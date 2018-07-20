/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-20 14:01:30
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import ViewListRow from '../../components/custRelationships/ViewListRow';
import CustRelationshipsList from '../../components/common/appList';
import Detail from '../../components/custRelationships/Detail';
import CreateApply from '../../components/custRelationships/CreateApply';
import config from '../../components/custRelationships/config';
import { permission, dva } from '../../helper';
import seibelHelper from '../../helper/page/seibel';

// 客户关联关系申请左侧列表宽度
const LEFT_PANEL_WIDTH = 500;
const {
  custRelationships,
  custRelationships: {
    statusOptions,
    pageType,
    headerFilters: { basicFilters, moreFilters, moreFilterData },
  },
 } = config;
const effect = dva.generateEffect;
const effects = {
  // 左侧列表
  getList: 'app/getNewSeibleList',
  // 右侧详情
  getDetailInfo: 'custRelationships/getDetailInfo',
  // 获取附件列表
  getAttachmentList: 'custRelationships/getAttachmentList',
  // 根据关键字获取可申请的客户列表
  queryCustList: 'custRelationships/queryCustList',
  // 获取选中的客户的详情信息
  getCustDetail: 'custRelationships/getCustDetail',
  // 获取关联关系树
  getRelationshipTree: 'custRelationships/getRelationshipTree',
  // 获取新建页面审批人信息和按钮
  getApprovalInfo: 'custRelationships/getApprovalInfo',
  // 获取驳回后修改页面审批人信息和按钮
  getApprovalInfoForUpdate: 'custRelationships/getApprovalInfoForUpdate',
  // 校验数据接口
  validateData: 'custRelationships/validateData',
  // “是否办理股票质押回购业务“选“否”时，新建提交后不需走审批流程，直接调这个接口
  chgCustRelaiton: 'custRelationships/chgCustRelaiton',
  // “是否办理股票质押回购业务“选“是”时，提交申请接口
  submitApply: 'custRelationships/submitApply',
  // 走流程接口
  doApproveFlow: 'custRelationships/doApproveFlow',
  // 清空数据
  clearReduxData: 'custRelationships/clearReduxData',
};
const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.newSeibleList,
  // 右侧详情数据
  detailInfo: state.custRelationships.detailInfo,
  // 附件列表
  attachmentList: state.custRelationships.attachmentList,
  // 可进行关联关系申请的客户列表
  custList: state.custRelationships.custList,
  // 用户选中的客户基本信息
  custDetail: state.custRelationships.custDetail,
  // 关联关系树
  relationshipTree: state.custRelationships.relationshipTree,
  // 新建页面的按钮和审批人信息
  approval: state.custRelationships.approval,
  // 驳回修改页面的按钮和审批人信息
  approvalForUpdate: state.custRelationships.approvalForUpdate,
  // 数据校验结果
  validateResult: state.custRelationships.validateResult,
  // 提交申请的结果
  submitResult: state.custRelationships.submitResult,
  // 流程接口结果
  flowResult: state.custRelationships.flowResult,
});

