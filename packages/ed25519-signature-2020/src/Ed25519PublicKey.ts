import bs58 from 'bs58';

import * as ed25519 from '@stablelib/ed25519';

import * as types from './types';

const keyType = 'Ed25519PublicKey2020';
const publicKeyVerificationMethodType = 'Ed25519VerificationKey2020';

@types.staticImplements<types.StaticEd25519LinkedDataPublicKey2020>()
export class Ed25519PublicKey implements types.Ed25519LinkedDataPublicKey2020 {
  public id: string;
  public type: string;
  public controller: string;
  public publicKeyBuffer: Buffer;

  static fingerprintFromPublicKey({
    publicKeyBase58,
  }: types.Base58EncodedPublicKey) {
    // ed25519 cryptonyms are multicodec encoded values, specifically:
    // (multicodec ed25519-pub 0xed01 + key bytes)
    const pubkeyBytes = bs58.decode(publicKeyBase58);
    const buffer = new Uint8Array(2 + pubkeyBytes.length);
    buffer[0] = 0xed;
    buffer[1] = 0x01;
    buffer.set(pubkeyBytes, 2);
    // prefix with `z` to indicate multi-base base58btc encoding
    return `z${bs58.encode(buffer)}`;
  }

  static fromFingerprint({ fingerprint }: types.Fingerprint) {
    // skip leading `z` that indicates base58 encoding
    const buffer = bs58.decode(fingerprint.substr(1));
    // https://github.com/multiformats/multicodec/blob/master/table.csv#L81
    if (buffer[0] === 0xed && buffer[1] === 0x01) {
      const publicKeyBase58 = bs58.encode(buffer.slice(2));
      const did = `did:key:${Ed25519PublicKey.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      const keyId = `#${Ed25519PublicKey.fingerprintFromPublicKey({
        publicKeyBase58,
      })}`;
      const publicKeyBuffer = bs58.decode(publicKeyBase58) as Buffer;
      return new Ed25519PublicKey({
        id: keyId,
        controller: did,
        publicKeyBuffer,
      });
    }

    throw new Error(`Unsupported Fingerprint Type: ${fingerprint}`);
  }

  static fromVerificationMethod(
    publicKeyVerificationMethod: types.Ed25519VerificationKey2020
  ) {
    const options = {
      id: publicKeyVerificationMethod.id,
      controller: publicKeyVerificationMethod.controller,
      publicKeyBuffer: bs58.decode(
        publicKeyVerificationMethod.publicKeyBase58
      ) as Buffer,
    };
    return new Ed25519PublicKey(options);
  }

  async toVerificationMethod(): Promise<types.Ed25519VerificationKey2020> {
    const publicKeyVerificationMethod: types.Ed25519VerificationKey2020 = {
      id: this.id,
      type: publicKeyVerificationMethodType,
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
    };
    return publicKeyVerificationMethod;
  }

  constructor(options: types.Ed25519PublicKey2020) {
    this.type = keyType;
    this.id = options.id;
    this.controller = options.controller;
    this.publicKeyBuffer = options.publicKeyBuffer;
    if (this.controller && !this.id) {
      this.id = `${this.controller}#${this.fingerprint()}`;
    }
  }

  fingerprint() {
    const { publicKeyBuffer } = this;
    return Ed25519PublicKey.fingerprintFromPublicKey({
      publicKeyBase58: bs58.encode(publicKeyBuffer),
    });
  }

  verifyFingerprint(fingerprint: string): types.FingerprintVerification {
    // fingerprint should have `z` prefix indicating
    // that it's multi-base encoded
    if (!(typeof fingerprint === 'string' && fingerprint[0] === 'z')) {
      return {
        error: new Error('`fingerprint` must be a multibase encoded string.'),
        valid: false,
      };
    }
    let fingerprintBuffer;
    try {
      fingerprintBuffer = bs58.decode(fingerprint.slice(1));
    } catch (e) {
      return { error: e, valid: false };
    }
    let publicKeyBuffer;
    try {
      publicKeyBuffer = this.publicKeyBuffer;
    } catch (e) {
      return { error: e, valid: false };
    }

    // validate the first two multicodec bytes 0xed01
    const valid =
      fingerprintBuffer.slice(0, 2).toString('hex') === 'ed01' &&
      publicKeyBuffer.equals(fingerprintBuffer.slice(2));
    if (!valid) {
      return {
        error: new Error('The fingerprint does not match the public key.'),
        valid: false,
      };
    }
    return { valid };
  }

  verifier() {
    if (!this.publicKeyBuffer) {
      return {
        async verify(_options: types.VerificationOptions) {
          throw new Error('No public key to verify with.');
        },
      };
    }
    let { publicKeyBuffer } = this;
    return {
      async verify({ data, signature }: types.VerificationOptions) {
        let verified = false;
        try {
          verified = ed25519.verify(publicKeyBuffer, data, signature);
        } catch (e) {
          console.error('An error occurred when verifying signature: ', e);
        }
        return verified;
      },
    };
  }
}
