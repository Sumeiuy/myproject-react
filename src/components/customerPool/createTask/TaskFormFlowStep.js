import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'dva/router';
import { Button, Mention } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import CreateTaskForm from './CreateTaskForm';
import TaskPreview from '../taskFlow/TaskPreview';
import { fspGlobal } from '../../../utils';
import styles from './taskFormFlowStep.less';


const { toString } = Mention;


@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    storedTaskFlowData: PropTypes.object,
    dict: PropTypes.object,
    saveTaskFlowData: PropTypes.func.isRequired,
    createTask: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dict: {},
    storedTaskFlowData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      currentStep: 0,
      previousData: {},
    };
  }

  @autobind
  handlePreviousStep() {
    const { storedTaskFlowData } = this.props;
    const { current } = this.state;
    this.setState({
      current: current - 1,
      previousData: storedTaskFlowData,
    });
  }

// @


  @autobind
  handleNextStep() {
    console.log(this.createTaskForm);
    const { current } = this.state;
    const { saveTaskFlowData } = this.props;
    this.createTaskForm.validateFields((err, values) => {
      if (!err) {
        saveTaskFlowData(values);
        this.setState({
          current: current + 1,
        });
      } else {
        console.warn('templetDesc-----', values.templetDesc);
      }
    });
  }

  @autobind
  closeTab() {
    // fspGlobal.closeRctTabById('RCT_FSP_TASK');
    console.log(this.createTaskForm.getFieldsValue());
    fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
  }

  // 自建任务提交
  @autobind
  handleSubmit() {
    const { storedTaskFlowData, createTask } = this.props;
    const params = storedTaskFlowData;
    params.templetDesc = toString(params.templetDesc); // eslint-disable-line
    params.triggerDate = moment(params.triggerDate).format('YYYY-MM-DD'); // eslint-disable-line
    params.closingDate = moment(params.closingDate).format('YYYY-MM-DD'); // eslint-disable-line
    createTask(params);
  }

  render() {
    const {
      current,
      previousData,
    } = this.state;

    const {
      dict,
      location,
    } = this.props;
    console.log('current----', current);
    const steps = [{
      title: '基本信息',
      content: <CreateTaskForm
        location={location}
        dict={dict}
        ref={ref => this.createTaskForm = ref}
        previousData={previousData}
      />,
    }, {
      title: '目标客户',
      content: <TaskPreview
        ref={ref => (this.taskPreviewRef = ref)}
      />,
    }];

    const stepsCount = _.size(steps);
    return (
      <div className={styles.taskFlowContainer}>

        <div className={styles.stepsContent}>
          {steps[current].content}
        </div>
        <div className={styles.stepsAction}>
          {
            current === 0
            &&
            <Button
              className={styles.cancelBtn}
              type="default"
              onClick={this.closeTab}
            >
              取消
            </Button>
          }
          {
            current > 0
            &&
            <Button
              className={styles.prevStepBtn}
              type="default"
              onClick={this.handlePreviousStep}
            >
              上一步
            </Button>
          }
          {
            current < stepsCount - 1
            &&
            <Button
              className={styles.handlePreviousStep}
              type="primary"
              onClick={this.handleNextStep}
            >下一步</Button>
          }
          {
            current === stepsCount - 1
            &&
            <Button
              className={styles.confirmBtn}
              type="primary"
              onClick={this.handleSubmit}
            >确认无误，提交</Button>
          }
        </div>
      </div>
    );
  }
}
