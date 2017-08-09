/**
 * 统计周期
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "kPIDateScopeType": [
        {
          "key": "518005",
          "value": "本年",
        },
        {
          "key": "518004",
          "value": "本季",
        },
        {
          "key": "518003",
          "value": "本月",
        }
      ]
    }
  }
}
