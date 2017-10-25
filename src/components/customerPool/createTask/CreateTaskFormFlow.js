/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Mention, message } from 'antd';
import _ from 'lodash';
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
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    storedTaskFlowData: PropTypes.object.isRequired,
    saveTaskFlowData: PropTypes.func.isRequired,
    approvalList: PropTypes.array.isRequired,
    getApprovalList: PropTypes.func.isRequired,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      showBtn: false,
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    console.log('location---', location);
    this.setState({
      showBtn: _.includes(['custGroupList'], query.entertype),
    });
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool


  @autobind
  closeTab() {
    // fspGlobal.closeRctTabById('RCT_FSP_TASK');
    console.log(this.createTaskForm.getFieldsValue());
    fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
  }

  @autobind
  parseQuery() {
    const { location: { query: { ids, condition } } } = this.props;
    let custCondition = {};
    let custIdList = null;
    if (!_.isEmpty(ids)) {
      custIdList = decodeURIComponent(ids).split(',');
    } else {
      custCondition = JSON.parse(decodeURIComponent(condition));
    }
    return {
      custIdList,
      custCondition,
    };
  }

  // 自建任务提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { createTask, location: { query } } = this.props;
    const { groupId } = query;
    // const { custIdList, searchReq } = this.state;
    this.createTaskForm.validateFields((err, values) => {
      if (!err) {
        console.warn('templetDesc-----', values);
        values.closingDate = moment(values.closingDate).format('YYYY-MM-DD');// eslint-disable-line
        values.triggerDate = moment(values.triggerDate).format('YYYY-MM-DD');// eslint-disable-line
        values.templetDesc = toString(values.templetDesc);// eslint-disable-line
        const value = { ...values, groupId };
        createTask(value);
      } else {
        console.warn('templetDesc-----', values.templetDesc);
        message.error('请填写任务基本信息');
      }
    });
  }


  render() {
    const {
      dict,
      location,
      storedTaskFlowData,
      saveTaskFlowData,
      createTask,
      getApprovalList,
      approvalList } = this.props;
    const { showBtn } = this.state;
    // console.warn('showBtn', showBtn);
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
            approvalList={approvalList}
            getApprovalList={getApprovalList}
            parseQuery={this.parseQuery}
          />
          }
      </div>
    );
  }
}
