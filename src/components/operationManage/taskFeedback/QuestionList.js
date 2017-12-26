/*
 * @Description: 任务反馈问题列表
 * @Author: Wangjunjun
 * @path: src/components/taskFeedback/QuestionList.js
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Pagination, Modal, message } from 'antd';

import ListItem from './ListItem';
import EmptyData from '../EmptyData';

import styles from './questionList.less';

export default class QuestionList extends PureComponent {

  static propTypes = {
    replace: PropTypes.func.isRequired,
    queryQuestions: PropTypes.func.isRequired,
    questionInfoList: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    deleteSuccess: PropTypes.bool.isRequired,
  }

  @autobind
  handlePageChange(num, size) {
    const {
      queryQuestions,
      replace,
      location: { pathname },
    } = this.props;
    queryQuestions({
      pageNum: num,
      pageSize: size,
    });
    replace({
      pathname,
      query: {
        pageNum: num,
      },
    });
  }

  @autobind
  handleSizeChange(num, size) {
    const {
      queryQuestions,
      replace,
      location: { pathname },
    } = this.props;
    queryQuestions({
      pageNum: 1,
      pageSize: size,
    });
    replace({
      pathname,
      query: {
        pageNum: 1,
        pageSize: size,
      },
    });
  }

  /**
   * 确认删除选中的问题
   * 删除成功后重新获取问题列表
   */
  @autobind
  confirmDelete({ quesId }) {
    const { deleteQuestion, queryQuestions } = this.props;
    deleteQuestion({ quesId })
    .then(() => {
      const {
        deleteSuccess,
        location: {
          query: {
            pageNum = 1,
            pageSize = 10,
          },
        },
      } = this.props;
      if (deleteSuccess) {
        message.success('删除成功');
        queryQuestions({
          pageNum,
          pageSize,
        });
      }
    });
  }

  /**
   * 提供给子组建删除问题的回调方法
   * @param {*} obj 被删除的问题信息对象
   */
  @autobind
  deleteOneQuestion(obj) {
    Modal.confirm({
      title: '确认',
      content: `删除 ‘${obj.quesValue}’ 问题吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.confirmDelete(obj),
    });
  }

  // 渲染问题列表
  renderList() {
    const {
      questionInfoList: {
        list,
      },
    } = this.props;
    if (_.isEmpty(list)) {
      return <EmptyData />;
    }
    return _.map(list, o => (<ListItem
      key={o.quesId}
      item={o}
      deleteQuestion={this.deleteOneQuestion}
    />));
  }

  render() {
    const {
      questionInfoList: {
        page,
      },
      location: {
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    const curPageNum = pageNum || page.pageNum;
    const curPageSize = pageSize || page.pageSize;

    return (
      <div className={styles.listWrapper}>
        {this.renderList()}
        <div className={styles.pagination}>
          <Pagination
            total={+page.totalCount}
            curPageSize={+curPageNum}
            pageSize={+curPageSize}
            showSizeChanger
            showTotal={total => `共${total}条`}
            onChange={this.handlePageChange}
            onShowSizeChange={this.handleSizeChange}
          />
        </div>
      </div>
    );
  }
}
