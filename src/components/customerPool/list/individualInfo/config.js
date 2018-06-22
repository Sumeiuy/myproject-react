/**
 * @Descripter: 个性化信息匹配规则配置
 * @Author: k0170179
 * @Date: 2018/6/13
 */

const matchRule = {
  primaryKeyLabels: {
    inset: true,
    key: [{
      name: '用户标签',
      id: 'relatedLabels',
      render: 'renderCustomerLabels',
    }],
  },
  primaryKeyPrdts: {
    inset: true,
    key: [
      {
        name: '持仓产品',
        id: 'holdingProducts',
        render: 'renderHoldingProduct',
      },
    ],
  },
  rights: {
    inset: true,
    key: [
      {
        name: '已开通业务',
        id: 'userRights',
        render: 'renderUserRights',
      },
      {
        name: '可开通业务',
        id: 'unrightType',
        render: 'renderUnrightType',
      }],
  },
  businessOpened: {
    inset: true,
    key: [
      {
        name: '已开通业务',
        id: 'userRights',
        render: 'renderUserRights',
      },
      {
        name: '可开通业务',
        id: 'unrightType',
        render: 'renderUnrightType',
      }],
  },
  unrights: {
    inset: true,
    key: [
      {
        name: '已开通业务',
        id: 'userRights',
        render: 'renderUserRights',
      },
      {
        name: '可开通业务',
        id: 'unrightType',
        render: 'renderUnrightType',
      }],
  },
  searchText: {
    inset: true,
    key: [
      {
        name: '姓名',
        id: 'name',
        render: 'renderName',
      },
      {
        name: '身份证号码',
        id: 'idNum',
        render: 'renderIdNum',
      },
      {
        name: '联系电话',
        id: 'telephone',
        render: 'renderTelephone',
      },
      {
        name: '经纪客户号',
        id: 'custId',
        render: 'renderCustId',
      },
      {
        name: '服务记录',
        id: 'serviceRecord',
        render: 'renderServiceRecord',
      },
      {
        name: '匹配标签',
        id: 'relatedLabels',
        render: 'renderRelatedLabels',
      },
      {
        name: '持仓产品',
        id: 'holdingProducts',
        render: 'renderSearchProduct',
      },
    ],
  },
};

export default matchRule;
