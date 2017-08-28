/**
 * 自建任务字典
*/
exports.response = function (req, res) {
  return {
    "code": 0,
    "msg": "OK",
    "resultData": {
      "missionTypes": [
        {
          "key": "704040",
          "value": "产品类",
          "defaultExecuteType": "Mission"
        },
        {
          "key": "12",
          "value": "账户类",
          "defaultExecuteType": "Mission"
        },
        {
          "key": "704020",
          "value": "融资打薪类",
          "defaultExecuteType": "Mission"
        },
        {
          "key": "704015",
          "value": "小额贷类",
          "defaultExecuteType": "Mission"
        }
      ],
      "executeType": [
        {
          "key": "Mission",
          "value": "必做"
        },
        {
          "key": "Chance",
          "value": "选做"
        }
      ]
    }
  }
}
