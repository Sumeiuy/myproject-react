/**
 * @Author: hongguangqing
 * @Descripter: 公务手机卡号申请页面
 * @Date: 2018-04-17 16:49:00
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-07 17:49:41
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
import logable, { logPV } from '../../decorators/logable';

// 头部筛选区域上方导航的高度40px，在SplitPanel计算中需要额外减去
// isSetMarginTop为false，不需要将框架的marginTop设置为0，此时10pxmarginTop也要额外减掉
const EXTRAHEIGHT = 50;
// 业务手机申请列表宽度
const LEFT_PANEL_WIDTH = 450;
const {
  telephoneNumApply,
  telephoneNumApply: {
    statusOptions,
    pageType,
    basicFilters,
    moreFilters,
    moreFilterData,
  },
} = config;
const effect = dva.generateEffect;
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
  // 获取批量投顾
  queryBatchAdvisorList: 'telephoneNumberManage/queryBatchAdvisorList',
  // 新建修改的更新接口
  updateBindingFlow: 'telephoneNumberManage/updateBindingFlow',
  // 走流程接口
  doApprove: 'telephoneNumberManage/doApprove',
  // 清除数据
  clearProps: 'telephoneNumberManage/clearProps',
  // 获取按钮组和审批人
  getButtonList: 'telephoneNumberManage/getButtonList',
  // 验证提交数据
  validateData: 'telephoneNumberManage/validateData',
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
  // 获取批量投顾
  batchAdvisorListData: state.telephoneNumberManage.batchAdvisorListData,
  // 新建修改的更新接口
  updateBindingFlowAppId: state.telephoneNumberManage.updateBindingFlowAppId,
  // 按钮组
  buttonList: state.telephoneNumberManage.buttonList,
  // 验证提交数据
  validateResultData: state.telephoneNumberManage.validateResultData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: effect(effects.getList, { forceFull: true }),
  // 获取右侧详情信息
  getDetailInfo: effect(effects.getDetailInfo, { forceFull: true }),
  // 服务经理表格申请数据
  queryEmpAppBindingList: effect(effects.queryEmpAppBindingList, { forceFull: true }),
  // 获取附件列表
  getAttachmentList: effect(effects.getAttachmentList, { forceFull: true }),
  // 获取新建页面的投顾
  queryAdvisorList: effect(effects.queryAdvisorList, { loading: false }),
  // 获取批量投顾
  queryBatchAdvisorList: effect(effects.queryBatchAdvisorList, { forceFull: true }),
  // 新建修改的更新接口
  updateBindingFlow: effect(effects.updateBindingFlow, { forceFull: true }),
  // 走流程接口
  doApprove: effect(effects.doApprove, { forceFull: true }),
  // 清除数据
  clearProps: effect(effects.clearProps, { forceFull: true }),
  // 清除数据
  getButtonList: effect(effects.getButtonList, { forceFull: true }),
  // 验证提交数据
  validateData: effect(effects.validateData, { forceFull: true }),
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
    // 获取批量投顾
    batchAdvisorListData: PropTypes.object.isRequired,
    queryBatchAdvisorList: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 清除数据
    clearProps: PropTypes.func.isRequired,
    // 获取按钮组
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 验证提交数据
    validateResultData: PropTypes.object.isRequired,
    validateData: PropTypes.func.isRequired,
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

  componentDidUpdate(prevProps) {
    const { location: { query: prevQuery } } = prevProps;
    const {
      location: { query },
    } = this.props;
    const otherQuery = _.omit(query, ['currentId']);
    const otherPrevQuery = _.omit(prevQuery, ['currentId']);
    // query和prevQuery，不等时需要重新获取列表，但是首次进入页面获取列表在componentDidMount中调用过，所以不需要重复获取列表
    if (!_.isEqual(otherQuery, otherPrevQuery) && !_.isEmpty(prevQuery)) {
      const { pageNum, pageSize } = query;
      this.queryAppList(query, pageNum, pageSize);
    }
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
        const { detailInfo, queryEmpAppBindingList, getAttachmentList } = this.props;
        const { appId, attachment } = detailInfo;
        // 拿详情接口返回的appId去调详情表格数据
        queryEmpAppBindingList({
          appId,
          pageNum: 1,
          pageSize: 10,
        });
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
  }

  @autobind
  clearModal(name) {
    // 清除模态框组件
    this.setState({ [name]: false });
  }

  // 打开新建申请的弹出框
  @autobind
  @logPV({ pathname: '/modal/telephoneNumberManagerApply', title: '新建公务手机卡号申请' })
  openCreateModalBoard() {
    this.setState({
      isShowCreateModal: true,
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
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  @logable({ type: 'ViewItem', payload: { name: '公务手机卡号申请列表' } })
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
    this.props.getDetailInfo({ flowId }).then(() => {
      const { detailInfo, queryEmpAppBindingList, getAttachmentList } = this.props;
      const { appId, attachment } = detailInfo;
      // 拿详情接口返回的appId去调详情表格数据
      queryEmpAppBindingList({
        appId,
        pageNum: 1,
        pageSize: 10,
      });
      // 拿详情接口返回的attachmnet，调详情附件信息
      getAttachmentList({ attachment: attachment || '' });
    });
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
      batchAdvisorListData,
      queryBatchAdvisorList,
      updateBindingFlowAppId,
      updateBindingFlow,
      doApprove,
      clearProps,
      buttonList,
      getButtonList,
      validateResultData,
      validateData,
    } = this.props;
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="telephoneNumApplyPage"
        pageType={pageType}
        stateOptions={statusOptions}
        empInfo={empInfo}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
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

    const leftPanel = (
      <TelePhoneNumApplyList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail
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
          extraHeight={EXTRAHEIGHT}
          leftWidth={LEFT_PANEL_WIDTH}
          isSetMarginTop={false}
        />
        {
          isShowCreateModal
            ? (
              <CreateApply
                location={location}
                advisorListData={advisorListData}
                queryAdvisorList={queryAdvisorList}
                empAppBindingList={empAppBindingList}
                queryEmpAppBindingList={queryEmpAppBindingList}
                batchAdvisorListData={batchAdvisorListData}
                queryBatchAdvisorList={queryBatchAdvisorList}
                updateBindingFlowAppId={updateBindingFlowAppId}
                updateBindingFlow={updateBindingFlow}
                doApprove={doApprove}
                queryAppList={this.queryAppList}
                clearProps={clearProps}
                onEmitClearModal={this.clearModal}
                buttonList={buttonList}
                getButtonList={getButtonList}
                validateResultData={validateResultData}
                validateData={validateData}
              />
            )
            : null
        }
      </div>
    );
  }
}
