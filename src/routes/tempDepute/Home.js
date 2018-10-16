/*
 * @Author: sunweibin
 * @Date: 2018-08-29 09:28:06
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-10-16 18:14:50
 * @description 临时委托他人处理任务Home页面
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import SplitPanel from '../../components/common/splitPanel/CutScreen';
import SeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import ApplyList from '../../components/common/appList';
import ApplyItem from '../../components/common/appList/ApplyItem';
import Detail from '../../components/tempDepute/Detail';
import CreateDeputeModal from '../../components/tempDepute/CreateDeputeModal';
import confirm from '../../components/common/confirm_';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { dva, emp } from '../../helper';
import logable, { logPV, logCommon } from '../../decorators/logable';
import { SEIBEL_HEADER_BASIC_FILTERS, getStatusTagProps } from './config';
import { composeQuery } from './utils';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 左侧列表数据
  applyList: state.tempDepute.applyList,
  // 右侧详情
  applyDetail: state.tempDepute.applyDetail,
  // 新建提交结果
  submitResult: state.tempDepute.submitResult,
  // 流程结果
  flowResult: state.tempDepute.flowResult,
  // 可以受托人的部门以及受托人员列表
  deputeEmpList: state.tempDepute.deputeEmpList,
  // 受托部门列表
  deputeOrgList: state.tempDepute.deputeOrgList,
  // 是否能够提交委托申请结果
  checkResult: state.tempDepute.checkResult,
  // 撤销委托申请结果
  revertResult: state.tempDepute.revertResult,
  // 新建弹出层的流程按钮以及审批人列表
  approval: state.tempDepute.approval,
});

const mapDispatchToProps = {
  // 获取左侧列表
  queryApplyList: effect('tempDepute/queryApplyList', { forceFull: true }),
  // 获取右侧详情
  queryApplyDetail: effect('tempDepute/queryApplyDetail', { forceFull: true }),
  // 查询可以受托的组织机构和服务经理
  queryCanDeputeEmp: effect('tempDepute/queryCanDeputeEmp', { loading: false }),
  // 校验是否可以申请任务委托
  checkApplyAbility: effect('tempDepute/checkApplyAbility', { forceFull: true }),
  // 撤销委托申请
  revertApply: effect('tempDepute/revertApply', { forceFull: true }),
  // 提交
  saveApply: effect('tempDepute/saveApply', { forceFull: true }),
  // 走流程
  doApprove: effect('tempDepute/doApprove', { forceFull: true }),
  // 获取受托部门列表
  queryCanDeputeOrg: effect('tempDepute/queryCanDeputeOrg', { forceFull: true }),
  // 获取下一步审批人信息
  getApprovalInfo: effect('tempDepute/getApprovalInfo', { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect('tempDepute/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 左侧列表数据
    applyList: PropTypes.object.isRequired,
    // 右侧详情
    applyDetail: PropTypes.object.isRequired,
    // 新建提交结果
    submitResult: PropTypes.object.isRequired,
    // 流程结果
    flowResult: PropTypes.object.isRequired,
    // 可以受托人的部门以及受托人员列表
    deputeEmpList: PropTypes.array.isRequired,
    // 是否能够提交委托申请结果
    checkResult: PropTypes.object.isRequired,
    // 撤销委托申请结果
    revertResult: PropTypes.object.isRequired,
    // 获取左侧列表
    queryApplyList: PropTypes.func.isRequired,
    // 获取右侧详情
    queryApplyDetail: PropTypes.func.isRequired,
    // 查询可以受托的组织机构和服务经理
    queryCanDeputeEmp: PropTypes.func.isRequired,
    // 校验是否可以申请任务委托
    checkApplyAbility: PropTypes.func.isRequired,
    // 撤销委托申请
    revertApply: PropTypes.func.isRequired,
    // 提交
    saveApply: PropTypes.func.isRequired,
    // 走流程
    doApprove: PropTypes.func.isRequired,
    // 获取下一步审批人信息
    getApprovalInfo: PropTypes.func.isRequired,
    // 审批人信息
    approval: PropTypes.object.isRequired,
    // 查询受托部门列表
    queryCanDeputeOrg: PropTypes.func.isRequired,
    // 受托部门列表
    deputeOrgList: PropTypes.array.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下发起委托不可见 false 不可见  true 可见
      launchDeputeModalVisible: false,
    };
  }
  componentDidMount() {
    const { location: { query } } = this.props;
    // 初始化查询申请列表
    this.queryApplyList(query);
  }

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const { location: { query: nextQuery } } = this.props;
    const nextQueryWithoutId = _.omit(nextQuery, ['currentId']);
    const prevQueryWithoutId = _.omit(prevQuery, ['currentId']);
    // query和prevQuery，不等时需要重新获取列表，但是首次进入页面获取列表在componentDidMount中调用过，所以不需要重复获取列表
    if (!_.isEqual(nextQueryWithoutId, prevQueryWithoutId) && !_.isEmpty(prevQuery)) {
      this.queryApplyList(nextQuery);
    }
  }

  // 查询右侧详情接口
  @autobind
  getRightDetail() {
    const { applyList: { list, page } } = this.props;
    if (!_.isEmpty(list)) {
      // 1.根据 url 中的 currentId 获取到用户选择的是哪个列表项，
      // 如果没有或者没有匹配到，则默认选中第一条
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { location: { pathname, query } } = this.props;
      const { currentId } = query;
      const { pageNum, pageSize } = page;
      let item = _.head(list);
      let itemIndex = _.findIndex(list, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.find(list, o => String(o.id) === currentId);
      } else {
        // 不存在currentId
        this.context.replace({
          pathname,
          query: {
            ...query,
            currentId: item.id,
            pageNum,
            pageSize,
          },
        });
        itemIndex = 0;
      }
      this.setState({
        activeRowIndex: itemIndex,
      });
      // 此处详情查询使用申请单编号，不使用flowId
      this.props.queryApplyDetail({
        itemId: item.id,
      });
    }
  }

  @autobind
  doRefreshListAfterApprove() {
    const { location: { query } } = this.props;
    // 初始化查询申请列表
    this.queryApplyList(query);
    this.handleLaunchDeputeModalClose();
  }

  // 撤销临时委托任务
  @autobind
  doRevertTempDepute(query) {
    this.props.revertApply(query).then(() => {
      this.props.queryApplyDetail(query);
    });
    // 记录撤销临时委托任务日志
    logCommon({
      type: 'Submit',
      payload: {
        name: '撤销临时委托任务',
        vlaue: JSON.stringify(query),
      },
    });
  }

  // 获取左侧列表
  @autobind
  queryApplyList(query) {
    const composedQuery = composeQuery({ ...query, orgId: emp.getOrgId() });
    this.props.queryApplyList(composedQuery).then(this.getRightDetail);
  }

  // 切换页码
  @autobind
  @logable({ type: 'Click', payload: { name: '临时委托任务列表切换页码' } })
  handlePageNumberChange(nextPage, currentPageSize) {
    const { location } = this.props;
    const { replace } = this.context;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
        pageSize: currentPageSize,
      },
    });
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '撤销委托' } })
  handleRevertBtnOfDetailClick(query) {
    // 撤销按钮点击行为需要弹框提示
    confirm({
      content: '撤销委托确认后所有任务将会在T+1日转到委托人名下，如需要T+1日可再次发起任务委托。是否确定撤销临时委托？',
      onOk: () => this.doRevertTempDepute(query),
    });
  }

  @autobind
  @logPV({ pathname: '/modal/creatTempDepute', title: '发起临时任务委托' })
  handleLaunchDepute() {
    this.setState({ launchDeputeModalVisible: true });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭发起委托新建弹框' } })
  handleLaunchDeputeModalClose() {
    this.setState({ launchDeputeModalVisible: false });
  }

  @autobind
  @logable({ type: 'ViewItem', payload: { name: '临时委托任务' } })
  handleListRowClick(record, index) {
    const { id } = record;
    const { location: { pathname, query, query: { currentId } } } = this.props;
    if (currentId === String(id)) {
      return;
    }
    this.context.replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    this.props.queryApplyDetail({ itemId: id });
  }

  @autobind
  handleHeaderFilter(param) {
    // 1.将值写入Url
    const { location } = this.props;
    const { replace } = this.context;
    const { query, pathname } = location;
    // 清空掉消息提醒页面带过来的 id
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...param,
      },
    });
  }

  // 因为临时任务委托第二行不需要展示处理申请标题不要展示多余的信息所以返回空字符串
  @autobind
  renderApplyItemSecondLine() {
    return '';
  }

  // 因为临时任务委托第三行需要展示日期
  @autobind
  renderApplyItemThirdLine(data) {
    return data.applyTime || '--';
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    const { statusCode } = record;
    const statusTags = [getStatusTagProps(statusCode)];
    return (
      <ApplyItem
        key={record.id}
        data={record}
        index={index}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        pageName="tempDeputeApply"
        iconType="kehu1"
        subTypeName="临时任务委托"
        statusTags={statusTags}
        showSecondLineInfo={this.renderApplyItemSecondLine}
        showThirdLineInfo={this.renderApplyItemThirdLine}
      />
    );
  }

  render() {
    const {
      applyList,
      applyDetail,
      location,
      queryCanDeputeEmp,
      queryCanDeputeOrg,
      deputeEmpList,
      deputeOrgList,
      approval,
      saveApply,
      submitResult,
      getApprovalInfo,
      checkApplyAbility,
      checkResult,
      doApprove,
      flowResult,
    } = this.props;
    const { dict: { deputeStatusDictList = [] } } = this.context;

    const { launchDeputeModalVisible } = this.state;

    // 头部筛选
    const topPanel = (
      <SeibelHeader
        applyBtnText="发起委托"
        isCallCustRangeApi={false}
        location={location}
        page="tempDeputeApply"
        stateOptions={deputeStatusDictList}
        creatSeibelModal={this.handleLaunchDepute}
        filterCallback={this.handleHeaderFilter}
        basicFilters={SEIBEL_HEADER_BASIC_FILTERS}
      />
    );

    // 列表分页器
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { list = [], page = {} } = applyList;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: _.isEmpty(page) ? 0 : (page.totalCount || 0),
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: _.noop,
    };

    // 判断当前数据是否为空
    const isEmpty = _.isEmpty(list);

    // 左侧列表
    const leftPanel = (
      <ApplyList
        list={list}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    // 右侧详情
    const rightPanel = (
      <Detail
        data={applyDetail}
        onRevert={this.handleRevertBtnOfDetailClick}
      />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="tempDeputeList"
          leftWidth={420}
        />
        {
          !launchDeputeModalVisible ? null
          :
          (
            <CreateDeputeModal
              deputeEmpList={deputeEmpList}
              deputeOrgList={deputeOrgList}
              onClose={this.handleLaunchDeputeModalClose}
              queryCanDeputeOrg={queryCanDeputeOrg}
              queryCanDeputeEmp={queryCanDeputeEmp}
              getApprovalInfo={getApprovalInfo}
              onSubmit={saveApply}
              approval={approval}
              doFlow={doApprove}
              flowResult={flowResult}
              submitResult={submitResult}
              checkApplyAbility={checkApplyAbility}
              checkResult={checkResult}
              doRefreshListAfterApprove={this.doRefreshListAfterApprove}
            />
          )
        }
      </div>
    );
  }
}
