/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-06 19:55:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';

import { timeList, codeList } from '../../../../config/profitRateConfig';
import { dva } from '../../../../helper';
import AccountInfoHeader from '../../../../components/customerDetailAccountInfo/AccountInfoHeader';
import AssetAndIncome from '../../../../components/customerDetailAccountInfo/AssetAndIncome';
import AccountInfoTabs from '../../../../components/customerDetailAccountInfo/AccountInfoTabs';
import logable from '../../../../decorators/logable';

import styles from './home.less';

// 转化时间范围
function transformTime(key, format = 'YYYYMMDD') {
  const today = moment().format(format);
  switch (key) {
    case 'month':
      return {
        startDate: moment().subtract(1, 'months').format(format),
        endDate: today,
      };
    case 'season':
      return {
        startDate: moment().subtract(3, 'months').format(format),
        endDate: today,
      };
    case 'halfYear':
      return {
        startDate: moment().subtract(6, 'months').format(format),
        endDate: today,
      };
    case 'currentYear':
      return {
        startDate: moment().startOf('year').format(format),
        endDate: today,
      };
    default:
      return {
        startDate: moment().subtract(1, 'months').format(format),
        endDate: today,
      };
  }
}

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
  // 业务类别
  busnTypeDict: state.detailAccountInfo.busnTypeDict,
  // 产品代码
  finProductList: state.detailAccountInfo.finProductList,
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
  //查询实时持仓中的实时资产
  getRealTimeAsset: effect('detailAccountInfo/getRealTimeAsset'),
  //查询实时持仓中的证券实时持仓
  getSecuritiesHolding: effect('detailAccountInfo/getSecuritiesHolding', { forceFull: true } ),
  //查询实时持仓中的产品实时持仓
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
  // 获取业务类别
  queryBusnTypeDict: effect('detailAccountInfo/queryBusnTypeDict', { forceFull: true }),
  // 获取产品代码
  queryFinProductList: effect('detailAccountInfo/queryFinProductList', { loading: false }),
  // 获取全产品目录
  queryProductCatalogTree: effect('detailAccountInfo/queryProductCatalogTree', { forceFull: true }),
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

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends PureComponent {
  static propTypes = {
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
    // 获取业务类别
    queryBusnTypeDict: PropTypes.func.isRequired,
    // 获取产品代码
    queryFinProductList: PropTypes.func.isRequired,
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
    // 业务类别
    busnTypeDict: PropTypes.object.isRequired,
    // 产品代码
    finProductList: PropTypes.object.isRequired,
    // 全产品目录
    productCatalogTree: PropTypes.object.isRequired,
    // 普通账户交易流水
    standardTradeFlowRes: PropTypes.object.isRequired,
    // 信用账户交易流水
    creditTradeFlowRes: PropTypes.object.isRequired,
    // 期权账户交易流水
    optionTradeFlowRes: PropTypes.object.isRequired,
    // 资金变动交易流水
    capitalChangeFlowRes: PropTypes.object.isRequired,
    //账户变动
    accountChangeRes: PropTypes.object.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    const { query: nextQuery } = location;
    const { location: { query: prevQuery } } = prevState;
    const isQueryChange = !_.isEqual(nextQuery, prevQuery);
    if(isQueryChange) {
      if(nextQuery && nextQuery.custId) {
        if(prevQuery && prevQuery.custId) {
          if(nextQuery.custId !== prevQuery.custId) {
            // 回置收益走势的选项
            return {
              time: timeList[0].key,
              compareCode: codeList[0].key,
              location,
            };
          }
          return {
            location,
          };
        }
        // 回置收益走势的选项
        return {
          time: timeList[0].key,
          compareCode: codeList[0].key,
          location,
        };
      }
      return {
        location,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      // 是否打开负债详情的Modal
      debtDetailModalVisible: false,
      // 选中的时间范围
      time: timeList[0].key,
      // 选中的对比指标
      compareCode: codeList[0].key,
    };
  }

  componentDidMount() {
    const {
      queryHasDoingFlow,
      location: { query: { custId } },
    } = this.props;
    // 获取收益走势数据
    this.getProfitRateInfo({ initial: true });

    // 查询是否有已实施的流程
    queryHasDoingFlow({ custId });
  }

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const { location: { query } } = this.props;

    if(query && query.custId) {
      if(prevQuery && prevQuery.custId) {
        if(query.custId !== prevQuery.custId) {
          this.getProfitRateInfo({ initial: true });
        }
      } else {
        this.getProfitRateInfo({
          initial: true
        });
      }
    }
  }

  // 此处将历史持仓明细的3个api接口写到一个函数中，一遍后面传递的时候只需要传递一个函数，
  // 避免传递过多的props
  @autobind
  queryHistoryHolding(query) {
    const { type, ...resetQ } = query;
    const {
      queryStockHistoryHolding,
      queryProductHistoryHolding,
      queryOptionHistoryHolding,
    } = this.props;
    if (type === 'stock') {
      // 调用查询证券历史持仓明细 api
      queryStockHistoryHolding(resetQ);
    } else if (type === 'product') {
      // 调用查询产品历史持仓明细 api
      queryProductHistoryHolding(resetQ);
    } else {
      // 调用查询期权历史持仓明细 api
      queryOptionHistoryHolding(resetQ);
    }
  }

  // 交易流水
  @autobind
  querytradeFlow(query) {
    const { type, ...otherQuery } = query;
    const {
      queryBusnTypeDict,
      queryFinProductList,
      queryProductCatalogTree,
      queryStandardTradeFlow,
      queryCreditTradeFlow,
      queryOptionTradeFlow,
      queryCapitalTradeFlow,
    } = this.props;
    const tradeFlowMap = {
      busnType: queryBusnTypeDict,
      finProduct: queryFinProductList,
      productTree: queryProductCatalogTree,
      standard: queryStandardTradeFlow,
      credit: queryCreditTradeFlow,
      option: queryOptionTradeFlow,
      capital: queryCapitalTradeFlow,
    };
    _.isFunction(tradeFlowMap[type]) && tradeFlowMap[type](otherQuery);
  }

  @autobind
  getProfitRateInfo(options) {
    const { location: { query }, queryProfitRateInfo } = this.props;
    if(options.initial) {
      queryProfitRateInfo({
        custId: query && query.custId,
        indexCode: '000300',
        startDate: transformTime('month').startDate,
        endDate: transformTime('month').endDate,
        withCustPofit: true,
      });
    } else { // 用户点击触发请求
      queryProfitRateInfo({
        custId: query && query.custId,
        indexCode: options.indexCode,
        startDate: transformTime(options.time).startDate,
        endDate: transformTime(options.time).endDate,
        withCustPofit: options.withCustPofit,
      });
    }
  }

  @autobind
  @logable({ type: 'DropdownSelect', payload: { name: '对比指标', value: '$args[0]' } })
  handleCodeSelectChange({ value }) {
    const { time } = this.state;
    this.getProfitRateInfo({
      indexCode: value,
      time,
      withCustPofit: false,
    });
    this.setState({
      compareCode: value,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '时间周期', value: '$args[0]' } })
  handleTimeSelectChange(key) {
    const { compareCode } = this.state;
    this.getProfitRateInfo({
      indexCode: compareCode,
      time: key,
      withCustPofit: true,
    });
    this.setState({
      time: key,
    });
  }

  render() {
    const {
      getSecuritiesHolding,
      securitiesHolding,
      realTimeAsset,
      getRealTimeAsset,
      productHoldingData,
      getProductHoldingData,
      assetsRadarData,
      debtDetail,
      queryDebtDetail,
      location,
      specificIndexData,
      querySpecificIndexData,
      custBasicData,
      custCompareData,
      getAssetRadarData,
      accountSummary,
      queryAccountSummary,
      queryAccountInfo,
      queryBusnTypeDict,
      accountInfo,
      hasDoingFlow,
      stockHistoryHolding,
      productHistoryHolding,
      optionHistoryHolding,
      busnTypeDict,
      finProductList,
      productCatalogTree,
      standardTradeFlowRes,
      creditTradeFlowRes,
      optionTradeFlowRes,
      capitalChangeFlowRes,
      queryAccountChange,
      accountChangeRes
    } = this.props;

    const { compareCode, time } = this.state;

    return (
      <div className={styles.detailAccountInfo}>
        {/* 头部实时持仓、历史持仓、交易流水、资产配置、账户分析 5 个按钮的所占区域*/}
        <div className={styles.headerBtnsArea}>
          <AccountInfoHeader
            getSecuritiesHolding={getSecuritiesHolding}
            securitiesData={securitiesHolding}
            getRealTimeAsset={getRealTimeAsset}
            realTimeAsset={realTimeAsset}
            productData={productHoldingData}
            getProductHoldingData={getProductHoldingData}
            location={location}
            hasDoingFlow={hasDoingFlow}
            queryHistoryHolding={this.queryHistoryHolding}
            stockHistoryHolding={stockHistoryHolding}
            productHistoryHolding={productHistoryHolding}
            optionHistoryHolding={optionHistoryHolding}
            querytradeFlow={this.querytradeFlow}
            busnTypeDict={busnTypeDict}
            finProductList={finProductList}
            productCatalogTree={productCatalogTree}
            standardTradeFlowRes={standardTradeFlowRes}
            creditTradeFlowRes={creditTradeFlowRes}
            optionTradeFlowRes={optionTradeFlowRes}
            capitalChangeFlowRes={capitalChangeFlowRes}
          />
        </div>
        {/* 中间资产分布和收益走势区域 */}
        <div className={styles.assetAndIncomeArea}>
          <AssetAndIncome
            location={location}
            assetsRadarData={assetsRadarData}
            specificIndexData={specificIndexData}
            querySpecificIndexData={querySpecificIndexData}
            getAssetRadarData={getAssetRadarData}
            queryDebtDetail={queryDebtDetail}
            debtDetail={debtDetail}
            compareCode={compareCode}
            time={time}
            custCompareData={custCompareData}
            custBasicData={custBasicData}
            handleCodeSelectChange={this.handleCodeSelectChange}
            handleTimeSelectChange={this.handleTimeSelectChange}
          />
        </div>
        {/* 底部详细Tabs，目前迭代不进行开发，先占个位置 */}
        <div className={styles.footTabsArea}>
          <AccountInfoTabs
            location={location}
            queryAccountSummary={queryAccountSummary}
            accountSummary={accountSummary}
            queryAccountInfo={queryAccountInfo}
            queryBusnTypeDict={queryBusnTypeDict}
            queryAccountChange={queryAccountChange}
            busnTypeDict={busnTypeDict}
            accountInfo={accountInfo}
            accountChangeRes={accountChangeRes}
          />
        </div>
      </div>
    );
  }
}
