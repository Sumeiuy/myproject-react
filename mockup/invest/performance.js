// 使用 Mock
var Mock = require('mockjs');
let data = Mock.mock({
    'performance|8-20':[{
    'title|1': ['投顾入岗人数','签约客户数','签约资金','签约平均佣金率','投顾净佣金收入','资产配置覆盖率','托管总资产','MOT任务完成率'],
    'num|500-1000': 1,
    'unit|1': ['户', '亿', '%', '万'],
    'icon|1': ['ren', 'kh', 'zc', 'tg','per'],
  }]
})
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": data
  }
}
