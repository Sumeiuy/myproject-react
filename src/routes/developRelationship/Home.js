/**
 * @Author: hongguangqing
 * @Description: 开发关系认定Home
 * @Date: 2018-01-03 16:47:24
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-01-10 22:27:23
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import CreateNewApprovalBoard from '../../components/developRelationship/CreateNewApprovalBoard';
import DevelopRelationshipList from '../../components/common/appList';
import ViewListRow from '../../components/developRelationship/ViewListRow';
import Detail from '../../components/developRelationship/Detail';
import appListTool from '../../components/common/appList/tool';
import { seibelConfig } from '../../config';
import seibelHelper from '../../helper/page/seibel';
import styles from './home.less';

const { developRelationship, developRelationship: { pageType, status } } = seibelConfig;

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.developRelationship.detailInfo,
  // 新建开发关系认定
  createDevelopRelationship: state.developRelationship.createDevelopRelationship,
  // 可申请开发关系认定的客户
  createCustList: state.app.canApplyCustList,
  // 可申请开发关系认定的客户是否可用
  isValidCust: state.developRelationship.isValidCust,
  // 原开发团队
  oldDevelopTeamList: state.developRelationship.oldDevelopTeamList,
  // 可添加新开发团队的服务经理列表
  addEmpList: state.developRelationship.addEmpList,
  // 获取按钮列表和下一步审批人
  buttonList: state.developRelationship.buttonList,
  // 监听 创建私密客户申请 过程
  addListenCreate: state.loading.effects['developRelationship/getCreateDevelopRelationship'] || false,
  // 员工基本信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取右侧详情信息
  getDetailInfo: fetchDataFunction(true, 'developRelationship/getDetailInfo'),
  // 新建接口
  getCreateDevelopRelationship: fetchDataFunction(true, 'developRelationship/getCreateDevelopRelationship'),
  // 获取可申请开发关系认定的客户
  getCreateCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 获取可申请开发关系认定的客户是否可用
  getIsValidCust: fetchDataFunction(false, 'developRelationship/getIsValidCust'),
  // 获取原开发团队
  getOldDevelopTeamList: fetchDataFunction(false, 'developRelationship/getOldDevelopTeamList'),
  // 获取可添加新开发团队服务经理的接口
  getAddEmpList: fetchDataFunction(false, 'developRelationship/getAddEmpList'),
  // 获取按钮列表和下一步审批人
  getButtonList: fetchDataFunction(false, 'developRelationship/getButtonList'),
  // 清除原开发团队列表
  clearPropsData: fetchDataFunction(false, 'developRelationship/clearPropsData'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Permission extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
    // 新建
    createDevelopRelationship: PropTypes.object.isRequired,
    getCreateDevelopRelationship: PropTypes.func.isRequired,
    addListenCreate: PropTypes.bool.isRequired,
    // 可申请开发关系认定的客户
    createCustList: PropTypes.array.isRequired,
    getCreateCustList: PropTypes.func.isRequired,
    // 可申请开发关系认定的客户是否可用
    isValidCust: PropTypes.object.isRequired,
    getIsValidCust: PropTypes.func.isRequired,
    // 原开发团队
    oldDevelopTeamList: PropTypes.array.isRequired,
    getOldDevelopTeamList: PropTypes.func.isRequired,
    // 可添加新开发团队的服务经理
    addEmpList: PropTypes.array.isRequired,
    getAddEmpList: PropTypes.func.isRequired,
    // 获取按钮列表和下一步审批人
    buttonList: PropTypes.object.isRequired,
    getButtonList: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 清除原开发团队的列表
    clearPropsData: PropTypes.func.isRequired,
  }

  static defaultProps = {
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
      this.props.getDetailInfo({ id: item.id });
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

  // 新建开发关系认定
  @autobind
  handleCreateDevelopRelationship(params) {
    const { location: { query } } = this.props;
    this.props.getCreateDevelopRelationship(params).then(
      () => this.queryAppList(query, query.pageNum, query.pageSize),
    );
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
    const { id } = record;
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
    this.props.getDetailInfo({ id });
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
        pageName="developRelationship"
        type="kehu1"
        pageData={developRelationship}
      />
    );
  }

  render() {
    const {
      replace,
      location,
      list,
      detailInfo,
      addListenCreate,
      createDevelopRelationship,
      empInfo: {
        empInfo = {},
      },
      createCustList,
      getCreateCustList,
      isValidCust,
      getIsValidCust,
      oldDevelopTeamList,
      getOldDevelopTeamList,
      addEmpList,
      getAddEmpList,
      buttonList,
      getButtonList,
      clearPropsData,
    } = this.props;
    if (_.isEmpty(detailInfo)) {
      return null;
    }
    const { isShowCreateModal } = this.state;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="developRelationshipPage"
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
      <DevelopRelationshipList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <Detail
        location={location}
        data={detailInfo}
      />
    );

    return (
      <div className={styles.developRelationshipbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="developRelationshipList"
        />
        {
          !isShowCreateModal ? null
          : (
            <CreateNewApprovalBoard
              location={location}
              empInfo={empInfo}
              onEmitClearModal={this.clearModal}
              addListenCreate={addListenCreate}
              createDevelopRelationship={createDevelopRelationship}
              getCreateDevelopRelationship={this.handleCreateDevelopRelationship}
              createCustList={createCustList}
              getCreateCustList={getCreateCustList}
              isValidCust={isValidCust}
              getIsValidCust={getIsValidCust}
              oldDevelopTeamList={oldDevelopTeamList}
              getOldDevelopTeamList={getOldDevelopTeamList}
              addEmpList={addEmpList}
              getAddEmpList={getAddEmpList}
              buttonList={buttonList}
              getButtonList={getButtonList}
              clearPropsData={clearPropsData}
            />
          )
        }
      </div>
    );
  }
}
