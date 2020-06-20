import * as fixtures from '../__fixtures__';
import { Ed25519KeyPair } from '@transmute/did-key-ed25519';
import { Ed25519Signature2018 } from '..';
import { runTests } from './vc-js-tester';

const firstKey = fixtures.unlockedDid.publicKey[0];
const key = new Ed25519KeyPair(firstKey);
const suite = new Ed25519Signature2018({
  key,
  date: '2019-12-11T03:50:55Z',
});

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2018', () => {
  runTests(suite);
});
