/**
 * 统计周期
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "kPIDataScopeType": [
        {
          "key": "518005",
          "value": "按年",
        },
        {
          "key": "518004",
          "value": "按季度",
        },
        {
          "key": "518003",
          "value": "按月",
        }
      ]
    }
  }
}
