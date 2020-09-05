// import crypto from 'crypto';
import { Ed25519PublicKey } from './Ed25519PublicKey';
import * as fixtures from './__fixtures__';

describe('fromVerificationMethod / toVerificationMethod', () => {
  it('should produce a verification method', async () => {
    const publicKey = await Ed25519PublicKey.fromVerificationMethod(
      fixtures.publicKeyVerificationMethod
    );
    const vm = await publicKey.toVerificationMethod();
    expect(vm).toEqual(fixtures.publicKeyVerificationMethod);
  });
});

describe('fromFingerprint', () => {
  it('public key from fingerprint', async () => {
    const key = await Ed25519PublicKey.fromFingerprint({
      fingerprint: fixtures.linkedDataKeyPairBase58Btc.id.split('#').pop(),
    });
    const vm = await key.toVerificationMethod();
    expect(vm).toEqual(fixtures.publicKeyVerificationMethod);
  });
});

describe('fingerprint', () => {
  it('can calculate fingerprint', async () => {
    const key = await Ed25519PublicKey.fromFingerprint({
      fingerprint: fixtures.linkedDataKeyPairBase58Btc.id.split('#').pop(),
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});

describe('verifyFingerprint', () => {
  it('can verifyFingerprint', async () => {
    const key = await Ed25519PublicKey.fromFingerprint({
      fingerprint: fixtures.linkedDataKeyPairBase58Btc.id.split('#').pop(),
    });
    expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
  });
});

describe('verify', () => {
  it('can verify', async () => {
    const key = await Ed25519PublicKey.fromFingerprint({
      fingerprint: fixtures.linkedDataKeyPairBase58Btc.id.split('#').pop(),
    });
    const verifier = key.verifier();
    const _verified = await verifier.verify({
      data: Buffer.from(fixtures.message),
      signature: Buffer.from(fixtures.signature, 'hex'),
    });
    expect(_verified).toBe(true);
  });
});
