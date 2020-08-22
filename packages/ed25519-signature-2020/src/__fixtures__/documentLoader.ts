import {
  production,
  IDocumentLoaderResponse,
  //   development,
} from '@transmute/jsonld-document-loader';

const documentLoader = async (
  uri: string
): Promise<IDocumentLoaderResponse> => {
  const _uri = uri.split('#')[0];

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
