import multibase from 'multibase';
import bs58 from 'bs58';

export const encode = (data: Buffer) => {
  const bytes = multibase.encode('base58btc', data);
  return `z${bs58.encode(bytes)}`;
};

export const decode = (encoded: string) => {
  if (encoded[0] !== 'z') {
    throw new Error('expected base58btc');
  }
  const withoutPrefix = encoded.substring(1);
  const decodedBytes = multibase.decode(bs58.decode(withoutPrefix));
  return decodedBytes;
};
