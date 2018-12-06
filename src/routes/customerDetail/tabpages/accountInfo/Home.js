/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-10 13:10:33
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { time as timeHelper } from '../../../../helper';
import { timeList, codeList } from '../../../../config/profitRateConfig';
import AccountInfoHeader from '../../../../components/customerDetailAccountInfo/AccountInfoHeader';
import AssetAndIncome from '../../../../components/customerDetailAccountInfo/AssetAndIncome';
import AccountInfoTabs from '../../../../components/customerDetailAccountInfo/AccountInfoTabs';
import logable from '../../../../decorators/logable';
import accountShape from './accountShape';

import styles from './home.less';

export default class Home extends PureComponent {
  static propTypes = accountShape

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    const { query: nextQuery } = location;
    const { location: { query: prevQuery } } = prevState;
    // url是否发生变化
    const isQueryChange = !_.isEqual(nextQuery, prevQuery);
    if (isQueryChange) {
      const { custId } = nextQuery;
      const { custId: prevCustId } = prevQuery;

      if (custId && custId !== prevCustId) {
        return {
          time: timeList[0].key,
          compareCode: codeList[0].key,
          location,
        };
      }
      return { location };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      // 选中的时间范围
      time: timeList[0].key,
      // 选中的对比指标
      compareCode: codeList[0].key,
    };

    // 由于账户信息下头部按钮的数量以及涉及到不同的模块，
    // 就导致传递到 AccountInfoHeader 组件的props及其之多，该组件本来就只是一个容器型组件
    // 所以此处将所有的接口按照不同的按钮进行区分
    // 目前暂时分类出有关交易流水弹出层的api接口
    this.tradeFlowApi = {
      // 查询交易流水普通账户历史交易
      queryStandardTradeFlow: props.queryStandardTradeFlow,
      // 查询交易流水信用账户历史交易
      queryCreditTradeFlow: props.queryCreditTradeFlow,
      // 查询交易流水期权账户历史交易
      queryOptionTradeFlow: props.queryOptionTradeFlow,
      // 查询交易流水资金变动
      queryCapitalTradeFlow: props.queryCapitalTradeFlow,
      // 查询交易流水普通账户、信用账户的业务类别
      queryBusnType: props.queryTradeFlowBusnTypeDict,
      // 查询交易流水的资金变动的业务类别
      queryBusnTypeForCapital: props.queryTradeFlowCapitalBusnTypeDict,
      // 查询交易流水中的普通账户、信用账户、期权账户的产品代码(注：以前的名字不好理解)
      queryProductCodeList: props.queryProductCodeList,
      // 查询交易流水中的普通账户下的全品类目录
      queryProductCatalogTree: props.queryProductCatalogTree,
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
    const { location: { query: { custId: prevCustId } } } = prevProps;
    const { location: { query: { custId } } } = this.props;

    if (custId && custId !== prevCustId) {
      this.getProfitRateInfo({ initial: true });
    }
  }

  @autobind
  getProfitRateInfo(options) {
    const { location: { query }, queryProfitRateInfo } = this.props;
    // 初始化时传递下面的参数发送请求
    if (options.initial) {
      queryProfitRateInfo({
        custId: query && query.custId,
        indexCode: '000300',
        startDate: timeHelper.transformTime('month').startDate,
        endDate: timeHelper.transformTime('month').endDate,
        withCustPofit: true,
      });
    } else { // 用户点击触发请求传递参数
      queryProfitRateInfo({
        custId: query && query.custId,
        indexCode: options.indexCode,
        startDate: timeHelper.transformTime(options.time).startDate,
        endDate: timeHelper.transformTime(options.time).endDate,
        withCustPofit: options.withCustPofit,
      });
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
      queryFinProductList,
      queryProductCatalogTree,
      queryStandardTradeFlow,
      queryCreditTradeFlow,
      queryOptionTradeFlow,
      queryCapitalTradeFlow,
    } = this.props;
    // TODO: swb 此处需要进行删除修改
    const tradeFlowMap = {
      finProduct: queryFinProductList,
      productTree: queryProductCatalogTree,
      standard: queryStandardTradeFlow,
      credit: queryCreditTradeFlow,
      option: queryOptionTradeFlow,
      capital: queryCapitalTradeFlow,
    };
    tradeFlowMap[type](otherQuery);
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '对比指标',
      value: '$args[0]'
    },
  })
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
  @logable({
    type: 'Click',
    payload: {
      name: '时间周期',
      value: '$args[0]'
    },
  })
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
      accountInfo,
      tradeFlowBusnTypeDict,
      tradeFlowCapitalBusnTypeDict,
      queryAccountBusnTypeDict,
      accountBusnTypeDict,
      hasDoingFlow,
      stockHistoryHolding,
      productHistoryHolding,
      optionHistoryHolding,
      productCatalogTree,
      standardTradeFlowRes,
      creditTradeFlowRes,
      optionTradeFlowRes,
      capitalChangeFlowRes,
      queryAccountChange,
      accountChangeRes,
    } = this.props;

    const { compareCode, time } = this.state;

    return (
      <div className={styles.detailAccountInfo}>
        {/* 头部实时持仓、历史持仓、交易流水、资产配置、账户分析 5 个按钮的所占区域 */}
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
            tradeFlowApi={this.tradeFlowApi}
            tradeFlowBusnTypeDict={tradeFlowBusnTypeDict}
            tradeFlowCapitalBusnTypeDict={tradeFlowCapitalBusnTypeDict}
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
        <div className={styles.footTabsArea}>
          <AccountInfoTabs
            location={location}
            queryAccountSummary={queryAccountSummary}
            accountSummary={accountSummary}
            queryAccountInfo={queryAccountInfo}
            queryBusnTypeDict={queryAccountBusnTypeDict}
            queryAccountChange={queryAccountChange}
            busnTypeDict={accountBusnTypeDict}
            accountInfo={accountInfo}
            accountChangeRes={accountChangeRes}
          />
        </div>
      </div>
    );
  }
}
