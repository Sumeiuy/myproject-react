/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { Form } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import styles from './createTaskForm.less';
import TaskFormInfo from './TaskFormInfo';


// const create = Form.create;
// const { toString } = Mention;

@RestoreScrollTop
export default class CreateTaskForm extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    previousData: PropTypes.object,
    isShowTitle: PropTypes.bool,
    isShowErrorInfo: PropTypes.bool,
    isShowErrorTaskType: PropTypes.bool.isRequired,
    isShowErrorExcuteType: PropTypes.bool.isRequired,
    isShowErrorTaskSubType: PropTypes.bool.isRequired,
    custCount: PropTypes.number,
    missionType: PropTypes.string,
    isShowErrorIntervalValue: PropTypes.bool.isRequired,
    isShowErrorStrategySuggestion: PropTypes.bool.isRequired,
    isShowErrorTaskName: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => { },
    previousData: {},
    isShowTitle: false,
    isShowErrorInfo: false,
    custCount: 0,
    missionType: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      firstUserName: '',
      searchReq: null,
      custIdList: null,
      statusData: [],
    };
  }

  componentWillMount() {
    const {
      location: { query },
      dict: { custIndexPlaceHolders },
      previousData,
    } = this.props;
    const arr = _.map(custIndexPlaceHolders, item => ({
      name: item.value.slice(1),
      type: item.value.slice(1),
    }));
    this.setState({
      statusData: arr,
    });

    if (_.isEmpty(previousData)) {
      this.handleInit(query);
    } else {
      this.setState({
        defaultMissionName: previousData.taskName,
        defaultMissionType: previousData.taskType, // 'Mission'
        defaultTaskSubType: previousData.taskSubType, // ''
        defaultExecutionType: previousData.executionType,
        defaultMissionDesc: previousData.templetDesc,
        defaultInitialValue: previousData.timelyIntervalValue,
        defaultServiceStrategySuggestion: previousData.serviceStrategySuggestion,
      });
    }
  }

  @autobind
  getData() {
    return this.taskFormInfoRef.getData();
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool
  @autobind
  handleKey(key, custIdexPlaceHolders) {
    const values = _.filter(custIdexPlaceHolders, item => item.key === key);
    if (!_.isEmpty(values) && !_.isEmpty(values[0])) {
      return values[0].value;
    }
    return '';
  }

  @autobind
  handleInit(query = {}) {
    let source = '';
    let count = '0';
    if (!_.isEmpty(query)) {
      source = query.source;
      count = query.count;
    }
    const { dict: { custIndexPlaceHolders }, missionType } = this.props;
    let defaultMissionName = '';
    let defaultMissionType = '';
    let defaultTaskSubType = '';
    let defaultExecutionType = '';
    const defaultServiceStrategySuggestion = '';
    let defaultInitialValue = null;
    let defaultMissionDesc = '';
    let custIdList = null;
    let searchReq = null;
    let firstUserName = '';
    let defaultKey = '';
    if (query.ids) {
      custIdList = decodeURIComponent(query.ids).split(',');
    } else if (query.condition) {
      const param = JSON.parse(decodeURIComponent(query.condition));
      searchReq = {
        sortsReqList: param.sortsReqList,
        enterType: param.enterType,
      };
    } else if (query.name) {
      firstUserName = decodeURIComponent(query.name) || '';
      if (firstUserName.length > 10) {
        firstUserName = `${firstUserName.substring(0, 10)}...`;
      } else {
        firstUserName += '等';
      }
    }
    // 判断source不同值，从什么页面进来，给不同的默认值
    switch (source) {
      case 'business':
        defaultMissionName = '提醒客户办理已满足条件的业务'; // 任务名称
        defaultMissionType = '25'; // 任务类型
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = 'Mission'; // 执行方式
        defaultKey = 'UNRIGHTS';
        // 任务提示
        defaultMissionDesc = `用户已达到办理 ${this.handleKey(defaultKey, custIndexPlaceHolders)} 业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。`;
        defaultInitialValue = 8; // 有效期
        break;
      case 'search':
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        defaultInitialValue = 4;
        break;
      case 'tag':
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        defaultInitialValue = 4;
        break;
      case 'custIndicator':
        defaultMissionName = '新客户回访';
        defaultMissionType = '26';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = 'Chance';
        defaultKey = 'ACCOUNT_OPEN_DATE';
        defaultMissionDesc = `用户在 ${this.handleKey(defaultKey, custIndexPlaceHolders)} 开户，建议跟踪服务了解客户是否有问题需要解决。`;
        defaultInitialValue = 8;
        break;
      case 'numOfCustOpened':
        defaultMissionName = '业务开通回访';
        defaultMissionType = '26';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = 'Chance';
        defaultKey = 'RIGHTS';
        defaultMissionDesc = `用户在 2 周内办理了 ${this.handleKey(defaultKey, custIndexPlaceHolders)} 业务，建议跟踪服务了解客户是否有问题需要解决。`;
        defaultInitialValue = 8;
        // {14日内开通的业务}
        break;
      case 'managerView':
        defaultMissionType = missionType || '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        break;
      case 'custGroupList':
        defaultMissionName = '';
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        break;
      default:
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        break;
    }
    this.setState({
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultMissionDesc,
      defaultInitialValue,
      defaultServiceStrategySuggestion,
      firstUserName,
      count,
      custIdList,
      searchReq,
      defaultTaskSubType,
    });
  }


  render() {
    const {
      dict,
      // form,
      isShowTitle = false,
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      isShowErrorTaskSubType,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
      custCount,
    } = this.props;
    const { executeTypes, missionType = [] } = dict || {};
    // 拿到自建任务需要的missionType
    // descText为1
    const motMissionType = _.filter(missionType, item => item.descText === '1') || [];
    const {
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultMissionDesc,
      defaultInitialValue,
      defaultServiceStrategySuggestion,
      defaultTaskSubType,
      firstUserName,
      count,
      statusData,
    } = this.state;

    return (
      <div>
        {!isShowTitle ?
          <div className={styles.task_title}>
            为{firstUserName} <b>{custCount || count}</b> 位客户新建任务
          </div>
          :
          <div className={styles.task_title}>任务基本信息</div>
        }
        <div className={styles.task_from}>
          <TaskFormInfo
            defaultMissionName={defaultMissionName}
            defaultMissionType={defaultMissionType}
            defaultExecutionType={defaultExecutionType}
            defaultMissionDesc={defaultMissionDesc}
            defaultInitialValue={defaultInitialValue}
            defaultServiceStrategySuggestion={defaultServiceStrategySuggestion}
            users={statusData}
            taskTypes={motMissionType}
            executeTypes={executeTypes}
            /* form={form} */
            isShowErrorInfo={isShowErrorInfo}
            isShowErrorExcuteType={isShowErrorExcuteType}
            isShowErrorTaskType={isShowErrorTaskType}
            isShowErrorIntervalValue={isShowErrorIntervalValue}
            isShowErrorStrategySuggestion={isShowErrorStrategySuggestion}
            isShowErrorTaskName={isShowErrorTaskName}
            defaultTaskSubType={defaultTaskSubType}
            isShowErrorTaskSubType={isShowErrorTaskSubType}
            wrappedComponentRef={ref => this.taskFormInfoRef = ref}
          />
        </div>
      </div>
    );
  }
}
