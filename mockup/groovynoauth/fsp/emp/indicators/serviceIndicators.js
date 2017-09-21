/**
 * 首页 服务指标
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [{
      'text': 'MOT 覆盖率',
      'percent': 45,
    }, {
      'text': '服务覆盖率',
      'percent': 34,
    }],
  }
}