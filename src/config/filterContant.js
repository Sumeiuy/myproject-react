import _ from 'lodash';

const RANDOM = `${_.random(1, 100000)}`;

const exported = {
  RANDOM,
};

export default exported;
export { RANDOM };
