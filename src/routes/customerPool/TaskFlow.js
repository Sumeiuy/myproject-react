import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Steps, message, Button } from 'antd';
import _ from 'lodash';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
// import Button from '../../components/common/Button';
import styles from './taskFlow.less';

const Step = Steps.Step;

const steps = [{
  title: '基本信息',
  content: 'First-step',
}, {
  title: '目标客户',
  content: <PickTargetCustomer />,
}, {
  title: '提交',
  content: 'Last-step',
}];

const stepsCount = _.size(steps);

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// const effects = {
//   getHotPossibleWds: 'customerPool/getCustomerHotPossibleWds',
// };

// const fetchData = (type, loading) => query => ({
//   type,
//   payload: query || EMPTY_OBJECT,
//   loading,
// });

const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
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
          {_.map(steps, item => <Step key={item.title} title={item.title} />)}
        </Steps>
        <div className={styles.stepsContent}>
          {steps[current].content}
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
            <Button className={styles.prevStepBtn} type="primary" onClick={() => this.prev()}>
              上一步
            </Button>
          }
          {
            current < stepsCount - 1
            &&
            <Button className={styles.nextStepBtn} type="primary" onClick={() => this.next()}>下一步</Button>
          }
          {
            current === stepsCount - 1
            &&
            <Button className={styles.confirmBtn} type="primary" onClick={() => message.success('Processing complete!')}>确认无误，提交</Button>
          }
        </div>
      </div>
    );
  }
}
