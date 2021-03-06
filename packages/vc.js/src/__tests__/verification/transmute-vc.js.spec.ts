import { documentLoader } from '../verification/__fixtures__/documentLoader';
import { ld as vc } from '../../index';
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;

jest.setTimeout(10 * 1000);

describe('transmute vc.js verification tests', () => {
  it('happy path', async () => {
    const key = await Ed25519KeyPair.from(
      require('../verification/__fixtures__/key.json')
    );
    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    let credentialTemplate = require('../verification/__fixtures__/credentialTemplate.json');
    credentialTemplate = {
      ...credentialTemplate,
      issuer: key.controller,
    };
    const credentialIssued = await vc.issue({
      credential: { ...credentialTemplate },
      suite: suite,
      documentLoader,
    });
    const credentialVerified = await vc.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(true);
  });

  it('fails when issuanceDate is mutated', async () => {
    const key = await Ed25519KeyPair.from(
      require('../verification/__fixtures__/key.json')
    );
    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    let credentialTemplate = require('../verification/__fixtures__/credentialTemplate.json');
    credentialTemplate = {
      ...credentialTemplate,
      issuer: key.controller,
    };

    const credentialIssued = await vc.issue({
      credential: { ...credentialTemplate },
      suite: suite,
      documentLoader,
    });
    credentialIssued.issuanceDate = '2000-12-03T12:19:52Z';
    const credentialVerified = await vc.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(false);
  });

  it('fails when expirationDate is mutated', async () => {
    const key = await Ed25519KeyPair.from(
      require('../verification/__fixtures__/key.json')
    );
    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    let credentialTemplate = require('../verification/__fixtures__/credentialTemplate.json');
    credentialTemplate = {
      ...credentialTemplate,
      issuer: key.controller,
    };

    const credentialIssued = await vc.issue({
      credential: { ...credentialTemplate },
      suite: suite,
      documentLoader,
    });
    credentialIssued.expirationDate = '2000-12-03T12:19:52Z';
    const credentialVerified = await vc.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(false);
  });

  it('fails when credential.id is mutated', async () => {
    const key = await Ed25519KeyPair.from(
      require('../verification/__fixtures__/key.json')
    );
    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    let credentialTemplate = require('../verification/__fixtures__/credentialTemplate.json');
    credentialTemplate = {
      ...credentialTemplate,
      issuer: key.controller,
    };

    const credentialIssued = await vc.issue({
      credential: { ...credentialTemplate },
      suite: suite,
      documentLoader,
    });
    credentialIssued.id = 'https://bad.actor.example/123';
    const credentialVerified = await vc.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(false);
  });
});
