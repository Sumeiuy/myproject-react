/*
 * @Description: 任务反馈问题列表
 * @Author: Wangjunjun
 * @path: src/components/taskFeedback/QuestionList.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pagination, Modal, message } from 'antd';

import ListItem from './ListItem';

import styles from './questionList.less';

const QuestionList = (props) => {
  const {
    replace,
    queryQuestions,
    deleteQuestion,
    questionInfoList: {
      list,
      page,
    },
    location: {
      query: {
        pageNum,
        pageSize,
      },
      pathname,
    },
  } = props;

  const handlePageChange = (num, size) => {
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
  };

  const handleSizeChange = (num, size) => {
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
  };

  const confirmDelete = ({ quesId }) => {
    deleteQuestion({ quesId })
    .then((res) => {
      if (props.deleteSuccess) {
        message.success('删除成功');
      }
      console.log('props>>>>>>', res, props, props.deleteSuccess);
    });
  };

  const deleteOneQuestion = (obj) => {
    Modal.confirm({
      title: 'Confirm',
      content: `确认删除 ‘${obj.quesValue}’ 问题吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => confirmDelete(obj),
    });
  };

  if (_.isEmpty(list)) {
    return null;
  }

  const curPageNum = pageNum || page.pageNum;
  const curPageSize = pageSize || page.pageSize;

  return (
    <div className={styles.listWrapper}>
      {_.map(list, o => <ListItem key={o.quesId} item={o} deleteQuestion={deleteOneQuestion} />) }
      <div className={styles.pagination}>
        <Pagination
          total={+page.totalCount}
          curPageSize={+curPageNum}
          pageSize={+curPageSize}
          showSizeChanger
          showTotal={total => `共${total}条`}
          onChange={handlePageChange}
          onShowSizeChange={handleSizeChange}
        />
      </div>
    </div>
  );
};

QuestionList.propTypes = {
  replace: PropTypes.func.isRequired,
  queryQuestions: PropTypes.func.isRequired,
  questionInfoList: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  deleteSuccess: PropTypes.bool.isRequired,
};

export default QuestionList;
