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

[LICENSE](./LICENSE)

## Release process

### Unstable releases

Unstable releases are automatic, from CD:

- On every commit to master an unstable release is pushed. An unstable release is a release with a tag of the form: vA.B.C-unstable.X. Everytime a PR is merged, X is incremented.
- If "skip-ci" is present in the commit message, the aforementioned behavior is skipped

### Stable releases

Stable releases are triggered by a dev locally

- Make sure you are familiar with [Semantic Versioning](https://semver.org/)
- Run `npm install` and `npm build` in the root level directory
- Run
  - `npm run publish:stable:patch` for a patch version increment
  - `npm run publish:stable:minor` for a minor version increment
  - `npm run publish:stable:major` for a major version increment


### Example

- Current version is v0.1.0
- A PR is made to fix bug A. When it's merged a release is made: v0.1.0-unstable-0
- A PR is made to add feature B. When it's merged a release is made: v0.1.0-unstable-1
- A PR is made to add feature C. When it's merged a release is made: v0.1.0-unstable-2
- Dev runs `npm run publish:stable:patch`. Current version is v0.1.0
- A PR is made to fix bug D. When it's merged a release is made: v0.1.1-unstable-0
- etc...
