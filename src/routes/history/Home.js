/**
 * @description 历史对比页面
 * @author sunweibin
 * @fileOverview history/Home.js
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { message } from 'antd';
import _ from 'lodash';

import { getEmpId } from '../../utils/helper';
import IndicatorOverviewHeader from '../../components/history/IndicatorOverviewHeader';
import IndicatorOverview from '../../components/history/IndicatorOverview';
import HisDivider from '../../components/history/HisDivider';
import ScatterAnalysis from '../../components/history/ScatterAnalysis';
import HistoryComparePolyChart from '../../components/history/HistoryComparePolyChart';
import HistoryCompareRankChart from '../../components/history/HistoryCompareRankChart';
import styles from './Home.less';

const effects = {
  allInfo: 'history/getAllInfo',
  getRadarData: 'history/getRadarData',
  getHistoryCore: 'history/getHistoryCore',
  queryContrastAnalyze: 'history/queryContrastAnalyze',
  queryHistoryContrast: 'history/queryHistoryContrast',
  getIndicatorLib: 'history/getIndicatorLib',
  queryCurrentRankingRecord: 'history/queryCurrentRankingRecord',
  getRankData: 'history/getRankData',
  getContrastData: 'history/getContrastData',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});


const mapStateToProps = state => ({
  globalLoading: state.activity.global,
  historyCore: state.history.historyCore, // 核心指标
  crrData: state.history.currentRankingRecord, // 雷达图数据
  custRange: state.history.custRange, // 页面右上角组织机构树
  visibleBoards: state.history.visibleBoards, // 页面左上角可见看板数据
  contributionAnalysis: state.history.contributionAnalysis, // 贡献分析
  reviewAnalysis: state.history.reviewAnalysis, // 入岗投顾
  historyContrastDic: state.history.historyContrastDic, // 字典数据
  createLoading: state.history.createLoading,
  deleteLoading: state.history.deleteLoading,
  updateLoading: state.history.updateLoading,
  operateData: state.history.operateData,
  message: state.history.message,
  queryCurrentRankingRecord: state.history.queryCurrentRankingRecord,
  contrastData: state.history.contrastData, // 历史对比折线图数据
  indicatorLib: state.history.indicatorLib, // 指标树
  rankData: state.history.rankData, // 历史对比排名柱状图数据
});

const mapDispatchToProps = {
  getAllInfo: fectchDataFunction(true, effects.allInfo),
  queryContrastAnalyze: fectchDataFunction(true, effects.queryContrastAnalyze),
  queryHistoryContrast: fectchDataFunction(true, effects.queryHistoryContrast),
  getContrastData: fectchDataFunction(true, effects.getContrastData),
  createHistoryBoard: fectchDataFunction(true, 'history/createHistoryBoard'),
  deleteHistoryBoard: fectchDataFunction(true, 'history/deleteHistoryBoard'),
  updateHistoryBoard: fectchDataFunction(true, 'history/updateHistoryBoard'),
  getIndicatorLib: fectchDataFunction(false, effects.getIndicatorLib),
  queryCurrentRankingRecord: fectchDataFunction(false, effects.queryCurrentRankingRecord),
  getRankData: fectchDataFunction(true, effects.getRankData),
  getRadarData: fectchDataFunction(false, effects.getRadarData),
  getHistoryCore: fectchDataFunction(true, effects.getHistoryCore),
  push: routerRedux.push,
  replace: routerRedux.replace,
};

const EMPTY_LIST = [];

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class HistoryHome extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    contrastData: PropTypes.object.isRequired,
    getAllInfo: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    visibleBoards: PropTypes.array.isRequired,
    globalLoading: PropTypes.bool,
    queryContrastAnalyze: PropTypes.func.isRequired,
    contributionAnalysis: PropTypes.object.isRequired,
    reviewAnalysis: PropTypes.object.isRequired,
    createHistoryBoard: PropTypes.func.isRequired, // 创建(另存为)
    deleteHistoryBoard: PropTypes.func.isRequired, // 删除
    updateHistoryBoard: PropTypes.func.isRequired, // 更新(保存)
    operateData: PropTypes.object,
    message: PropTypes.string,
    createLoading: PropTypes.bool,
    deleteLoading: PropTypes.bool,
    updateLoading: PropTypes.bool,
    historyCore: PropTypes.array.isRequired, // 概览
    crrData: PropTypes.object.isRequired, // 强弱指示分析
    indicatorLib: PropTypes.object.isRequired,
    getIndicatorLib: PropTypes.func.isRequired,
    historyContrastDic: PropTypes.object.isRequired,
    queryHistoryContrast: PropTypes.func.isRequired,
    queryCurrentRankingRecord: PropTypes.func.isRequired,
    getContrastData: PropTypes.func.isRequired,
    getRankData: PropTypes.func.isRequired,
    getRadarData: PropTypes.func.isRequired,
    getHistoryCore: PropTypes.func.isRequired,
    rankData: PropTypes.object.isRequired,
  }

  static defaultProps = {
    createLoading: false,
    deleteLoading: false,
    updateLoading: false,
    globalLoading: false,
    operateData: {},
    message: '',
  }

  constructor(props) {
    super(props);
    // 此处针对一些常用参数，存放在stata里面
    const { location: { query: { boardId, boardType } } } = props;
    const empId = getEmpId(); // 用户ID
    // TODO 此处需要等到时间选择器完成提供方法
    // const duration = {};
    this.state = {
      boardId,
      boardType,
      begin: '20170611', // 本期开始时间
      end: '20170620', // 本期结束时间
      cycleType: 'month', // 时间段周期类型
      contrastBegin: '20170601', // 上期开始时间
      contrastEnd: '20170610', // 上期结束时间
      selectKeys: [], // 弹出层挑选的指标
      indicatorId: '', // 当前选中的核心指标key
      orgId: '', // 用户的组织机构Id
      empId, // 用户ID
      swtichDefault: false, // 通知相关组件切换回默认状态
    };
  }

  componentWillMount() {
    // 本页面初始化的时候，只能获取boardId,已经empId
    const {
      location: { query },
      getAllInfo,
      queryHistoryContrast,
      queryContrastAnalyze,
      getContrastData,
      getIndicatorLib,
      queryCurrentRankingRecord,
      getRankData,
    } = this.props;

    getAllInfo({
      ...query,
    });

    queryCurrentRankingRecord({
      begin: '20170701',
      boardId: '3',
      cycleType: 'month',
      end: '20170719',
      scope: '2',
      orgId: 'ZZ001041093',
      contrastBegin: '20170601',
      contrastEnd: '20170619',
      localScope: '2',
      isMultiple: '0',
    });

    queryContrastAnalyze({
      boardId: '3',
      type: 'cust',
      orgId: 'ZZ001041',
      localScope: '1',
      scope: '2',
      begin: '20170601',
      end: '20170630',
      cycleType: 'month',
      // coreIndicatorId: '',
      // contrastIndicatorId: '',
    });

    queryContrastAnalyze({
      boardId: '3',
      type: 'invest',
      orgId: 'ZZ001041',
      localScope: '1',
      scope: '2',
      begin: '20170601',
      end: '20170630',
      cycleType: 'month',
      // coreIndicatorId: '',
      // contrastIndicatorId: '',
    });
    getIndicatorLib({
      orgId: 'ZZ001041',
      type: 'TYPE_TGYJ',
    });

    // 先写一个假参数
    queryHistoryContrast({
      boardId: '3',
    });
    // 参数需要动态变
    // 暂时先写死
    getContrastData({
      boardId: 3,
      scope: '1',
      coreIndicatorId: '',
      orgId: 'ZZ001041',
      begin: '20170705',
      end: '20170723',
      contrastBegin: '20160605',
      contrastEnd: '20160623',
      cycleType: 'month',
    });

    // 获取历史排名数据
    getRankData({
      indicatorId: 'tgInNum', // 指标ID
      begin: '20170701', // 本期开始日期
      cycleType: 'month', // 周期类型
      end: '20170719', // 本期结束日期
      scope: '3', // 查询层级
      orgId: 'ZZ001041093', // 机关ID
      contrastBegin: '20170601', // 上期开始日期
      contrastEnd: '20170619', // 上期结束日期
      localScope: '2', // 当前所在层级
      pageSize: 10, // 每页显示条数
      pageNum: 1, // 页码
      orderIndicatorId: 'currSignCustAset', // 排序指标ID
      orderType: 'desc', // 排序方式
      isMultiple: '1', // 此处写死“1”
    });
    // 初始化取数据
    this.getInitialInfo();
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    // 因为新的参数存放在state里面，所以props只有咋boarId变化时候，才会查询数据
    // 此处不需要担心预览页面
    const { location: { query: { boardId, boardType } } } = nextProps;
    const {
      location: { query: { boardId: preBoardId } },
    } = this.props;
    // 核心指标变化,通过选择之后变化
    const { historyCore: preCore } = this.props;
    const { historyCore } = nextProps;
    // 初始化进入页面后，记录第一个核心指标
    if (!_.isEqual(preCore, historyCore) && _.isEmpty(preCore)) {
      this.setState({
        indicatorId: historyCore[0].key,
      });
    }
    const { custRange: preCR } = this.props;
    const { custRange } = nextProps;
    if (!_.isEqual(preBoardId, boardId) || !_.isEqual(preCR, custRange)) {
      const currentOrg = custRange[0];
      // 必须要要有orgId,否则所有数据均为空
      // TODO 此处需要等到时间选择器完成提供方法
      // const { begin, end, cycleType } = getDurationString('month');
      this.setState({
        boardId,
        boardType,
        orgId: currentOrg.id,
        scope: (Number(currentOrg.level) + 1),
        localScope: currentOrg.level,
      },
      () => {
        this.getInitialInfo();
      });
    }

    const {
      createLoading: preCL,
      deleteLoading: preDL,
      updateLoading: prePL,
    } = this.props;
    const { push, createLoading, deleteLoading, updateLoading } = nextProps;
    if (preCL && !createLoading) {
      // 创建完成后，需要跳转到新建看板
      this.setState({
        selectKeys: [],
      },
      () => {
        // const { selectKeys } = this.state;
        // console.warn('selectKeys+++++', selectKeys);
        // push(`/history?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
      });
    }
    if (preDL && !deleteLoading) {
      // 删除成功
      message.success('删除成功');
      if (boardType === 'TYPE_LSDB_JYYJ') {
        push('/history?boardId=4');
      } else if (boardType === 'TYPE_LSDB_TGJX') {
        push('/history?boardId=3');
      }
    }
    if (!updateLoading && prePL) {
      message.success('保存成功');
      this.setState({
        selectKeys: [],
      },
      () => {
        // push(`/history?boardId=${id}&orgId=${ownerOrgId}&boardType=${boardType}`);
      });
    }
  }

  @autobind
  getUserSummuryKeys(summury) {
    if (!_.isEmpty(summury)) {
      return summury.map(o => o.key);
    }
    return [];
  }

  // 初始获取相关数据
  @autobind
  getInitialInfo() {
    const { orgId, empId, boardType, boardId } = this.state;
    if (!_.isEmpty(orgId)) {
      // 必须要有orgId才能有数据，否则页面所有元素均不能渲染
      // 查询相关数据
      this.queryAllData();
       // 获取指标树
      this.props.getIndicatorLib({
        orgId,
        type: boardType,
      });
    } else {
      // 初始化的时候必须先查询到组织机构树和可见看板
      this.props.getAllInfo({
        empId,
      });
      // 获取散点图的对比指标
      this.props.queryHistoryContrast({
        boardId,
      });
    }
  }

  @autobind
  queryAllData() {
    // 取数据前先将参数进行一下整理
    // 初始化
    const {
      getHistoryCore,
      getRadarData,
      getContrastData,
      getRankData,
      queryContrastAnalyze,
    } = this.props;
    const { localScope, indicatorId } = this.state;
    // 因为接口的原因，其请求的参数中scope的值其实是localScope
    const coreQuery = this.makeQueryParams({ scope: localScope });
    // 获取历史对比核心指标数据
    getHistoryCore(coreQuery);
    // 获取雷达图数据
    const radarQuery = this.makeQueryParams({ isMultiple: 0 });
    getRadarData(radarQuery);
    // 获取折线图数据
    const contrastQuery = this.makeQueryParams({ scope: localScope });
    getContrastData(contrastQuery);
    // 获取对比排名数据
    // orderIndicatorId与indicatorId一致，必须要传
    const rankQuery = this.makeQueryParams({
      pageSize: 10,
      pageNum: 1,
      isMultiple: 1,
      orderType: 'desc',
      orderIndicatorId: indicatorId,
    });
    getRankData(rankQuery);
    // 获取散点图数据
    const scatterCustQuery = this.makeQueryParams({
      type: 'cust',
    });
    const scatterInvestQuery = this.makeQueryParams({
      type: 'invest',
    });
    queryContrastAnalyze(scatterCustQuery);
    queryContrastAnalyze(scatterInvestQuery);
  }

  @autobind
  makeQueryParams(params) {
    const defaultParams = this.state;
    return {
      ...defaultParams,
      ...params,
    };
  }

  // 从弹出层取出挑选的指标数组
  @autobind
  saveIndcatorToHome(array) {
    // 根据 array 发出请求
    this.setState({
      selectKeys: array,
    });
  }

  // 另存为新的历史对比看板
  @autobind
  createBoardConfirm(board) {
    this.props.createHistoryBoard(board);
  }

  // 确认删除历史对比的看板
  @autobind
  deleteBoardConfirm(board) {
    this.props.deleteHistoryBoard(board);
  }

  // 更新(保存)历史记录看板
  @autobind
  updateBoardConfirm(border) {
    this.props.updateHistoryBoard(border);
  }

  // 切换时间段和组织机构
  @autobind
  updateQueryState(query) {
    this.setState({
      ...query,
    });
    // TODO 变换后，需要重新查询所有的数据
  }

  // 切换当前核心指标
  @autobind
  changeCore(indicatorId) {
    this.setState({
      indicatorId,
    });
    // TODO 变换后，需要重新查询，折线、柱状图、散点图
  }

  // 柱状图维度，排序，页码变化
  @autobind
  changeRankBar(rankQuery) {
    const query = this.makeQueryParams({
      ...rankQuery,
      orderIndicatorId: this.state.indicatorId,
    });
    this.props.getRankData(query);
  }

  // 散点图切换对比指标
  @autobind
  changeScatterContrast(query) {
    this.props.queryContrastAnalyze(query);
  }

  render() {
    const {
      reviewAnalysis,
      contributionAnalysis,
      historyCore,
      crrData,
      historyContrastDic,
      contrastData,
      indicatorLib,
      rankData,
    } = this.props;

    const { scope, localScope, boardType } = this.state;

    // 总量指标库
    const summuryCheckedKeys = this.getUserSummuryKeys(historyCore);
    const summuryLib = {
      type: 'summury',
      boardType: 'TYPE_TGJX',
      checkTreeArr: indicatorLib.summury,
      checkedKeys: summuryCheckedKeys,
    };

    const { cust = EMPTY_LIST, invest = EMPTY_LIST } = historyContrastDic;
    const { selectKeys } = this.state;
    return (
      <div className="pageHistory">
        <div className={styles.historyhd}>
          {/* 头部时间组织机构选择区域 */}
        </div>
        <div className={styles.historybd}>
          <div className={styles.indicatorOverview}>
            {/* 核心指标头部区域---假定数据 */}
            <IndicatorOverviewHeader
              location={location}
              createBoardConfirm={this.createBoardConfirm}
              deleteBoardConfirm={this.deleteBoardConfirm}
              updateBoardConfirm={this.updateBoardConfirm}
              ownerOrgId={'ZZ001041'}
              orgId={'ZZ001041'}
              selectKeys={selectKeys}
            />
            {/* 指标概览区域 */}
            <IndicatorOverview
              overviewData={historyCore}
              indexData={crrData}
              summuryLib={summuryLib}
              saveIndcatorToHome={this.saveIndcatorToHome}
            />
          </div>
          <div className={styles.indicatorAnalyse}>
            <div className={styles.caption}>核心指标分析-总交易量</div>
            <div className={styles.polyArea}>
              <HistoryComparePolyChart data={contrastData} />
              {/* 假定数据 */}
              {
                _.isEmpty(rankData)
                ? null
                : (
                  <HistoryCompareRankChart
                    level={localScope}
                    scope={scope}
                    data={rankData}
                    boardType={boardType}
                  />
                )
              }
            </div>
            <HisDivider />
            <div className={styles.scatterArea}>
              {/* 散点图区域 */}
              <ScatterAnalysis
                contributionAnalysisData={contributionAnalysis}
                reviewAnalysisData={reviewAnalysis}
                queryContrastAnalyze={this.changeScatterContrast}
                cust={cust}
                invest={invest}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
