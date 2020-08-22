import * as fixtures from './__fixtures__';

import * as vcjs from '@transmute/vc.js';
import { Ed25519KeyPair } from './Ed25519KeyPair';
import { Ed25519Signature2020 } from './Ed25519Signature2020';
// let verifiableCredential: any;
// let verifiablePresentation: any;

const keypair = new Ed25519KeyPair(fixtures.linkedDataKeyPairBase58Btc);

keypair.id = keypair.controller + keypair.id;

const suite = new Ed25519Signature2020({
  key: keypair,
  date: fixtures.credentialTemplate.issuanceDate,
});

it('issue verifiableCredential', async () => {
  const verifiableCredential = await vcjs.ld.issue({
    credential: { ...fixtures.credentialTemplate },
    suite,
    documentLoader: fixtures.documentLoader,
  });
  // console.log(JSON.stringify(verifiableCredential));
  expect(verifiableCredential).toEqual(fixtures.linkedDataProofVc);
});

it('verify verifiableCredential', async () => {
  const result = await vcjs.ld.verifyCredential({
    credential: fixtures.linkedDataProofVc,
    suite,
    documentLoader: fixtures.documentLoader,
  });
  // console.log(JSON.stringify(result, null, 2));
  expect(result.verified).toBe(true);
});

// it('createPresentation & signPresentation', async () => {
//   const id = 'ebc6f1c2';
//   const holder = 'did:ex:12345';
//   const presentation = await vc.createPresentation({
//     verifiableCredential,
//     id,
//     holder,
//   });
//   expect(presentation.type).toEqual(['VerifiablePresentation']);
//   verifiablePresentation = await vc.signPresentation({
//     presentation,
//     suite,
//     challenge: '123',
//     documentLoader,
//   });
//   expect(verifiablePresentation.proof).toBeDefined();
// });

// it('verify verifiablePresentation', async () => {
//   // console.log(JSON.stringify(verifiablePresentation, null, 2));
//   const result = await vc.verify({
//     presentation: verifiablePresentation,
//     challenge: '123',
//     suite,
//     documentLoader,
//   });
//   expect(result.verified).toBe(true);
// });
