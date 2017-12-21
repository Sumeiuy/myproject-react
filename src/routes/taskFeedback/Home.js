/*
 * @Description: 任务反馈
 * @Author: Wangjunjun
 * @path: src/routes/taskFeedback/Home
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';
import { autobind } from 'core-decorators';
import { connect } from 'react-redux';
import { Button } from 'antd';

import withRouter from '../../decorators/withRouter';
import choosePage from '../../components/operationManage/choosePage';
import QuestionList from '../../components/operationManage/taskFeedback/QuestionList';

import styles from './home.less';

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  queryQuestions: 'taskFeedback/queryQuestions',
  deleteQuestion: 'taskFeedback/deleteQuestion',
};

const mapStateToProps = state => ({
  questionInfoList: state.taskFeedback.questionInfoList,
  deleteSuccess: state.taskFeedback.deleteSuccess,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  queryQuestions: fetchDataFunction(true, effects.queryQuestions),
  deleteQuestion: fetchDataFunction(true, effects.deleteQuestion),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@choosePage
export default class TaskFeedback extends PureComponent {

  static propTypes = {
    questionInfoList: PropTypes.object.isRequired,
    queryQuestions: PropTypes.func.isRequired,
    deleteQuestion: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    deleteSuccess: PropTypes.bool.isRequired,
  }

  componentDidMount() {
    this.props.queryQuestions({
      pageNum: 1,
      pageSize: 10,
    });
  }

  // 添加问题
  @autobind
  addQuestion() {
    console.log('add a question');
  }

  render() {
    return (
      <div className={styles.taskFeedback}>
        <p className={styles.pageDescription}>
          任务反馈标准问题库，用于管理岗人员给服务经理创建任务时选择是否要服务经理对该任务做反馈，
          并为需要的反馈从此标准问题库中选择问题列表组成调查问卷。管理人员在此维护问题列表，点击相应问题可进行编辑。
        </p>
        <div className={styles.listHeader}>
          <Button
            className={styles.addQuestion}
            type="dashed"
            onClick={this.addQuestion}
          >
            +添加问题
          </Button>
        </div>
        <QuestionList
          {...this.props}
        />
      </div>
    );
  }
}

