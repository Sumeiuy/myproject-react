// 使用 Mock
// let Mock = require('mockjs');
// let data = Mock.mock({
//   'chartInfo|8':[{
//     'title|1': ['投顾入岗人数','签约客户数','签约资金','签约平均佣金率','投顾净佣金收入','资产配置覆盖率','托管总资产','MOT任务完成率'],
//     'unit|1': ['户', '亿', '%', '万'],
//     'icon|1': ['ren', 'kh', 'zc', 'tg','per'],
//     'data|8': [{
//       'name|1':['南京','北京','上海','广州','深圳','宁波','武汉','长沙','合肥','西安'],
//       'value|100-1000': 300
//     }]
//   }]
// })
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "chartInfo": [
              {
        "title": "投顾入岗人数",
        "unit": "户",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 450
          },
          {
            "name": "广州",
            "value": 540
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 200
          },
          {
            "name": "长沙",
            "value": 700
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 300
          }
        ]
      },
      {
        "title": "签约客户数",
        "unit": "户",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      },
      {
        "title": "签约资产",
        "unit": "万元",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      },
      {
        "title": "签约平均佣金率",
        "unit": "%",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      },
      {
        "title": "投顾净佣金收入",
        "unit": "万元",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      },
      {
        "title": "资产配置覆盖率",
        "unit": "%",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      },
      {
        "title": "托管总资产",
        "unit": "万元",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      },
      {
        "title": "MOT任务完成率",
        "unit": "%",
        "icon": "ren",
        "data": [
          {
            "name": "南京",
            "value": 900
          },
          {
            "name": "北京",
            "value": 820
          },
          {
            "name": "上海",
            "value": 730
          },
          {
            "name": "广州",
            "value": 640
          },
          {
            "name": "深圳",
            "value": 520
          },
          {
            "name": "宁波",
            "value": 460
          },
          {
            "name": "武汉",
            "value": 400
          },
          {
            "name": "长沙",
            "value": 320
          },
          {
            "name": "合肥",
            "value": 280
          },
          {
            "name": "西安",
            "value": 108
          }
        ]
      }
      ]
    }
  };
}
