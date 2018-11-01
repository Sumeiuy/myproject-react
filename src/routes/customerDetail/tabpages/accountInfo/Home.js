/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-10-31 22:44:35
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
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
});

const mapDispatchToProps = {
  push: routerRedux.push,
  // 查询资产分布的雷达图数据
  getAssetRadarData: effect('detailAccountInfo/getAssetRadarData'),
  // 查询资产分布的雷达上具体指标的数据
  querySpecificIndexData: effect('detailAccountInfo/querySpecificIndexData'),
  // 查询资产分布的负债详情的数据
  queryDebtDetail: effect('detailAccountInfo/queryDebtDetail'),
  //查询实时持仓中的实时资产
  getRealTimeAsset: effect('detailAccountInfo/getRealTimeAsset'),
  //查询实时持仓中的证券实时持仓
  getSecuritiesHolding: effect('detailAccountInfo/getSecuritiesHolding'),
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
  queryHasDoingFlow:  effect('detailAccountInfo/queryHasDoingFlow'),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends PureComponent {
  static propTypes = {
    push: PropTypes.func.isRequired,
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
  }

  static defaultProps = {
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
      push,
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
      hasDoingFlow,
    } = this.props;

    const {
      compareCode,
      time,
    } = this.state;

    return (
      <div className={styles.detailAccountInfo}>
        {/* 头部实时持仓、历史持仓、交易流水、资产配置、账户分析 5 个按钮的所占区域*/}
        <div className={styles.headerBtnsArea}>
          <AccountInfoHeader
            push={push}
            getSecuritiesHolding={getSecuritiesHolding}
            securitiesData={securitiesHolding}
            getRealTimeAsset={getRealTimeAsset}
            realTimeAsset={realTimeAsset}
            productData={productHoldingData}
            getProductHoldingData={getProductHoldingData}
            location={location}
            hasDoingFlow={hasDoingFlow}
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
            accountInfo={accountInfo}
          />
        </div>
      </div>
    );
  }
}
