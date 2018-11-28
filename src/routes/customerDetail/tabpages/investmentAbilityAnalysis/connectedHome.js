/*
 * @Author: zhangjun
 * @Date: 2018-11-27 16:21:53
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-28 13:20:23
 * @Description: 客户360-投资能力分析相关effect,mapStateToProps,mapDispatchToProps
 */
import { connect } from 'dva';
import { dva } from '../../../../helper';
import Home from './Home';

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const effects = {
  // 获取客户盈利能力
  getProfitAbility: 'detailInvestmentAbilityAnalysis/getProfitAbility',
  // 获取投资账户特征
  getInvestmentFeatureLabels: 'detailInvestmentAbilityAnalysis/getInvestmentFeatureLabels',
  // 获取账户资产变动
  getAssetChangeState: 'detailInvestmentAbilityAnalysis/getAssetChangeState',
  // 获取账户资产变动图表
  getAssetChangeReport: 'detailInvestmentAbilityAnalysis/getAssetChangeReport',
  // 获取账户收益走势图表数据
  getProfitTrendReport: 'detailInvestmentAbilityAnalysis/getProfitTrendReport',
  // 获取brinson归因结果
  getAttributionAnalysis: 'detailInvestmentAbilityAnalysis/getAttributionAnalysis',
};

const mapStateToProps = state => ({
  // 客户盈利能力
  profitAbility: state.detailInvestmentAbilityAnalysis.profitAbility,
  // 投资账户特征
  investmentFeatureLabels: state.detailInvestmentAbilityAnalysis.investmentFeatureLabels,
  // 账户资产变动
  assetChangeList: state.detailInvestmentAbilityAnalysis.assetChangeList,
  // 账户资产变动图表数据
  assetChangeReportData: state.detailInvestmentAbilityAnalysis.assetChangeReportData,
  //账户收益走势图表数据
  profitTrendData: state.detailInvestmentAbilityAnalysis.profitTrendData,
  // brinson归因数据
  attributionData: state.detailInvestmentAbilityAnalysis.attributionData,
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
