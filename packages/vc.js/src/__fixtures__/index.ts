export * from './documentLoader';
export * from './vendors';
export const unlockedDid = require('./unlocked-did.json');
export const credentialTemplate = require('./credential-template.json');
export const expected = {
  credentialIssued: require('./expected/credential-issued.json'),
  credentialVerified: require('./expected/credential-verified.json'),
  presentationCreated: require('./expected/presentation-created.json'),
  presentationProved: require('./expected/presentation-proved.json'),
  presentationVerified: require('./expected/presentation-verified.json'),
};
