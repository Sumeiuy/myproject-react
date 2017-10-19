import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Steps, message, Button } from 'antd';
// import { autobind } from 'core-decorators';
import _ from 'lodash';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import TaskOverview from '../../components/customerPool/taskFlow/TaskOverview';
import CreateTaskForm from '../../components/customerPool/createTask/CreateTaskForm';
// import Button from '../../components/common/Button';
import styles from './taskFlow.less';

const Step = Steps.Step;

// const steps = [{
//   title: '基本信息',
//   content: <CreateTaskForm />,
// }, {
//   title: '目标客户',
//   content: <PickTargetCustomer />,
// }, {
//   title: '提交',
//   content: <TaskOverview />,
// }];

// const stepsCount = _.size(steps);

const effects = {
  getLabelCirclePeople: 'customerPool/getLabelCirclePeople',
  getPeopleOfLabel: 'customerPool/getPeopleOfLabel',
};
const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

// const fetchData = (type, loading) => query => ({
//   type,
//   payload: query || EMPTY_OBJECT,
//   loading,
// });

const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
  circlePeopleData: state.customerPool.circlePeopleData,
  peopleOfLabelData: state.customerPool.peopleOfLabelData,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  getCirclePeople: fectchDataFunction(true, effects.getCirclePeople),
  getPeopleOfLabel: fectchDataFunction(true, effects.getPeopleOfLabel),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    getCirclePeople: PropTypes.func.isRequired,
    getPeopleOfLabel: PropTypes.func.isRequired,
    circlePeopleData: PropTypes.array.isRequired,
    peopleOfLabelData: PropTypes.array.isRequired,
    dict: PropTypes.object,
  };

  static defaultProps = {
    dict: {},
  };

  constructor(props) {
    console.warn('props--', props);
    const { dict, location } = props;
    super(props);
    this.state = {
      current: 0,
    };
    this.steps = [{
      title: '基本信息',
      content: <CreateTaskForm
        location={location}
        dict={dict}
      />,
    }, {
      title: '目标客户',
      content: <PickTargetCustomer />,
    }, {
      title: '提交',
      content: <TaskOverview />,
    }];
    this.stepsCount = _.size(this.steps);
  }
  componentWillMount() {
  }
  next() {
    const { current } = this.state;
    this.setState({
      current: current + 1,
    });
  }

  prev() {
    const { current } = this.state;
    this.setState({
      current: current - 1,
    });
  }

  render() {
    const { current } = this.state;
    return (
      <div className={styles.taskFlowContainer}>
        <Steps current={current} className={styles.stepsSection}>
          {_.map(this.steps, item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepsContent}>
          {this.steps[current].content}
        </div>
        <div className={styles.stepsAction}>
          {
            current === 0
            &&
            <Button className={styles.cancelBtn} type="default" onClick={() => { }}>
              取消
            </Button>
          }
          {
            current > 0
            &&
            <Button className={styles.prevStepBtn} type="default" onClick={() => this.prev()}>
              上一步
            </Button>
          }
          {
            current < this.stepsCount - 1
            &&
            <Button className={styles.nextStepBtn} type="primary" onClick={() => this.next()}>下一步</Button>
          }
          {
            current === this.stepsCount - 1
            &&
            <Button className={styles.confirmBtn} type="primary" onClick={() => message.success('Processing complete!')}>确认无误，提交</Button>
          }
        </div>
      </div>
    );
  }
}
