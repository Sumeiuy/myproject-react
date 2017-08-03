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
          "description": "upd入岗投顾人员服务的客户数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null
        }
      ],
      "invest": [
        {
          "key": "tgInNum",
          "name": "投顾入岗人数",
          "value": null,
          "unit": "人",
          "description": "upd在投顾薪酬系统中人员状态为“入岗”的人数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null
        }
      ]
    }
  };
};