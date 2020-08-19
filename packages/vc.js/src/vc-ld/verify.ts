import jsonld from 'jsonld';
import { verify as jSigsVerify } from '@transmute/linked-data-proof';
import { IVerifyOptions } from '../types';
import { checkPresentation } from './checkPresentation';
import { checkCredential } from './checkCredential';
import {
  AuthenticationProofPurpose,
  CredentialIssuancePurpose,
} from './purposes';

const _verifyCredential = async (options: IVerifyOptions) => {
  const { credential, checkStatus, documentLoader } = options;

  // run common credential checks
  await checkCredential(credential, documentLoader);

  // if credential status is provided, a `checkStatus` function must be given
  if (
    credential.credentialStatus &&
    typeof options.checkStatus !== 'function'
  ) {
    throw new TypeError(
      'A "checkStatus" function must be given to verify credentials with ' +
        '"credentialStatus".'
    );
  }

  const { controller } = options;
  const purpose =
    options.purpose ||
    new CredentialIssuancePurpose({
      controller,
    });

  const result = await jSigsVerify(credential, {
    purpose,
    ...options,
  });

  // if verification has already failed, skip status check
  if (!result.verified) {
    return result;
  }

  if (credential.credentialStatus) {
    result.statusResult = await checkStatus(options);
    if (!result.statusResult.verified) {
      result.verified = false;
    }
  }

  return result;
};

export const verifyCredential = async (options: IVerifyOptions) => {
  const { credential } = options;
  try {
    if (!credential) {
      throw new TypeError('A "credential" property is required for verifying.');
    }
    return _verifyCredential(options);
  } catch (error) {
    return {
      verified: false,
      results: [{ credential, verified: false, error }],
      error,
    };
  }
};

const _verifyPresentation = async (options: IVerifyOptions) => {
  const { presentation, unsignedPresentation } = options;

  checkPresentation(presentation);

  // FIXME: verify presentation first, then each individual credential
  // only if that proof is verified

  // if verifiableCredentials are present, verify them, individually
  let credentialResults: any;
  let verified = true;
  const credentials = jsonld.getValues(presentation, 'verifiableCredential');
  if (credentials.length > 0) {
    // verify every credential in `verifiableCredential`
    credentialResults = await Promise.all(
      credentials.map((credential: any) => {
        return verifyCredential({ credential, ...options });
      })
    );

    credentialResults = credentialResults.map((cr: any, i: any) => {
      cr.credentialId = credentials[i].id;
      return cr;
    });

    const allCredentialsVerified = credentialResults.every(
      (r: any) => r.verified
    );
    if (!allCredentialsVerified) {
      verified = false;
    }
  }

  if (unsignedPresentation) {
    // No need to verify the proof section of this presentation
    return { verified, results: [presentation], credentialResults };
  }

  const { controller, domain, challenge } = options;
  if (!options.presentationPurpose && !challenge) {
    throw new Error(
      'A "challenge" param is required for AuthenticationProofPurpose.'
    );
  }

  const purpose =
    options.presentationPurpose ||
    new AuthenticationProofPurpose({ controller, domain, challenge });

  const presentationResult = await jSigsVerify(presentation, {
    purpose,
    ...options,
  });

  return {
    presentationResult,
    verified: verified && presentationResult.verified,
    credentialResults,
    error: presentationResult.error,
  };
};
export const verify = async (options: IVerifyOptions) => {
  if (!options.documentLoader) {
    throw new TypeError(
      '"documentLoader" parameter is required for verifying.'
    );
  }
  const { presentation } = options;
  try {
    if (!presentation) {
      throw new TypeError(
        'A "presentation" property is required for verifying.'
      );
    }
    return _verifyPresentation(options);
  } catch (error) {
    return {
      verified: false,
      results: [{ presentation, verified: false, error }],
      error,
    };
  }
};
