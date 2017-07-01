
const checkTreeObj = {
  expandedKeys: ['custAmountDetail', 'zcmx'],
  type: 'summury',
  checkTreeArr: [
    {
      indicatorCategoryDto: {
        categoryKey: 'custAmountDetail',
        categoryName: '客户数明细',
        parentCateKey: 'managementIndicator',
        level: '2',
        remark: null,
      },
      detailIndicators: [
        {
          key: 'totCustNum',
          name: '总客户数',
          value: null,
          unit: '户',
          description: '这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: null,
        },
        {
          key: 'effCustNum',
          name: '有效客户数',
          value: null,
          unit: '户',
          description: '这个是有效客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'InminorCustNum',
          name: '高净值客户数',
          value: null,
          unit: '户',
          description: '这个是高净值客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'newCustNum',
          name: '新开客户数',
          value: null,
          unit: '户',
          description: '这个指标是个人新开客户数、机构新开客户数、产品新开客户数的合计',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: 'Y',
          parentKey: null,
          parentName: null,
          children: [
            {
              key: 'pNewCustNum',
              name: '个人新开客户数',
              value: null,
              unit: '户',
              description: '这个是个人新开客户数',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'newCustNum',
              parentName: null,
              children: null,
              isChoosed: 'Y',
            },
            {
              key: 'oNewCustNum',
              name: '机构新开客户数',
              value: null,
              unit: '户',
              description: '这个是机构新开客户数',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'newCustNum',
              parentName: null,
              children: null,
              isChoosed: 'Y',
            },
            {
              key: 'oNewPrdtCustNum',
              name: '产品新开客户数',
              value: null,
              unit: '户',
              description: '这个是产品新开客户数',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'newCustNum',
              parentName: null,
              children: null,
              isChoosed: 'Y',
            },
          ],
          isChoosed: 'Y',
        },
        {
          key: 'hignLoseCustPercent',
          name: '高净值客户流失率',
          value: null,
          unit: '%',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
      ],
    },
    {
      indicatorCategoryDto: {
        categoryKey: 'zcmx',
        categoryName: '资产明细',
        parentCateKey: 'managementIndicator',
        level: '2',
        remark: null,
      },
      detailIndicators: [
        {
          key: 'totalzc',
          name: '总资产',
          value: null,
          unit: '户',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: null,
        },
        {
          key: 'effzc',
          name: '有效资产',
          value: null,
          unit: '户',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'minzc',
          name: '负资产',
          value: null,
          unit: '户',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'allzc',
          name: '所有资产',
          value: null,
          unit: '户',
          description: '我认为这个指标就是三个子指标的和',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: 'Y',
          parentKey: null,
          parentName: null,
          children: [
            {
              key: 'pZc',
              name: '个人资产',
              value: null,
              unit: '户',
              description: '这个指标不知取哪个字段',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'newCustNum',
              parentName: null,
              children: null,
              isChoosed: 'Y',
            },
            {
              key: 'ozc',
              name: '家庭资产',
              value: null,
              unit: '户',
              description: '这个指标不知取哪个字段',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'newCustNum',
              parentName: null,
              children: null,
              isChoosed: 'Y',
            },
            {
              key: 'opzc',
              name: '公司资产',
              value: null,
              unit: '户',
              description: '这个指标不知取哪个字段',
              categoryKey: null,
              isBelongsSummury: null,
              hasChildren: null,
              parentKey: 'newCustNum',
              parentName: null,
              children: null,
              isChoosed: 'Y',
            },
          ],
          isChoosed: 'Y',
        },
      ],
    },
  ],
};
const checkTreeObj1 = {
  expandedKeys: ['custAmountDetail1', 'zcmx1'],
  type: 'detail',
  checkTreeArr: [
    {
      indicatorCategoryDto: {
        categoryKey: 'custAmountDetail1',
        categoryName: '客户数明细1',
        parentCateKey: 'managementIndicator',
        level: '2',
        remark: null,
      },
      detailIndicators: [
        {
          key: 'totCustNum1',
          name: '总客户数1',
          value: null,
          unit: '户',
          description: '这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数这个是总客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: null,
        },
        {
          key: 'effCustNum1',
          name: '有效客户数',
          value: null,
          unit: '户',
          description: '这个是有效客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'InminorCustNum1',
          name: '高净值客户数',
          value: null,
          unit: '户',
          description: '这个是高净值客户数',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'newCustNum1',
          name: '新开客户数',
          value: null,
          unit: '户',
          description: '这个指标是个人新开客户数、机构新开客户数、产品新开客户数的合计',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          isChoosed: 'Y',
        },
        {
          key: 'hignLoseCustPercent1',
          name: '高净值客户流失率',
          value: null,
          unit: '%',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
      ],
    },
    {
      indicatorCategoryDto: {
        categoryKey: 'zcmx1',
        categoryName: '资产明细',
        parentCateKey: 'managementIndicator',
        level: '2',
        remark: null,
      },
      detailIndicators: [
        {
          key: 'totalzc1',
          name: '总资产',
          value: null,
          unit: '户',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: null,
        },
        {
          key: 'effzc1',
          name: '有效资产',
          value: null,
          unit: '户',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'minzc1',
          name: '负资产',
          value: null,
          unit: '户',
          description: '这个指标不知取哪个字段',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          children: null,
          isChoosed: 'Y',
        },
        {
          key: 'allzc1',
          name: '所有资产',
          value: null,
          unit: '户',
          description: '我认为这个指标就是三个子指标的和',
          categoryKey: null,
          isBelongsSummury: null,
          hasChildren: null,
          parentKey: null,
          parentName: null,
          isChoosed: 'Y',
        },
      ],
    },
  ],
};
export default { checkTreeObj, checkTreeObj1 };
