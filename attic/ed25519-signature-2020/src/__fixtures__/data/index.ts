import { VcTemplate, Ed25519LinkedDataKeyPair2020, Issuer } from '../../types';
import { documentLoader } from './documentLoader';

import credential_fixtures from './credential.json';
import keypair_fixtures from './keypair.json';
import issuer_fixtures from './issuer.json';

const vc_template_0 = credential_fixtures.vc_template_0 as VcTemplate;
const vc_0 = credential_fixtures.vc_0 as VcTemplate;

const keypair_0 = keypair_fixtures.keypair_0 as Ed25519LinkedDataKeyPair2020;

const issuer_0 = issuer_fixtures.issuer_0 as Issuer;

export { vc_template_0, vc_0, keypair_0, issuer_0, documentLoader };
