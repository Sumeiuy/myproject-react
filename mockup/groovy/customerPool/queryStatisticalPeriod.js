/**
 * 统计周期
*/
exports.response = function (req, res) {
  return {
  "code": "0",
  "msg": "OK",
  "resultData": [
    {
      key: "518005",
      name: "按年",
    },
    {
      key: "518004",
      name: "按季度",
    },
    {
      key: "518003",
      name: "按月",
    }
  ]
  }
}
