import bs58 from 'bs58';

import * as ed25519 from '@stablelib/ed25519';

import { Ed25519PublicKey } from './Ed25519PublicKey';

import * as types from './types';

const keyPairType = 'Ed25519LinkedDataKeyPair2020';

@types.staticImplements<types.StaticEd25519KeyPair2020>()
export class Ed25519KeyPair extends Ed25519PublicKey
  implements types.Ed25519KeyPair2020 {
  public privateKeyBuffer: Buffer;

  static async generate(options: types.LinkedDataKeyPairGenerateoptions) {
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
          return options.seed as Buffer;
        },
      });
    }

    if (!key) {
      throw new Error('options.seed or options.secureRandom is required.');
    }

    const publicKeyBase58 = bs58.encode(key.publicKey);

    const did = `did:key:${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    const keyId = `#${Ed25519KeyPair.fingerprintFromPublicKey({
      publicKeyBase58,
    })}`;
    return new Ed25519KeyPair({
      id: keyId,
      controller: did,
      publicKeyBuffer: Buffer.from(key.publicKey),
      privateKeyBuffer: Buffer.from(key.secretKey),
    });
  }

  // consider renaming to fromLinkedDataBase58BtcKeyPair
  static from(options: types.Ed25519LinkedDataKeyPair2020) {
    let { privateKeyBase58, publicKeyBase58 } = options;
    const publicKeyBuffer = bs58.decode(publicKeyBase58);
    const privateKeyBuffer = bs58.decode(privateKeyBase58);
    return new Ed25519KeyPair({
      ...options,
      publicKeyBuffer,
      privateKeyBuffer,
    });
  }

  constructor(options: types.Ed25519KeyPair2020ConstructorArgs) {
    super(options);
    this.type = keyPairType;
    this.privateKeyBuffer = options.privateKeyBuffer;
  }

  toLinkedDataKeyPair(): types.Ed25519LinkedDataKeyPair2020 {
    const linkedDataKeyPair: types.Ed25519LinkedDataKeyPair2020 = {
      id: this.id,
      type: keyPairType,
      controller: this.controller,
      publicKeyBase58: bs58.encode(this.publicKeyBuffer),
      privateKeyBase58: bs58.encode(this.privateKeyBuffer),
    };
    return linkedDataKeyPair;
  }

  signer() {
    if (!this.privateKeyBuffer) {
      return {
        async sign(_options: types.SignerOptions) {
          throw new Error('Ed25519KeyPair has no private key to sign with.');
        },
      };
    }
    let { privateKeyBuffer } = this;
    return {
      async sign({ data }: types.SignerOptions) {
        const signatureUInt8Array = ed25519.sign(privateKeyBuffer, data);
        return signatureUInt8Array;
      },
    };
  }
}
