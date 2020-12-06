import {
  Bls12381G2KeyPair,
  BbsBlsSignature2020,
  BbsBlsSignatureProof2020,
  deriveProof,
} from '@mattrglobal/jsonld-signatures-bbs';

import * as fixtures from '../__fixtures__';
import { ld as vcld } from '../index';

import blsKeys from './bls-keys.json';
import c from './c.json';
import f from './f.json';

const k0 = blsKeys[0].g2['application/did+ld+json'];
k0.id = k0.controller + k0.id;

let verifiableCredential: any;

it('can issue, verify', async () => {
  const keyPair = await new Bls12381G2KeyPair(k0);
  const suite = new BbsBlsSignature2020({ key: keyPair });
  const credential = {
    ...c,
    issuer: {
      id: k0.controller,
    },
    credentialSubject: {
      ...c.credentialSubject,
      id: k0.id,
    },
  };

  verifiableCredential = await vcld.issue({
    credential: { ...credential },
    suite: suite,
    documentLoader: (url: string) => {
      return fixtures.documentLoader(url);
    },
  });
  // console.log(JSON.stringify(credentialIssued, null, 2))
  const credentialVerified = await vcld.verifyCredential({
    credential: { ...verifiableCredential },
    suite: new BbsBlsSignature2020({}),
    documentLoader: (url: string) => {
      if (
        url.indexOf(
          'did:key:z5TcESXuYUE9aZWYwSdrUEGK1HNQFHyTt4aVpaCTVZcDXQmUheFwfNZmRksaAbBneNm5KyE52SdJeRCN1g6PJmF31GsHWwFiqUDujvasK3wTiDr3vvkYwEJHt7H5RGEKYEp1ErtQtcEBgsgY2DA9JZkHj1J9HZ8MRDTguAhoFtR4aTBQhgnkP4SwVbxDYMEZoF2TMYn3s'
        ) === 0
      ) {
        const didDoc =
          blsKeys[0].resolution['application/did+ld+json'].didDocument;
        didDoc['@context'].push(
          'https://w3c-ccg.github.io/ldp-bbs2020/context/v1'
        );
        return {
          documentUrl: url,
          document: didDoc,
        };
      } else {
        return fixtures.documentLoader(url);
      }
    },
  });
  expect(credentialVerified.verified).toBe(true);
});

it('can derive, present', async () => {
  //Derive a proof
  const deriveProofFrame = f;
  const derivedProofCredential = await deriveProof(
    verifiableCredential,
    deriveProofFrame,
    {
      suite: new BbsBlsSignatureProof2020(),
      documentLoader: (url: string) => {
        if (
          url.indexOf(
            'did:key:z5TcESXuYUE9aZWYwSdrUEGK1HNQFHyTt4aVpaCTVZcDXQmUheFwfNZmRksaAbBneNm5KyE52SdJeRCN1g6PJmF31GsHWwFiqUDujvasK3wTiDr3vvkYwEJHt7H5RGEKYEp1ErtQtcEBgsgY2DA9JZkHj1J9HZ8MRDTguAhoFtR4aTBQhgnkP4SwVbxDYMEZoF2TMYn3s'
          ) === 0
        ) {
          const didDoc =
            blsKeys[0].resolution['application/did+ld+json'].didDocument;
          didDoc['@context'].push(
            'https://w3c-ccg.github.io/ldp-bbs2020/context/v1'
          );
          return {
            documentUrl: url,
            document: didDoc,
          };
        } else {
          return fixtures.documentLoader(url);
        }
      },
    }
  );
  // console.log(JSON.stringify(derivedProofCredential, null, 2))
  const credentialVerified = await vcld.verifyCredential({
    credential: { ...derivedProofCredential },
    suite: new BbsBlsSignatureProof2020({}),
    documentLoader: (url: string) => {
      if (
        url.indexOf(
          'did:key:z5TcESXuYUE9aZWYwSdrUEGK1HNQFHyTt4aVpaCTVZcDXQmUheFwfNZmRksaAbBneNm5KyE52SdJeRCN1g6PJmF31GsHWwFiqUDujvasK3wTiDr3vvkYwEJHt7H5RGEKYEp1ErtQtcEBgsgY2DA9JZkHj1J9HZ8MRDTguAhoFtR4aTBQhgnkP4SwVbxDYMEZoF2TMYn3s'
        ) === 0
      ) {
        const didDoc =
          blsKeys[0].resolution['application/did+ld+json'].didDocument;
        didDoc['@context'].push(
          'https://w3c-ccg.github.io/ldp-bbs2020/context/v1'
        );
        return {
          documentUrl: url,
          document: didDoc,
        };
      } else {
        return fixtures.documentLoader(url);
      }
    },
  });
  // console.log(JSON.stringify(credentialVerified, null, 2))
  expect(credentialVerified.verified).toBe(true);
});
