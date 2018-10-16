/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:22:18
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { connect } from 'dva';
import moment from 'moment';
import { timeList, codeList } from '../../../../config/profitRateConfig';
import { dva } from '../../../../helper';
import withRouter from '../../../../decorators/withRouter';
import AssetAndIncome from '../../../../components/customerDetailAccountInfo/AssetAndIncome';

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
  // 收益走势基本指标数据
  custBasicData: state.detailAccountInfo.custBasicData,
  // 收益走势对比指标数据
  custCompareData: state.detailAccountInfo.custCompareData,
});

const mapDispatchToProps = {
  // 查询资产分布的雷达图数据
  getAssetRadarData: effect('detailAccountInfo/getAssetRadarData'),
  // 查询资产分布的雷达上具体指标的数据
  querySpecificIndexData: effect('detailAccountInfo/querySpecificIndexData'),
  // 查询资产分布的负债详情的数据
  queryDebtDetail: effect('detailAccountInfo/queryDebtDetail'),
  // 查询收益走势数据
  queryProfitRateInfo: effect('detailAccountInfo/getProfitRateInfo'),
  // 清除Redux中的数据
  clearReduxData: effect('detailAccountInfo/clearReduxData', { loading: false }),
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
    custBasicData: PropTypes.object.isRequired,
    custCompareData: PropTypes.object.isRequired,
    // 查询收益走势数据
    queryProfitRateInfo: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { location } = nextProps;
    const { query: nextQuery } = location;
    const { location: { query: prevQuery } } = prevState;
    debugger;
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
      // 是否选择含信用checkbox,默认为含信用
      credit: 'Y',
      // 当前雷达图上高亮的指标key
      radarHightlightIndex: 'stock',
      // 是否打开负债详情的Modal
      debtDetailModalVisible: false,
      // 选中的时间范围
      time: timeList[0].key,
      // 选中的对比指标
      compareCode: codeList[0].key,
    };
  }

  componentDidMount() {
    // 第一次进入需要查询下资产分布的雷达图数据
    // 默认查询含信用的
    this.queryAssetDistributeData({
      creditFlag: 'Y',
    });
    // 获取收益走势数据
    this.getProfitRateInfo({ initial: true });
  }

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const { location: { query } } = this.props;

    if(query && query.custId) {
      if(prevQuery && prevQuery.custId) {
        if(query.custId !== prevQuery.custId) {
          this.getProfitRateInfo({
            initial: true
          });
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

  // 关闭负债详情的弹出层
  @autobind
  handleDebtDetailModalClose() {
    this.setState({ debtDetailModalVisible: false });
  }

  // 点击负债详情小图标，打开负债详情弹出层
  @autobind
  handleDebtDetailClick() {
    this.setState({ debtDetailModalVisible: true });
  }

  // 查询资产分布雷达图数据
  @autobind
  queryAssetDistributeData(query) {
    const { location: { query: { custId } } } = this.props;
    this.props.getAssetRadarData({ ...query, custId });
  }

  render() {
    const {
      assetsRadarData,
      debtDetail,
      queryDebtDetail,
      location,
      specificIndexData,
      querySpecificIndexData,
      custBasicData,
      custCompareData,
    } = this.props;

    const {
      compareCode,
      time,
    } = this.state;

    return (
      <div className={styles.detailAccountInfo}>
        {/* 头部实时持仓、历史持仓、交易流水、资产配置、账户分析 5 个按钮的所占区域*/}
        <div className={styles.headerBtnsArea}></div>
        {/* 中间资产分布和收益走势区域 */}
        <div className={styles.assetAndIncomeArea}>
          <AssetAndIncome
            location={location}
            assetsRadarData={assetsRadarData}
            specificIndexData={specificIndexData}
            querySpecificIndexData={querySpecificIndexData}
            onClickCredit={this.queryAssetDistributeData}
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
        <div className={styles.footTabsArea}></div>
      </div>
    );
  }
}
