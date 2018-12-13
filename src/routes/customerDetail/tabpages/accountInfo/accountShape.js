/*
 * @Author: sunweibin
 * @Date: 2018-12-07 11:47:39
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:05:29
 * @description 由于客户360中的props实在是太多了，所以将prop校验的提取出来
 */
import PropTypes from 'prop-types';

const accountPropTypes = {
  location: PropTypes.object.isRequired,
  // 资产分布的雷达数据
  assetsRadarData: PropTypes.object.isRequired,
  // 资产分布的雷达上具体指标的数据
  specificIndexData: PropTypes.array.isRequired,
  // 负债详情的数据
  debtDetail: PropTypes.object.isRequired,
  // 查询资产分布的雷达图数据
  getAssetRadarData: PropTypes.func.isRequired,
  // 查询资产分布的雷达上具体指标的数据
  querySpecificIndexData: PropTypes.func.isRequired,
  // 查询资产分布的负债详情的数据
  queryDebtDetail: PropTypes.func.isRequired,
  // 实时持仓中的实时资产
  realTimeAsset: PropTypes.object.isRequired,
  // 实时持仓中的证券实时持仓
  securitiesHolding: PropTypes.array.isRequired,
  // 实时持仓中的产品实时持仓
  productHoldingData: PropTypes.array.isRequired,
  // 查询实时持仓中的实时资产
  getRealTimeAsset: PropTypes.func.isRequired,
  // 查询实时持仓中的证券实时持仓
  getSecuritiesHolding: PropTypes.func.isRequired,
  // 查询实时持仓中的产品实时持仓
  getProductHoldingData: PropTypes.func.isRequired,
  custBasicData: PropTypes.object.isRequired,
  custCompareData: PropTypes.object.isRequired,
  // 查询收益走势数据
  queryProfitRateInfo: PropTypes.func.isRequired,
  // 查询账户概要Tab下的数据
  queryAccountSummary: PropTypes.func.isRequired,
  accountSummary: PropTypes.object.isRequired,
  // 查询普通账户、信用账户、期权账户
  queryAccountInfo: PropTypes.func.isRequired,
  accountInfo: PropTypes.object.isRequired,
  // 清除Redux中的数据
  clearReduxData: PropTypes.func.isRequired,
  // 查询是否有已实施的流程
  queryHasDoingFlow: PropTypes.func.isRequired,
  // 是否有已实施的流程
  hasDoingFlow: PropTypes.bool.isRequired,
  // 证券历史持仓明细 api
  queryStockHistoryHolding: PropTypes.func.isRequired,
  // 产品历史持仓明细 api
  queryProductHistoryHolding: PropTypes.func.isRequired,
  // 期权历史持仓明细 api
  queryOptionHistoryHolding: PropTypes.func.isRequired,
  // 证券历史持仓明细数据
  stockHistoryHolding: PropTypes.object.isRequired,
  // 产品历史持仓明细数据
  productHistoryHolding: PropTypes.object.isRequired,
  // 期权历史持仓明细数据
  optionHistoryHolding: PropTypes.object.isRequired,
  // 获取交易流水的业务类别
  queryTradeFlowBusnTypeDict: PropTypes.func.isRequired,
  // 获取交易流水的业务类别
  queryTradeFlowCapitalBusnTypeDict: PropTypes.func.isRequired,
  // 获取账户信息的业务类型
  queryAccountBusnTypeDict: PropTypes.func.isRequired,
  // 获取产品代码
  queryProductCodeList: PropTypes.func.isRequired,
  // 获取全产品目录
  queryProductCatalogTree: PropTypes.func.isRequired,
  // 获取普通账户交易流水
  queryStandardTradeFlow: PropTypes.func.isRequired,
  // 获取信用账户交易流水
  queryCreditTradeFlow: PropTypes.func.isRequired,
  // 获取期权账户交易流水
  queryOptionTradeFlow: PropTypes.func.isRequired,
  // 获取资金变动交易流水
  queryCapitalTradeFlow: PropTypes.func.isRequired,
  // 获取账户变动
  queryAccountChange: PropTypes.func.isRequired,
  // 交易流水的业务类别
  tradeFlowBusnTypeDict: PropTypes.object.isRequired,
  // 交易流水下的资金变动的业务类别
  tradeFlowCapitalBusnTypeDict: PropTypes.object.isRequired,
  // 账户信息的业务类别
  accountBusnTypeDict: PropTypes.object.isRequired,
  // 全产品目录
  productCatalogTree: PropTypes.array.isRequired,
  // 普通账户交易流水
  standardTradeFlowRes: PropTypes.object.isRequired,
  // 信用账户交易流水
  creditTradeFlowRes: PropTypes.object.isRequired,
  // 期权账户交易流水
  optionTradeFlowRes: PropTypes.object.isRequired,
  // 资金变动交易流水
  capitalChangeFlowRes: PropTypes.object.isRequired,
  // 账户变动
  accountChangeRes: PropTypes.object.isRequired,
  // 主服务经理权限
  isMainEmpPermission: PropTypes.bool.isRequired,
};

export default accountPropTypes;
