/**
 * @Author: hongguangqing
 * @Descripter: 公务手机卡号申请页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-21 13:39:15
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import ViewListRow from '../../components/telephoneNumberManage/ViewListRow';
import TelePhoneNumApplyList from '../../components/common/appList';
import Detail from '../../components/telephoneNumberManage/ApplyDetail';
import CreateApply from '../../components/telephoneNumberManage/CreateApply';
import config from '../../components/telephoneNumberManage/config';
import { dva } from '../../helper';
import seibelHelper from '../../helper/page/seibel';

const { telephoneNumApply, telephoneNumApply: { statusOptions, pageType } } = config;
const dispatch = dva.generateEffect;
const effects = {
  // 左侧列表
  getList: 'app/getSeibleList',
  // 右侧详情
  getDetailInfo: 'telephoneNumberManage/getDetailInfo',
  // 详情页面服务经理表格申请数据
  queryEmpAppBindingList: 'telephoneNumberManage/queryEmpAppBindingList',
  // 获取附件列表
  getAttachmentList: 'telephoneNumberManage/getAttachmentList',
  // 获取新建页面投顾
  queryAdvisorList: 'telephoneNumberManage/queryAdvisorList',
  // 新建页面获取下一步审批人
  queryNextApproval: 'telephoneNumberManage/queryNextApproval',
  // 获取批量投顾
  queryBatchAdvisorList: 'telephoneNumberManage/queryBatchAdvisorList',
};
const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.telephoneNumberManage.detailInfo,
  // 服务经理表格申请数据
  empAppBindingList: state.telephoneNumberManage.empAppBindingList,
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 附件列表
  attachmentList: state.telephoneNumberManage.attachmentList,
  // 获取新建页面的投顾
  advisorListData: state.telephoneNumberManage.advisorListData,
  // 新建页面获取下一步审批人
  nextApprovalData: state.telephoneNumberManage.nextApprovalData,
  // 获取批量投顾
  batchAdvisorListData: state.telephoneNumberManage.batchAdvisorListData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: dispatch(effects.getList, { forceFull: true }),
  // 获取右侧详情信息
  getDetailInfo: dispatch(effects.getDetailInfo, { forceFull: true }),
  // 服务经理表格申请数据
  queryEmpAppBindingList: dispatch(effects.queryEmpAppBindingList, { forceFull: true }),
  // 获取附件列表
  getAttachmentList: dispatch(effects.getAttachmentList, { forceFull: true }),
  // 获取新建页面的投顾
  queryAdvisorList: dispatch(effects.queryAdvisorList, { loading: false }),
  // 获取新建下一步审批人
  queryNextApproval: dispatch(effects.queryNextApproval, { forceFull: true }),
  // 获取批量投顾
  queryBatchAdvisorList: dispatch(effects.queryBatchAdvisorList, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class ApplyHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 服务经理表格申请数据
    empAppBindingList: PropTypes.object.isRequired,
    queryEmpAppBindingList: PropTypes.func.isRequired,
    // 详情页面服务经理表格申请数据
    attachmentList: PropTypes.array,
    getAttachmentList: PropTypes.func.isRequired,
    // 新建页面获取投顾
    advisorListData: PropTypes.object.isRequired,
    queryAdvisorList: PropTypes.func.isRequired,
    // 新建页面获取下一步审批人
    nextApprovalData: PropTypes.array.isRequired,
    queryNextApproval: PropTypes.func.isRequired,
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
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

  componentWillMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  // 获取右侧详情
  @autobind
  getRightDetail() {
    const {
      replace,
      list,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = list.page;
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
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
      this.props.getDetailInfo({ flowId: item.flowId }).then(() => {
        const { appId, attachmnet } = this.props.detailInfo;
        this.props.queryEmpAppBindingList({
          appId,
          pageNum: 1,
          pageSize: 10,
        });
        this.props.getAttachmentList({ attachmnet });
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
    const { replace, location } = this.props;
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

  @autobind
  clearModal(name) {
    // 清除模态框组件
    this.setState({ [name]: false });
  }

  // 打开新建申请的弹出框
  @autobind
  openCreateModalBoard() {
    this.setState({
      isShowCreateModal: true,
    });
  }

  // 关闭新建申请的弹出框
  @autobind
  closeCreateModalBoard() {
    this.setState({
      isShowCreateModal: false,
    });
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace, location } = this.props;
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
    const { replace, location } = this.props;
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
  handleListRowClick(record, index) {
    const { id, flowId } = record;
    const {
      replace,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (currentId === String(id)) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ activeRowIndex: index });
    this.props.getDetailInfo({ flowId });
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
        pageName="telephoneNumApply"
        type="kehu1"
        pageData={telephoneNumApply}
      />
    );
  }

  render() {
    const {
      replace,
      location,
      list,
      detailInfo,
      empInfo,
      empAppBindingList,
      queryEmpAppBindingList,
      attachmentList,
      advisorListData,
      queryAdvisorList,
      nextApprovalData,
      queryNextApproval,
      batchAdvisorListData,
      queryBatchAdvisorList,
    } = this.props;
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="telephoneNumApplyPage"
        pageType={pageType}
        needSubType={false}
        stateOptions={statusOptions}
        empInfo={empInfo}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
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

    const leftPanel = (
      <TelePhoneNumApplyList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail
        location={location}
        data={detailInfo}
        empAppBindingList={empAppBindingList}
        queryEmpAppBindingList={queryEmpAppBindingList}
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
          leftListClassName="telephoneNumApplyList"
        />
        {
          isShowCreateModal ?
            <CreateApply
              location={location}
              closeCreateModalBoard={this.closeCreateModalBoard}
              advisorListData={advisorListData}
              queryAdvisorList={queryAdvisorList}
              nextApprovalData={nextApprovalData}
              queryNextApproval={queryNextApproval}
              empAppBindingList={empAppBindingList}
              queryEmpAppBindingList={queryEmpAppBindingList}
              batchAdvisorListData={batchAdvisorListData}
              queryBatchAdvisorList={queryBatchAdvisorList}
            />
            :
            null
        }
      </div>
    );
  }
}
