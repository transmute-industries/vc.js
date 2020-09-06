import * as fixtures from './__fixtures__';
import { Ed25519KeyPair2020 } from './Ed25519KeyPair2020';

it('toVerificationMethod', () => {
  const key = new Ed25519KeyPair2020(fixtures.keypair_0);
  const vm = key.toVerificationMethod();
  expect(vm).toEqual(fixtures.vm_0);
});

it('toKeyPair', () => {
  const key = new Ed25519KeyPair2020(fixtures.keypair_0);
  const kp = key.toKeyPair();
  expect(kp).toEqual(fixtures.keypair_1);
});