const mapDispatchToProps = {
  // 获取左侧列表
  getList: effect(effects.getList, { forceFull: true }),
  // 获取右侧详情信息
  getDetailInfo: effect(effects.getDetailInfo, { forceFull: true }),
  // 获取附件列表
  getAttachmentList: effect(effects.getAttachmentList, { forceFull: true }),
  // 根据关键字获取可申请的客户列表
  queryCustList: effect(effects.queryCustList, { forceFull: true }),
  // 获取选中的客户的详情信息
  getCustDetail: effect(effects.getCustDetail, { forceFull: true }),
  // 获取关联关系树
  getRelationshipTree: effect(effects.getRelationshipTree, { forceFull: true }),
  // 获取新建页面审批人信息和按钮
  getApprovalInfo: effect(effects.getApprovalInfo, { forceFull: true }),
  // 获取驳回后修改页面审批人信息和按钮
  getApprovalInfoForUpdate: effect(effects.getApprovalInfoForUpdate, { forceFull: true }),
  // 校验数据接口
  validateData: effect(effects.validateData, { forceFull: true }),
  // “是否办理股票质押回购业务“选“否”时，新建提交后不需走审批流程，直接调这个接口
  chgCustRelaiton: effect(effects.chgCustRelaiton, { forceFull: true }),
  // “是否办理股票质押回购业务“选“是”时，提交申请接口
  submitApply: effect(effects.submitApply, { forceFull: true }),
  // 走流程接口
  doApproveFlow: effect(effects.doApproveFlow, { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect(effects.clearReduxData, { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class CustRelationshipsHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 详情页面服务经理表格申请数据
    attachmentList: PropTypes.array,
    getAttachmentList: PropTypes.func.isRequired,
    // 获取客户详情
    getCustDetail: PropTypes.func.isRequired,
    custDetail: PropTypes.object.isRequired,
    // 获取可申请客户列表
    queryCustList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    // 获取可申请客户列表
    getRelationshipTree: PropTypes.func.isRequired,
    relationshipTree: PropTypes.array.isRequired,
    // 新建页面的按钮和审批人信息
    approval: PropTypes.object.isRequired,
    getApprovalInfo: PropTypes.func.isRequired,
    // 驳回后修改页面的按钮和审批人信息
    getApprovalInfoForUpdate: PropTypes.func.isRequired,
    approvalForUpdate: PropTypes.object.isRequired,
    // 校验数据
    validateData: PropTypes.func.isRequired,
    validateResult: PropTypes.object.isRequired,
    // 提交申请
    submitResult: PropTypes.string.isRequired,
    submitApply: PropTypes.func.isRequired,
    // “是否办理股票质押回购业务“选“否”时，新建提交后不需走审批流程，直接调这个接口
    chgCustRelaiton: PropTypes.func.isRequired,
    // 走流程
    flowResult: PropTypes.string.isRequired,
    doApproveFlow: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachmentList: [],
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
    this.getAppList();
  }

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const {
      location: { query },
    } = this.props;
    const { ...otherQuery } = query;
    const { ...otherPrevQuery } = prevQuery;
    if (!_.isEqual(otherQuery, otherPrevQuery)) {
      const { pageNum, pageSize } = otherQuery;
      this.queryAppList(otherQuery, pageNum, pageSize);
    }
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
      // “是否办理股票质押回购业务“选“否”时，新建提交后不需走审批流程,没有flowId，此时用id
      this.props.getDetailInfo({
        flowId: item.flowId,
        id: item.id,
      }).then(() => {
        const { detailInfo, getAttachmentList } = this.props;
        const { attachment } = detailInfo;
        // 拿详情接口返回的attachmnet，调详情附件信息
        getAttachmentList({ attachment: attachment || '' });
      });
    }
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getList({ ...params, type: pageType }).then(this.getRightDetail);
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
  }

  // 打开新建申请的弹出框
  @autobind
  openCreateModalBoard() {
    this.setState({
      isShowCreateModal: true,
    });
  }

  @autobind
  handleShowCreateBtn() {
    // 如果有 HTSC 融资类业务客户关联关系管理岗职责，则显示新建按钮
    return permission.hasGLGXGLGPermission();
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
        // 翻页将当前申请id从url上清空
        currentId: '',
      },
    });
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
        // 翻页将当前申请id从url上清空
        currentId: '',
      },
    });
  }

  // 点击列表每条的时候对应请求详情
  @autobind
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
    // “是否办理股票质押回购业务“选“否”时，新建提交后不需走审批流程,没有flowId，此时用id
    this.props.getDetailInfo({
      flowId,
      id,
    }).then(() => {
      const { detailInfo, getAttachmentList } = this.props;
      const { attachment } = detailInfo;
      // 拿详情接口返回的attachmnet，调详情附件信息
      getAttachmentList({ attachment: attachment || '' });
    });
  }

  @autobind
  handleCloseCreateModal(name, isNeedRefresh) {
    this.setState({ [name]: false });
    this.props.clearReduxData({
      custDetail: {},
      custList: [],
      approval: {},
    });
    if (isNeedRefresh) {
      this.getAppList();
    }
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="custRelationships"
        type="kehu1"
        pageData={custRelationships}
      />
    );
  }

  render() {
    const {
      location,
      list,
      detailInfo,
      attachmentList,
      custDetail,
      getCustDetail,
      custList,
      queryCustList,
      relationshipTree,
      getRelationshipTree,
      getApprovalInfo,
      approval,
      validateData,
      validateResult,
      submitApply,
      submitResult,
      chgCustRelaiton,
      flowResult,
      doApproveFlow,
    } = this.props;

    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    // 头部筛选
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        page="custRelationships"
        pageType={pageType}
        stateOptions={statusOptions}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        isShowCreateBtn={this.handleShowCreateBtn}
        isUseNewCustList
        basicFilters={basicFilters}
        moreFilters={moreFilters}
        moreFilterData={moreFilterData}
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
      <CustRelationshipsList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    // 右侧详情
    const rightPanel = (
      <Detail
        data={detailInfo}
        attachmentList={attachmentList}
      />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="custRelationshipsList"
          leftWidth={LEFT_PANEL_WIDTH}
        />
        {
          !isShowCreateModal ? null :
          (
            <CreateApply
              onCloseModal={this.handleCloseCreateModal}
              custDetail={custDetail}
              custList={custList}
              getCustDetail={getCustDetail}
              queryCustList={queryCustList}
              relationshipTree={relationshipTree}
              getRelationshipTree={getRelationshipTree}
              approval={approval}
              getApprovalInfo={getApprovalInfo}
              validateData={validateData}
              validateResult={validateResult}
              submitResult={submitResult}
              submitApply={submitApply}
              chgCustRelaiton={chgCustRelaiton}
              flowResult={flowResult}
              doApproveFlow={doApproveFlow}
            />
          )
        }
      </div>
    );
  }
}
