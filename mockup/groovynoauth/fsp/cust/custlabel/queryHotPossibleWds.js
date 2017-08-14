/**
 * 联想的推荐热词列表
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "hotPossibleWdsList": [
        {
          "id": null,
          "tagNumId": "499_1",
          "labelMapping": "shi_fou_cai_zhang_die",
          "labelNameVal": "乐米版猜涨跌客户",
          "labelDesc": "乐米版猜涨跌客户"
        },
        {
          "id": null,
          "tagNumId": "231_1",
          "labelMapping": "shi_fou_cai_zhang_die",
          "labelNameVal": "乐米版猜涨跌客户",
          "labelDesc": "近三个月参与乐米版猜涨跌次数超过1次"
        }
      ]
    }
  }
}