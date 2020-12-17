import { documentLoader } from '../verification/__fixtures__/documentLoader';
import { ld as vc } from '../../index';
import moment from 'moment'
const jsigs = require('jsonld-signatures');
const { Ed25519KeyPair } = require('crypto-ld');
const { Ed25519Signature2018 } = jsigs.suites;

jest.setTimeout(10 * 1000);

const betterVerify = async (verifiableCredential:any)=>{
    const results = await vc.verifyCredential({
        credential: { ...verifiableCredential },
        suite: new Ed25519Signature2018({}),
        documentLoader,
      });

      let verified = results.verified
      let verificationDetails: any = {
        verified,
        checks: []
      }

      if(verifiableCredential.expirationDate && moment(verifiableCredential.expirationDate).isBefore(moment.now())){
        verificationDetails.verified = false
        verificationDetails.checks.push({
            status: 'bad',
            description: 'The credential is expired.'
        })
      }

      return verificationDetails;
}

describe('better verification checks', () => {
  it('happy path', async () => {
    const key = await Ed25519KeyPair.from(
      require('../verification/__fixtures__/key.json')
    );
    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    let credentialTemplate = require('../verification/__fixtures__/credentialTemplate.json');
    credentialTemplate = {
      ...credentialTemplate,
      issuer: key.controller,
    };
    const credentialIssued = await vc.issue({
      credential: { ...credentialTemplate },
      suite: suite,
      documentLoader,
    });
    const credentialVerified = await vc.verifyCredential({
      credential: { ...credentialIssued },
      suite: new Ed25519Signature2018({}),
      documentLoader,
    });
    expect(credentialVerified.verified).toBe(true);
  });

  it('should fail when credential is expired', async () => {
    const key = await Ed25519KeyPair.from(
      require('../verification/__fixtures__/key.json')
    );
    const suite = new Ed25519Signature2018({
      key,
      date: '2019-12-11T03:50:55Z',
    });
    let credentialTemplate = require('../verification/__fixtures__/credentialTemplate.json');
    credentialTemplate = {
      ...credentialTemplate,
      issuer: key.controller,
    };
    credentialTemplate.expirationDate = '2019-12-03T12:19:52Z'
    const credentialIssued = await vc.issue({
      credential: { ...credentialTemplate },
      suite: suite,
      documentLoader,
    });
    const results = await betterVerify(credentialIssued)
    
    expect(results.verified).toBe(false);
    expect(results.checks[0].status).toBe('bad')
    expect(results.checks[0].description).toBe('The credential is expired.')
  });

  
});
