// // 使用 Mock
// var Mock = require('mockjs');
// let data = Mock.mock({
//     'performance|1-20':[{
//     'title|1': ['投顾入岗人数','签约客户数','签约资金','签约平均佣金率','投顾净佣金收入','资产配置覆盖率','托管总资产','MOT任务完成率'],
//     'num|5000-1000000000': 1,
//     'unit|1': ['户', '元', '%', '元'],
//     'icon|1': ['ren', 'kh', 'zc', 'tg','per'],
//   }]
// })
exports.response = function (req, res) {
    return {
        "code": "0",
        "msg": "OK",
        "resultData": {
            "singleRecords": [
                {
                    "key": "tgInNum",
                    "name": "投顾入岗人数",
                    "value": "150",
                    "unit": "人",
                    "description": null
                }, {
                    "key": "currSignCustNum",
                    "name": "签约客户数",
                    "value": "0",
                    "unit": "户",
                    "description": "当前签约客户数"
                }, {
                    "key": "currSignCustAset",
                    "name": "签约总资产",
                    "value": "0",
                    "unit": "元",
                    "description": null
                }, {
                    "key": "totAset",
                    "name": "托管总资产",
                    "value": "90196742300.5894",
                    "unit": "元",
                    "description": null
                }, {
                    "key": "feeConfigPercent",
                    "name": "资产配置覆盖率",
                    "value": "0.3504496502720106583768180304207838347952",
                    "unit": "%",
                    "description": null
                }, {
                    "key": "infoCompPercent",
                    "name": "高净值客户信息完善率",
                    "value": "0.9370525087655394186698726901770091465527",
                    "unit": "%",
                    "description": null
                }, {
                    "key": "motCompletePercent",
                    "name": "MOT任务完成率",
                    "value": null,
                    "unit": "%",
                    "description": null
                }, {
                    "key": "serviceCompPercent",
                    "name": "服务覆盖率",
                    "value": "0.4995225935383590540690573998001554346619",
                    "unit": "%",
                    "description": null
                }
            ]
        }
    }
}
