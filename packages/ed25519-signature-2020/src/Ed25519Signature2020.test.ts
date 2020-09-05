import * as vcjs from '@transmute/vc.js';
import { Ed25519KeyPair } from './Ed25519KeyPair';
import { Ed25519Signature2020 } from './Ed25519Signature2020';

import {
  keypair_0,
  vc_template_0,
  vc_0,
  documentLoader,
  issuer_0,
} from './__fixtures__/data';

const keypair = Ed25519KeyPair.from(keypair_0);

// when suite is contains a key (pair)
// the key is used to sign and verify
const suite = new Ed25519Signature2020({
  key: keypair,
  // needed to ensure that the verification method is a proper URI.
  verificationMethod: issuer_0.id + keypair.id,
  date: vc_template_0.issuanceDate,
});

// when suite is empty, documentloader produces verification methods
// and they are used to verify
// const emptySuite = new Ed25519Signature2020({});

it('issue verifiableCredential', async () => {
  const verifiableCredential = await vcjs.ld.issue({
    credential: {
      ...vc_template_0,
      issuer: {
        ...vc_template_0.issuer,
        id: issuer_0.id,
      },
    },
    suite,
    documentLoader: (uri: string) => {
      return documentLoader(uri);
    },
  });
  expect(verifiableCredential).toEqual(vc_0);
});

// it('verify verifiableCredential', async () => {
//   const result = await vcjs.ld.verifyCredential({
//     credential: { ...vc_0 },
//     suite: new Ed25519Signature2020({}),
//     documentLoader: (uri: string) => {
//       return documentLoader(uri);
//     },
//   });
//   console.log(JSON.stringify(result, null, 2));
//   expect(result.verified).toBe(true);
// });

// it('createPresentation', async () => {
//   const id = 'ebc6f1c2';
//   const holder = 'did:ex:12345';
//   const presentation = await vcjs.ld.createPresentation({
//     verifiableCredential: fixtures.linkedDataProofVc,
//     id,
//     holder,
//     documentLoader: fixtures.documentLoader,
//   });
//   expect(presentation.type).toEqual(['VerifiablePresentation']);
// });

// it('signPresentation', async () => {
//   const presentation = { ...fixtures.linkedDataProofVp };
//   delete presentation.proof;
//   const verifiablePresentation = await vcjs.ld.signPresentation({
//     presentation,
//     suite,
//     challenge: '123',
//     documentLoader: fixtures.documentLoader,
//   });
//   expect(verifiablePresentation).toEqual(fixtures.linkedDataProofVp);
// });

// it('verify verifiablePresentation', async () => {
//   const result = await vcjs.ld.verify({
//     presentation: fixtures.linkedDataProofVp,
//     challenge: '123',
//     suite: emptySuite,
//     documentLoader: fixtures.documentLoader,
//   });
//   expect(result.verified).toBe(true);
// });
