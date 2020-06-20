export interface IIssueOptions {
  credential: any;
  suite: any;
  purpose?: any;
  documentLoader: any;
}

export interface IVerifyOptions {
  presentation?: any;
  credential?: any;
  checkStatus?: any;
  suite: any;
  purpose?: any;
  unsignedPresentation?: any;
  documentLoader: any;
  controller?: any;
  domain?: any;
  challenge?: any;
  presentationPurpose?: any;
}

export interface IPurposeValidateOptions {
  document?: any;
  suite?: any;
  verificationMethod?: any;
  documentLoader?: any;
  expansionMap?: any;
}
