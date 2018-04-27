/*
 * @Author: XuWenKang
 * @Description: 精选组合home
 * @Date: 2018-04-17 09:22:26
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-25 21:24:05
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
// import _ from 'lodash';
import styles from './index.less';
import dva from '../../helper/dva';
import CombinationAdjustHistory from '../../components/choicenessCombination/CombinationAdjustHistory';
import WeeklySecurityTopTen from '../../components/choicenessCombination/WeeklySecurityTopTen';
import CombinationRank from '../../components/choicenessCombination/combinationRank/CombinationRank';
import CombinationModal from '../../components/choicenessCombination/CombinationModal';

const dispatch = dva.generateEffect;
// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const effects = {
  // 获取调仓历史
  getAdjustWarehouseHistory: 'choicenessCombination/getAdjustWarehouseHistory',
  // 获取组合证券构成数据/获取近一周表现前十的证券
  getCombinationSecurityList: 'choicenessCombination/getCombinationSecurityList',
  // 组合树
  getCombinationTree: 'choicenessCombination/getCombinationTree',
};

const mapStateToProps = state => ({
  // 调仓历史数据
  adjustWarehouseHistoryData: state.choicenessCombination.adjustWarehouseHistoryData,
  // 弹窗调仓历史数据
  tableHistoryList: state.choicenessCombination.tableHistoryList,
  // 组合调仓数据
  combinationAdjustHistoryData: state.choicenessCombination.combinationAdjustHistoryData,
  // 近一周表现前十的证券
  weeklySecurityTopTenData: state.choicenessCombination.weeklySecurityTopTenData,
  // 组合树
  combinationTreeList: state.choicenessCombination.combinationTreeList,
});
const mapDispatchToProps = {
  getAdjustWarehouseHistory: dispatch(effects.getAdjustWarehouseHistory, { loading: false }),
  getCombinationSecurityList: dispatch(effects.getCombinationSecurityList, { loading: false }),
  getCombinationTree: dispatch(effects.getCombinationTree, { loading: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ChoicenessCombination extends PureComponent {
  static propTypes = {
    getCombinationTree: PropTypes.func.isRequired,
    combinationTreeList: PropTypes.array.isRequired,
    getAdjustWarehouseHistory: PropTypes.func.isRequired,
    adjustWarehouseHistoryData: PropTypes.object.isRequired,
    tableHistoryList: PropTypes.object.isRequired,
    getCombinationSecurityList: PropTypes.func.isRequired,
    weeklySecurityTopTenData: PropTypes.array.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      directionCode: '1',
    };
  }

  componentDidMount() {
    const { getAdjustWarehouseHistory, getCombinationSecurityList } = this.props;
    // 调仓方向传 3 视为取最新两条数据
    const payload = {
      directionCode: '3',
    };
    getAdjustWarehouseHistory(payload);
    getCombinationSecurityList();
  }


  // 打开弹窗
  @autobind
  showModal(directionCode) {
    this.setState({
      visible: true,
      directionCode,
    });
  }

  @autobind
  closeModal() {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      getCombinationTree,
      combinationTreeList,
      getAdjustWarehouseHistory,
      adjustWarehouseHistoryData,
      tableHistoryList,
      weeklySecurityTopTenData,
    } = this.props;
    const {
      visible,
      directionCode,
    } = this.state;
    return (
      <div className={styles.choicenessCombinationBox}>
        <div className={`${styles.topContainer} clearfix`}>
          {/* 组合调仓组件 */}
          <CombinationAdjustHistory
            showModal={this.showModal}
            data={adjustWarehouseHistoryData}
          />
          <WeeklySecurityTopTen data={weeklySecurityTopTenData} />
        </div>
        <CombinationRank />
        {
          visible
          ?
            <CombinationModal
              direction={directionCode}
              getTreeData={getCombinationTree}
              treeData={combinationTreeList}
              getListData={getAdjustWarehouseHistory}
              listData={tableHistoryList}
              closeModal={this.closeModal}
            />
          :
            null
        }
      </div>
    );
  }
}
