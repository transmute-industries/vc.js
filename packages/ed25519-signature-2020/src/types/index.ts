interface Ed25519VerificationKey2020 {
  id: string;
  type: 'Ed25519VerificationKey2020';
  controller: string;
  publicKeyBase58: string;
}

interface Ed25519PublicKey2020 {
  id: string;
  controller: string;
  publicKeyBuffer: Buffer;
}

interface Ed25519KeyPair2020 {
  id: string;
  controller: string;
  publicKeyBuffer: Buffer;
  privateKeyBuffer: Buffer;
}

export { Ed25519VerificationKey2020, Ed25519PublicKey2020, Ed25519KeyPair2020 };
