import * as fixtures from '../../__fixtures__';

const [, transmuteVendor] = fixtures.vendors as any[];

describe('common datetime formatting', () => {
  it('issue credential', async () => {
    const credential = {
      ...fixtures.test_vectors.ld.credentialTemplate,
      issuer: { id: fixtures.unlockedDid.id },
      credentialSubject: {
        ...fixtures.test_vectors.ld.credentialTemplate.credentialSubject,
        id: fixtures.unlockedDid.id,
      },
      issuanceDate: '2020-03-10T04:24:12.164Z',
    };
    const credentialIssued = await transmuteVendor.vcld.issue({
      credential,
      suite: transmuteVendor.suite,
      documentLoader: fixtures.documentLoader,
    });
    expect(credentialIssued).toEqual(fixtures.test_vectors.ld.credentialIssued);
  });

  it('verify credential', async () => {
    const credentialVerified = await transmuteVendor.vcld.verifyCredential({
      credential: {
        ...fixtures.test_vectors.ld.credentialIssued,
        issuanceDate: '2020-03-10T04:24:12.000Z',
      },
      suite: transmuteVendor.suite,
      documentLoader: fixtures.documentLoader,
    });

    expect(credentialVerified).toEqual(
      fixtures.test_vectors.ld.credentialVerified
    );
  });
});
