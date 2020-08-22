import crypto from 'crypto';
import { Ed25519KeyPair } from './Ed25519KeyPair';
import * as fixtures from './__fixtures__';

describe('generate', () => {
  it('from random seed', async () => {
    const key = await Ed25519KeyPair.generate({
      secureRandom: () => {
        return crypto.randomBytes(32);
      },
    });
    expect(key.id).toBeDefined();
    expect(key.type).toBe('Ed25519KeyPair2020');
    expect(key.controller).toBeDefined();
    expect(key.publicKeyBuffer).toBeDefined();
    expect(key.privateKeyBuffer).toBeDefined();
  });

  it('from chosen seed', async () => {
    const key = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key.id).toBe('#z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP');
    expect(key.type).toBe('Ed25519KeyPair2020');
    expect(key.controller).toBe(
      'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP'
    );
    expect(key.publicKeyBuffer).toBeDefined();
    expect(key.privateKeyBuffer).toBeDefined();
  });
});

describe('toVerificationMethod', () => {
  it('should produce a verification method', async () => {
    const key = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const vm = await key.toVerificationMethod();
    expect(vm).toEqual(fixtures.publicKeyVerificationMethod);
  });
});

describe('toLinkedDataKeyPair', () => {
  it('base58btc - should produce a linked data key pair ', async () => {
    const key = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const keypair = await key.toLinkedDataKeyPair({ encoding: 'base58btc' });
    expect(keypair).toEqual(fixtures.linkedDataKeyPairBase58Btc);
  });
  it('hex - should produce a linked data key pair', async () => {
    const key = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const keypair = await key.toLinkedDataKeyPair({ encoding: 'hex' });
    expect(keypair).toEqual(fixtures.linkedDataKeyPairHex);
  });
  it('jwk - should produce a linked data key pair', async () => {
    const key = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const keypair = await key.toLinkedDataKeyPair({ encoding: 'jwk' });
    expect(keypair).toEqual(fixtures.linkedDataKeyPairJwk);
  });
});

describe('from', () => {
  it('from base58', async () => {
    const key = await Ed25519KeyPair.from(fixtures.linkedDataKeyPairBase58Btc);
    const keypair = await key.toLinkedDataKeyPair({ encoding: 'base58btc' });
    expect(keypair).toEqual(fixtures.linkedDataKeyPairBase58Btc);
  });

  it('from hex', async () => {
    const key = await Ed25519KeyPair.from(fixtures.linkedDataKeyPairHex);
    const keypair = await key.toLinkedDataKeyPair({ encoding: 'base58btc' });
    expect(keypair).toEqual(fixtures.linkedDataKeyPairBase58Btc);
  });

  it('from jwk', async () => {
    const key = await Ed25519KeyPair.from(fixtures.linkedDataKeyPairJwk);
    const keypair = await key.toLinkedDataKeyPair({ encoding: 'base58btc' });
    expect(keypair).toEqual(fixtures.linkedDataKeyPairBase58Btc);
  });
});

describe('fromFingerprint', () => {
  it('public key from fingerprint', async () => {
    let key = await Ed25519KeyPair.fromFingerprint({
      fingerprint: fixtures.linkedDataKeyPairBase58Btc.id.split('#').pop(),
    });
    const vm = await key.toVerificationMethod();
    expect(vm).toEqual(fixtures.publicKeyVerificationMethod);
  });
});

describe('fingerprint', () => {
  it('can calculate fingerprint', async () => {
    let key: any = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key.id).toBe('#' + key.fingerprint());
  });
});

describe('verifyFingerprint', () => {
  it('can verifyFingerprint', async () => {
    let key: any = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    expect(key.verifyFingerprint(key.fingerprint())).toEqual({ valid: true });
  });
});

describe('sign', () => {
  it('can sign', async () => {
    let key: any = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const signer = key.signer();
    const _signature = await signer.sign({
      data: Buffer.from(fixtures.message),
    });
    expect(Buffer.from(_signature).toString('hex')).toBe(fixtures.signature);
  });
});

describe('verify', () => {
  it('can verify', async () => {
    let key: any = await Ed25519KeyPair.generate({
      seed: Buffer.from(fixtures.seed, 'hex'),
    });
    const verifier = key.verifier();
    const _verified = await verifier.verify({
      data: Buffer.from(fixtures.message),
      signature: Buffer.from(fixtures.signature, 'hex'),
    });
    expect(_verified).toBe(true);
  });
});
