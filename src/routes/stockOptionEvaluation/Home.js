/*
 * @Author: zhangjun
 * @Date: 2018-06-05 12:52:08
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-07 17:18:26
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { connect } from 'dva';

import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import StockOptionApplyList from '../../components/common/appList';
import config from '../../components/stockOptionEvaluation/config';
import ViewListRow from '../../components/stockOptionEvaluation/ViewListRow';
import Detail from '../../components/stockOptionEvaluation/ApplyDetail';
import CreateApply from '../../components/stockOptionEvaluation/CreateApply';
import seibelHelper from '../../helper/page/seibel';
import permission from '../../helper/permission';
import logable, { logPV } from '../../decorators/logable';

const {
  stockOptionApply,
  stockOptionApply: {
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
  getList: 'app/getNewSeibleList',
  // 右侧详情
  getDetailInfo: 'stockOptionEvaluation/getDetailInfo',
  // 附件列表
  getAttachmentList: 'stockOptionEvaluation/getAttachmentList',
  // 获取本营业部客户
  getBusCustList: 'stockOptionEvaluation/getBusCustList',
  // 获取客户基本信息
  getCustInfo: 'stockOptionEvaluation/getCustInfo',
  // 获取基本信息的多个select数据
  getSelectMap: 'stockOptionEvaluation/getSelectMap',
  // 清除数据
  clearProps: 'stockOptionEvaluation/clearProps',
  // 受理营业部变更
  queryAcceptOrg: 'stockOptionEvaluation/queryAcceptOrg',
  // 新建页面获取下一步按钮和审批人
  getCreateButtonList: 'stockOptionEvaluation/getCreateButtonList',
  // 验证提交数据结果
  validateResult: 'stockOptionEvaluation/validateResult',
  // 走流程接口
  doApprove: 'stockOptionEvaluation/doApprove',
  // 新建修改的更新接口
  updateBindingFlow: 'stockOptionEvaluation/updateBindingFlow',
};

const mapStateToProps = state => ({
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 左侧列表数据
  list: state.app.newSeibleList,
  // 右侧详情数据
  detailInfo: state.stockOptionEvaluation.detailInfo,
  // 附件列表
  attachmentList: state.stockOptionEvaluation.attachmentList,
  // 本营业部客户
  busCustList: state.stockOptionEvaluation.busCustList,
  // 客户基本信息
  custInfo: state.stockOptionEvaluation.custInfo,
  // 客户类型下拉列表
  stockCustTypeList: state.stockOptionEvaluation.stockCustTypeList,
  // 申请类型下拉列表
  reqTypeList: state.stockOptionEvaluation.reqTypeList,
  // 开立期权市场类别下拉列表
  optionMarketTypeList: state.stockOptionEvaluation.optionMarketTypeList,
  // 业务受理营业部下拉列表
  busDivisionList: state.stockOptionEvaluation.busDivisionList,
  // 受理营业部变更
  acceptOrgData: state.stockOptionEvaluation.acceptOrgData,
  // 新建页面获取下一步按钮和审批人
  createButtonListData: state.stockOptionEvaluation.createButtonListData,
  // 验证提交数据结果
  validateResultData: state.stockOptionEvaluation.validateResultData,
  // 新建修改的更新接口
  updateBindingFlowAppId: state.stockOptionEvaluation.updateBindingFlowAppId,
});

const mapDispatchToProps = {
  // 获取左侧列表
  getList: effect(effects.getList, { forceFull: true }),
  // 获取右侧详情信息
  getDetailInfo: effect(effects.getDetailInfo, { forceFull: true }),
  // 附件列表
  getAttachmentList: effect(effects.getAttachmentList, { forceFull: true }),
  // 获取本营业部客户
  getBusCustList: effect(effects.getBusCustList, { forceFull: true }),
   // 获取客户基本信息
  getCustInfo: effect(effects.getCustInfo, { forceFull: true }),
  // 获取基本信息的多个select数据
  getSelectMap: effect(effects.getSelectMap, { forceFull: true }),
  // 清除数据
  clearProps: effect(effects.clearProps, { forceFull: true }),
  // 受理营业部变更
  queryAcceptOrg: effect(effects.queryAcceptOrg, { forceFull: true }),
  // 新建页面获取下一步按钮和审批人
  getCreateButtonList: effect(effects.getCreateButtonList, { forceFull: true }),
  // 验证提交数据结果
  validateResult: effect(effects.validateResult, { forceFull: true }),
  // 走流程接口
  doApprove: effect(effects.doApprove, { forceFull: true }),
  // 新建修改的更新接口
  updateBindingFlow: effect(effects.updateBindingFlow, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class StockOptionApplication extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 右侧详情数据
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 附件数据
    attachmentList: PropTypes.array,
    getAttachmentList: PropTypes.func.isRequired,
    // 本营业部客户
    busCustList: PropTypes.array.isRequired,
    getBusCustList: PropTypes.func.isRequired,
    // 客户基本信息
    custInfo: PropTypes.object.isRequired,
    getCustInfo: PropTypes.func.isRequired,
    // 客户类型下拉列表
    stockCustTypeList: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeList: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    optionMarketTypeList: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionList: PropTypes.array.isRequired,
    // 获取基本信息的多个select数据
    getSelectMap: PropTypes.func.isRequired,
    // 清除数据
    clearProps: PropTypes.func.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
    // 新建页面获取下一步按钮和审批人
    createButtonListData: PropTypes.object.isRequired,
    getCreateButtonList: PropTypes.func.isRequired,
    // 验证提交数据结果
    validateResultData: PropTypes.object.isRequired,
    validateResult: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
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

  // 获取右侧列表
  @autobind
  getRightDetail() {
    const { replace } = this.context;
    const {
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
        item = _.filter(list.resultData, o => o.id.toString() === currentId)[0];
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
      this.props.getDetailInfo({
        id: item.id,
        flowId: item.flowId,
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


  // 点击列表每条的时候对应请求详情
  @autobind
  handleListRowClick(record, index) {
    const { id, flowId } = record;
    const { replace } = this.context;
    const {
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
    this.props.getDetailInfo({
      id,
      flowId,
    }).then(() => {
      const { detailInfo, getAttachmentList } = this.props;
      const { attachment } = detailInfo;
      // 拿详情接口返回的attachmnet，调详情附件信息
      getAttachmentList({ attachment: attachment || '' });
    });
  }

  // 新建申请
  @autobind
  @logPV({ pathname: '/modal/createStockApplyModal', title: '新建股票期权申请弹框' })
  openCreateModalBoard() {
    this.setState({ isShowCreateModal: true });
  }

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { replace } = this.context;
    const { location } = this.props;
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

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace } = this.context;
    const { location } = this.props;
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
    const { replace } = this.context;
    const { location } = this.props;
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

  // 关闭新建弹窗
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭股票期权申请弹框' } })
  handleClearModal() {
    this.setState({ isShowCreateModal: false });
  }

  // 申请新建按钮是否显示
  handleShowCreateBtn() {
    return permission.hasPermissionOfStockApplyCreate();
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
        pageName="stockOptionApply"
        type="shenqing"
        pageData={stockOptionApply}
      />
    );
  }

  render() {
    const { empInfo } = this.context;
    const {
      location,
      list,
      detailInfo,
      attachmentList,
      busCustList,
      getBusCustList,
      custInfo,
      getCustInfo,
      stockCustTypeList,
      optionMarketTypeList,
      reqTypeList,
      busDivisionList,
      getSelectMap,
      clearProps,
      acceptOrgData,
      queryAcceptOrg,
      createButtonListData,
      getCreateButtonList,
      validateResultData,
      validateResult,
      doApprove,
      updateBindingFlowAppId,
      updateBindingFlow,
    } = this.props;
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        page="stockOptionApplyPage"
        pageType={pageType}
        stateOptions={statusOptions}
        empInfo={empInfo}
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

    const leftPanel = (
      <StockOptionApplyList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail
        detailInfo={detailInfo}
        attachmentList={attachmentList}
      />
    );
    return (
      <div >
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
        { isShowCreateModal ?
          <CreateApply
            location={location}
            busCustList={busCustList}
            getBusCustList={getBusCustList}
            clearProps={clearProps}
            onEmitClearModal={this.handleClearModal}
            custInfo={custInfo}
            getCustInfo={getCustInfo}
            stockCustTypeList={stockCustTypeList}
            optionMarketTypeList={optionMarketTypeList}
            reqTypeList={reqTypeList}
            busDivisionList={busDivisionList}
            getSelectMap={getSelectMap}
            acceptOrgData={acceptOrgData}
            queryAcceptOrg={queryAcceptOrg}
            createButtonListData={createButtonListData}
            getCreateButtonList={getCreateButtonList}
            validateResultData={validateResultData}
            validateResult={validateResult}
            doApprove={doApprove}
            updateBindingFlowAppId={updateBindingFlowAppId}
            updateBindingFlow={updateBindingFlow}
            queryAppList={this.queryAppList}
          />
          : null
        }
      </div>
    );
  }
}
