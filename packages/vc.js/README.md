# @transmute/vc.js

This typescript module has been built to support direct substitutability with [digitalbazaar/vc-js](https://github.com/digitalbazaar/vc-js) for Linked Data Proof based Verifiable Credentials.

However, some changes were made to support typescript, and no `defaultDocumentLoader` is provided.

Additionally, this module provides test vectors for both [Ed25519Signature2018](https://w3c-ccg.github.io/ld-cryptosuite-registry/#ed25519signature2018) based Linked Data Proof Verifiable Credentials and [EdDSA](https://tools.ietf.org/html/rfc8037#section-3.1) based JWT Verifiable Credentials.

Beware that while JOSE and JWT tooling is widespread, there are security implications for supporting specific keys and algorithms, especially the "NIST Curves".

Please review [https://safecurves.cr.yp.to/](https://safecurves.cr.yp.to/) before leveraging ECDH, ECDSA, EdDSA or more generally... you are responsible for selecting cryptography that is appropriate for your users / customers...
