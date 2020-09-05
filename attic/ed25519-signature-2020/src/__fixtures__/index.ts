import * as fs from 'fs';
import * as path from 'path';
import { documentLoader } from './documentLoader';

const seed = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/seed.txt'))
  .toString();

const message = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/message.txt'))
  .toString();

const signature = fs
  .readFileSync(path.resolve(__dirname, './test-vectors/signature.txt'))
  .toString();

const publicKeyVerificationMethod = JSON.parse(
  fs
    .readFileSync(
      path.resolve(__dirname, './test-vectors/publicKeyVerificationMethod.json')
    )
    .toString()
);

const linkedDataKeyPairBase58Btc = JSON.parse(
  fs
    .readFileSync(
      path.resolve(
        __dirname,
        './test-vectors/linked-data-key-pair-base58btc.json'
      )
    )
    .toString()
);

const credentialTemplate = JSON.parse(
  fs
    .readFileSync(
      path.resolve(
        __dirname,
        './test-vectors/linked-data-proof-vc-template.json'
      )
    )
    .toString()
);

const linkedDataProofVc = JSON.parse(
  fs
    .readFileSync(
      path.resolve(__dirname, './test-vectors/linked-data-proof-vc.json')
    )
    .toString()
);

const linkedDataProofVp = JSON.parse(
  fs
    .readFileSync(
      path.resolve(__dirname, './test-vectors/linked-data-proof-vp.json')
    )
    .toString()
);

export {
  seed,
  message,
  signature,
  publicKeyVerificationMethod,
  linkedDataKeyPairBase58Btc,
  credentialTemplate,
  linkedDataProofVc,
  linkedDataProofVp,
  documentLoader,
};
