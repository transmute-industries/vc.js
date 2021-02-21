import { Ed25519KeyPair } from '@transmute/did-key-ed25519';

import { encode, decode } from './utils';
import bs58 from 'bs58';

export class Ed25519KeyPair2020 extends Ed25519KeyPair {
  static from = async (args: any): Promise<Ed25519KeyPair2020> => {
    if (args.publicKeyMultibase) {
      args.publicKeyBase58 = bs58.encode(decode(args.publicKeyMultibase));
    }
    if (args.privateKeyMultibase) {
      args.privateKeyBase58 = bs58.encode(decode(args.privateKeyMultibase));
    }
    return new Ed25519KeyPair2020(args);
  };

  toVerificationMethod() {
    return {
      id: this.id,
      type: 'Ed25519VerificationKey2020',
      controller: this.controller,
      publicKeyMultibase: encode(bs58.decode(this.publicKeyBase58)),
    };
  }

  toKeyPair() {
    return {
      id: this.id,
      type: 'Ed25519KeyPair2020',
      controller: this.controller,
      publicKeyMultibase: encode(bs58.decode(this.publicKeyBase58)),
      privateKeyMultibase: encode(bs58.decode(this.privateKeyBase58)),
    };
  }
}
