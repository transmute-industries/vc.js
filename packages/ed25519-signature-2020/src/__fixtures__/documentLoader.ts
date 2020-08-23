import {
  production,
  IDocumentLoaderResponse,
  //   development,
} from '@transmute/jsonld-document-loader';

const documentLoader = async (
  uri: string
): Promise<IDocumentLoaderResponse> => {
  // uncomment to debug uris
  // console.log(uri);
  const _uri = uri.split('#')[0];

  // needed because v3 is not published
  if (_uri === 'https://w3id.org/security/v3') {
    return {
      contextUrl: null,
      documentUrl: 'https://w3id.org/security/v3',
      document: require('./unstable_contexts/sec-v3.json'),
    };
  }

  // needed because v2 is not published
  if (_uri === 'https://www.w3.org/2018/credentials/v2') {
    return {
      contextUrl: null,
      documentUrl: 'https://www.w3.org/2018/credentials/v2',
      document: require('./unstable_contexts/cred-v2.json'),
    };
  }

  if (_uri === 'did:key:z6Mkf5rGMoatrSj1f4CyvuHBeXJELe9RPdzo2PKGNCKVtZxP') {
    const didDocument = await require('@transmute/did-key-ed25519').driver.get({
      did: _uri,
    });

    return {
      contextUrl: null,
      documentUrl: uri.split('#')[0],
      document: JSON.stringify(didDocument),
    };
  }

  try {
    const result = await production.documentLoader(_uri);
    return Promise.resolve(result);
  } catch (e) {
    console.error(uri);
    console.error(e);
    throw new Error(e);
  }
};

export { documentLoader };
