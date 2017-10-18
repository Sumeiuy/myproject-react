import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, routerRedux } from 'dva/router';
import { Steps, message, Button } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import PickTargetCustomer from '../../components/customerPool/taskFlow/PickTargetCustomer';
import TaskOverview from '../../components/customerPool/taskFlow/TaskOverview';
// import Button from '../../components/common/Button';
import styles from './taskFlow.less';

const Step = Steps.Step;

// const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const effects = {
  // 预览客户细分数据
  priviewCustFile: 'customerPool/priviewCustFile',
  // 存储客户细分数据
  saveCustSegmentData: 'customerPool/saveCustSegmentData',
  // 存储标签圈人数据
  saveLabelCustData: 'customerPool/saveLabelCustData',
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
  // 客户细分存储的数据
  storedCustSegmentData: state.customerPool.storedCustSegmentData,
  // 标签圈人储存的数据
  storedLabelCustData: state.customerPool.storedLabelCustData,
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  priviewCustFile: fetchData(effects.priviewCustFile, true),
  saveCustSegmentData: fetchData(effects.saveCustSegmentData, false),
  saveLabelCustData: fetchData(effects.saveLabelCustData, false),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskFlow extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    priviewCustFileData: PropTypes.object.isRequired,
    priviewCustFile: PropTypes.func.isRequired,
    saveCustSegmentData: PropTypes.func.isRequired,
    saveLabelCustData: PropTypes.func.isRequired,
    storedCustSegmentData: PropTypes.object.isRequired,
    storedLabelCustData: PropTypes.object.isRequired,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      storeWhichData: [],
      restoreWhichData: [],
    };
  }

  @autobind
  next() {
    const { current } = this.state;
    // 下一步时，存储当前数据
    this.setState({
      storeWhichData: [current],
    });
  }

  @autobind
  prev() {
    const { current } = this.state;
    // 恢复上一步数据
    this.setState({
      restoreWhichData: [current - 1],
    });

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
  handleStepUpdate({ type }) {
    const { current } = this.state;
    if (type === 'next') {
      this.setState({
        current: current + 1,
        storeWhichData: [],
        restoreWhichData: [],
      });
    }
  }

  render() {
    const { current, storeWhichData, restoreWhichData } = this.state;
    const {
      priviewCustFileData,
      storedCustSegmentData,
      saveCustSegmentData,
      replace,
      location,
    } = this.props;

    const steps = [{
      title: '基本信息',
      content: 'First-step',
    }, {
      title: '目标客户',
      content: <PickTargetCustomer
        location={location}
        replace={replace}
        onPreview={this.handlePreview}
        onStepUpdate={this.handleStepUpdate}
        storedData={storedCustSegmentData}
        storeData={saveCustSegmentData}
        priviewCustFileData={priviewCustFileData}
        // 1代表第一步，2代表第二步，3代表第三步
        isRestoreData={!_.isEmpty(restoreWhichData) && _.includes(restoreWhichData, 1)}
        isStoreData={!_.isEmpty(storeWhichData) && _.includes(storeWhichData, 1)}
      />,
    }, {
      title: '提交',
      content: <TaskOverview
        location={location}
        replace={replace}
        isRestoreData={!_.isEmpty(restoreWhichData) && _.includes(restoreWhichData, 2)}
        isStoreData={!_.isEmpty(storeWhichData) && _.includes(storeWhichData, 2)}
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
              onClick={this.prev}
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
              onClick={this.next}
            >下一步</Button>
          }
          {
            current === stepsCount - 1
            &&
            <Button
              className={styles.confirmBtn}
              type="primary"
              onClick={() => message.success('Processing complete!')}
            >确认无误，提交</Button>
          }
        </div>
      </div>
    );
  }
}
