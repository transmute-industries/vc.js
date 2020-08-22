import jsonld from 'jsonld';
import constants from './constants';
import crypto from 'crypto';
import bs58 from 'bs58';

import { Ed25519PublicKey } from './Ed25519PublicKey';

const linkedDataProofType = 'Ed25519Signature2020';

const sha256 = (data: string) => {
  const h = crypto.createHash('sha256');
  h.update(data);
  return h.digest();
};

import * as types from './types';

export class Ed25519Signature2020 {
  public useNativeCanonize: boolean = false;
  public type: string = linkedDataProofType;
  public date?: string;
  public signer?: types.Signer;
  public verifier?: types.Verifier;
  public key?: types.Ed25519KeyPair2020;
  // consider making verificationMethod required when options are provided.
  public verificationMethod?: string;

  constructor(options: types.Ed25519Signature2018Options) {
    if (options) {
      this.signer = options.signer;
      this.date = options.date;
      this.verificationMethod = options.verificationMethod;
      if (options.key) {
        const signingKeyPair = options.key as types.Ed25519KeyPair2020;
        this.key = signingKeyPair;
        this.verificationMethod =
          options.verificationMethod || signingKeyPair.id;

        this.signer = {
          sign: async ({ data }: types.SignerOptions) => {
            const signer = signingKeyPair.signer();
            const _signature = await signer.sign({
              data,
            });
            return bs58.encode(_signature);
          },
        };

        this.verifier = {
          verify: async ({ data, signature }: types.VerificationOptions) => {
            let verified = false;
            try {
              const verifier = signingKeyPair.verifier();
              verified = await verifier.verify({
                data,
                signature: bs58.decode(signature),
              });
            } catch (e) {
              console.error('An error occurred when verifying signature: ', e);
            }
            return verified;
          },
        };
      }
    }
  }

  async canonize(
    input: any,
    { documentLoader, expansionMap, skipExpansion }: types.CannonizeOptions
  ) {
    return jsonld.canonize(input, {
      algorithm: 'URDNA2015',
      format: 'application/n-quads',
      documentLoader,
      expansionMap,
      skipExpansion,
      useNative: this.useNativeCanonize,
    });
  }

  // TODO: fix security issue, unknown proof type.
  async canonizeProof(
    proof: any,
    { documentLoader, expansionMap }: types.CannonizeOptions
  ) {
    // `signatureValue` must not be included in the proof
    // options
    // TODO: fix security issue, spreading unknown properties into the proof.
    proof = { ...proof };
    delete proof.signatureValue;
    return this.canonize(proof, {
      documentLoader,
      expansionMap,
      skipExpansion: false,
    });
  }

  async createVerifyData({
    document,
    proof,
    documentLoader,
    expansionMap,
  }: types.CreateVerifyDataOptions) {
    const c14nProofOptions = await this.canonizeProof(proof, {
      documentLoader,
      expansionMap,
    });
    const c14nDocument = await this.canonize(document, {
      documentLoader,
      expansionMap,
    });
    return Buffer.concat([sha256(c14nProofOptions), sha256(c14nDocument)]);
  }

  async matchProof({ proof }: types.MatchProofOptions) {
    return proof.type === this.type;
  }

  async updateProof({ proof }: types.UpdateProofOptions) {
    return proof;
  }

  async sign({ verifyData, proof }: types.LinkedDataSigantureSignOptions) {
    if (!(this.signer && typeof this.signer.sign === 'function')) {
      throw new Error('A signer API has not been specified.');
    }

    const signature = await this.signer.sign({ data: verifyData });
    proof.signatureValue = signature;
    return proof;
  }

