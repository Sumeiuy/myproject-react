import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Steps, message, Button } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import events from 'events';
import { autobind } from 'core-decorators';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import TaskPreview from '../../components/customerPool/taskFlow/TaskPreview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
// import Button from '../../components/common/Button';
import styles from './taskFlow.less';

const Step = Steps.Step;

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  // 预览客户细分数据
  priviewCustFile: 'customerPool/priviewCustFile',
  getCirclePeople: 'customerPool/getCirclePeople',
  getPeopleOfLabel: 'customerPool/getPeopleOfLabel',
  submitTaskFlow: 'customerPool/submitTaskFlow',
};

const fetchData = (type, loading) => query => ({
  type,
  payload: query || EMPTY_OBJECT,
  loading,
});

const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
  // 客户细分导入数据
  priviewCustFileData: state.customerPool.priviewCustFileData,
  // 储存的数据
  storedTaskFlowData: state.customerPool.storedTaskFlowData,
  circlePeopleData: state.customerPool.circlePeopleData,
  peopleOfLabelData: state.customerPool.peopleOfLabelData,
  currentTab: state.customerPool.currentTab,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 存储任务流程数据
  saveTaskFlowData: query => ({
    type: 'customerPool/saveTaskFlowData',
    payload: query,
  }),
  // 清除任务流程数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
  // 保存选中的tab
  saveCurrentTab: query => ({
    type: 'customerPool/saveCurrentTab',
    payload: query,
  }),
  priviewCustFile: fetchData(effects.priviewCustFile, true),
  getCirclePeople: fetchData(true, effects.getCirclePeople),
  getPeopleOfLabel: fetchData(true, effects.getPeopleOfLabel),
  submitTaskFlow: fetchData(true, effects.submitTaskFlow),
};

const EventEmitter = events;
// new一个事件监听，用来发射缓存数据事件
const saveDataEmitter = new EventEmitter();

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    priviewCustFile: PropTypes.func.isRequired,
    getCirclePeople: PropTypes.func.isRequired,
    getPeopleOfLabel: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.array.isRequired,
    dict: PropTypes.object,
    saveCurrentTab: PropTypes.func.isRequired,
    currentTab: PropTypes.string.isRequired,
    storedTaskFlowData: PropTypes.object.isRequired,
    saveTaskFlowData: PropTypes.func.isRequired,
    clearTaskFlowData: PropTypes.func.isRequired,
    submitTaskFlow: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dict: {},
  };

  constructor(props) {
    console.warn('props--', props);
    super(props);
    this.state = {
      current: 0,
      currentStep: 0,
    };
  }

  @autobind
  handleNextStep() {
    // 下一步
    const { current } = this.state;
    if (current === 0) {
      saveDataEmitter.emit('saveTaskFormData');
    } else if (current === 1) {
      saveDataEmitter.emit('saveSelectCustData');
    }
  }

  @autobind
  handlePreviousStep() {
    const { current } = this.state;
    // 上一步
    this.setState({
      current: current - 1,
    });
  }

  @autobind
  handlePreview({ uploadKey, pageNum, pageSize }) {
    console.log(uploadKey);
    if (!uploadKey) {
      message.error('请先上传文件');
      return;
    }
    const { priviewCustFile } = this.props;
    // 预览数据
    priviewCustFile({
      filename: uploadKey,
      pageNum,
      pageSize,
    });
  }

  @autobind
  handleStepUpdate() {
    const { current } = this.state;
    this.setState({
      current: current + 1,
    });
  }

  @autobind
  handleSubmitTaskFlow() {
    const { clearTaskFlowData, submitTaskFlow, storedTaskFlowData } = this.props;
    submitTaskFlow({
      storedTaskFlowData,
    });
    clearTaskFlowData();
  }

  render() {
    const {
      current,
    } = this.state;

    const {
      dict,
      priviewCustFileData,
      currentTab,
      saveCurrentTab,
      storedTaskFlowData,
      saveTaskFlowData,
      getCirclePeople,
      getPeopleOfLabel,
      peopleOfLabelData,
      circlePeopleData,
    } = this.props;

    const steps = [{
      title: '基本信息',
      content: <CreateTaskForm
        dict={dict}
        location={location}
        storedTaskFlowData={storedTaskFlowData}
        saveTaskFlowData={saveTaskFlowData}
        onStepUpdate={this.handleStepUpdate}
        saveDataEmitter={saveDataEmitter}
      />,
    }, {
      title: '目标客户',
      content: <PickTargetCustomer
        currentTab={currentTab}
        saveCurrentTab={saveCurrentTab}
        onPreview={this.handlePreview}
        priviewCustFileData={priviewCustFileData}
        storedTaskFlowData={storedTaskFlowData}
        saveTaskFlowData={saveTaskFlowData}
        getCirclePeople={getCirclePeople}
        circlePeopleData={circlePeopleData}
        getPeopleOfLabel={getPeopleOfLabel}
        peopleOfLabelData={peopleOfLabelData}
        onStepUpdate={this.handleStepUpdate}
        saveDataEmitter={saveDataEmitter}
      />,
    }, {
      title: '提交',
      content: <TaskPreview
        storedTaskFlowData={storedTaskFlowData}
      />,
    }];

    const stepsCount = _.size(steps);

    return (
      <div className={styles.taskFlowContainer}>
        <Steps current={current} className={styles.stepsSection}>
          {_.map(steps, item => <Step key={item.title} title={item.title} />)}
        </Steps>
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
              onClick={() => { }}
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
              className={styles.nextStepBtn}
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
              onClick={this.handleSubmitTaskFlow}
            >确认无误，提交</Button>
          }
        </div>
      </div>
    );
  }
}
