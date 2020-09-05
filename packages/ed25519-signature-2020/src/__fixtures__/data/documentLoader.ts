import {
  documentLoaderFactory,
  contexts,
} from '@transmute/jsonld-document-loader';

const golem = documentLoaderFactory.pluginFactory.build({
  contexts: {
    ...contexts.W3C_Verifiable_Credentials,
    ...contexts.W3ID_Security_Vocabulary,
  },
});

golem.addContext({
  'https://example.com/credentials/latest': require('./contexts/credentials-latest.json'),
});

const documentLoader = golem.buildDocumentLoader();

export { documentLoader };
