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

import styles from './home.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const typeOptions = permissionOptions.typeOptions;
const stateOptions = permissionOptions.stateOptions;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  detailMessage: state.permission.detailMessage,
  list: state.permission.list,
  // 拟稿人
  drafterList: state.permission.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getDetailMessage: fetchDataFunction(true, 'permission/getDetailMessage'),
  // 获取左侧列表
  getPermissionList: fetchDataFunction(true, 'permission/getPermissionList'),
  // 获取拟稿人
  getDrafterList: fetchDataFunction(true, 'permission/getDrafterList'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Permission extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    drafterList: PropTypes.array.isRequired,
    getPermissionList: PropTypes.func.isRequired,
    getDrafterList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    detailMessage: PropTypes.object.isRequired,
    getDetailMessage: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
    };
  }

  componentWillMount() {
    this.props.getDetailMessage({ code: 111 });
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

  get getDetailComponent() {
    if (_.isEmpty(this.props.detailMessage)) {
      return null;
    }
    return <Detail {...this.props.detailMessage} />;
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

  /**
   * 构造表格的列数据
   * 传参为icon的type
   */
  @autobind
  constructTableColumns() {
    return seibelColumns('save_blue');
  }

  @autobind
  toSearchDrafter(value) {
    const { getDrafterList } = this.props;
    // 查询拟稿人
    getDrafterList({
      empId: value,
    });
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {
    console.log('新建');
  }

  render() {
    const { list, location, replace } = this.props;
    const { isEmpty } = this.state;
    const topPanel = (
      <PermissionHeader
        location={location}
        replace={replace}
        page="premissionPage"
        typeOptions={typeOptions}
        stateOptions={stateOptions}
        creatSeibelModal={this.creatPermossionModal}
        toSearchDrafter={this.toSearchDrafter}
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
        {this.getDetailComponent}
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
      </div>
    );
  }
}

