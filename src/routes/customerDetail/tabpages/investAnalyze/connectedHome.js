/*
 * @Author: zhangjun
 * @Date: 2018-11-27 16:21:53
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-12-04 19:51:04
 * @Description: 客户360-投资能力分析相关effect,mapStateToProps,mapDispatchToProps
 */
import { connect } from 'dva';
import { dva } from '../../../../helper';
import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const effects = {
  // 获取客户盈利能力
  getProfitAbility: 'detailInvestAnalyze/getProfitAbility',
  // 获取投资账户特征
  getInvestmentFeatureLabels: 'detailInvestAnalyze/getInvestmentFeatureLabels',
  // 获取账户资产变动
  getAssetChangeState: 'detailInvestAnalyze/getAssetChangeState',
  // 获取账户资产变动图表
  getAssetChangeReport: 'detailInvestAnalyze/getAssetChangeReport',
  // 获取账户收益走势图表数据
  getProfitTrendReport: 'detailInvestAnalyze/getProfitTrendReport',
  // 获取brinson归因结果
  getAttributionAnalysis: 'detailInvestAnalyze/getAttributionAnalysis',
  // 获取个体收益明细结果
  getEachStockIncomeDetails: 'detailInvestAnalyze/getEachStockIncomeDetails',
};

const mapStateToProps = state => ({
  // 客户盈利能力
  profitAbility: state.detailInvestAnalyze.profitAbility,
  // 投资账户特征
  investmentFeatureLabels: state.detailInvestAnalyze.investmentFeatureLabels,
  // 账户资产变动
  assetChangeList: state.detailInvestAnalyze.assetChangeList,
  // 账户资产变动图表数据
  assetChangeReportData: state.detailInvestAnalyze.assetChangeReportData,
  // 账户收益走势图表数据
  profitTrendData: state.detailInvestAnalyze.profitTrendData,
  // brinson归因数据
  attributionData: state.detailInvestAnalyze.attributionData,
  // 个体收益明细数据
  incomeDetailData: state.detailInvestAnalyze.incomeDetailData,
});

const mapDispatchToProps = {
  // 获取客户盈利能力
  getProfitAbility: effect(effects.getProfitAbility, { forceFull: true }),
  // 获取投资账户特征
  getInvestmentFeatureLabels: effect(effects.getInvestmentFeatureLabels, { forceFull: true }),
  // 获取账户资产变动
  getAssetChangeState: effect(effects.getAssetChangeState, { forceFull: true }),
  // 获取账户资产变动图表
  getAssetChangeReport: effect(effects.getAssetChangeReport, { forceFull: true }),
  // 获取账户收益走势图表数据
  getProfitTrendReport: effect(effects.getProfitTrendReport, { forceFull: true }),
  // 获取brinson归因结果
  getAttributionAnalysis: effect(effects.getAttributionAnalysis, { forceFull: true }),
  // 获取个体收益明细
  getEachStockIncomeDetails: effect(effects.getEachStockIncomeDetails, { forceFull: true }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