  async createProof({
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: types.CreateProofOptions) {
    // build proof (currently known as `signature options` in spec)
    let proof: any = { '@context': constants.SECURITY_CONTEXT_URL };

    // ensure proof type is set
    proof.type = this.type;

    // set default `now` date if not given in `proof` or `options`
    let date = this.date;
    if (proof.created === undefined && date === undefined) {
      date = new Date().toISOString();
    }

    // ensure date is in string format
    if (date !== undefined && typeof date !== 'string') {
      date = new Date(date).toISOString();
    }

    // add API overrides
    if (date !== undefined) {
      proof.created = date;
    }
    // `verificationMethod` is for newer suites, `creator` for legacy
    if (this.verificationMethod !== undefined) {
      proof.verificationMethod = this.verificationMethod;
    }

    // add any extensions to proof (mostly for legacy support)
    proof = await this.updateProof({
      proof,
    });

    // allow purpose to update the proof; the `proof` is in the
    // SECURITY_CONTEXT_URL `@context` -- therefore the `purpose` must
    // ensure any added fields are also represented in that same `@context`
    proof = await purpose.update(proof, {
      document,
      suite: this,
      documentLoader,
      expansionMap,
    });

    // create data to sign
    const verifyData = await this.createVerifyData({
      document,
      proof,
      documentLoader,
      expansionMap,
      compactProof,
    });

    // sign data
    proof = await this.sign({
      verifyData,
      proof,
    });

    return proof;
  }

  async getVerificationMethod({
    proof,
    documentLoader,
  }: types.GetVerificationMethodOptions) {
    let { verificationMethod } = proof;

    if (!verificationMethod) {
      // backwards compatibility support for `creator`
      const { creator } = proof;
      verificationMethod = creator;
    }

    if (typeof verificationMethod === 'object') {
      verificationMethod = verificationMethod.id;
    }

    if (!verificationMethod) {
      throw new Error('No "verificationMethod" or "creator" found in proof.');
    }

    // Note: `expansionMap` is intentionally not passed; we can safely drop
    // properties here and must allow for it
    const framed = await jsonld.frame(
      verificationMethod,
      {
        '@context': constants.SECURITY_CONTEXT_URL,
        '@embed': '@always',
        id: verificationMethod,
      },
      { documentLoader, compactToRelative: false }
    );

    if (!framed) {
      throw new Error(`Verification method ${verificationMethod} not found.`);
    }

    // Security issue, is the ever implemented like this?
    // ensure verification method has not been revoked
    if (framed.revoked !== undefined) {
      throw new Error('The verification method has been revoked.');
    }

    return framed;
  }

  async verifySignature({
    verifyData,
    verificationMethod,
    proof,
  }: types.VerifySignatureOptions) {
    let { verifier } = this;
    if (!verifier) {
      const publicKey = await Ed25519PublicKey.fromVerificationMethod(
        verificationMethod
      );
      // this suite relies on detached JWS....
      // so we need to make sure thats the signature format we are verifying.
      verifier = {
        verify: async ({ data, signature }: types.VerificationOptions) => {
          let verified = false;
          try {
            const verifier = await publicKey.verifier();
            verified = await verifier.verify({
              data,
              signature: bs58.decode(signature),
            });
          } catch (e) {
            console.error('An error occurred when verifying signature: ', e);
          }
          return verified;
        },
      };
    }
    return verifier.verify({
      data: verifyData,
      signature: proof.signatureValue,
    });
  }

  async verifyProof({
    proof,
    document,
    purpose,
    documentLoader,
    expansionMap,
    compactProof,
  }: types.VerifyProofOptions) {
    try {
      // create data to verify
      const verifyData = await this.createVerifyData({
        document,
        proof,
        documentLoader,
        expansionMap,
        compactProof,
      });

      // fetch verification method
      const verificationMethod = await this.getVerificationMethod({
        proof,
        documentLoader,
      });

      // verify signature on data
      const verified = await this.verifySignature({
        verifyData,
        verificationMethod,
        proof,
      });
      if (!verified) {
        throw new Error('Invalid signature.');
      }

      // ensure proof was performed for a valid purpose
      const purposeResult = await purpose.validate(proof, {
        document,
        suite: this,
        verificationMethod,
        documentLoader,
        expansionMap,
      });

      if (!purposeResult.valid) {
        throw purposeResult.error;
      }

      return { verified: true, purposeResult };
    } catch (error) {
      return { verified: false, error };
    }
  }
}
