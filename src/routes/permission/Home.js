/**
 * @file premission/Home.js
 *  权限申请
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Col } from 'antd';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import PermissionHeader from '../../components/common/biz/SeibelHeader';
import Detail from '../../components/permission/Detail';
import PermissionList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import { permissionOptions } from '../../config';
import CreatePrivateClient from '../../components/permission/CreatePrivateClient';
import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
// 子类型
const subtypeOptions = permissionOptions.subtypeOptions;
// 状态
const stateOptions = permissionOptions.stateOptions;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 右侧详情
  detailMessage: state.permission.detailMessage,
  // 左侧列表数据
  list: state.permission.list,
  serverPersonelList: state.permission.serverPersonelList,
  // 拟稿人
  drafterList: state.permission.drafterList,
  // 部门
  empOrgTreeList: state.permission.empOrgTreeList,
  // 子类型
  childTypeList: state.permission.childTypeList,
  // 客户
  customerList: state.permission.customerList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
  // 获取左侧列表
  getPermissionList: fetchDataFunction(true, 'permission/getPermissionList'),
  // 获取服务人员列表
  getServerPersonelList: fetchDataFunction(true, 'permission/getServerPersonelList'),
  // 获取拟稿人
  getDrafterList: fetchDataFunction(true, 'permission/getDrafterList'),
  // 获取部门
  getEmpOrgTree: fetchDataFunction(true, 'permission/getEmpOrgTree'),
  // 获取子类型
  getChildTypeList: fetchDataFunction(true, 'permission/getChildTypeList'),
 // 获取客户列表
  getCustomerList: fetchDataFunction(true, 'permission/getCustomerList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    drafterList: PropTypes.array.isRequired,
    empOrgTreeList: PropTypes.object.isRequired,
    getPermissionList: PropTypes.func.isRequired,
    getDrafterList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
    detailMessage: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    getServerPersonelList: PropTypes.func.isRequired,
    getChildTypeList: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    serverPersonelList: PropTypes.array.isRequired,
    childTypeList: PropTypes.array.isRequired,
    customerList: PropTypes.array.isRequired,
  }

  static defaultProps = {

  }

  static childContextTypes = {
    getChildTypeList: PropTypes.func.isRequired,
    getCustomerList: PropTypes.func.isRequired,
    getServerPersonelList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      isShowModal: false,
    };
  }

  getChildContext() {
    return {
      // 获取 子类型
      getChildTypeList: (data) => {
        this.props.getChildTypeList({ id: data });
      },
      // 获取 客户列表
      getCustomerList: (data) => {
        this.props.getCustomerList({ code: data });
      },
      // 获取 服务人员列表
      getServerPersonelList: (data) => {
        this.props.getServerPersonelList({ code: data });
      },
    };
  }

  componentWillMount() {
    const { getPermissionList, location: { query, query: {
      pageNum,
      pageSize,
     } } } = this.props;
    // 默认筛选条件
    getPermissionList(constructSeibelPostBody(query, pageNum || 1, pageSize || 10));
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getPermissionList } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;

    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        getPermissionList(constructSeibelPostBody(
          nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        ));
      }
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace,
      list: { resultData = EMPTY_LIST } } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
        },
      });
    }

    if (_.isEmpty(resultData)) {
      this.setState({ // eslint-disable-line
        isEmpty: true,
      });
    } else {
      this.setState({ // eslint-disable-line
        isEmpty: false,
      });
    }
  }

  /**
   * 点击列表每条的时候对应请求详情
   */
  @autobind
  getListRowId(id) {
    const { getDetailMessage } = this.props;
    getDetailMessage({
      id,
    });
  }

  @autobind
  clearModal() {
    // 清除模态框组件
    console.log('模态框已经清楚');
    this.setState({ isShowModal: false });
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {
    // 打开模态框 发送获取服务人员列表请求
    this.props.getServerPersonelList({ id: 101110 });
    this.setState({ isShowModal: true });
  }

  @autobind
  toSearchDrafter(value) {
    // 查询拟稿人
    this.props.getDrafterList({
      empId: value,
    });
  }

  /**
   * 构造表格的列数据
   * 传参为icon的type
   */
  @autobind
  constructTableColumns() {
    return seibelColumns('save_blue');
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
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    return (
      <Detail
        {...this.props.detailMessage}
        customerList={this.props.customerList}
        childTypeList={this.props.childTypeList}
        serverPersonelList={this.props.serverPersonelList}
      />
    );
  }

  render() {
    const {
      list,
      location,
      replace,
      drafterList,
      empOrgTreeList,
      customerList,
      childTypeList,
      serverPersonelList,
    } = this.props;
    const { isEmpty } = this.state;
    const topPanel = (
      <PermissionHeader
        location={location}
        replace={replace}
        page="premissionPage"
        subtypeOptions={subtypeOptions}
        stateOptions={stateOptions}
        creatSeibelModal={this.creatPermossionModal}
        toSearchDrafter={this.toSearchDrafter}
        drafterList={drafterList}
        empOrgTreeList={empOrgTreeList}
      />
    );

    const leftPanel = (
      <PermissionList
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
        getListRowId={this.getListRowId}
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
          this.state.isShowModal ?
            <CreatePrivateClient
              customerList={customerList}
              childTypeList={childTypeList}
              serverPersonelList={serverPersonelList}
              onEmitClearModal={this.clearModal}
            />
          :
            null
        }
      </div>
    );
  }
}

