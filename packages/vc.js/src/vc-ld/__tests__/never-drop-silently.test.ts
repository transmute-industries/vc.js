import * as fixtures from '../../__fixtures__';
import { ld as vcld } from '../../index';
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;
const firstKey = fixtures.unlockedDid.publicKey[0];
const key = new Ed25519KeyPair(firstKey);
const shortForm = 'https://short-form-did.example.com/12';

key.controller = `${shortForm}`;
    key.id = `${key.controller}#${key.id.split('#').pop()}`;

const suite = new Ed25519Signature2018({
    key,
    date: '2019-12-11T03:50:55Z',
    });
    const credential = {
    ...fixtures.test_vectors.ld.credentialTemplate,
    issuer: {
        id: shortForm,
    },
    credentialSubject: {
        ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
        id: fixtures.unlockedDid.id,
    },
    };
jest.setTimeout(10 * 1000);
it('cannot mutate signed credential with properties that are dropped', async () => {
    const credentialIssued = await vcld.issue({
      credential: { ...credential },
      suite: suite,
      documentLoader: (url: string) => {
        return fixtures.documentLoader(url);
      },
    });

    credentialIssued.type.push('BAD_PROPERTY_WILL_BE_DROPPED_SHOULD_CAUSE_ERROR')
    console.log(JSON.stringify(credentialIssued, null, 2))

    const credentialVerified = await vcld.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader: (url: string) => {
        if (url.split('#')[0] === shortForm) {
          const shortFormDidDoc = require('../../__fixtures__/shortFormDidDoc.json');
          return {
            contextUrl: null,
            document: shortFormDidDoc,
            documentUrl: shortFormDidDoc.id,
          };
        }
        return fixtures.documentLoader(url);
      },
    });
    expect(credentialVerified.verified).toBe(false);
  });
