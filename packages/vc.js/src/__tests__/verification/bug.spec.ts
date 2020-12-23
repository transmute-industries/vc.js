import { ld as vcTransmute } from '../../';
const vcDb = require('vc-js');
const { Ed25519Signature2018 } = require('@transmute/ed25519-signature-2018');
const { Ed25519KeyPair } = require('@transmute/did-key-ed25519');
import { documentLoader } from '../verification/__fixtures__/documentLoader';

const cmtrVc = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://w3id.org/traceability/v1',
    {
      '@version': 1.1,
      gs1: 'https://gs1.org/voc/',
      schema: 'https://schema.org/',
      traceability: 'https://w3c-ccg.github.io/traceability-vocab/',
      PostalAddress: {
        '@id': 'gs1:PostalAddress',
        '@context': {
          organizationName: 'gs1:organizationName',
          streetAddress: 'gs1:streetAddress',
          addressLocality: 'gs1:addressLocality',
          addressRegion: 'gs1:addressRegion',
          addressCountry: 'gs1:addressCountry',
          crossStreet: 'gs1:crossStreet',
          countyCode: 'gs1:countyCode',
          postalCode: 'gs1:postalCode',
          postOfficeBoxNumber: 'gs1:postOfficeBoxNumber',
        },
      },
      ContactPoint: {
        '@id': 'gs1:ContactPoint',
        '@context': {
          contactTitle: 'gs1:contactTitle',
          contactType: 'gs1:contactType',
          email: 'gs1:email',
          name: 'schema:name',
          telephone: 'gs1:telephone',
        },
      },
      manufacturerLocation: 'traceability:manufacturer',
      manufacturerContact: 'traceability:manufacturerContact',
      customerLocation: 'traceability:customer',
      productDetails: 'traceability:productDetails',
      steelProduct: 'schema:category',
      steelSpecifications: 'traceability:steelSpecification',
      steelGrades: 'traceability:steelGrade',
      size: 'schema:size',
      purchaseDetails: 'traceability:purchaseDetails',
      purchaseOrder: 'schema:orderNumber',
      invoiceNumber: 'schema:confirmationNumber',
      certificateNumber: 'traceability:certificateNumber',
      originDetails: 'traceability:originDetails',
      countryOfOrigin: 'schema:country',
      priorMillCerticateLinks: 'traceability:priorMillCerticateLinks',
      manufacturer: 'schema:manufacturer',
      Organization: {
        '@id': 'schema:Organization',
        '@context': {
          logo: 'schema:logo',
          website: 'schema:sameAs',
        },
      },
      chemicalProperties: 'traceability:chemicalProperties',
      ChemicalProperty: {
        '@id': 'https://w3id.org/traceability/ChemicalProperty',
        '@context': {
          description: 'schema:description',
          formula: 'http://purl.obolibrary.org/obo/chebi/formula',
          heatNumber: 'traceability:heatNumber',
          identifier: 'schema:identifier',
          inchi: 'http://purl.obolibrary.org/obo/chebi/inchi',
          inchikey: 'http://purl.obolibrary.org/obo/chebi/inchikey',
          name: 'schema:name',
          value: 'schema:value',
        },
      },
      mechanicalProperties: 'traceability:mechanicalProperties',
      MechanicalProperty: {
        '@id': 'https://w3id.org/traceability/MechanicalProperty',
        '@context': {
          description: 'schema:description',
          identifier: 'schema:identifier',
          lotNumber: 'traceability:lotNumber',
          name: 'schema:name',
          value: 'schema:value',
        },
      },
      additionalRemarks: 'schema:comment',
      shippingDetails: 'traceability:shippingDetails',
      masterBillOfLading: 'traceability:masterBillOfLading',
      containerNumber: 'traceability:containerNumber',
      importDetails: 'traceability:importDetails',
      entryNumber: 'traceability:entryNumber',
      importerReferenceId: 'traceability:importerReferenceId',
      steelLicenseNumber: 'traceability:steelLicenseNumber',
    },
  ],
  type: ['VerifiableCredential', 'CertifiedMillTestReport'],
  name: 'Certified Mill Test Report',
  description:
    'US Customs Approved Certified Mill Test Report Verifiable Credential',
  credentialSubject: {
    additionalRemarks: 'Nothing to report 👍',
    chemicalProperties: [
      {
        heatNumber: '31231',
        inchikey: 'OKTJSMMVPCPJKN-UHFFFAOYSA-N',
        name: 'C',
        type: 'ChemicalProperty',
        value: '0.00123',
      },
      {
        heatNumber: '45654',
        inchikey: 'QVGXLLKOCUKJST-UHFFFAOYSA-N',
        name: 'O',
        type: 'ChemicalProperty',
        value: '0.456',
      },
    ],
    customerLocation: {
      addressCountry: 'United States',
      addressLocality: 'Laredo',
      addressRegion: 'Texas',
      organizationName: 'New Steel LLC',
      postalCode: '78751',
      streetAddress: '1433 S. Long Lane',
      type: 'PostalAddress',
    },
    importDetails: {
      entryNumber: '324-1247392-1',
      importerReferenceId: '123-456',
      steelLicenseNumber: 'L 123',
    },
    manufacturer: {
      logo: 'https://example/com/logo.png',
      type: 'Organization',
      website: 'https://example.com',
    },
    manufacturerContact: {
      contactTitle: 'Director Quality',
      email: 'stacy@example.com',
      name: 'Stacy Slater',
      telephone: '555-555-5555',
      type: 'ContactPoint',
    },
    manufacturerLocation: {
      addressCountry: 'Mexico',
      addressLocality: 'Monterrey',
      addressRegion: 'Nueva Leon',
      organizationName: 'Steel Inc.',
      postalCode: '66268',
      streetAddress: 'Av. Batallon de San Cristobal 103-403',
      type: 'PostalAddress',
    },
    mechanicalProperties: [
      {
        description: 'Yield to Tensile Ration',
        lotNumber: '12312123',
        name: 'yield',
        type: 'MechanicalProperty',
        value: '34.2145',
      },
      {
        description: 'Density',
        lotNumber: '12312123',
        name: 'density',
        type: 'MechanicalProperty',
        value: '0.969',
      },
    ],
    originDetails: {
      countryOfOrigin: 'Mexico',
      priorMillCerticateLinks: ['https://example.com/vc/1'],
    },
    productDetails: {
      size: '98x45x123',
      steelGrades: 'A B C',
      steelProduct: 'Rebar',
      steelSpecifications: 'ISO-456 / spec-v99',
    },
    purchaseDetails: {
      certificateNumber: 'CN-88823',
      invoiceNumber: 'IN-122387',
      purchaseOrder: 'PO-7478562',
    },
    shippingDetails: {
      containerNumber: 'C 003',
      masterBillOfLading: 'MBL 456',
    },
  },
  id:
    'test/organizations/5fe261090c7c97250e9aa57f/credentials/db5a0c60-4068-46ca-b1a4-057dac6747a6',
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
  '@context': ['https://w3id.org/wallet/v1'],
  name: 'Sidetree Key',
  image:
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  description: 'Generated by @sidetree/wallet.',
  tags: [],
};

let suite: any;
beforeAll(async () => {
  const key = await Ed25519KeyPair.from(issuanceKey);
  suite = new Ed25519Signature2018({
    key,
  });
});

describe("Transmute's vc.js", () => {
  let vc = vcTransmute;

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
      name: 'name',
      description: 'description',
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
  let vc = vcDb;

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
      name: 'name',
      description: 'description',
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
