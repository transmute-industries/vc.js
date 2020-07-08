import { EdDSA }  from '@transmute/did-key-ed25519'

import * as vcjs from '@transmute/vc.js'
// import {documentLoader} from './documentLoader'
const didDoc = require('./did-doc.json')
const _credential = require('./credential.json')

const signerFactory = (controller, jwk) => {
return {
    sign: (payload, header) => {
    // typ: 'JWT', MUST NOT be present per well known did configuration...
    header.kid = controller + jwk.kid;
    return EdDSA.sign(payload, jwk, header);
    },
};
};

const verifyFactory = (jwk) => {
return {
    verify: (jws) => {
    const verified = EdDSA.verify(jws, jwk, {
        complete: true,
    });
    delete verified.key;
    return verified;
    },
};
};



  const signer = signerFactory(
    'did:example:123',
    didDoc.publicKey[1].privateKeyJwk
  );
  const verifier = verifyFactory(
    didDoc.publicKey[1].publicKeyJwk
  );

  const credential = {
    ..._credential,
    issuer: { id: didDoc.id },
    credentialSubject: {
      ..._credential.credentialSubject,
      id: didDoc.id,
    },
  };
  const vpOptions = {
    domain: 'verifier.com',
    challenge: '7cec01f7-82ee-4474-a4e6-feaaa7351e48',
  };


export const testJwt = async ()=>{
    console.log({didDoc})
    const credentialIssued = await vcjs.jwt.issue(credential, signer);
    console.log({credentialIssued})
    const credentialVerified = await vcjs.jwt.verify(
      credentialIssued,
      verifier
    );
    console.log({credentialVerified})
    const presentationCreated = await vcjs.jwt.createPresentation(
      [credentialIssued],
      'did:example:456'
    );
    console.log({presentationCreated})
    const presentationProved = await vcjs.jwt.provePresentation(
      presentationCreated,
      vpOptions,
      signer
    );
    console.log({presentationProved})
    const presentationVerified = await vcjs.jwt.verify(
      presentationProved,
      verifier
    );
    console.log({presentationVerified})
}
