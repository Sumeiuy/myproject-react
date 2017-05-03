// 使用 Mock
// var Mock = require('mockjs');
// let data = Mock.mock({
//     'performance|1-20':[{
//     'title|1': ['投顾入岗人数','签约客户数','签约资金','签约平均佣金率','投顾净佣金收入','资产配置覆盖率','托管总资产','MOT任务完成率'],
//     'num|500-1000': 1,
//     'unit|1': ['户', '亿', '%', '万'],
//     'icon|1': ['ren', 'kh', 'zc', 'tg','per'],
//   }]
// })

exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "performance": [
      {
        "title": "投顾入岗人数",
        "num": "1235",
        "unit": "户",
        "icon": "ren",
      },
      {
        "title": "签约客户数",
        "num": "1586",
        "unit": "户",
        "icon": "kh",
      },
      {
        "title": "签约资金",
        "num": "236",
        "unit": "亿",
        "icon": "zc",
      },
      {
        "title": "签约平均佣金率",
        "num": "66",
        "unit": "%",
        "icon": "tg",
      },
      {
        "title": "投顾净佣金收入",
        "num": "1289",
        "unit": "亿",
        "icon": "zc",
      },
      {
        "title": "资产配置覆盖率",
        "num": "81",
        "unit": "%",
        "icon": "per",
      },
      {
        "title": "托管总资产",
        "num": "281",
        "unit": "万",
        "icon": "zc",
      },
      {
        "title": "MOT任务完成率",
        "num": "63",
        "unit": "%",
        "icon": "per",
      }
    ]
    }
  }
}
