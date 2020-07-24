import example1 from './example-1';
import example2 from './example-2';
const example3 = require('./example-3.json');

const unlockedDids: any = {
  [example1.id]: example1,
  [example2.id]: example2,
  [example3.id]: example3,
};

export { unlockedDids };
