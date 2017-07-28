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
  data: state.customerPool.todolistRecord,
  todoPage: state.customerPool.todoPage,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getToDoList: query => ({
    type: 'customerPool/getToDoList',
    payload: query,
  }),
  search: query => ({
    type: 'customerPool/search',
    payload: query,
  }),
  pageChange: query => ({
    type: 'customerPool/pageChange',
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
    search: PropTypes.func.isRequired,
    todoPage: PropTypes.object.isRequired,
    pageChange: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getToDoList();
  }

  @autobind
  onSearch(value) {
    this.props.search(value);
  }

  @autobind
  pageChange(obj) {
    this.props.pageChange(obj);
  }

  render() {
    const { data, todoPage } = this.props;
    return (
      <div className={styles.todo}>
        <Row type="flex" justify="space-between" align="middle">
          <Col span={12}>
            <p className="total-num">找到待办流程任务<em>&nbsp;{data.length}&nbsp;</em>个</p>
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
          todoPage={todoPage}
          onChange={this.pageChange}
        />
      </div>
    );
  }
}
