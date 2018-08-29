/*
 * @Author: sunweibin
 * @Date: 2018-08-29 09:28:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-29 20:48:39
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

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { dva } from '../../helper';
import logable, { logPV } from '../../decorators/logable';
import {
  SEIBEL_HEADER_BASIC_FILTERS,
  getStatusTagProps,
} from './config';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 页面字典
  tempDeputeDict: state.tempDepute.tempDeputeDict,
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
  // 是否能够提交委托申请结果
  checkResult: state.tempDepute.checkResult,
  // 撤销委托申请结果
  revertResult: state.tempDepute.revertResult,
});

const mapDispatchToProps = {
  // 获取页面字典
  queryDict: effect('tempDepute/queryDict', { forceFull: true }),
  // 获取左侧列表
  queryApplyList: effect('tempDepute/queryApplyList', { forceFull: true }),
  // 获取右侧详情
  queryApplyDetail: effect('tempDepute/queryApplyDetail', { forceFull: true }),
  // 查询可以受托的组织机构和服务经理
  queryCanDeputeEmp: effect('tempDepute/queryCanDeputeEmp', { forceFull: true }),
  // 校验是否可以申请任务委托
  checkApplyAbility: effect('tempDepute/checkApplyAbility', { forceFull: true }),
  // 撤销委托申请
  revertApply: effect('tempDepute/revertApply', { forceFull: true }),
  // 提交
  saveApply: effect('tempDepute/saveApply', { forceFull: true }),
  // 走流程
  doApprove: effect('tempDepute/doApprove', { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect('tempDepute/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Home extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 页面字典
    tempDeputeDict: PropTypes.object.isRequired,
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
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
    // 获取页面字典
    queryDict: PropTypes.func.isRequired,
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
    // 初始化页面的时候，获取下页面中需要的字典数据
    const { queryDict, tempDeputeDict } = this.props;
    const notGetDict = _.isEmpty(tempDeputeDict);
    if (notGetDict) {
      queryDict();
    }
    // 查询申请列表
    this.getApplyList();
  }

  @autobind
  getApplyList() {
    const { location: { query, query: { pageNum, pageSize } } } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    console.warn('queryAppList: ', pageSize);
    // const { queryApplyList } = this.props;
    // 默认筛选条件,
    // queryApplyList({ ...params }).then(this.getRightDetail);
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
  handleRevertBtnOfDetailClick({ applyId }) {
    this.props.revertApply({ itemId: applyId }).then(() => {
      this.props.queryApplyDetail({ itemId: applyId });
    });
  }

  @autobind
  @logPV({ pathname: '/modal/creatTempDepute', title: '发起临时任务委托' })
  handleLaunchDepute() {
    this.setState({ launchDeputeModalVisible: true });
  }

  @autobind
  @logable({ type: 'ViewItem', payload: { name: '临时委托任务' } })
  handleListRowClick(record) {
    console.warn('临时委托任务: ', record);
  }

  @autobind
  handleHeaderFilter(param) {
    console.warn('头部筛选条件参数', param);
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    const { statusCode } = record;
    const statusTags = [getStatusTagProps(statusCode)];
    return (
      <ApplyItem
        key={record.applyId}
        data={record}
        index={index}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        pageName="tempDeputeApply"
        iconType="kehu1"
        subTypeName="临时任务委托"
        statusTags={statusTags}
      />
    );
  }

  render() {
    const { applyList, applyDetail } = this.props;

    // const { launchDeputeModalVisible } = this.state;

    const isEmpty = _.isEmpty(applyList);

    // 头部筛选
    const topPanel = (
      <SeibelHeader
        applyBtnText="发起委托"
        isCallCustRangeApi={false}
        location={location}
        page="tempDeputeApply"
        stateOptions={[]}
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
      total: page.totalCount || 0,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: _.noop,
    };

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
      </div>
    );
  }
}
