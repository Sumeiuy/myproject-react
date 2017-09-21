/**
 * 首页 新增客户
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [{
      'cust': '净新增有效户',
      'count': 25,
      'percent': 60,
    }, {
      'cust': '净新增高净值户',
      'count': 18,
      'percent': 40,
    }, {
      'cust': '净新增高端客户',
      'count': 18,
      'percent': 40,
    }, {
      'cust': '净新增产品客户',
      'count': 18,
      'percent': 40,
    }],
  }
}