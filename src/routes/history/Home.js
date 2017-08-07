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
import PageHeader from '../../components/pageCommon/PageHeader';
import styles from './Home.less';

const effects = {
  getInitial: 'history/getInitial',
  getRadarData: 'history/getRadarData',
  getHistoryCore: 'history/getHistoryCore',
  queryContrastAnalyze: 'history/queryContrastAnalyze',
  queryHistoryContrast: 'history/queryHistoryContrast',
  getIndicatorLib: 'history/getIndicatorLib',
  getRankData: 'history/getRankData',
  getContrastData: 'history/getContrastData',
  collectBoardSelect: 'report/collectBoardSelect',
  collectCustRange: 'report/collectCustRange',
  collectDurationSelect: 'report/collectDurationSelect',
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
  newVisibleBoards: state.history.newVisibleBoards, // 新可见看板数据
  contributionAnalysis: state.history.contributionAnalysis, // 贡献分析
  reviewAnalysis: state.history.reviewAnalysis, // 入岗投顾
  historyContrastDic: state.history.historyContrastDic, // 字典数据
  contrastData: state.history.contrastData, // 历史对比折线图数据
  indicatorLib: state.history.indicatorLib, // 指标树
  rankData: state.history.rankData, // 历史对比排名柱状图数据
  createLoading: state.history.createLoading,
  deleteLoading: state.history.deleteLoading,
  updateLoading: state.history.updateLoading,
  operateData: state.history.operateData,
  message: state.history.message,
});

