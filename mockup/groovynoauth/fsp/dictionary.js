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
      ],
      "custBusinessType":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"817030",
            "value":"融资融券"
        },
        {
            "key":"817200",
            "value":"沪港通"
        },
      ],
      "custNature":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"P",
            "value":"个人"
        },
        {
            "key":"O",
            "value":"机构"
        },
      ],
      "custRiskBearing":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"704040",
            "value":"保守型(最低类别)"
        },
        {
            "key":"704030",
            "value":"保守型"
        },
        {
            "key":"704020",
            "value":"稳健型"
        },
        {
            "key":"704015",
            "value":"积极型"
        },
        {
            "key":"704025",
            "value":"谨慎型"
        },
        {
            "key":"704010",
            "value":"激进型"
        }
      ],
      "custType":[
        {
            "key":"",
            "value":"不限"
        },
        {
            "key":"Y",
            "value":"高净值"
        },
        {
            "key":"N",
            "value":"零售客户"
        }
      ]
    }
  }
}
