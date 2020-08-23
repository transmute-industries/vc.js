import * as fixtures from './__fixtures__';

import * as vcjs from '@transmute/vc.js';
import { Ed25519KeyPair } from './Ed25519KeyPair';
import { Ed25519Signature2020 } from './Ed25519Signature2020';

const keypair = Ed25519KeyPair.from(fixtures.linkedDataKeyPairBase58Btc);

// when suite is contains a key (pair)
// the key is used to sign and verify
const suite = new Ed25519Signature2020({
  key: keypair,
  // needed to ensure that the verification method is a proper URI.
  verificationMethod: keypair.controller + keypair.id,
  date: fixtures.credentialTemplate.issuanceDate,
});

// when suite is empty, documentloader produces verification methods
// and they are used to verify
const emptySuite = new Ed25519Signature2020({});

it('issue verifiableCredential', async () => {
  const verifiableCredential = await vcjs.ld.issue({
    credential: { ...fixtures.credentialTemplate },
    suite,
    documentLoader: fixtures.documentLoader,
  });
  expect(verifiableCredential).toEqual(fixtures.linkedDataProofVc);
});

it('verify verifiableCredential', async () => {
  const result = await vcjs.ld.verifyCredential({
    credential: fixtures.linkedDataProofVc,
    suite: emptySuite,
    documentLoader: fixtures.documentLoader,
  });
  expect(result.verified).toBe(true);
});

it('createPresentation & signPresentation', async () => {
  const id = 'ebc6f1c2';
  const holder = 'did:ex:12345';
  const presentation = await vcjs.ld.createPresentation({
    verifiableCredential: fixtures.linkedDataProofVc,
    id,
    holder,
  });
  expect(presentation.type).toEqual(['VerifiablePresentation']);
  const verifiablePresentation = await vcjs.ld.signPresentation({
    presentation,
    suite,
    challenge: '123',
    documentLoader: fixtures.documentLoader,
  });
  expect(verifiablePresentation).toEqual(fixtures.linkedDataProofVp);
});

it('verify verifiablePresentation', async () => {
  const result = await vcjs.ld.verify({
    presentation: fixtures.linkedDataProofVp,
    challenge: '123',
    suite: emptySuite,
    documentLoader: fixtures.documentLoader,
  });
  expect(result.verified).toBe(true);
});
