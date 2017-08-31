/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import CreateTaskSuccess from '../../components/customerPool/CreateTaskSuccess';
import CreateTaskFrom from '../../components/customerPool/CreateTaskForm';
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
  dict: state.customerPool.dict,
  createTaskResult: state.customerPool.createTaskResult,
});

const mapDispatchToProps = {
  createTask: fectchDataFunction(true, effects.createTask),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class CreateTask extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array,
    dict: PropTypes.object,
    createTask: PropTypes.func.isRequired,
    createTaskResult: PropTypes.object,
  }

  static defaultProps = {
    data: [],
    dict: {},
    createTaskResult: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      startFormat: 'YYYY/MM/DD(E)',
      endFormat: 'YYYY/MM/DD(E)',
      fromShow: true,
      successShow: false,
      firstUserName: '',
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
    const { code } = result;
    if (code === '0') {
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
    const { dict, location } = this.props;
    return (
      <div className={styles.taskBox}>
        <CreateTaskFrom
          location={location}
          dict={dict}
          createTask={this.handleCreateTask}
        />
        <CreateTaskSuccess />
      </div>
    );
  }
}
