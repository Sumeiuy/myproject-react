/**
 * @Descripter: 个性化信息匹配规则配置
 * @Author: k0170179
 * @Date: 2018/6/13
 */

//  账户状态
const accountState = {
  name: '账户状态',
  id: 'accountStausName',
  render: 'renderDefaultVal',
};

/**
 * @desc: 描述个性化信息map的每一项key的含义
 * * name: 个性化信息的label
 * * id: 个性化信息对应的数据（response）的key
 * * render: 该项个性化信息定制的render方法
 * * unit: 是否需要添加单位
 * * hasCycle: 该项个性化信息是否有周期
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
  outMktVal: {
    inset: true,
    key: [{
      name: '外部市值',
      id: 'outMktVal',
      render: 'renderDefaultVal',
      unit: '元',
    }],
  },
  cashAmt: {
    inset: false,
    key: [{
      name: '资金余额（含信用）',
      id: 'cashAmt',
      render: 'renderDefaultVal',
      unit: '元',
    }],
  },
  avlAmt: {
    inset: false,
    key: [{
      name: '普通可用资金',
      id: 'avlAmt',
      render: 'renderDefaultVal',
      unit: '元',
    }],
  },
  avlAmtCrdt: {
    inset: false,
    key: [{
      name: '信用可用资金',
      id: 'avlAmtCrdt',
      render: 'renderDefaultVal',
      unit: '元',
    }],
  },
  totMktVal: {
    inset: true,
    key: [{
      name: '总市值(含信用)',
      id: 'totMktVal',
      render: 'renderDefaultVal',
      unit: '元',
    }],
  },
  primaryKeyJxgrps: {
    inset: true,
    key: [{
      name: '订购组合',
      id: 'primaryKeyJxgrps',
      render: 'renderOrderCombination',
    }],
  },
  name: {
    inset: true,
    key: [{
      name: '姓名',
      id: 'name',
      render: 'renderDefaultVal',
    }],
  },
  accountStatus: {
    inset: false,
    key: [accountState],
  },
  idNum: {
    inset: true,
    key: [{
      name: '身份证号码',
      id: 'idNum',
      render: 'renderDefaultVal',
    }],
  },
  serviceRecord: {
    inset: true,
    key: [{
      name: '服务记录',
      id: 'serviceRecord',
      render: 'renderDefaultVal',
    }],
  },
  sorPtyId: {
    inset: true,
    key: [{
      name: '经纪客户号',
      id: 'custId',
      render: 'renderDefaultVal',
    }],
  },
  mobile: {
    inset: true,
    key: [{
      name: '联系电话',
      id: 'telephone',
      render: 'renderDefaultVal',
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
  validDt: {
    inset: false,
    key: [
      {
        name: '开户日期',
        id: 'accountOpenDate',
        render: 'renderDefaultVal',
      },
      accountState,
    ],
  },
  dateOpened: {
    inset: false,
    key: [
      {
        name: '开户日期',
        id: 'accountOpenDate',
        render: 'renderDefaultVal',
      },
      accountState,
    ],
  },
  gjzDt: {
    inset: false,
    key: [
      {
        name: '高净值客户认定日期',
        id: 'gjzDt',
        render: 'renderDefaultVal',
      },
      accountState,
    ],
  },
  highPrdtDt: {
    inset: false,
    key: [
      {
        name: '高端产品户认定日期',
        id: 'highPrdtDt',
        render: 'renderDefaultVal',
      },
      accountState,
    ],
  },
  buyProdDt: {
    inset: false,
    key: [
      {
        name: '产品户认定日期',
        id: 'buyProdDt',
        render: 'renderDefaultVal',
      },
      accountState,
    ],
  },
  purFinAset: {
    inset: true,
    key: [
      {
        name: '净转入总额',
        id: 'purFinAset',
        render: 'renderDefaultVal',
        unit: '元',
      },
    ],
  },
  gjAmt: {
    inset: true,
    key: [
      {
        name: '基础股基交易量',
        id: 'gjAmt',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  gjPurRake: {
    inset: true,
    key: [
      {
        name: '累计股基净佣金',
        id: 'gjPurRake',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  kfBuyAmt: {
    inset: true,
    key: [
      {
        name: '公募基金购买金额',
        id: 'kfBuyAmt',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  smBuyAmt: {
    inset: true,
    key: [
      {
        name: '私募基金购买金额',
        id: 'smBuyAmt',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  finaBuyAmt: {
    inset: true,
    key: [
      {
        name: '紫金产品购买金额',
        id: 'finaBuyAmt',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  otcBuyAmt: {
    inset: true,
    key: [
      {
        name: 'OTC购买金额',
        id: 'otcBuyAmt',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  lastServDt: {
    inset: true,
    key: [
      {
        name: '最近服务日期',
        id: 'lastServDt',
        render: 'renderDefaultVal',
      },
    ],
  },
  tgSignDate: {
    inset: true,
    key: [
      {
        name: '签约模式',
        id: 'tgFeeMode',
        render: 'renderDefaultVal',
      },
      {
        name: '签约日期',
        id: 'tgSignDate',
        render: 'renderDefaultVal',
      },
    ],
  },
  purRake: {
    inset: true,
    key: [
      {
        name: '净佣金收入',
        id: 'purRake',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  saleFare: {
    inset: true,
    key: [
      {
        name: '产品手续费净收入',
        id: 'saleFare',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  netIncome: {
    inset: true,
    key: [
      {
        name: '利息净收入',
        id: 'netIncome',
        render: 'renderDefaultVal',
        unit: '元',
        hasCycle: true,
      },
    ],
  },
  gjlRate: {
    inset: true,
    key: [{
      name: '外部市值',
      id: 'outMktVal',
      render: 'renderDefaultVal',
      unit: '元',
    }],
  },
  completedRate: {
    inset: true,
    key: [{
      name: '未完备信息',
      id: 'completedRate',
      descMap: {
        mobileFlag: '手机号码',
        emailFlag: '电子邮箱',
        addrFlag: '联系地址',
        riskFlag: '风险偏好',
      },
      render: 'renderNoCompleted',
    }],
  },
  primaryKeyIndustry: {
    inset: true,
    key: [{
      name: '持仓行业',
      id: 'holdingIndustry',
      render: 'renderHoldingIndustry',
    }],
  },
};

export default matchRule;
