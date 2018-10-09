/**
 * @Author: zhufeiyang
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-09 17:31:07
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { Tabs } from 'antd';
import { connect } from 'dva';

import { dva } from '../../../../helper';
import withRouter from '../../../../decorators/withRouter';

import styles from './home.less';

// const TabPane = Tabs.TabPane;

// 使用helper里面封装的生成effects的方法
const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 资产分布的雷达数据
  assetsRadarData: state.detailAccountInfo.assetsRadarData,
  // 资产分布的雷达上具体指标的数据
  specificIndexData: state.detailAccountInfo.specificIndexData,
  // 负债详情的数据
  debtDetail: state.detailAccountInfo.debtDetail,
});

const mapDispatchToProps = {
  // 查询资产分布的雷达图数据
  getAssetRadarData: effect('detailAccountInfo/getAssetRadarData'),
  // 查询资产分布的雷达上具体指标的数据
  querySpecificIndexData: effect('detailAccountInfo/querySpecificIndexData'),
  // 查询资产分布的负债详情的数据
  queryDebtDetail: effect('detailAccountInfo/queryDebtDetail'),
  // 清除Redux中的数据
  clearReduxData: effect('detailAccountInfo/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
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
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 是否选择含信用checkbox,默认为含信用
      credit: 'Y',
      // 当前雷达图上高亮的指标key
      radarHightlightIndex: 'stock',
      // 是否打开负债详情的Modal
      debtDetailModalVisible: false,
    };
  }

  componentDidMount() {
    // TODO 第一次进入需要查询下资产分布的雷达图数据
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

  render() {
    return (
      <div className={styles.detailAccountInfo}>
        {/* 头部实时持仓、历史持仓、交易流水、资产配置、账户分析 5 个按钮的所占区域*/}
        <div className={styles.headerBtnsArea}></div>
        {/* 中间资产分布和收益走势区域 */}
        <div className={styles.assetAndIncomeArea}></div>
        {/* 底部详细Tabs，目前迭代不进行开发，先占个位置 */}
      </div>
    );
  }
}
