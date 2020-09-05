import * as fixtures from '../__fixtures__';
const vc = require('vc-js');
import { Ed25519Signature2018 } from '..';
const { documentLoader } = fixtures;

const firstKey =
  fixtures.unlockedDids[
    'did:key:z6MktGVfipjBkipFvdE3qGBPQe9heMSuWpgdNVStAfjUsmXV'
  ].publicKey[0];

const credential = {
  ...fixtures.credential,
  issuer: { id: firstKey.controller },
  credentialSubject: {
    ...fixtures.credential.credentialSubject,
    id: firstKey.controller,
  },
};

export const runTests = (suite: any) => {
  let verifiableCredential: any;
  let verifiablePresentation: any;

  it('issue verifiableCredential', async () => {
    verifiableCredential = await vc.issue({
      credential: { ...credential },
      suite,
      documentLoader,
    });
    expect(verifiableCredential.proof).toBeDefined();
  });

  it('verify verifiableCredential', async () => {
    const result = await vc.verifyCredential({
      credential: verifiableCredential,
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });

  it('createPresentation & signPresentation', async () => {
    const id = 'ebc6f1c2';
    const holder = 'did:ex:12345';
    const presentation = await vc.createPresentation({
      verifiableCredential,
      id,
      holder,
    });
    expect(presentation.type).toEqual(['VerifiablePresentation']);
    verifiablePresentation = await vc.signPresentation({
      presentation,
      suite,
      challenge: '123',
      documentLoader,
    });
    expect(verifiablePresentation.proof).toBeDefined();
  });

  it('verify verifiablePresentation', async () => {
    // console.log(JSON.stringify(verifiablePresentation, null, 2));
    const result = await vc.verify({
      presentation: verifiablePresentation,
      challenge: '123',
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(result.verified).toBe(true);
  });
};
