/*
 * @Author: sunweibin
 * @Date: 2018-12-07 11:44:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:44:33
 * @description 包装下客户360下账户信息的model
 */
import { connect } from 'dva';

import { dva } from '../../../../helper';

import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 资产分布的雷达数据
  assetsRadarData: state.detailAccountInfo.assetsRadarData,
  // 资产分布的雷达上具体指标的数据
  specificIndexData: state.detailAccountInfo.specificIndexData,
  // 负债详情的数据
  debtDetail: state.detailAccountInfo.debtDetail,
  // 实时持仓中的实时资产
  realTimeAsset: state.detailAccountInfo.realTimeAsset,
  // 实时持仓中的证券实时持仓
  securitiesHolding: state.detailAccountInfo.securitiesHolding,
  // 实时持仓中的产品实时持仓
  productHoldingData: state.detailAccountInfo.productHoldingData,
  // 收益走势基本指标数据
  custBasicData: state.detailAccountInfo.custBasicData,
  // 收益走势对比指标数据
  custCompareData: state.detailAccountInfo.custCompareData,
  // 账户概要信息
  accountSummary: state.detailAccountInfo.accountSummaryInfo,
  // 普通账户、信用账户、期权账户信息
  accountInfo: state.detailAccountInfo.accountInfo,
  // 是否有已实施的流程
  hasDoingFlow: state.detailAccountInfo.hasDoingFlow,
  // 证券历史持仓明细
  stockHistoryHolding: state.detailAccountInfo.stockHistoryHoldingData,
  // 产品历史持仓明细
  productHistoryHolding: state.detailAccountInfo.productHistoryHoldingData,
  // 期权历史持仓明细
  optionHistoryHolding: state.detailAccountInfo.optionHistoryHoldingData,
  // 交易流水的业务类别
  tradeFlowBusnTypeDict: state.detailAccountInfo.tradeFlowBusnTypeDict,
  // 交易流水的资金变动下的业务类别
  tradeFlowCapitalBusnTypeDict: state.detailAccountInfo.tradeFlowCapitalBusnTypeDict,
  // 账户信息的业务类别
  accountBusnTypeDict: state.detailAccountInfo.accountBusnTypeDict,
  // 全产品目录
  productCatalogTree: state.detailAccountInfo.productCatalogTree,
  // 普通账户交易流水
  standardTradeFlowRes: state.detailAccountInfo.standardTradeFlowRes,
  // 信用账户交易流水
  creditTradeFlowRes: state.detailAccountInfo.creditTradeFlowRes,
  // 期权账户交易流水
  optionTradeFlowRes: state.detailAccountInfo.optionTradeFlowRes,
  // 资金变动交易流水
  capitalChangeFlowRes: state.detailAccountInfo.capitalChangeFlowRes,
  // 账户变动
  accountChangeRes: state.detailAccountInfo.accountChangeRes,
});

const mapDispatchToProps = {
  // 查询资产分布的雷达图数据
  getAssetRadarData: effect('detailAccountInfo/getAssetRadarData'),
  // 查询资产分布的雷达上具体指标的数据
  querySpecificIndexData: effect('detailAccountInfo/querySpecificIndexData'),
  // 查询资产分布的负债详情的数据
  queryDebtDetail: effect('detailAccountInfo/queryDebtDetail'),
  // 查询实时持仓中的实时资产
  getRealTimeAsset: effect('detailAccountInfo/getRealTimeAsset'),
  // 查询实时持仓中的证券实时持仓
  getSecuritiesHolding: effect('detailAccountInfo/getSecuritiesHolding', { forceFull: true }),
  // 查询实时持仓中的产品实时持仓
  getProductHoldingData: effect('detailAccountInfo/getProductHoldingData'),
  // 查询收益走势数据
  queryProfitRateInfo: effect('detailAccountInfo/getProfitRateInfo'),
  // 查询账户概要Tab下的信息
  queryAccountSummary: effect('detailAccountInfo/queryAccountSummary'),
  // 查询普通账户、信用账户、期权账户
  queryAccountInfo: effect('detailAccountInfo/queryAccountInfo'),
  // 清除Redux中的数据
  clearReduxData: effect('detailAccountInfo/clearReduxData', { loading: false }),
  // 查询是否有已实施的流程
  queryHasDoingFlow: effect('detailAccountInfo/queryHasDoingFlow'),
  // 查询证券历史持仓明细
  queryStockHistoryHolding: effect('detailAccountInfo/queryStockHistoryHolding', { forceFull: true }),
  // 查询产品历史持仓明细
  queryProductHistoryHolding: effect('detailAccountInfo/queryProductHistoryHolding', { forceFull: true }),
  // 查询期权历史持仓明细
  queryOptionHistoryHolding: effect('detailAccountInfo/queryOptionHistoryHolding', { forceFull: true }),
  // 获取交易流水的业务类别
  queryTradeFlowBusnTypeDict: effect('detailAccountInfo/queryTradeFlowBusnTypeDict', { forceFull: true }),
  // 获取交易流水下的资金变动的业务类别
  queryTradeFlowCapitalBusnTypeDict: effect('detailAccountInfo/queryTradeFlowCapitalBusnTypeDict', { forceFull: true }),
  // 获取账户信息下的业务类别
  queryAccountBusnTypeDict: effect('detailAccountInfo/queryAccountBusnTypeDict', { forceFull: true }),
  // 获取全产品目录
  queryProductCatalogTree: effect('detailAccountInfo/queryProductCatalogTree', { forceFull: true }),
  // 获取产品代码列表
  queryProductCodeList: effect('detailAccountInfo/queryProductCodeList', { forceFull: true }),
  // 获取普通账户交易流水
  queryStandardTradeFlow: effect('detailAccountInfo/queryStandardTradeFlow', { forceFull: true }),
  // 获取信用账户交易流水
  queryCreditTradeFlow: effect('detailAccountInfo/queryCreditTradeFlow', { forceFull: true }),
  // 获取期权账户交易流水
  queryOptionTradeFlow: effect('detailAccountInfo/queryOptionTradeFlow', { forceFull: true }),
  // 获取资金变动交易流水
  queryCapitalTradeFlow: effect('detailAccountInfo/queryCapitalTradeFlow', { forceFull: true }),
  // 获取账户变动
  queryAccountChange: effect('detailAccountInfo/queryAccountChange', { forceFull: true }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
