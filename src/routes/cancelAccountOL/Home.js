/**
 * @Author: sunweibin
 * @Date: 2018-07-09 09:58:54
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-19 14:43:05
 * @description 线上销户首页
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';

import SplitPanel from '../../components/common/splitPanel/CutScreen';
import SeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import ApplyList from '../../components/common/appList';
import ApplyItem from '../../components/common/appList/ApplyItem';
import Detail from '../../components/cancelAccountOL/Detail';
import CreateApply from '../../components/cancelAccountOL/CreateApply';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { dva, convert } from '../../helper';
import seibelHelper from '../../helper/page/seibel';
import logable, { logPV } from '../../decorators/logable';

import { PAGE_TYPE, STATUS_OPTIONS } from './config';

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.newSeibleList,
  // 右侧详情
  detailInfo: state.cancelAccountOL.detailInfo,
  // 新建弹出层可选客户列表
  custList: state.cancelAccountOL.custList,
  // 新建弹出层的流程按钮以及审批人列表
  approval: state.cancelAccountOL.approval,
  // 新建提交结果
  submitResult: state.cancelAccountOL.submitResult,
  // 流程结果
  flowResult: state.cancelAccountOL.flowResult,
  // 下拉列表字典
  optionsDict: state.cancelAccountOL.optionsDict,
  // 推送结果
  pushResult: state.cancelAccountOL.pushResult,
});

const mapDispatchToProps = {
  // 获取左侧列表
  getList: effect('app/getNewSeibleList', { forceFull: true }),
  // 获取右侧详情
  getDetail: effect('cancelAccountOL/getDetail', { forceFull: true }),
  // 根据关键字查询可选客户列表
  queryCustList: effect('cancelAccountOL/queryCustList', { forceFull: true }),
  // 获取流程按钮以及对应的审批人信息
  getApprovalInfo: effect('cancelAccountOL/getApprovalInfo', { forceFull: true }),
  // 获取新建页面下的下拉字典
  queryDict: effect('cancelAccountOL/queryDict', { forceFull: true }),
  // 推送销户
  pushCancelAcccount: effect('cancelAccountOL/pushCancelAcccount', { forceFull: true }),
  // 提交
  submitApply: effect('cancelAccountOL/submitApply', { forceFull: true }),
  // 走流程
  doApproval: effect('cancelAccountOL/doApproval', { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect('cancelAccountOL/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CancelAccountOLHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    queryDict: PropTypes.func.isRequired,
    optionsDict: PropTypes.object.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 右侧详情
    detailInfo: PropTypes.object.isRequired,
    getDetail: PropTypes.func.isRequired,
    // 新建弹出层可选客户列表
    custList: PropTypes.array.isRequired,
    queryCustList: PropTypes.func.isRequired,
    // 获取新建按钮以及对应的审批人信息
    getApprovalInfo: PropTypes.func.isRequired,
    approval: PropTypes.object.isRequired,
    // 提交结果
    submitApply: PropTypes.func.isRequired,
    submitResult: PropTypes.object.isRequired,
    // 流程结果
    doApproval: PropTypes.func.isRequired,
    flowResult: PropTypes.object.isRequired,
    // 推送销户
    pushCancelAcccount: PropTypes.func.isRequired,
    pushResult: PropTypes.string.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      isShowCreateModal: false,
    };
  }

  componentDidMount() {
    // 初始化页面的时候，获取下页面中需要的字典数据
    const { queryDict, optionsDict } = this.props;
    const notGetDict = _.isEmpty(optionsDict);
    if (notGetDict) {
      queryDict();
    }
    this.getAppList();
  }

  @autobind
  getAppList() {
    const { location: { query, query: { pageNum, pageSize } } } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  // 获取右侧详情
  @autobind
  getRightDetail() {
    const {
      list,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    const { replace } = this.context;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = list.page;
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === currentId)[0];
      } else {
        // 不存在currentId
        replace({
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
      this.props.getDetail({
        flowId: item.flowId,
      });
    }
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件,
    getList({ ...params, type: PAGE_TYPE }).then(this.getRightDetail);
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
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
        ...obj,
      },
    });
    // 2.调用queryApplicationList接口
    this.queryAppList({ ...query, ...obj }, 1, query.pageSize);
  }

  // 打开新建申请的弹出框
  @autobind
  @logPV({ pathname: '/modal/createCancelAccountOL', title: '新建线上销户申请' })
  openCreateModalBoard() {
    this.setState({
      isShowCreateModal: true,
    });
  }

  // 切换页码
  @autobind
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
    this.queryAppList(query, nextPage, currentPageSize);
  }

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { location } = this.props;
    const { replace } = this.context;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
    this.queryAppList(query, 1, changedPageSize);
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({ type: 'ViewItem', payload: { name: '线上销户左侧列表项' } })
  handleListRowClick(record, index) {
    const { id, flowId } = record;
    const { location: { pathname, query, query: { currentId } } } = this.props;
    const { replace } = this.context;
    if (currentId === String(id)) {
      return;
    }
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    this.props.getDetail({
      flowId,
    });
  }

  @autobind
  handleCloseCreateModal(name, isNeedRefresh) {
    this.setState({ [name]: false });
    this.props.clearReduxData({
      custList: [],
      approval: {},
    });
    if (isNeedRefresh) {
      this.getAppList();
    }
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '销户链接推送' } })
  handlePushBtnOfDetailClick({ id, flowId }) {
    this.props.pushCancelAcccount({ id }).then(() => {
      this.props.getDetail({ flowId });
    });
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    const { status } = record;
    const statusTags = [convert.getStatusByCode(status)];
    return (
      <ApplyItem
        key={record.id}
        data={record}
        index={index}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        pageName="custRelationships"
        iconType="kehu1"
        subTypeName="线上销户申请"
        statusTags={statusTags}
      />
    );
  }

  render() {
    const {
      location,
      list,
      detailInfo,
      custList,
      approval,
      submitResult,
      flowResult,
      optionsDict,
      pushResult,
    } = this.props;

    const {
      isShowCreateModal,
    } = this.state;

    const isEmpty = _.isEmpty(list.resultData);
    // 头部筛选
    const topPanel = (
      <SeibelHeader
        location={location}
        page="cancelAccountOL"
        pageType={PAGE_TYPE}
        needSubType={false}
        stateOptions={STATUS_OPTIONS}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        needApplyTime
        isUseNewCustList
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    // 左侧列表
    const leftPanel = (
      <ApplyList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    // 右侧详情
    const rightPanel = (
      <Detail
        pushResult={pushResult}
        optionsDict={optionsDict}
        data={detailInfo}
        onPush={this.handlePushBtnOfDetailClick}
      />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="cancelAccountOLlist"
          leftWidth={420}
        />
        {
          !isShowCreateModal ? null
          :
          (
            <CreateApply
              onClose={this.handleCloseCreateModal}
              queryCustList={this.props.queryCustList}
              getApprovalInfo={this.props.getApprovalInfo}
              onSubmit={this.props.submitApply}
              doApproval={this.props.doApproval}
              optionsDict={optionsDict}
              custList={custList}
              approval={approval}
              submitResult={submitResult}
              flowResult={flowResult}
            />
          )
        }
      </div>
    );
  }
}
