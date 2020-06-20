import * as fixtures from '../__fixtures__';
import { Ed25519KeyPair as OurKeyPair } from '@transmute/did-key-ed25519';
import { Ed25519Signature2018 as OurSignature } from '..';

const TheirKeyPair = require('crypto-ld').Ed25519KeyPair;
const TheirSignature = require('jsonld-signatures').suites.Ed25519Signature2018;

const vc = require('vc-js');

const { documentLoader } = fixtures;

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2018', () => {
  it('ours with theirs', async () => {
    const firstKey = fixtures.unlockedDid.publicKey[0];
    const key = new TheirKeyPair(firstKey);
    const suite = new TheirSignature({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    const result = await vc.verify({
      presentation: fixtures.ours,
      challenge: '123',
      suite,
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });

  it('theirs with ours', async () => {
    const firstKey = fixtures.unlockedDid.publicKey[0];
    const key = new OurKeyPair(firstKey);
    const suite = new OurSignature({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    const result = await vc.verify({
      presentation: fixtures.theirs,
      challenge: '123',
      suite,
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });
});
