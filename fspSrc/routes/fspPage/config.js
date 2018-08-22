import _ from 'lodash';

const BLOCK_JSP_TEST_ELEM = [
  {
    pathname: '/fsp/customerCenter/customer360',
    test: [
      {
        id: '#isEdit',
        value: 'Y',
      },
      {
        id: '#isPerEdit',
        value: 'Y',
      },
      {
        id: '#isPersonalEdit',
        value: 'Y',
      },
      {
        id: '#isPersonalEdit',
        value: 'Y',
      },
    ],
  },
];

function checkJSPValue(testElems = []) {
  return _.every(testElems, (elem) => {
    if ($(elem.id)) {
      return $(elem.id).val() !== elem.value;
    }
    return true;
  });
}

export { BLOCK_JSP_TEST_ELEM, checkJSPValue };
