import _ from 'lodash';

const RANDOM = _.random(1, 100000);
const randomStr1 = `FILTER_SELECT_FROM_MOREFILTER_${RANDOM}`;
const randomStr2 = `MORE_FILTER_STORAGE_${RANDOM}`;

export default {
  FILTER_SELECT_FROM_MOREFILTER: randomStr1,
  MORE_FILTER_STORAGE: randomStr2,
  RANDOM,
};
