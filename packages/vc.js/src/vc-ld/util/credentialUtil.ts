import moment from 'moment';

const credentialUtil = {
  // format dates the same, don't do ms as it might not be passed
  formatDates: (credential: any) => {
    if (credential.issuanceDate) {
      // console.log('b', credential.issuanceDate);
      credential.issuanceDate =
        moment(credential.issuanceDate)
          .toISOString()
          .split('.')[0] + 'Z';
      // console.log('a', credential.issuanceDate);
    }
    if (credential.expirationDate) {
      credential.expirationDate =
        moment(credential.expirationDate)
          .toISOString()
          .split('.')[0] + 'Z';
    }
  },
};

export default credentialUtil;
