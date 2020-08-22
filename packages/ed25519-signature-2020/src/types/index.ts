type Ed25519VerificationKey2020 = {
  id: string;
  type: 'Ed25519VerificationKey2020';
  controller: string;
  publicKeyBase58: string;
};

type Ed25519LinkedDataKeyPair2020 = {
  id: string;
  type: 'Ed25519LinkedDataKeyPair2020';
  controller: string;
  publicKeyBase58: string;
  privateKeyBase58: string;
};

interface Ed25519PublicKey2020 {
  id: string;
  controller: string;
  publicKeyBuffer: Buffer;
}

interface FingerprintVerification {
  error?: Error;
  valid: boolean;
}

interface VerificationOptions {
  data: Buffer;
  signature: Buffer;
}

interface Verifier {
  verify: (options: VerificationOptions) => Promise<boolean>;
}

interface Ed25519LinkedDataPublicKey2020 {
  id: string;
  controller: string;
  publicKeyBuffer: Buffer;
  verifier: () => Verifier;
  fingerprint: () => string;
  verifyFingerprint: (fingerprint: string) => FingerprintVerification;
  toVerificationMethod: () => Promise<Ed25519VerificationKey2020>;
}

interface Base58EncodedPublicKey {
  publicKeyBase58: string;
}

interface Fingerprint {
  fingerprint: string;
}
interface StaticEd25519LinkedDataPublicKey2020 {
  fingerprintFromPublicKey: ({
    publicKeyBase58,
  }: Base58EncodedPublicKey) => string;
  fromFingerprint: ({ fingerprint }: Fingerprint) => Ed25519PublicKey2020;
  fromVerificationMethod: (
    vm: Ed25519VerificationKey2020
  ) => Ed25519PublicKey2020;
}

interface Ed25519KeyPair2020ConstructorArgs {
  id: string;
  controller: string;
  publicKeyBuffer: Buffer;
  privateKeyBuffer: Buffer;
}
interface SignerOptions {
  data: Buffer;
}
interface Signer {
  sign: (options: SignerOptions) => Promise<Uint8Array>;
}

interface Ed25519KeyPair2020 {
  id: string;
  controller: string;
  publicKeyBuffer: Buffer;
  privateKeyBuffer: Buffer;
  toLinkedDataKeyPair: () => Ed25519LinkedDataKeyPair2020;
  signer: () => Signer;
  verifier: () => Verifier;
}

interface LinkedDataKeyPairGenerateoptions {
  secureRandom?: () => Buffer;
  seed?: Buffer;
}

interface StaticEd25519KeyPair2020 {
  generate: (
    options: LinkedDataKeyPairGenerateoptions
  ) => Promise<Ed25519KeyPair2020>;
  from: (linkedDataKeyPair: Ed25519LinkedDataKeyPair2020) => Ed25519KeyPair2020;
}

interface Ed25519Signature2018Options {
  key?: Ed25519KeyPair2020;
  date?: any;
  signer?: any;
  verificationMethod?: string;
}

interface CannonizeOptions {
  documentLoader: any;
  expansionMap: any;
  skipExpansion?: any;
}

interface CreateVerifyDataOptions {
  document: any;
  proof: any;
  documentLoader: any;
  expansionMap: any;
  compactProof?: any;
}

interface MatchProofOptions {
  proof: any;
}

interface UpdateProofOptions {
  proof: any;
}

interface LinkedDataSigantureSignOptions {
  verifyData: any;
  proof: any;
}

interface CreateProofOptions {
  document: any;
  proof: any;
  documentLoader: any;
  expansionMap: any;
  compactProof?: any;
  purpose: any;
}

interface GetVerificationMethodOptions {
  proof: any;
  documentLoader: any;
}

interface VerifySignatureOptions {
  verifyData: any;
  verificationMethod: any;
  proof: any;
}

interface VerifyProofOptions {
  proof: any;
  document: any;
  purpose: any;
  documentLoader: any;
  expansionMap: any;
  compactProof: any;
}

/* class decorator */
function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    return constructor;
  };
}

export {
  VerificationOptions,
  SignerOptions,
  Signer,
  Verifier,
  Ed25519KeyPair2020ConstructorArgs,
  Base58EncodedPublicKey,
  LinkedDataKeyPairGenerateoptions,
  FingerprintVerification,
  Fingerprint,
  Ed25519VerificationKey2020,
  Ed25519LinkedDataKeyPair2020,
  Ed25519LinkedDataPublicKey2020,
  StaticEd25519LinkedDataPublicKey2020,
  Ed25519PublicKey2020,
  Ed25519KeyPair2020,
  StaticEd25519KeyPair2020,
  Ed25519Signature2018Options,
  CannonizeOptions,
  CreateVerifyDataOptions,
  MatchProofOptions,
  UpdateProofOptions,
  CreateProofOptions,
  LinkedDataSigantureSignOptions,
  GetVerificationMethodOptions,
  VerifySignatureOptions,
  VerifyProofOptions,
  staticImplements,
};
