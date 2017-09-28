/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import CreateTaskSuccess from '../../components/customerPool/createTask/CreateTaskSuccess';
import CreateTaskFrom from '../../components/customerPool/createTask/CreateTaskForm';
import styles from './createTask.less';

const effects = {
  createTask: 'customerPool/createTask',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  dict: state.app.dict,
  createTaskResult: state.customerPool.createTaskResult,
});

const mapDispatchToProps = {
  createTask: fectchDataFunction(true, effects.createTask),
  goBack: routerRedux.goBack,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CreateTask extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array,
    dict: PropTypes.object,
    createTask: PropTypes.func.isRequired,
    createTaskResult: PropTypes.object,
    goBack: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: [],
    dict: {},
    createTaskResult: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { createTaskResult: preCreateTaskResult } = this.props;
    const { createTaskResult: nextcreateTaskResult } = nextProps;
    if (preCreateTaskResult !== nextcreateTaskResult) {
      this.handleCreateTaskSuccess(nextcreateTaskResult);
    }
  }

  @autobind
  handleCreateTaskSuccess(result) {
    const { createTaskResult } = result;
    if (!_.isEmpty(createTaskResult.code) && createTaskResult.code === '0') {
      this.setState({
        isSuccess: true,
      });
    }
  }

  @autobind
  handleCreateTask(value) {
    const { createTask } = this.props;
    console.log(value);
    createTask(value);
  }

  render() {
    const { dict, location, goBack } = this.props;
    const { isSuccess } = this.state;
    return (
      <div className={styles.taskBox}>
        {isSuccess ?
          <CreateTaskFrom
            goBack={goBack}
            location={location}
            dict={dict}
            createTask={this.handleCreateTask}
          /> :
          <CreateTaskSuccess
            successType={isSuccess}
          />
        }
      </div>
    );
  }
}
