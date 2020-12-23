import { ld as vc } from '../../';
const { Ed25519Signature2018 } = require('@transmute/ed25519-signature-2018');
const { Ed25519KeyPair } = require('@transmute/did-key-ed25519');
import { documentLoader } from '../verification/__fixtures__/documentLoader';

const cmtrVc = {
  '@context': 'https://www.w3.org/2018/credentials/v1',
  type: ['VerifiableCredential'],
  credentialSubject: {
    id: 'https://example.com/me',
  },
  id: 'https://example.com/vc',
  issuer: 'did:key:z6MkfMDGAbnhGxB9DCHeuhtFjCpfcDpfCjXTZWuvunCXec4P',
  issuanceDate: '2020-12-22T21:11:37+00:00',
};

const issuanceKey = {
  id:
    'did:key:z6MkfMDGAbnhGxB9DCHeuhtFjCpfcDpfCjXTZWuvunCXec4P#z6MkfMDGAbnhGxB9DCHeuhtFjCpfcDpfCjXTZWuvunCXec4P',
  type: 'JsonWebKey2020',
  controller: 'did:key:z6MkfMDGAbnhGxB9DCHeuhtFjCpfcDpfCjXTZWuvunCXec4P',
  publicKeyJwk: {
    crv: 'Ed25519',
    x: 'DU8OG7xNKIJS5NEZLV6l71O7-pifSCjruxD3uyEj9ng',
    kty: 'OKP',
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    d: 'LaQwk7ogJU-p2rK81u65ROsely0uwrCTpNkeAp7rrJI',
    x: 'DU8OG7xNKIJS5NEZLV6l71O7-pifSCjruxD3uyEj9ng',
    kty: 'OKP',
  },
};

let suite: any;
beforeAll(async () => {
  const key = await Ed25519KeyPair.from(issuanceKey);
  suite = new Ed25519Signature2018({
    key,
  });
});

describe("Transmute's vc.js", () => {
  it('should work', async () => {
    const issued = await vc.issue({
      credential: cmtrVc,
      suite,
      documentLoader,
    });
    const result = await vc.verifyCredential({
      credential: issued,
      suite: new Ed25519Signature2018(),
      documentLoader,
    });
    // true
    console.log(result.verified);
  });

  it('should fail', async () => {
    const issued = await vc.issue({
      credential: cmtrVc,
      suite,
      documentLoader,
    });
    const wrongVc = {
      ...issued,
      issuanceDate: '2020-12-22T20:19:58+00:00',
      id: 'lol',
    };
    const result = await vc.verifyCredential({
      credential: wrongVc,
      suite: new Ed25519Signature2018(),
      documentLoader,
    });
    // true, but should be false...
    console.log(result.verified);
  });
});

describe("Digital Bazaar's vc.js", () => {
  it('should work', async () => {
    const issued = await vc.issue({
      credential: cmtrVc,
      suite,
      documentLoader,
    });
    const result = await vc.verifyCredential({
      credential: issued,
      suite: new Ed25519Signature2018(),
      documentLoader,
    });
    // true
    console.log(result.verified);
  });

  it('should fail', async () => {
    const issued = await vc.issue({
      credential: cmtrVc,
      suite,
      documentLoader,
    });
    const wrongVc = {
      ...issued,
      issuanceDate: '2020-12-22T20:19:58+00:00',
      id: 'lol',
    };
    const result = await vc.verifyCredential({
      credential: wrongVc,
      suite: new Ed25519Signature2018(),
      documentLoader,
    });
    // true, but should be false...
    console.log(result.verified);
  });
});
