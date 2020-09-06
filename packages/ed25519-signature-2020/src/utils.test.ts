import { encode, decode } from './utils';
it('can encode as multibase', () => {
  const message = Buffer.from('hello');
  const encoded = encode(message);
  const decoded = decode(encoded);
  expect(decoded).toEqual(message);
});
