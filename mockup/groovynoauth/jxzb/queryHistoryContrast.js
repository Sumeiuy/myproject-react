exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": {
      "cust": [
        {
          "key": "custNum",
          "name": "服务客户数",
          "value": null,
          "unit": "户",
          "description": "入岗投顾人员服务的客户数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null,
          "isAggressive": "1"
        },
        {
          "key": "currSignCustNum",
          "name": "签约客户数",
          "value": null,
          "unit": "户",
          "description": "入岗投顾统计期内名下签约的客户数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null,
          "isAggressive": "1"
        }
      ],
      "invest": [
        {
          "key": "tgNum",
          "name": "投顾人数",
          "value": null,
          "unit": "人",
          "description": "HR系统中具有投顾咨询资格的人数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null,
          "isAggressive": "1"
        },
        {
          "key": "tgInNum",
          "name": "投顾入岗人数",
          "value": null,
          "unit": "人",
          "description": "在投顾薪酬系统中人员状态为“入岗”的人数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null,
          "isAggressive": "1"
        }
      ]
    }
  };
};
