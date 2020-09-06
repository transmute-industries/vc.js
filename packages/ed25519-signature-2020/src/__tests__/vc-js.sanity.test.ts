import * as fixtures from '../__fixtures__';
import { runTests } from './vc-js-tester';

const { Ed25519KeyPair } = require('crypto-ld');
import { Ed25519Signature2020 } from '..';

const key = new Ed25519KeyPair(fixtures.keypair_0);
const suite = new Ed25519Signature2020({
  key,
  date: '2019-12-11T03:50:55Z',
});

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2020', () => {
  runTests(suite);
});
