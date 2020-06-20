import * as fixtures from '../__fixtures__';

export const testVendors = (vendors: any[]) => {
  vendors.forEach(async vendor => {
    describe(vendor.name, () => {
      const credential = {
        ...fixtures.credentialTemplate,
        issuer: { id: fixtures.unlockedDid.id },
        credentialSubject: {
          ...fixtures.credentialTemplate.credentialSubject,
          id: fixtures.unlockedDid.id,
        },
      };

      it('issue credential', async () => {
        const credentialIssued = await vendor.vcjs.issue({
          credential: { ...credential },
          suite: vendor.suite,
          documentLoader: fixtures.documentLoader,
        });
        expect(credentialIssued).toEqual(fixtures.expected.credentialIssued);
      });

      it('verify credential', async () => {
        const credentialVerified = await vendor.vcjs.verifyCredential({
          credential: { ...fixtures.expected.credentialIssued },
          suite: vendor.suite,
          documentLoader: fixtures.documentLoader,
        });

        expect(credentialVerified).toEqual(
          fixtures.expected.credentialVerified
        );
      });

      it('create presentation', async () => {
        const id = 'ebc6f1c2';
        const holder = 'did:ex:12345';
        const presentationCreated = vendor.vcjs.createPresentation({
          verifiableCredential: { ...fixtures.expected.credentialIssued },
          id,
          holder,
        });
        // console.log(JSON.stringify(presentationCreated, null, 2));
        expect(presentationCreated).toEqual(
          fixtures.expected.presentationCreated
        );
      });

      it('prove presentation', async () => {
        const presentationProved = await vendor.vcjs.signPresentation({
          presentation: { ...fixtures.expected.presentationCreated },
          suite: vendor.suite,
          challenge: '123',
          documentLoader: fixtures.documentLoader,
        });
        expect(presentationProved).toEqual(
          fixtures.expected.presentationProved
        );
      });

      it('verify presentation', async () => {
        const presentationVerified = await vendor.vcjs.verify({
          presentation: { ...fixtures.expected.presentationProved },
          suite: vendor.suite,
          challenge: '123',
          documentLoader: fixtures.documentLoader,
        });
        expect(presentationVerified).toEqual(
          fixtures.expected.presentationVerified
        );
      });
    });
  });
};
