exports.response = function (req, res) {
  return {
    "code": "0",
    "msg": "OK",
    "resultData": [
      {
          "key": "effCustNum",
          "name": "有效客户数",
          "value": null,
          "unit": "户",
          "description": "统计周期期末为有效的客户数",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null,
          "incrementRate": "10%",
          "isAggressive": "1"
      },
      {
          "key": "InminorCustNum",
          "name": "高净值客户数",
          "value": null,
          "unit": "户",
          "description": "是否零售客户标志为非零售客户",
          "categoryKey": null,
          "isBelongsSummury": null,
          "hasChildren": null,
          "parentKey": null,
          "parentName": null,
          "children": null,
          "incrementRate": "20%",
          "isAggressive": "1"
      },
      {
            "key": "totCustNum",
            "name": "总客户数",
            "value": null,
            "unit": "户",
            "description": "非销户的客户总数",
            "categoryKey": null,
            "isBelongsSummury": null,
            "hasChildren": null,
            "parentKey": null,
            "parentName": null,
            "children": null,
            "incrementRate": "30%",
            "isAggressive": "1"
        },
        {
            "key": "pCustNum",
            "name": "个人客户数",
            "value": null,
            "unit": "户",
            "description": "客户性质为个人且状态为非销户客户数",
            "categoryKey": null,
            "isBelongsSummury": null,
            "hasChildren": null,
            "parentKey": null,
            "parentName": null,
            "children": null,
            "incrementRate": "40%",
            "isAggressive": "1"
        },
        {
            "key": "minorCustNum",
            "name": "零售客户数",
            "value": null,
            "unit": "户",
            "description": "是否零售客户标志为零售客户",
            "categoryKey": null,
            "isBelongsSummury": null,
            "hasChildren": null,
            "parentKey": null,
            "parentName": null,
            "children": null,
            "incrementRate": "50%",
            "isAggressive": "1"
        }
    ]
  }
}