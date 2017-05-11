// 使用 Mock
let Mock = require('mockjs');
let data = Mock.mock({
  'chartInfo|8':[{
    'title|1': ['投顾入岗人数','签约客户数','签约资金','签约平均佣金率','投顾净佣金收入','资产配置覆盖率','托管总资产','MOT任务完成率'],
    'unit|1': ['户', '亿', '%', '万'],
    'icon|1': ['ren', 'kh', 'zc', 'tg','per'],
    'data|8': [{
      'name|1':['南京','北京','上海','广州','深圳','宁波','武汉','长沙','合肥','西安'],
      'value|100-1000': 300
    }]
  }]
})
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": data
  };
}