const mapDispatchToProps = {
  getInitial: fectchDataFunction(true, effects.getInitial),
  queryContrastAnalyze: fectchDataFunction(true, effects.queryContrastAnalyze),
  queryHistoryContrast: fectchDataFunction(true, effects.queryHistoryContrast),
  getContrastData: fectchDataFunction(true, effects.getContrastData),
  createHistoryBoard: fectchDataFunction(true, 'history/createHistoryBoard'),
  deleteHistoryBoard: fectchDataFunction(true, 'history/deleteHistoryBoard'),
  updateHistoryBoard: fectchDataFunction(true, 'history/updateHistoryBoard'),
  getIndicatorLib: fectchDataFunction(false, effects.getIndicatorLib),
  getRankData: fectchDataFunction(false, effects.getRankData),
  getRadarData: fectchDataFunction(false, effects.getRadarData),
  getHistoryCore: fectchDataFunction(true, effects.getHistoryCore),
  collectBoardSelect: fectchDataFunction(false, effects.collectBoardSelect),
  collectCustRange: fectchDataFunction(false, effects.collectCustRange),
  collectDurationSelect: fectchDataFunction(false, effects.collectDurationSelect),
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
    getInitial: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    visibleBoards: PropTypes.array.isRequired,
    newVisibleBoards: PropTypes.array.isRequired,
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
    getContrastData: PropTypes.func.isRequired,
    getRankData: PropTypes.func.isRequired,
    getRadarData: PropTypes.func.isRequired,
    getHistoryCore: PropTypes.func.isRequired,
    rankData: PropTypes.object.isRequired,
    collectBoardSelect: PropTypes.func.isRequired,
    collectCustRange: PropTypes.func.isRequired,
    collectDurationSelect: PropTypes.func.isRequired,
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
    const { custRange, location: { query: { boardId, boardType } } } = props;
    const empId = getEmpId(); // 用户ID
    const ownerOrg = custRange[0];
    // TODO 此处需要等到时间选择器完成提供方法
    // const duration = {};
    this.state = {
      boardId,
      boardType,
      begin: '20170701', // 本期开始时间
      end: '20170719', // 本期结束时间
      cycleType: 'month', // 时间段周期类型
      contrastBegin: '20170601', // 上期开始时间
      contrastEnd: '20170619', // 上期结束时间
      coreIndicatorIds: [], // 弹出层挑选的指标
      indicatorId: '', // 当前选中的核心指标key
      orgId: ownerOrg && ownerOrg.id, // 用户当前选择的组织机构Id
      ownerOrgId: ownerOrg && ownerOrg.id, // 用户所属的组织机构Id
      empId, // 用户ID
      swtichDefault: '', // 通知相关组件切换回默认状态
    };
  }

  componentWillMount() {
    this.queryInitial();
  }

  componentWillReceiveProps(nextProps) {
    // 判断props是否变化
    // 因为新的参数存放在state里面，所以props只有咋boarId变化时候，才会查询数据
    // 此处不需要担心预览页面
    const { location: { query: { boardId, boardType } } } = nextProps;
    const {
      location: { query: { boardId: preBoardId } },
    } = this.props;
    const differentId = !_.isEqual(preBoardId, boardId);
    if (differentId) {
      const { custRange } = nextProps;
      const ownerOrg = custRange[0];
      // TODO 此处需要等到时间选择器完成提供方法
      // const { begin, end, cycleType } = getDurationString('month');
      this.setState({
        boardId,
        boardType,
        scope: ownerOrg && String(Number(ownerOrg.level) + 1),
        localScope: ownerOrg && ownerOrg.level,
        orgId: ownerOrg && ownerOrg.id, // 用户当前选择的组织机构Id
        ownerOrgId: ownerOrg && ownerOrg.id, // 用户所属的组织机构Id
      },
      () => {
        this.queryInitial();
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
        coreIndicatorIds: [],
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
        coreIndicatorIds: [],
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

  // 初始查询数据
  @autobind
  queryInitial() {
    const { getInitial } = this.props;
    const { empId, boardType, boardId } = this.state;
    const selfNeed = ['boardId'];
    const coreQuery = this.makeQueryParams({}, selfNeed);
    const radarQuery = this.makeQueryParams({ isMultiple: 0 }, selfNeed);
    const polyQuery = this.makeQueryParams({}, selfNeed);
    const barQuery = this.makeQueryParams({
      pageSize: 10,
      pageNum: 1,
      isMultiple: 1,
      orderType: 'desc',
    }, selfNeed);
    const custScatterQuery = this.makeQueryParams({ type: 'cust' }, selfNeed);
    const investScatterQuery = this.makeQueryParams({ type: 'invest' }, selfNeed);

    getInitial({
      custRang: { empId },
      core: coreQuery,
      radar: radarQuery,
      poly: polyQuery,
      bar: barQuery,
      custScatter: custScatterQuery,
      investScatter: investScatterQuery,
      dic: { boardId },
      lib: { type: boardType },
    });
  }

  // 切换history时候查询数据
  @autobind
  freshAllCore() {
    // 取数据前先将参数进行一下整理
    const {
      getHistoryCore,
      getRadarData,
    } = this.props;
    const { localScope, coreIndicatorIds } = this.state;
    let selfNeed = ['boardId'];
    if (!_.isEmpty(coreIndicatorIds)) {
      selfNeed = ['coreIndicatorIds'];
    }
    // 获取core数据
    const coreQuery = this.makeQueryParams({ scope: localScope }, selfNeed);
    getHistoryCore(coreQuery);
    // 获取雷达图数据
    // localScope=1时，不查询雷达图数据
    if (Number(localScope) > 1) {
      const radarQuery = this.makeQueryParams({
        scope: localScope,
        isMultiple: 0,
      }, selfNeed);
      getRadarData(radarQuery);
    }
  }

  @autobind
  queryOneCoreIndicator() {
    const {
      getContrastData,
      getRankData,
      queryContrastAnalyze,
      historyContrastDic,
    } = this.props;
    const { localScope, indicatorId, coreIndicatorIds } = this.state;
    let selfNeed = [];
    if (!_.isEmpty(coreIndicatorIds)) {
      selfNeed = ['coreIndicatorIds'];
    }
    // 1.查询poly
    const contrastQuery = this.makeQueryParams({
      scope: localScope,
      coreIndicatorId: indicatorId,
    }, selfNeed);
    getContrastData(contrastQuery);
    // 2.查询bar
    const rankQuery = this.makeQueryParams({
      pageSize: 10,
      pageNum: 1,
      isMultiple: 1,
      orderType: 'desc',
      indicatorId,
      orderIndicatorId: indicatorId,
    }, selfNeed);
    getRankData(rankQuery);
    // 3.查询scatter
    const { cust, invest } = historyContrastDic;
    // 切换Core，scatter是需要切换到默认值得
    const scatterCustQuery = this.makeQueryParams({
      type: 'cust',
      coreIndicatorId: indicatorId,
      contrastIndicatorId: cust[0].key,
    }, selfNeed);
    const scatterInvestQuery = this.makeQueryParams({
      type: 'invest',
      coreIndicatorId: indicatorId,
      contrastIndicatorId: invest[0].key,
    }, selfNeed);
    queryContrastAnalyze(scatterCustQuery);
    queryContrastAnalyze(scatterInvestQuery);
  }

  @autobind
  makeQueryParams(special, selfNeed) {
    let privateParams = selfNeed;
    if (!selfNeed) { privateParams = []; }
    // 时间段是共同的参数
    const duration = _.pick(this.state, ['begin', 'end', 'cycleType', 'contrastBegin', 'contrastEnd']);
    // 组织机构信息
    const { orgId, scope, localScope } = this.state;
    const { custRange } = this.props;
    const owner = custRange[0];
    const org = {
      orgId: orgId || (owner && owner.id),
      localScope: localScope || (owner && owner.level),
      scope: scope || (owner && String(Number(owner.level) + 1)),
    };
    const selfParam = _.pick(this.state, privateParams);
    return {
      ...duration,
      ...org,
      ...selfParam,
      ...special,
    };
  }

  // 从弹出层取出挑选的指标数组
  @autobind
  saveIndcatorToHome(coreIndicatorIds) {
    const indicatorId = coreIndicatorIds[0];
    this.setState({
      coreIndicatorIds,
      indicatorId,
    },
    () => {
      this.freshAllCore();
      this.queryOneCoreIndicator();
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
    let durationOrg = query;
    if (query.orgId) {
      const { scope, orgId, level } = query;
      durationOrg = {
        scope: String(scope),
        orgId,
        localScope: level,
      };
    }
    // 此时需要确认indicatorId
    let indicatorId = '';
    const { coreIndicatorIds } = this.state;
    const { historyCore } = this.props;
    if (_.isEmpty(coreIndicatorIds)) {
      indicatorId = historyCore[0].key;
    } else {
      indicatorId = coreIndicatorIds[0];
    }
    this.setState({
      ...durationOrg,
      indicatorId,
    },
    () => {
      this.freshAllCore();
      this.queryOneCoreIndicator();
    });
  }

  // 切换当前核心指标
  @autobind
  changeCore(indicatorId) {
    this.setState({
      indicatorId,
      swtichDefault: indicatorId,
    },
    () => {
      this.queryOneCoreIndicator();
    });
  }

  // 柱状图维度，排序，页码变化
  @autobind
  changeRankBar(rankQuery) {
    let { indicatorId } = this.state;
    const hasIndicatorId = _.isEmpty(indicatorId);
    if (hasIndicatorId) {
      // 初始化indicatorId并么有添加进state
      indicatorId = this.props.historyCore[0].key;
      this.setState({
        indicatorId,
      });
    }
    const query = this.makeQueryParams({
      isMultiple: 1,
      pageSize: 10,
      ...rankQuery,
      orderIndicatorId: indicatorId,
      indicatorId,
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
      custRange,
      visibleBoards,
      newVisibleBoards,
      location,
      replace,
      push,
      collectBoardSelect,
      collectCustRange,
      collectDurationSelect,
    } = this.props;

    if (_.isEmpty(custRange) || _.isEmpty(visibleBoards)) {
      return null;
    }
    const {
      scope,
      localScope,
      boardType,
      coreIndicatorIds,
      ownerOrgId,
      swtichDefault,
    } = this.state;
    const level = localScope || custRange[0].level;
    const newScope = scope || String(Number(level) + 1);
    const custOrg = ownerOrgId || custRange[0].id;
    // 总量指标库
    const summuryCheckedKeys = this.getUserSummuryKeys(historyCore);
    const summuryLib = {
      type: 'summury',
      boardType: 'TYPE_TGJX',
      checkTreeArr: indicatorLib.core,
      checkedKeys: summuryCheckedKeys,
    };

    const { cust = EMPTY_LIST, invest = EMPTY_LIST } = historyContrastDic;
    return (
      <div className="pageHistory">
        <PageHeader
          location={location}
          replace={replace}
          push={push}
          custRange={custRange}
          visibleBoards={visibleBoards}
          newVisibleBoards={newVisibleBoards}
          updateQueryState={this.updateQueryState}
          orgId={'ZZ001041'}
          collectBoardSelect={collectBoardSelect}
          collectCustRange={collectCustRange}
          collectDurationSelect={collectDurationSelect}
          showSelfDatePicker
        />
        <div className={styles.historybd}>
          <div className={styles.indicatorOverview}>
            {/* 核心指标头部区域---假定数据 */}
            <IndicatorOverviewHeader
              location={location}
              createBoardConfirm={this.createBoardConfirm}
              deleteBoardConfirm={this.deleteBoardConfirm}
              updateBoardConfirm={this.updateBoardConfirm}
              ownerOrgId={custOrg}
              orgId={custOrg}
              selectKeys={coreIndicatorIds}
            />
            {/* 指标概览区域 */}
            <IndicatorOverview
              overviewData={historyCore}
              indexData={crrData}
              summuryLib={summuryLib}
              saveIndcatorToHome={this.saveIndcatorToHome}
              changeCore={this.changeCore}
              level={level}
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
                    level={level}
                    scope={newScope}
                    data={rankData}
                    boardType={boardType}
                    changeRankBar={this.changeRankBar}
                    swtichDefault={swtichDefault}
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
                swtichDefault={swtichDefault}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
