/**
 * @Author: XuWenKang
 * @Description: 客户列表相关titlelist
 * @Date: 2018-06-06 14:13:41
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-06 14:54:45
 */

export default {
  holdingCombinationSecurity: [
    {
      dataIndex: 'securityNameCode',
      key: 'securityNameCode',
      title: '证券名称/代码',
      width: '45%',
      align: 'left',
    },
    {
      dataIndex: 'num',
      key: 'num',
      title: '持仓数量',
      width: '30%',
      align: 'left',
    },
    {
      dataIndex: 'price',
      key: 'price',
      title: '持仓市值',
      width: '25%',
      align: 'left',
    },
  ],
};
