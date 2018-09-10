/**
 * @Author: XuWenKang
 * @Description: 客户列表相关titlelist
 * @Date: 2018-06-06 14:13:41
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-07-12 10:19:50
 */

const exported = {
  holdingCombinationSecurity: [
    {
      dataIndex: 'securityNameCode',
      key: 'securityNameCode',
      title: '证券名称/代码',
      width: '48%',
      align: 'left',
    },
    {
      dataIndex: 'num',
      key: 'num',
      title: '数量',
      width: '27%',
      align: 'left',
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: '市值',
      width: '25%',
      align: 'left',
    },
  ],

  holdingIndustry: [
    {
      dataIndex: 'industryNameCode',
      key: 'industryNameCode',
      title: '证券名称/代码',
      align: 'left',
    },
    {
      dataIndex: 'amount',
      key: 'amount',
      title: '数量',
      align: 'left',
    },
    {
      dataIndex: 'marketValue',
      key: 'marketValue',
      title: '市值',
      align: 'left',
    },
  ],
};

export const {
  holdingCombinationSecurity,
  holdingIndustry,
} = exported;
