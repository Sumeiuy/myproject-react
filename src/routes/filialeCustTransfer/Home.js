/**
 * @Author: hongguangqing
 * @Description: 分公司客户人工划转Home页面
 * @Date: 2018-01-29 13:25:30
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-31 10:14:19
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
import CreateFilialeCustTransfer from '../../components/filialeCustTransfer/CreateFilialeCustTransfer';
import FilialeCustTransferList from '../../components/common/appList';
import ViewListRow from '../../components/filialeCustTransfer/ViewListRow';
import Detail from '../../components/filialeCustTransfer/Detail';
import appListTool from '../../components/common/appList/tool';
import { seibelConfig } from '../../config';
import seibelHelper from '../../helper/page/seibel';

const { filialeCustTransfer, filialeCustTransfer: { pageType, status } } = seibelConfig;

const fetchDataFunction = (globalLoading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
  forceFull,
});

const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.filialeCustTransfer.detailInfo,
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 客户列表
  custList: state.filialeCustTransfer.custList,
  // 服务经理数据
  managerData: state.filialeCustTransfer.managerData,
  // 新服务经理列表
  newManagerList: state.filialeCustTransfer.newManagerList,
  // 组织机构树
  custRangeList: state.customerPool.custRange,
  // 批量划转的数据
  customerAssignImport: state.filialeCustTransfer.customerAssignImport,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: fetchDataFunction(true, 'app/getSeibleList', true),
  // 获取右侧详情信息
  getDetailInfo: fetchDataFunction(true, 'filialeCustTransfer/getDetailInfo', true),
  // 获取客户列表
  getCustList: fetchDataFunction(false, 'filialeCustTransfer/getCustList'),
  // 获取原服务经理
  getOldManager: fetchDataFunction(false, 'filialeCustTransfer/getOldManager'),
  // 获取新服务经理
  getNewManagerList: fetchDataFunction(false, 'filialeCustTransfer/getNewManagerList'),
  // 选择新服务经理
  selectNewManager: fetchDataFunction(false, 'filialeCustTransfer/selectNewManager'),
  // 提交保存
  saveChange: fetchDataFunction(true, 'filialeCustTransfer/saveChange'),
  // 提交成功后清除上一次查询的数据
  emptyQueryData: fetchDataFunction(false, 'filialeCustTransfer/emptyQueryData'),
  // 获取批量划转的客户数据
  queryCustomerAssignImport: fetchDataFunction(true, 'filialeCustTransfer/queryCustomerAssignImport', true),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class FilialeCustTransfer extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 获取客户列表
    getCustList: PropTypes.func.isRequired,
    custList: PropTypes.array,
    // 获取原服务经理
    getOldManager: PropTypes.func.isRequired,
    // 获取新服务经理
    getNewManagerList: PropTypes.func.isRequired,
    newManagerList: PropTypes.array,
    // 选择新的服务经理
    selectNewManager: PropTypes.func.isRequired,
    // 服务经理数据
    managerData: PropTypes.array,
    // 提交保存
    saveChange: PropTypes.func.isRequired,
    // 提交成功后清除上一次查询的数据
    emptyQueryData: PropTypes.func.isRequired,
    // 组织机构树
    custRangeList: PropTypes.array.isRequired,
    // 批量划转的接口
    queryCustomerAssignImport: PropTypes.func,
    // 批量划转的数据
    customerAssignImport: PropTypes.object,
  }

  static defaultProps = {
    custList: [],
    managerData: [],
    newManagerList: [],
    queryCustomerAssignImport: _.noop,
    customerAssignImport: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      isShowCreateModal: true,
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
      this.props.getDetailInfo({ flowId: item.flowId });
    }
  }


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
        pageName="filialeCustTransfer"
        type="kehu1"
        pageData={filialeCustTransfer}
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
      getCustList,
      custList,
      // 获取原服务经理
      getOldManager,
      // 获取新服务经理
      getNewManagerList,
      newManagerList,
      // 选择新的服务经理
      selectNewManager,
      // 服务经理数据
      managerData,
      // 提交保存
      saveChange,
      // 提交成功后清除上一次查询的数据
      emptyQueryData,
      // 组织机构树
      custRangeList,
      // 批量划转
      queryCustomerAssignImport,
      customerAssignImport,
    } = this.props;
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="filialeCustTransferPage"
        pageType={pageType}
        needSubType={false}
        stateOptions={status}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: page.totalCount || 0,
      pageSize: parseInt(pageSize, 10),
      defaultPageSize: 10,
      onChange: this.handlePageNumberChange,
      showTotal: appListTool.showTotal,
      showSizeChanger: true,
      onShowSizeChange: this.handlePageSizeChange,
      pageSizeOptions: appListTool.constructPageSizeOptions(page.totalCount || 0),
    };

    const leftPanel = (
      <FilialeCustTransferList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail data={detailInfo} />
    );

    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="FilialeCustTransferList"
        />
        {
          !isShowCreateModal ? null
          : (
            <CreateFilialeCustTransfer
              location={location}
              empInfo={empInfo}
              onEmitClearModal={this.clearModal}
              getCustList={getCustList}
              custList={custList}
              getOldManager={getOldManager}
              getNewManagerList={getNewManagerList}
              newManagerList={newManagerList}
              selectNewManager={selectNewManager}
              managerData={managerData}
              saveChange={saveChange}
              emptyQueryData={emptyQueryData}
              custRangeList={custRangeList}
              queryCustomerAssignImport={queryCustomerAssignImport}
              customerAssignImport={customerAssignImport}
            />
          )
        }
      </div>
    );
  }
}
