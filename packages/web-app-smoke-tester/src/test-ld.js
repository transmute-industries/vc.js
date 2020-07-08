import {Ed25519KeyPair}  from '@transmute/did-key-ed25519'
import {Ed25519Signature2018}  from '@transmute/ed25519-signature-2018'
import * as vcjs from '@transmute/vc.js'
import {documentLoader} from './documentLoader'
const didDoc = require('./did-doc.json')
const _credential = require('./credential.json')

export const testLd = async ()=>{
    console.log({didDoc})
    const key = await Ed25519KeyPair.from(didDoc.publicKey[0])
    key.id = key.controller + key.id
    console.log({key})
    const suite = new Ed25519Signature2018({
        key,
        date: '2019-12-11T03:50:55Z',
    })
    console.log({suite})
    const credential = {
        ..._credential,
        issuer: { id: didDoc.id },
        credentialSubject: {
          ..._credential.credentialSubject,
          id: didDoc.id,
        },
      };
    const verifiableCredential = await vcjs.ld.issue({
        credential,
        suite,
        documentLoader
    })
    console.log({verifiableCredential})

    const id = 'ebc6f1c2';
    const holder = 'did:ex:12345';
    const challenge = '123'
    const presentation = await vcjs.ld.createPresentation({
      verifiableCredential: verifiableCredential,
      id,
      holder,
    });
    console.log({presentation})
    const verifiablePresentation = await vcjs.ld.signPresentation({
      presentation,
      suite,
      challenge,
      documentLoader,
    });
    console.log({verifiablePresentation})
    const presentationVerified = await vcjs.ld.verify({
      presentation: verifiablePresentation,
      suite,
      challenge,
      documentLoader,
    });
    console.log({presentationVerified})
}
