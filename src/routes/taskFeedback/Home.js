/*
 * @Description: 任务反馈
 * @Author: Wangjunjun
 * @path: src/routes/taskFeedback/Home
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withRouter from '../../decorators/withRouter';

import styles from './home.less';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  queryQuestions: 'taskFeedback/queryQuestions',
};

const mapStateToProps = state => ({
  questionInfoList: state.taskFeedback.questionInfoList,
});

const mapDispatchToProps = {
  queryQuestions: fetchDataFunction(true, effects.queryQuestions),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFeedback extends PureComponent {

  static propTypes = {}

  static defaultProps = {}

  componentDidMount() {
    this.props.queryQuestions({
      pageNum: 1,
      pageSize: 5,
    });
  }

  render() {
    return (
      <div className={styles.taskFeedback}>
        TaskFeedback
      </div>
    );
  }
}

