/**
 * @description 历史对比页面
 * @author sunweibin
 * @fileOverview history/Home.js
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import moment from 'moment';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { message, Row, Col } from 'antd';
import _ from 'lodash';

import { getEmpId, getDurationString } from '../../utils/helper';
import IndicatorOverviewHeader from '../../components/history/IndicatorOverviewHeader';
import IndicatorOverview from '../../components/history/IndicatorOverview';
import ScatterAnalysis from '../../components/history/ScatterAnalysis';
import HistoryComparePolyChart from '../../components/history/HistoryComparePolyChart';
import HistoryCompareRankChart from '../../components/history/HistoryCompareRankChart';
import PageHeader from '../../components/pageCommon/PageHeader';
import styles from './Home.less';

// 投顾绩效历史对比的borderId
const TYPE_LSDB_TGJX = '3';
// 经营业绩历史对比的boardId
const TYPE_LSDB_JYYJ = '4';

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
const EMPTY_OBJECT = {};

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
    const nowDuration = getDurationString('month');
    const begin = nowDuration.begin;
    const end = nowDuration.end;

    const distanceDays = moment(end).diff(moment(begin), 'days') + 1;
    const lastBeginMoment = moment(begin).subtract(distanceDays, 'days');
    const lastEndMoment = moment(end).subtract(distanceDays, 'days');

    this.state = {
      boardId,
      boardType,
      begin: nowDuration.begin, // 本期开始时间
      end: nowDuration.end, // 本期结束时间
      cycleType: 'month', // 时间段周期类型
      contrastBegin: lastBeginMoment.format('YYYYMMDD'), // 上期开始时间
      contrastEnd: lastEndMoment.format('YYYYMMDD'), // 上期结束时间
      coreIndicatorIds: [], // 弹出层挑选的指标
      indicatorId: '', // 当前选中的核心指标key
      orgId: ownerOrg && ownerOrg.id, // 用户当前选择的组织机构Id
      ownerOrgId: ownerOrg && ownerOrg.id, // 用户所属的组织机构Id
      empId, // 用户ID
      swtichDefault: '', // 通知相关组件切换回默认状态
      showMenu: false,
      showSubMenu: false,
      resetDefault: false,
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
      const timeStamp = new Date().getTime().toString();
      // TODO 此处需要等到时间选择器完成提供方法
      // const { begin, end, cycleType } = getDurationString('month');
      this.setState({
        swtichDefault: timeStamp,
        boardId,
        boardType,
        scope: ownerOrg && String(Number(ownerOrg.level) + 1),
        localScope: ownerOrg && ownerOrg.level,
        orgId: ownerOrg && ownerOrg.id, // 用户当前选择的组织机构Id
        ownerOrgId: ownerOrg && ownerOrg.id, // 用户所属的组织机构Id
        coreIndicatorIds: [],
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
    const { push, createLoading, deleteLoading, updateLoading, operateData } = nextProps;
    if (preCL && !createLoading) {
      // 首先判断创建成功与否
      const { success } = operateData;
      if (success) {
        // 创建完成后，需要跳转到新建看板
        this.setState({
          coreIndicatorIds: [],
        },
          () => {
            const { id } = operateData;
            push(`/history?boardId=${id}&boardType=${boardType}`);
          });
      }
    }
    if (preDL && !deleteLoading) {
      // 删除成功
      message.success('删除成功');
      this.setState({
        coreIndicatorIds: [],
      },
        () => {
          if (boardType === 'TYPE_LSDB_JYYJ') {
            push(`/history?boardId=${TYPE_LSDB_JYYJ}&boardType=TYPE_LSDB_JYYJ`);
          } else if (boardType === 'TYPE_LSDB_TGJX') {
            push(`/history?boardId=${TYPE_LSDB_TGJX}&boardType=TYPE_LSDB_TGJX`);
          }
        });
    }
    if (!updateLoading && prePL) {
      message.success('保存成功');
      this.setState({
        coreIndicatorIds: [],
      },
        () => {
          push(`/history?boardId=${boardId}&boardType=${boardType}`);
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
      contrastIndicatorId: !_.isEmpty(cust) && cust[0].key,
    }, selfNeed);
    queryContrastAnalyze(scatterCustQuery);
    if (!_.isEmpty(invest)) {
      const scatterInvestQuery = this.makeQueryParams({
        type: 'invest',
        coreIndicatorId: indicatorId,
        contrastIndicatorId: invest[0].key,
      }, selfNeed);
      queryContrastAnalyze(scatterInvestQuery);
    }
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
    const indicatorId = !_.isEmpty(coreIndicatorIds) && coreIndicatorIds[0];
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
      indicatorId = !_.isEmpty(historyCore) && historyCore[0].key;
    } else {
      indicatorId = !_.isEmpty(coreIndicatorIds) && coreIndicatorIds[0];
    }
    this.setState({
      swtichDefault: new Date().getTime().toString(),
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
    const { historyCore } = this.props;
    const hasIndicatorId = _.isEmpty(indicatorId);
    if (hasIndicatorId) {
      // 初始化indicatorId并么有添加进state
      indicatorId = !_.isEmpty(historyCore) && historyCore[0].key;
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
    const { type, contrastIndicatorId } = query;
    const { historyCore } = this.props;
    const { coreIndicatorIds } = this.state;
    let { indicatorId } = this.state;
    // 判断有无选择core
    const hasIndicatorId = _.isEmpty(indicatorId);
    const hasSelectCore = _.isEmpty(coreIndicatorIds);
    if (hasIndicatorId) {
      // 初始化indicatorId并么有添加进state
      if (hasSelectCore) {
        // 没有选择Core
        indicatorId = !_.isEmpty(historyCore) && historyCore[0].key;
      } else {
        // 选择了Core
        indicatorId = !_.isEmpty(coreIndicatorIds) && coreIndicatorIds[0];
      }
      this.setState({
        indicatorId,
      });
    }
    const scatterQuery = this.makeQueryParams({
      type,
      coreIndicatorId: indicatorId,
      contrastIndicatorId,
    });
    this.props.queryContrastAnalyze(scatterQuery);
  }

  render() {
    const {
      reviewAnalysis = EMPTY_OBJECT,
      contributionAnalysis,
      historyCore = EMPTY_LIST,
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
      createLoading,
      operateData,
    } = this.props;

    if (_.isEmpty(custRange) || _.isEmpty(visibleBoards) || _.isEmpty(newVisibleBoards)) {
      return null;
    }
    const {
      scope,
      localScope,
      boardType,
      coreIndicatorIds,
      ownerOrgId,
      swtichDefault,
      orgId,
      indicatorId,
    } = this.state;
    const level = localScope || custRange[0].level;
    const newScope = scope || String(Number(level) + 1);
    const custOrg = ownerOrgId || custRange[0].id;

    const cOrgId = orgId || custRange[0].id;
    // 总量指标库
    const summuryCheckedKeys = this.getUserSummuryKeys(historyCore);
    const summuryLib = {
      type: 'summury',
      boardType,
      checkTreeArr: indicatorLib.core,
      checkedKeys: summuryCheckedKeys,
    };

    const { cust = EMPTY_LIST, invest = EMPTY_LIST } = historyContrastDic;

    const curNameIndex = _.findIndex(historyCore, item => item.key === indicatorId);

    // 找出当前是否是以率为结尾的指标
    const isLvIndicator = curNameIndex > -1 ? historyCore[curNameIndex].name.indexOf('率') !== -1 : false;

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
          orgId={cOrgId}
          collectBoardSelect={collectBoardSelect}
          collectCustRange={collectCustRange}
          collectDurationSelect={collectDurationSelect}
          showSelfDatePicker
        />
        <div className={styles.historybd}>
          <div className={styles.indicatorOverview}>
            {/* 核心指标头部区域 */}
            <IndicatorOverviewHeader
              location={location}
              createBoardConfirm={this.createBoardConfirm}
              deleteBoardConfirm={this.deleteBoardConfirm}
              updateBoardConfirm={this.updateBoardConfirm}
              ownerOrgId={custOrg}
              orgId={custOrg}
              selectKeys={coreIndicatorIds}
              boardType={boardType}
              createLoading={createLoading}
              operateData={operateData}
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
            <div className={styles.caption}>{curNameIndex >= 0 ? historyCore[curNameIndex].name : '指标'}-详细分析</div>
            <div className={styles.polyArea}>
              <Row type="flex" gutter={10} >
                <Col span="12">
                  <HistoryComparePolyChart data={contrastData} />
                </Col>
                <Col span="12">
                  <HistoryCompareRankChart
                    level={level}
                    scope={newScope}
                    data={rankData}
                    boardType={boardType}
                    changeRankBar={this.changeRankBar}
                    swtichDefault={swtichDefault}
                  />
                </Col>
              </Row>
            </div>
            <div className={styles.scatterArea}>
              {/* 散点图区域 */}
              <ScatterAnalysis
                contributionAnalysisData={contributionAnalysis}
                reviewAnalysisData={reviewAnalysis}
                queryContrastAnalyze={this.changeScatterContrast}
                cust={cust}
                invest={invest}
                switchDefault={swtichDefault}
                location={location}
                level={level}
                isLvIndicator={isLvIndicator}
                currentSelectIndicatorName={curNameIndex > -1 ? `${historyCore[curNameIndex].parentName || ''}${historyCore[curNameIndex].name}` : ''}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
