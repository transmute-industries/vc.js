import { driver } from '@transmute/did-key-ed25519';

export const documentLoader = async (uri: string) => {
  if (uri === 'https://www.w3.org/2018/credentials/v1') {
    return {
      documentUrl: uri,
      document: require('../../../__fixtures__/contexts/credentials-v1.json'),
    };
  }
  if (uri === 'https://www.w3.org/ns/did/v1') {
    return {
      documentUrl: uri,
      document: require('../../../__fixtures__/contexts/did-v1.json'),
    };
  }

  if (uri === 'https://w3id.org/security/v1') {
    return {
      documentUrl: uri,
      document: require('../../../__fixtures__/contexts/security-v1.json'),
    };
  }

  if (uri === 'https://w3id.org/security/v2') {
    return {
      documentUrl: uri,
      document: require('../../../__fixtures__/contexts/security-v2.json'),
    };
  }

  if (uri.startsWith('did:example:def')) {
    return {
      documentUrl: uri,
      document: require('../__fixtures__/controller.json'),
    };
  }
  if (uri.startsWith('did:key')) {
    const { didDocument } = await driver.resolve(uri, {
      accept: 'application/did+ld+json',
    });
    return {
      documentUrl: uri,
      document: didDocument,
    };
  }

  console.error(uri);
  throw new Error('unsupported context ' + uri);
};
