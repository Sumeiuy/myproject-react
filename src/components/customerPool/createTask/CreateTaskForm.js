/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import { isSightingScope } from '../helper';
import {
  RETURN_TASK_FROM_TODOLIST,
  RETURN_TASK_FROM_TASKLIST,
  PIE_ENTRY,
  PROGRESS_ENTRY,
  CUST_GROUP_LIST,
} from '../../../config/createTaskEntry';
import styles from './createTaskForm.less';
import TaskFormInfo from './TaskFormInfo';
import { productArguments } from './config';

const NOOP = _.noop;
// const EMPTY_OBJECT = {};

// 瞄准镜发起任务，需要替换的文本，用来构造mention的可选项列表
// \s*匹配0个或多个空格，尽量可能匹配多个空格
const sightLabelPattern = /该客户筛选自\s*$/;
// 正则匹配出'$持仓数量#0002#'
// eg: 客户当前持有601088，数量为$持仓数量#GP601088#，市值为$持仓市值#GP601088#。
// 匹配出 ["$持仓数量#GP601088#", "$持仓市值#GP601088#"]
const productPattern = /\$[\u4e00-\u9fa5]{1,}#[a-zA-Z0-9]{1,}#/g;

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
    taskBasicInfo: PropTypes.object,
    isShowErrorIntervalValue: PropTypes.bool.isRequired,
    isShowErrorStrategySuggestion: PropTypes.bool.isRequired,
    isShowErrorTaskName: PropTypes.bool.isRequired,
    templetDesc: PropTypes.string,
    isSightLabel: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: NOOP,
    previousData: {},
    isShowTitle: false,
    isShowErrorInfo: false,
    custCount: 0,
    missionType: '',
    taskBasicInfo: {},
    templetDesc: '',
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
      templetDesc,
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
        defaultMissionDesc: templetDesc || previousData.templetDesc,
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

  // 处理任务基本信息返回的任务执行方式格式
  // 后台返回的执行方式 => '必做任务'，字典是[{key: '', value: '必做'}]
  // 提交任务时传 key 值
  @autobind
  handleTaskType(key = '') {
    const { dict: { executeTypes } } = this.props;
    const keyWord = key.slice(0, 2) || '';
    const selectData = _.find(executeTypes, ['value', keyWord]) || {};
    return selectData.key;
  }

  @autobind
  handleInit(query = {}) {
    const { source = '', count = '0', missionDesc = '' } = query;
    const { dict: { custIndexPlaceHolders }, missionType, taskBasicInfo, templetDesc } = this.props;
    const { motDetailModel = {} } = taskBasicInfo;
    let defaultMissionName = '';
    let defaultMissionType = '';
    let defaultTaskSubType = '';
    let defaultExecutionType = '';
    let defaultServiceStrategySuggestion = '';
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
      case 'association':
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        defaultMissionDesc = this.defaultMissionDescFromProduct(query);
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
      case PROGRESS_ENTRY:
      case PIE_ENTRY:
        defaultMissionType = missionType || '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        break;
      case CUST_GROUP_LIST:
        defaultMissionName = '';
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        break;
      case RETURN_TASK_FROM_TODOLIST:
      case RETURN_TASK_FROM_TASKLIST:
        defaultMissionName = motDetailModel.eventName; // 任务名称
        defaultMissionType = motDetailModel.eventType; // 任务类型
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = this.handleTaskType(motDetailModel.exeType); // 执行方式
        defaultKey = 'UNRIGHTS';
        defaultServiceStrategySuggestion = motDetailModel.strategyDesc;
        // 任务提示
        defaultMissionDesc = motDetailModel.infoContent;
        defaultInitialValue = motDetailModel.timelyIntervalValue; // 有效期
        break;
      default:
        defaultMissionType = '请选择';
        defaultTaskSubType = '请选择'; // 任务子类型
        defaultExecutionType = '请选择';
        break;
    }
    // 如果url上存在missionDesc，那么将任务提示填值
    if (missionDesc) {
      defaultMissionDesc = decodeURIComponent(missionDesc);
    }
    // 如果props上存在任务提示，则作为默认值
    if (templetDesc) {
      defaultMissionDesc = templetDesc;
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

  // 返回持仓产品发起任务时，任务提示的文字
  defaultMissionDescFromProduct(query) {
    const condition = JSON.parse(decodeURIComponent(query.condition));
    const { labelName, primaryKey: [id] } = condition;
    let defaultMissionDesc = '';
    if (this.isFromProduct(query)) {
      defaultMissionDesc = `客户当前持有${labelName}，数量为 $持仓数量#${id}# ，市值为 $持仓市值#${id}# 。`;
    }
    return defaultMissionDesc;
  }

  // 判断是否从持仓产品进入的列表页发起任务的
  isFromProduct(query) {
    const condition = JSON.parse(decodeURIComponent(query.condition));
    const { searchTypeReq } = condition;
    return searchTypeReq === 'PRODUCT';
  }

  /**
   * 瞄准镜发起任务时，构造的mention suggestion
   * @param {*string} templetDesc 构造好的任务提示
   */
  @autobind
  renderMissionDescSuggestion(templetDesc) {
    const type = _.replace(templetDesc, sightLabelPattern, '');

    return {
      type,
      name: type,
      isSightingScope: true,
    };
  }

  @autobind
  renderProductDesc(value) {
    const { location: { query } } = this.props;
    const condition = JSON.parse(decodeURIComponent(query.condition));
    const { primaryKey: [id] } = condition;
    const list = value.match(productPattern);
    const newList = _.map(list, item => ({ type: item.slice(1), name: item.slice(1) }));
    const dateList = _.map(productArguments, item => ({ type: `${item}#${id}#`, name: `${item}#${id}#` }));
    return [...newList, ...dateList];
  }

  render() {
    const {
      dict,
      isShowTitle = false,
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      isShowErrorTaskSubType,
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
      custCount,
      templetDesc,
      location: { query },
      isSightLabel,
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
    const { missionDesc, source } = query || {};
    // 构造suggestion给mention
    let templetDescSuggestion = {};

    // 来自taskFlow标签圈人的瞄准镜标签
    if (templetDesc && isSightLabel) {
      templetDescSuggestion = this.renderMissionDescSuggestion(templetDesc);
    } else if (missionDesc && isSightingScope(source)) {
      // 来自搜索瞄准镜标签
      templetDescSuggestion = this.renderMissionDescSuggestion(decodeURIComponent(missionDesc));
    }

    const productDescSuggestions = this.isFromProduct(query) ?
      this.renderProductDesc(defaultMissionDesc) : [];
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
            isShowErrorInfo={isShowErrorInfo}
            isShowErrorExcuteType={isShowErrorExcuteType}
            isShowErrorTaskType={isShowErrorTaskType}
            isShowErrorIntervalValue={isShowErrorIntervalValue}
            isShowErrorStrategySuggestion={isShowErrorStrategySuggestion}
            isShowErrorTaskName={isShowErrorTaskName}
            defaultTaskSubType={defaultTaskSubType}
            isShowErrorTaskSubType={isShowErrorTaskSubType}
            templetDescSuggestion={templetDescSuggestion}
            wrappedComponentRef={ref => this.taskFormInfoRef = ref}
            productDescSuggestions={productDescSuggestions}
          />
        </div>
      </div>
    );
  }
}
