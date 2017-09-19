import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Button } from 'antd';
import _ from 'lodash';
import GroupTable from '../../components/customerPool/groupManage/GroupTable';
import CustomerGroupSearch from '../../components/customerPool/groupManage/CustomerGroupListSearch';
import styles from './customerGroupManage.less';
import tableStyles from '../../components/customerPool/groupManage/groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  getGroupList: 'customerPool/getCustomerGroupList',
};

const fetchData = (type, loading) => query => ({
  type,
  payload: query || EMPTY_OBJECT,
  loading,
});

const mapStateToProps = state => ({
  customerGroupList: state.customerPool.customerGroupList, // 客户分组列表
});

const mapDispatchToProps = {
  getCustomerGroupList: fetchData(effects.getGroupList, true), // 获取客户分组列表
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CustomerGroupManage extends PureComponent {
  static propTypes = {
    customerGroupList: PropTypes.object,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getCustomerGroupList: PropTypes.func.isRequired,
  };

  static defaultProps = {
    customerGroupList: EMPTY_OBJECT,
  };

  componentWillMount() {
    const { getCustomerGroupList } = this.props;
    // 获取客户分组列表
    getCustomerGroupList({
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      replace,
      location: { query, query: { curPageNum }, pathname },
    } = this.props;
    const { customerGroupList: nextCustomerGroupList = EMPTY_OBJECT } = nextProps;
    const { page: nextPage = EMPTY_OBJECT } = nextCustomerGroupList;
    const { curPageNum: nextPageNum = 1, pageSize } = nextPage;
    // 初始化，url上加上页码，页目
    if (nextPageNum === 1 && _.isEmpty(curPageNum)) {
      replace({
        pathname,
        query: {
          ...query,
          curPageNum: nextPageNum,
          curPageSize: pageSize,
        },
      });
    }
  }

  /**
   * 页码改变事件，翻页事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页条目
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { getCustomerGroupList } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: nextPage,
        curPageSize: currentPageSize,
      },
    });
    getCustomerGroupList({
      curPageNum: nextPage,
      pageSize: currentPageSize,
    });
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    const { getCustomerGroupList } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        curPageNum: 1,
        curPageSize: changedPageSize,
      },
    });
    getCustomerGroupList({
      curPageNum: currentPageNum,
      pageSize: changedPageSize,
    });
  }

  @autobind
  // 编辑客户分组
  editCustomerGroup() {
    console.log('edit customer group list');
  }

  @autobind
  // 删除客户分组
  deleteCustomerGroup() {
    console.log('delete customer group list');
  }

  @autobind
  // 发起任务
  lanuchTask() {
    console.log('launch task');
  }

  @autobind
  handleGroupListSearch(value) {
    console.log('search', value);
  }

  @autobind
  handleAddGroup() {
    console.log('add customer group');
  }

  renderColumnTitle() {
    return [{
      key: 'name',
      value: '分组名称',
    },
    {
      key: 'description',
      value: '描述',
    },
    {
      key: 'userCount',
      value: '用户数',
    },
    {
      key: 'createTime',
      value: '创建时间',
    },
    {
      key: 'action',
      value: '操作',
    }];
  }

  renderActionSource() {
    return [{
      type: '编辑',
      handler: this.editCustomerGroup,
    },
    {
      type: '删除',
      handler: this.deleteCustomerGroup,
    },
    {
      type: '发起任务',
      handler: this.lanuchTask,
    }];
  }

  render() {
    const { customerGroupList = EMPTY_OBJECT } = this.props;

    const {
      resultData = EMPTY_LIST,
      page = EMPTY_OBJECT,
    } = customerGroupList;

    const { totalRecordNum = 1, curPageNum: pageNum, pageSize } = page;

    const { location: { query: { curPageNum, curPageSize } } } = this.props;

    const currentPageNum = curPageNum || pageNum;
    const currentPageSize = curPageSize || pageSize;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 构造operation
    const actionSource = this.renderActionSource();

    return (
      <div className={styles.groupPanelContainer}>
        <div className={styles.title}>我的客户分组</div>
        <div className={styles.operationRow}>
          <CustomerGroupSearch
            onSearch={this.handleGroupListSearch}
          />
          <div className={styles.addBtn} onClick={this.handleAddGroup}>
            <Button
              type="primary"
              icon="search"
            >
              新建
            </Button>
          </div>
        </div>
        <GroupTable
          pageData={{
            curPageNum: currentPageNum,
            curPageSize: currentPageSize,
            totalRecordNum,
          }}
          listData={resultData}
          onSizeChange={this.handleShowSizeChange}
          onPageChange={this.handlePageChange}
          tableClass={
            classnames({
              [tableStyles.groupTable]: true,
            })
          }
          titleColumn={titleColumn}
          actionSource={actionSource}
        />
      </div>
    );
  }
}
