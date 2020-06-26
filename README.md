# Verifiable Credentials

- [W3C Verifible Credentials](https://www.w3.org/TR/vc-data-model/)

This [mono repo](https://github.com/lerna/lerna) contains the modules necessary to support Verifiable Credentials in JavaScript.

These modules are written in TypeScript, and based on the amazing work of [Digital Bazaar](https://github.com/digitalbazaar). 

## Linked Data Proofs

For Linked Data Proofs and Credentials, we have kept the interfaces 100% compatible with [jsonld-signatures](https://github.com/digitalbazaar/jsonld-signatures) and [vc-js](https://github.com/digitalbazaar/vc-js). We have provided a set of test vectors and vendor equivalence checks to ensure that the interfaces remain compatible as new versions are released.

## JSON Web Tokens

Since there was no implementation of VC-JWT, we have provided a set of test vectors and equivalence checks, with the hope that JOSE ecosystem support for verifiable credentials can be matured while acknowledging the risks of relying on legacy crypto, prohibited algorithms and widespread use of "NIST Curves".

Please review [https://safecurves.cr.yp.to/](https://safecurves.cr.yp.to/). 

JOSE supports Ed25519 / X25519, we recommend using Ed25519 and EdDSA whenever possible.

### Development

```
git clone git@github.com:transmute-industries/vc.js.git
npm i
```

### License

This mono repo contains packages which are derived from other open source software.

See the README in each package for details.

Unless otherwise noted, the following License applies:

```
Copyright 2020 Transmute Industries, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
