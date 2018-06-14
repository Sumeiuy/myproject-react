/*
 * @Author: zhangjun
 * @Date: 2018-06-05 12:52:08
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-14 23:01:51
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

const { stockOptionApply, stockOptionApply: { statusOptions, pageType } } = config;

const effect = dva.generateEffect;
const effects = {
  // 左侧列表
  getList: 'app/getSeibleList',
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
};

const mapStateToProps = state => ({
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.stockOptionEvaluation.detailInfo,
  // 附件列表
  attachmentList: state.stockOptionEvaluation.attachmentList,
  // 本营业部客户
  busCustList: state.stockOptionEvaluation.busCustList,
  // 客户基本信息
  custInfo: state.stockOptionEvaluation.custInfo,
  // 客户类型下拉列表
  stockCustTypeMap: state.stockOptionEvaluation.stockCustTypeMap,
  // 申请类型下拉列表
  reqTypeMap: state.stockOptionEvaluation.reqTypeMap,
  // 开立期权市场类别下拉列表
  klqqsclbMap: state.stockOptionEvaluation.klqqsclbMap,
  // 业务受理营业部下拉列表
  busDivisionMap: state.stockOptionEvaluation.busDivisionMap,
  // 受理营业部变更
  acceptOrgData: state.stockOptionEvaluation.acceptOrgData,
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
    // 详情页面服务经理表格申请数据
    attachmentList: PropTypes.array,
    getAttachmentList: PropTypes.func.isRequired,
    // 本营业部客户
    busCustList: PropTypes.array.isRequired,
    getBusCustList: PropTypes.func.isRequired,
    // 客户基本信息
    custInfo: PropTypes.object.isRequired,
    getCustInfo: PropTypes.func.isRequired,
    // 客户类型下拉列表
    stockCustTypeMap: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeMap: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    klqqsclbMap: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionMap: PropTypes.array.isRequired,
    // 获取基本信息的多个select数据
    getSelectMap: PropTypes.func.isRequired,
    // 清除数据
    clearProps: PropTypes.func.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
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
    // 2.调用queryApplicationList接口
    this.queryAppList({ ...query, ...obj }, 1, query.pageSize);
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
    this.queryAppList(query, nextPage, currentPageSize);
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
    this.queryAppList(query, 1, changedPageSize);
  }

  // 关闭新建弹窗
  @autobind
  handleClearModal() {
    this.setState({ isShowCreateModal: false });
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

  // 申请新建按钮是否显示
  handleShowCreateBtn() {
    return permission.hasPermissionOfStockApplyCreate();
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
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      getSelectMap,
      clearProps,
      acceptOrgData,
      queryAcceptOrg,
    } = this.props;
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        page="stockOptionApplyPage"
        pageType={pageType}
        needSubType={false}
        stateOptions={statusOptions}
        empInfo={empInfo}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        isShowCreateBtn={this.handleShowCreateBtn}
        isUseOfCustomer
        needApplyTime
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
        data={detailInfo}
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
            empInfo={empInfo}
            busCustList={busCustList}
            getBusCustList={getBusCustList}
            clearProps={clearProps}
            onEmitClearModal={this.handleClearModal}
            custInfo={custInfo}
            getCustInfo={getCustInfo}
            stockCustTypeMap={stockCustTypeMap}
            reqTypeMap={reqTypeMap}
            klqqsclbMap={klqqsclbMap}
            busDivisionMap={busDivisionMap}
            getSelectMap={getSelectMap}
            acceptOrgData={acceptOrgData}
            queryAcceptOrg={queryAcceptOrg}
          />
          : null
        }
      </div>
    );
  }
}
