import * as fixtures from '../__fixtures__';

import { Ed25519Signature2020, Ed25519KeyPair2020 } from '..';

import { runTests } from './vc-js-tester';

const key = new Ed25519KeyPair2020(fixtures.keypair_0);
const suite = new Ed25519Signature2020({
  key,
  date: '2019-12-11T03:50:55Z',
});

jest.setTimeout(10 * 1000);

describe('Ed25519Signature2020', () => {
  runTests(suite);
});
