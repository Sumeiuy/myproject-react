/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Mention } from 'antd';
// import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { fspGlobal } from '../../../utils';
import Button from '../../common/Button';
import CreateTaskForm from './CreateTaskForm';
import TaskFormFlowStep from './TaskFormFlowStep';
import styles from './createTaskFormFlow.less';


const { toString } = Mention;


export default class CreateTaskFormFlow extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    storedTaskFlowData: PropTypes.object.isRequired,
    saveTaskFlowData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      fromShow: true,
      successShow: false,
      showBtn: false,
      statusData: [],
      nextPage: false,
      defauleData: {},
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    console.log('location---', location);
    this.handleBtn(query);
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool


  @autobind
  handleBtn(query) {
    const entertype = query.entertype || '';
    console.warn('entertype--', entertype);
    switch (entertype) {
      case 'businessCustPool':
        this.setState({
          showBtn: false,
        });
        break;
      case 'searchCustPool':
        this.setState({
          showBtn: false,
        });
        break;
      case 'performanceIncrementCustPool':
        this.setState({
          showBtn: false,
        });
        break;
      case 'performanceBusinessOpenCustPool':
        this.setState({
          showBtn: false,
        });
        // {14日内开通的业务}
        break;
      case 'custGroupList':
        this.setState({
          showBtn: true,
        });
        break;
      default:
        this.setState({
          showBtn: false,
        });
        break;
    }
  }

  @autobind
  closeTab() {
    // fspGlobal.closeRctTabById('RCT_FSP_TASK');
    console.log(this.createTaskForm.getFieldsValue());
    fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
    // this.props.goBack();
  }

  @autobind
  handleNextPage() {
    this.setState({
      nextPage: true,
    });
  }

  // 自建任务提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { createTask } = this.props;
    const { custIdList, searchReq } = this.state;
    this.createTaskForm.validateFields((err, values) => {
      if (!err) {
        console.warn('templetDesc-----', values);
        values.closingDate = moment(values.closingDate).format('YYYY-MM-DD');// eslint-disable-line
        values.triggerDate = moment(values.triggerDate).format('YYYY-MM-DD');// eslint-disable-line
        values.templetDesc = toString(values.templetDesc);// eslint-disable-line
        const value = { ...values, custIdList, searchReq };
        createTask(value);
      } else {
        console.warn('templetDesc-----', values.templetDesc);
      }
    });
  }


  render() {
    const { dict, location, storedTaskFlowData, saveTaskFlowData, createTask } = this.props;
    const { showBtn } = this.state;
    // const { getFieldDecorator } = form;
    console.warn('showBtn', showBtn);
    // console.warn('statusData', statusData);
    return (
      <div className={styles.taskInner}>
        {showBtn ?
          <div className={styles.taskcontent}>
            <CreateTaskForm
              location={location}
              dict={dict}
              ref={ref => this.createTaskForm = ref}
            />
            <div
              className={
                    classnames({
                      [styles.hideTextArea]: !showBtn,
                      [styles.showTextArea]: showBtn,
                    })
                }
            >
              <div className={styles.task_btn}>
                <Button onClick={this.closeTab}>取消</Button>
                <Button type="primary" onClick={this.handleSubmit}>提交</Button>
              </div>
            </div>
          </div>
             :
          <TaskFormFlowStep
            location={location}
            dict={dict}
            saveTaskFlowData={saveTaskFlowData}
            storedTaskFlowData={storedTaskFlowData}
            createTask={createTask}
          />
          }
      </div>
    );
  }
}
