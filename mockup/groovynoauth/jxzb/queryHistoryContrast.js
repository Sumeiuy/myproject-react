exports.response = function (req, res) {
  return {
    code: '0',
    msg: 'OK',
    resultData: {
      cust: [
        {
          key: 'totCustNum',
          name: '总客户数',
          value: null,
          unit: '户',
          description: '非销户的客户总数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isAggressive: '1',
        },
        {
          key: 'pCustNum',
          name: '个人客户数',
          value: null,
          unit: '户',
          description: '客户性质为个人且状态为非销户客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isAggressive: '1',
        },
        {
          key: 'oCustNum',
          name: '机构客户数',
          value: null,
          unit: '户',
          description: '客户性质为机构客户且状态为非销户客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: 'Y',
          parentKey: null,
          parentName: null,
          children: [
            {
              key: 'oNoPrdtCustNum',
              name: '一般',
              value: null,
              unit: '户',
              description: '除产品户之外的机构客户',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'oCustNum',
              parentName: '机构客户数',
              children: null,
              isAggressive: '1',
            },
            {
              key: 'oPrdtCustNum',
              name: '产品',
              value: null,
              unit: '户',
              description: '客户性质为机构且机构类型为产品户，账户状态正常的客户。产品类型不为“基金公司特定客户资产管理产品（保险）”、“全国社保基金”、“地方社保基金”、“保险产品”、“保险资产管理产品”、“企业年金计划”、“养老金产品”、“银行理财产品”、上市公司员工持股计划”“其他”的客户，剔除资管客户',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'oCustNum',
              parentName: '机构客户数',
              children: null,
              isAggressive: '1',
            },
          ],
          isAggressive: '1',
        },
        {
          key: 'oNewCustNum',
          name: '一般机构',
          value: null,
          unit: '户',
          description: '在统计周期内开户，且客户性质为一般机构的客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: 'newCustNum',
          parentName: '新开客户数',
          children: null,
          isAggressive: '2',
        },
        {
          key: 'oNewPrdtCustNum',
          name: '产品机构',
          value: null,
          unit: '户',
          description: '在统计周期内开户，且客户性质为产品机构户的客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: 'newCustNum',
          parentName: '新开客户数',
          children: null,
          isAggressive: '2',
        },
        {
          key: 'InminorCustNum',
          name: '高净值客户数',
          value: null,
          unit: '户',
          description: '是否零售客户标志为非零售客户',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isAggressive: '1',
        },
      ],
      invest: null,
    },
  };
};
