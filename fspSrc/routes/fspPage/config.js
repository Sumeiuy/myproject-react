import _ from 'lodash';

const BLOCK_JSP_TEST_ELEM = [
  {
    pathname: '/fsp/customerCenter/customer360',
    test: [
      {
        id: '#isEdit',
        value: 'Y',
        isCondition: false, // 条件不满足的时候，返回true
      },
      {
        id: '#isPerEdit',
        value: 'Y',
        isCondition: false,
      },
      {
        id: '#isPersonalEdit',
        value: 'Y',
        isCondition: false,
      },
      {
        id: '#isPersonalEdit',
        value: 'Y',
        isCondition: false,
      },
    ],
  },
  {
    pathname: '/fsp/customerCenter/contractSelectOperate',
    test: [
      {
        id: '#tgcontractlist_custcomp_econNum',
        value: '',
        isCondition: true, // 条件满足时候，返回true
      },
    ],
  },
];

function checkJSPValue(testElems = []) {
  return _.every(testElems, (elem) => {
    if ($(elem.id)) {
      return elem.isCondition ? $(elem.id).val() === elem.value : $(elem.id).val() !== elem.value;
    }
    return true;
  });
}

export { BLOCK_JSP_TEST_ELEM, checkJSPValue };
