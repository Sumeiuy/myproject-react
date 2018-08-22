import _ from 'lodash';

const BLOCK_JSP_TEST_ELEM = [
  {
    pathname: '/fsp/customerCenter/customer360',
    test: [
      {
        id: '#isEdit',
        value: 'N',
      },
      {
        id: '#isPerEdit',
        value: 'N',
      },
      {
        id: '#isPersonalEdit',
        value: 'N',
      },
      {
        id: '#isPersonalEdit',
        value: 'N',
      },
    ],
  },
  {
    pathname: '/fsp/customerCenter/contractSelectOperate',
    test: [
      {
        id: '#tgcontractlist_custcomp_econNum',
        value: '',
      },
    ],
  },
];

function checkJSPValue(testElems = []) {
  return _.every(testElems, (elem) => {
    if ($(elem.id)) {
      return $(elem.id).val() === elem.value;
    }
    return true;
  });
}

export { BLOCK_JSP_TEST_ELEM, checkJSPValue };
