/**
 * 沪深归集率数据
*/
exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [{
      "key": "shzNpRate",
      "name": "沪深归集率",
      "value": '45',
      "unit": "%",
      "description": "客户在沪深市场归属华泰的资产总额/所有资产总额\n",
      "categoryKey": null,
      "isBelongsSummury": null,
      "hasChildren": null,
      "parentKey": null,
      "parentName": null,
      "children": null,
      "isAggressive": null,
    }],
  };
}
