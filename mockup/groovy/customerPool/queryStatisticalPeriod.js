/**
 * 统计周期
*/
exports.response = function (req, res) {
  return {
  "code": "0",
  "msg": "OK",
  "resultData": {
    "518005":"按年",
    "518004":"按季度",
    "518003":"按月"
    }
  }
}
