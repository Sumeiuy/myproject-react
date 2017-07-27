/**
 * @file customerPool/ToDo.js
 *  目标客户池 待办流程列表页
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { Input, Row, Col } from 'antd';

import ToDoList from '../../components/customerPool/ToDoList';

import styles from './todo.less';

const mapStateToProps = state => ({
  data: state.customerPool.todolist,
  page: state.customerPool.todolistPage,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getToDoList: query => ({
    type: 'customerPool/getToDoList',
    payload: query,
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ToDo extends PureComponent {

  static propTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getToDoList: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    page: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { getToDoList, location: { query: { currentPage } } } = this.props;
    getToDoList({
      currentPage: currentPage || 1,
    });
  }

  @autobind
  onSearch(value) {
    const { getToDoList, replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        keyword: value,
        currentPage: 1,
        pageSize: 10,
      },
    });
    getToDoList({
      ...query,
      keyword: value,
      currentPage: 1,
      pageSize: 10,
    });
  }

  @autobind
  handleTableChange(options) {
    const { getToDoList, replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        ...options,
      },
    });
    getToDoList({
      ...query,
      ...options,
    });
  }

  render() {
    const { data, page } = this.props;
    return (
      <div className={styles.todo}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            <p className="total-num">找到待办流程任务<em>&nbsp;{page.totalRecordNum}&nbsp;</em>个</p>
          </Col>
          <Col span={12}>
            <div className="search-box">
              <Input.Search
                className="search-input"
                placeholder="请输入任务名称"
                onSearch={this.onSearch}
              />
            </div>
          </Col>
        </Row>
        <ToDoList
          className="todoList"
          data={data}
          page={page}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
