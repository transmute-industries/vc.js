import bs58 from 'bs58';

import * as ed25519 from '@stablelib/ed25519';
import * as keyUtils from './keyUtils';
import { Ed25519PublicKey } from './Ed25519PublicKey';

const keyPairType = 'Ed25519KeyPair2020';

export class Ed25519KeyPair extends Ed25519PublicKey {
  public privateKeyBuffer: Buffer;

  static async generate(options: any = {}) {
    let key;
    if (options.secureRandom) {
      key = ed25519.generateKeyPair({
        isAvailable: true,
        randomBytes: options.secureRandom,
      });
    }

    if (options.seed) {
      key = ed25519.generateKeyPair({
        isAvailable: true,
        randomBytes: () => {
          return Buffer.from(options.seed, 'hex');
        },
      });
    }

    if (!key) {
      throw new Error('options.seed or options.secureRandom is required.');
    }

    const publicKeyBase58 = bs58.encode(key.publicKey);
    const privateKeyBase58 = bs58.encode(key.secretKey);

    const did = `did:key:${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    const keyId = `#${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    return new Ed25519KeyPair({
      id: keyId,
      controller: did,
      publicKeyBase58,
      privateKeyBase58,
    });
  }

  static async from(options: any) {
    let privateKeyBase58 = options.privateKeyBase58;
    let publicKeyBase58 = options.publicKeyBase58;

    if (options.privateKeyHex) {
      privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyHex(
        options.privateKeyHex
      );
    }

    if (options.publicKeyHex) {
      publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyHex(
        options.publicKeyHex
      );
    }

    if (options.privateKeyJwk) {
      privateKeyBase58 = keyUtils.privateKeyBase58FromPrivateKeyJwk(
        options.privateKeyJwk
      );
    }

    if (options.publicKeyJwk) {
      publicKeyBase58 = keyUtils.publicKeyBase58FromPublicKeyJwk(
        options.publicKeyJwk
      );
    }

    return new Ed25519KeyPair({
      ...options,
      privateKeyBase58,
      publicKeyBase58,
    });
  }

  constructor(options: any = {}) {
    super(options);
    this.type = keyPairType;
    this.privateKeyBuffer = bs58.decode(options.privateKeyBase58);
  }

  // public publicNode({ controller = this.controller }: any = {}) {
  //   const publicNode: any = {
  //     id: this.id,
  //     type: this.type,
  //   };
  //   if (controller) {
  //     publicNode.controller = controller;
  //   }

  //   this.addEncodedPublicKey(publicNode); // Subclass-specific
  //   return publicNode;
  // }

  async toLinkedDataKeyPair(options = { encoding: 'base58btc' }) {
    let linkedDataKeyPair: any = {
      id: this.id,
      type: keyPairType,
      controller: this.controller,
    };

    if (options.encoding === 'base58btc') {
      linkedDataKeyPair = {
        ...linkedDataKeyPair,
        publicKeyBase58: bs58.encode(this.publicKeyBuffer),
        privateKeyBase58: bs58.encode(this.privateKeyBuffer),
      };
    }

    if (options.encoding === 'hex') {
      linkedDataKeyPair = {
        ...linkedDataKeyPair,
        publicKeyHex: keyUtils.publicKeyHexFromPublicKeyBase58(
          bs58.encode(this.publicKeyBuffer)
        ),
        privateKeyHex: keyUtils.privateKeyHexFromPrivateKeyBase58(
          bs58.encode(this.privateKeyBuffer)
        ),
      };
    }

    if (options.encoding === 'jwk') {
      linkedDataKeyPair = {
        ...linkedDataKeyPair,
        publicKeyJwk: keyUtils.publicKeyJwkFromPublicKeyBase58(
          bs58.encode(this.publicKeyBuffer)
        ),
        privateKeyJwk: keyUtils.privateKeyJwkFromPrivateKeyBase58(
          bs58.encode(this.privateKeyBuffer)
        ),
      };
      delete linkedDataKeyPair.publicKeyJwk.kid;
      delete linkedDataKeyPair.privateKeyJwk.kid;
    }

    return linkedDataKeyPair;
  }

  signer() {
    if (!this.privateKeyBuffer) {
      return {
        async sign() {
          throw new Error('No private key to sign with.');
        },
      };
    }
    let { privateKeyBuffer } = this;
    return {
      async sign({ data }: any) {
        const signatureUInt8Array = ed25519.sign(privateKeyBuffer, data);
        return signatureUInt8Array;
      },
    };
  }
}
