/**
 * @file premission/Home.js
 *  权限申请home页面
 * @author honggaunqging
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'antd';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/permission/Detail';
import PermissionList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { seibelConfig } from '../../config';
import ModifyPrivateClient from '../../components/permission/ModifyPrivateClient';
import CreatePrivateClient from '../../components/permission/CreatePrivateClient_';
import Barable from '../../decorators/selfBar';
import styles from './home.less';

const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const { permission, permission: { pageType, subType, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 右侧详情
  detailMessage: state.permission.detailMessage,
  // 左侧列表数据
  list: state.app.seibleList,
  // 服务人员列表
  searchServerPersonList: state.permission.searchServerPersonList,
  // 可申请客户
  canApplyCustList: state.app.canApplyCustList,
  // 查询已有服务任务列表
  hasServerPersonList: state.permission.hasServerPersonList,
  // 按照条件 查询下一审批人列表
  nextApproverList: state.permission.nextApproverList,
  // 获取btnlist
  bottonList: state.permission.bottonList,
  // 获取修改私密客户申请 的结果
  modifyCustApplication: state.permission.modifyCustApplication,
  // 监听 修改私密客户申请 过程
  addListenModify: state.loading.effects['permission/getModifyCustApplication'] || false,
  // 获取创建私密客户申请 的结果
  createCustApplication: state.permission.createCustApplication,
  // 监听 创建私密客户申请 过程
  addListenCreate: state.loading.effects['permission/getCreateCustApplication'] || false,
  // 列表loading
  seibelListLoading: state.loading.effects['app/getSeibleList'],
  //  获取子类型
  subTypeList: state.permission.subTypeList,
  // 员工基本信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
  // 获取左侧列表
  getPermissionList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取服务人员列表
  getServerPersonelList: fetchDataFunction(false, 'permission/getServerPersonelList'),
  // 搜索服务人员列表
  getSearchServerPersonList: fetchDataFunction(false, 'permission/getSearchServerPersonList'),
  // 获取可申请客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 查询已有服务任务列表
  getHasServerPersonList: fetchDataFunction(false, 'permission/getHasServerPersonList'),
  // 按照条件 查询下一审批人列表
  getNextApproverList: fetchDataFunction(false, 'permission/getNextApproverList'),
  // 获取btnlist
  getBottonList: fetchDataFunction(false, 'permission/getBottonList'),
  // 获取修改私密客户申请 的结果
  getModifyCustApplication: fetchDataFunction(false, 'permission/getModifyCustApplication'),
  // 获取创建私密客户申请 的结果
  getCreateCustApplication: fetchDataFunction(false, 'permission/getCreateCustApplication'),
  // 获取子类型
  getSubTypeList: fetchDataFunction(false, 'permission/getSubTypeList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    seibelListLoading: PropTypes.bool,
    getPermissionList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
    detailMessage: PropTypes.object,
    replace: PropTypes.func.isRequired,
    getCanApplyCustList: PropTypes.func.isRequired,
    searchServerPersonList: PropTypes.array.isRequired,
    getSearchServerPersonList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    hasServerPersonList: PropTypes.array.isRequired,
    getHasServerPersonList: PropTypes.func.isRequired,
    getNextApproverList: PropTypes.func.isRequired,
    nextApproverList: PropTypes.array.isRequired,
    bottonList: PropTypes.object.isRequired,
    getBottonList: PropTypes.func.isRequired,
    getModifyCustApplication: PropTypes.func.isRequired,
    modifyCustApplication: PropTypes.object.isRequired,
    addListenModify: PropTypes.bool.isRequired,
    getCreateCustApplication: PropTypes.func.isRequired,
    createCustApplication: PropTypes.object.isRequired,
    addListenCreate: PropTypes.bool.isRequired,
    getSubTypeList: PropTypes.func.isRequired,
    subTypeList: PropTypes.array.isRequired,
    empInfo: PropTypes.object,
  }

  static defaultProps = {
    detailMessage: {},
    empInfo: {},
    seibelListLoading: false,
  }

  static childContextTypes = {
    getCanApplyCustList: PropTypes.func.isRequired,
    getSearchServerPersonList: PropTypes.func.isRequired,
    getSubTypeList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      // 是否显示新建私密客户弹框
      isShowCreateModal: false,
      // 是否显示修改私密客户弹框
      isShowModifyModal: false,
      detailMessage: {},
    };
  }

  getChildContext() {
    return {
      getCanApplyCustList: (data) => {
        this.props.getCanApplyCustList({
          keyword: data,
          type: pageType,
        });
      },
      // 获取 查询服务人员列表
      getSearchServerPersonList: (data) => {
        this.props.getSearchServerPersonList({
          keyword: data,
          pageSize: 10,
          pageNum: 1,
        });
      },
      getSubTypeList: (data) => {
        this.props.getSubTypeList(data);
      },
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
      getPermissionList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getPermissionList({
      ...params,
      type: pageType,
    });
    this.setState({ detailMessage: this.props.detailMessage });
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: { query: nextQuery = EMPTY_OBJECT },
      location: { query: { currentId } },
    } = nextProps;
    const {
      location: { query: prevQuery = EMPTY_OBJECT },
      getPermissionList,
      location: { query: { currentId: prevCurrentId } },
      list,
     } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = constructSeibelPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getPermissionList({
          ...params,
          type: pageType,
        });
      }
    }
    const { seibelListLoading: prevSLL } = this.props;
    const { seibelListLoading: nextSLL } = nextProps;
    const applicationBaseInfoList = list.resultData;
    /* currentId变化重新请求 */
    if ((prevSLL && !nextSLL && !_.isEmpty(applicationBaseInfoList)) ||
    (currentId && (currentId !== prevCurrentId) && !_.isEmpty(applicationBaseInfoList))) {
      const { getDetailMessage } = this.props;
      getDetailMessage({
        id: currentId,
        type: pageType,
      });
      this.setState({ detailMessage: {} });
    }
    // 当redux 中 detailMessage的数据放生变化的时候 重新setState赋值
    if (this.props.detailMessage !== nextProps.detailMessage) {
      this.setState({ detailMessage: nextProps.detailMessage });
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
          pageNum: 1,
        },
      });
    }
  }

  get getDetailComponent() {
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    return <Detail {...this.props.detailMessage} />;
  }

  @autobind
  clearModal(name) {
    // 清除模态框组件
    this.setState({ [name]: false });
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {
    // 打开模态框 发送获取服务人员列表请求
    // this.props.getHasServerPersonList({ id: 101110 });
    this.setState({ isShowCreateModal: true });
  }

  @autobind
  showModifyModal() {
    this.setState(prevState => ({ isShowModifyModal: !prevState.isShowModifyModal }));
  }
  /**
   * 构造表格的列数据
   * 传参为icon的type
   */
  @autobind
  constructTableColumns() {
    return seibelColumns({
      pageName: 'permission',
      type: 'kehu1',
      pageData: permission,
    });
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  get detailComponent() {
    if (_.isEmpty(this.state.detailMessage)) {
      return null;
    }
    const {
      canApplyCustList,
      searchServerPersonList,
      nextApproverList,
      getNextApproverList,
      getBottonList,
      bottonList,
      getModifyCustApplication,
      modifyCustApplication,
      addListenModify,
      subTypeList,
      location,
    } = this.props;
    return (
      <Detail
        {...this.state.detailMessage}
        location={location}
        canApplyCustList={canApplyCustList}
        searchServerPersonList={searchServerPersonList}
        nextApproverList={nextApproverList}
        getNextApproverList={getNextApproverList}
        getBottonList={getBottonList}
        bottonList={bottonList}
        getModifyCustApplication={getModifyCustApplication}
        modifyCustApplication={modifyCustApplication}
        addListenModify={addListenModify}
        subTypeList={subTypeList}
        onEmitEvent={this.showModifyModal}
        onEmitClearModal={this.clearModal}
      />
    );
  }

  render() {
    const {
      list,
      location,
      replace,
      canApplyCustList,
      searchServerPersonList,
      hasServerPersonList,
      getHasServerPersonList,
      nextApproverList,
      getNextApproverList,
      getCreateCustApplication,
      createCustApplication,
      addListenCreate,
      subTypeList,
      getBottonList,
      bottonList,
      getModifyCustApplication,
      modifyCustApplication,
      addListenModify,
      empInfo: {
        empInfo = EMPTY_OBJECT,
      },
    } = this.props;

    const isEmpty = _.isEmpty(list.resultData);
    const { isShowCreateModal, isShowModifyModal } = this.state;
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="premissionPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.creatPermossionModal}
      />
    );

    const leftPanel = (
      <PermissionList
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
      />
    );

    const rightPanel = (
      <Col span="24" className={styles.rightSection}>
        {this.detailComponent}
      </Col>
    );

    return (
      <div className={styles.premissionbox}>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
        />
        {
          isShowCreateModal ?
            <CreatePrivateClient
              location={location}
              canApplyCustList={canApplyCustList}
              searchServerPersonList={searchServerPersonList}
              hasServerPersonList={hasServerPersonList}
              onEmitClearModal={this.clearModal}
              getHasServerPersonList={getHasServerPersonList}
              nextApproverList={nextApproverList}
              getNextApproverList={getNextApproverList}
              getCreateCustApplication={getCreateCustApplication}
              createCustApplication={createCustApplication}
              addListenCreate={addListenCreate}
              subTypeList={subTypeList}
              empInfo={empInfo}
            />
          :
            null
        }
        {
          isShowModifyModal ?
            <ModifyPrivateClient
              {...this.state.detailMessage}
              location={location}
              onEmitClearModal={this.clearModal}
              canApplyCustList={canApplyCustList}
              searchServerPersonList={searchServerPersonList}
              getBottonList={getBottonList}
              bottonList={bottonList}
              getModifyCustApplication={getModifyCustApplication}
              modifyCustApplication={modifyCustApplication}
              addListenModify={addListenModify}
              subTypeList={subTypeList}
            />
          : null
        }
      </div>
    );
  }
}
