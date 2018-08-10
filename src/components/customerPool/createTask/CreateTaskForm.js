/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { stateFromHTML } from 'draft-js-import-html';
import { Mention } from 'antd';
import RestoreScrollTop from '../../../decorators/restoreScrollTop';
import { isSightingScope } from '../helper';
import {
  RETURN_TASK_FROM_TODOLIST,
  RETURN_TASK_FROM_TASKLIST,
  CUST_GROUP_LIST,
  PIE_ENTRY,
  PROGRESS_ENTRY,
  BUSINESS_ENTRY,
  SEARCH_ENTRY,
  PRODUCT_POTENTIAL_TARGET_CUST_ENTRY,
  SECURITIES_PRODUCTS_ENTRY,
  ORDER_COMBINATION_ENTRY,
  EXTERNAL_ENTRY,
  ASSOCIATION_ENTRY,
  TAG_ENTRY,
  CUSTINDICATOR_ENTRY,
  NUMOFCUSTOPENED_ENTRY,
  TASK_CUST_SCOPE_ENTRY,
  SOURCE_CUSTLIST,
  SOURCE_LABELMANAGEMENT,
} from '../../../config/createTaskEntry';
import styles from './createTaskForm.less';
import TaskFormInfo from './TaskFormInfo';
import { PRODUCT_ARGUMENTS } from './config';
import { getLabelInfo } from '../../../helper/page/customerPool';
import { url } from '../../../helper';
import { getFilterInfo } from './help';

const { toString } = Mention;

const NOOP = _.noop;

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
    custCount: PropTypes.number,
    missionType: PropTypes.string,
    taskBasicInfo: PropTypes.object,
    isShowErrorIntervalValue: PropTypes.bool.isRequired,
    isShowErrorStrategySuggestion: PropTypes.bool.isRequired,
    isShowErrorTaskName: PropTypes.bool.isRequired,
    templetDesc: PropTypes.string,
    isSightLabel: PropTypes.bool,
    industryList: PropTypes.array,
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
    isSightLabel: false,
    industryList: [],
  }

  static contextTypes = {
    dict: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const { dict: { custIndexPlaceHolders } } = props;
    const arr = _.map(custIndexPlaceHolders, item => ({
      name: item.value.slice(1),
      type: item.value.slice(1),
    }));
    this.state = {
      firstUserName: '',
      searchReq: null,
      custIdList: null,
      statusData: arr,
    };
  }

  componentWillMount() {
    const {
      location: { query },
      previousData,
      templetDesc,
    } = this.props;

    if (_.isEmpty(previousData)) {
      this.handleInit(query);
    } else {
      this.setState({
        defaultMissionName: previousData.taskName,
        defaultMissionType: previousData.taskType,
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

  // 返回持仓产品发起任务时，任务提示的文字
  getDefaultMissionDescFromProduct(query = {}) {
    let defaultMissionDesc = '';
    if (this.isFromExternalProduct(query)) {
      const { productName = '', id = '' } = query;
      defaultMissionDesc = `客户当前持有${productName}，数量为 $持仓数量#${id}# ，市值为 $持仓市值#${id}# 。`;
    }
    return defaultMissionDesc;
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
    const { source = '', count = '0' } = query;
    const missionDesc = this.getMissionDesc();
    const { dict: { custIndexPlaceHolders }, missionType, taskBasicInfo, templetDesc } = this.props;
    const { motDetailModel = {} } = taskBasicInfo;
    let defaultMissionName = '';
    let defaultMissionType = '';
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
      };
      if (param.enterType) {
        searchReq.enterType = param.enterType;
      }
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
      case BUSINESS_ENTRY:
        defaultMissionName = '提醒客户办理已满足条件的业务'; // 任务名称
        defaultMissionType = '25'; // 任务类型
        defaultExecutionType = 'Mission'; // 执行方式
        defaultKey = 'UNRIGHTS';
        // 任务提示
        defaultMissionDesc = `用户已达到办理 ${this.handleKey(defaultKey, custIndexPlaceHolders)} 业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。`;
        defaultInitialValue = 8; // 有效期
        break;
      // 非理财平台
      case EXTERNAL_ENTRY:
        defaultMissionType = '请选择';
        defaultExecutionType = 'Chance';
        defaultInitialValue = 4; // 有效期4天
        // defaultMissionDesc = this.getDefaultMissionDescFromProduct(query);
        break;
      // 产品潜在目标客户跳转
      // 精选组合页面的订购组合
      // 证券产品
      // 首页的联想词
      // 首页的模糊搜索
      // 首页的热词
      case PRODUCT_POTENTIAL_TARGET_CUST_ENTRY:
      case SECURITIES_PRODUCTS_ENTRY:
      case ORDER_COMBINATION_ENTRY:
      case ASSOCIATION_ENTRY:
      case SEARCH_ENTRY:
      case TAG_ENTRY:
        defaultMissionType = '请选择';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        defaultInitialValue = 4; // 有效期4天
        break;
      case CUSTINDICATOR_ENTRY:
        defaultMissionName = '新客户回访';
        defaultMissionType = '26';
        defaultExecutionType = 'Chance';
        defaultKey = 'ACCOUNT_OPEN_DATE';
        defaultMissionDesc = `用户在 ${this.handleKey(defaultKey, custIndexPlaceHolders)} 开户，建议跟踪服务了解客户是否有问题需要解决。`;
        defaultInitialValue = 8;
        break;
      case NUMOFCUSTOPENED_ENTRY:
        defaultMissionName = '业务开通回访';
        defaultMissionType = '26';
        defaultExecutionType = 'Chance';
        defaultKey = 'RIGHTS';
        defaultMissionDesc = `用户在 2 周内办理了 ${this.handleKey(defaultKey, custIndexPlaceHolders)} 业务，建议跟踪服务了解客户是否有问题需要解决。`;
        defaultInitialValue = 8;
        // {14日内开通的业务}
        break;
      case PROGRESS_ENTRY:
      case PIE_ENTRY:
      case TASK_CUST_SCOPE_ENTRY:
        defaultMissionType = missionType || '请选择';
        defaultExecutionType = '请选择';
        break;
      case CUST_GROUP_LIST:
        defaultMissionName = '';
        defaultMissionType = '请选择';
        defaultExecutionType = '请选择';
        break;
      case RETURN_TASK_FROM_TODOLIST:
      case RETURN_TASK_FROM_TASKLIST:
        defaultMissionName = motDetailModel.eventName; // 任务名称
        defaultMissionType = motDetailModel.eventType; // 任务类型
        defaultExecutionType = this.handleTaskType(motDetailModel.exeType); // 执行方式
        defaultKey = 'UNRIGHTS';
        defaultServiceStrategySuggestion = motDetailModel.strategyDesc;
        // 任务提示
        defaultMissionDesc = motDetailModel.infoContent;
        defaultInitialValue = motDetailModel.timelyIntervalValue; // 有效期
        break;
      case SOURCE_CUSTLIST:
        defaultMissionType = '请选择';
        defaultExecutionType = '请选择';
        defaultMissionDesc = this.getFilterInfo();
        break;
      case SOURCE_LABELMANAGEMENT:
        defaultMissionType = '请选择';
        defaultExecutionType = '请选择';
        defaultMissionDesc = this.getLabelManagementMissionDesc();
        break;
      default:
        defaultMissionType = '请选择';
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
    });
  }

  // 判断是否从外部持仓产品进入的列表页发起任务的
  isFromExternalProduct(query = {}) {
    return query.source === EXTERNAL_ENTRY && query.type === 'PRODUCT';
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
    const { location: { query = {} } } = this.props;
    const list = value.match(productPattern);
    const newList = _.map(list, item => ({ type: item.slice(1), name: item.slice(1) }));
    if (_.isEmpty(query)) {
      return newList;
    }
    const { product = '' } = query;
    // 从product中匹配出产品代码 晋亿实业(601002) => 601002
    const result = /\((\S+)\)/.exec(product);
    const productCode = !_.isEmpty(result) && result[1];
    const dateList = _.map(PRODUCT_ARGUMENTS, item => ({ type: `${item}#${productCode}#`, name: `${item}#${productCode}#` }));
    return [...newList, ...dateList];
  }

  // 获取瞄准镜标签在mention中默认显示的信息
  @autobind
  getMissionDesc() {
    const { location: { query: { condition } } } = this.props;
    if (condition) {
      const { primaryKey = [] } = JSON.parse(decodeURIComponent(condition));
      const { missionDesc } = getLabelInfo(primaryKey[0]);
      return missionDesc || '';
    }
    return '';
  }

  @autobind
  getFilterInfo() {
    const { dict } = this.context;
    const { location: { query }, industryList } = this.props;
    const filterObj = url.transfromFilterValFromUrl(query.filters);
    const { htmlStr, suggestionList } = getFilterInfo({ filterObj, dict, industryList, query });
    this.setState(state => ({
      statusData: [
        ...state.statusData,
        ...suggestionList,
      ],
    }));
    return toString(stateFromHTML(htmlStr));
  }

  // 管理标签页进入，任务提示显示自定义标签的名称
  @autobind
  getLabelManagementMissionDesc() {
    const { location: { query: { labelName } } } = this.props;
    const htmlStr = `<div>
      <div>该客户通过淘客筛选，满足以下条件：</div>
      <div>自定义标签：${labelName}</div>
    </div>`;
    return toString(stateFromHTML(htmlStr));
  }

  render() {
    const {
      dict,
      isShowTitle = false,
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
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
      firstUserName,
      count,
      statusData,
    } = this.state;
    const { source } = query || {};
    const missionDesc = this.getMissionDesc();
    // 构造suggestion给mention
    let templetDescSuggestion = {};

    // 来自taskFlow标签圈人的瞄准镜标签
    if (templetDesc && isSightLabel) {
      templetDescSuggestion = this.renderMissionDescSuggestion(templetDesc);
    } else if (missionDesc && isSightingScope(source)) {
      // 来自搜索瞄准镜标签
      templetDescSuggestion = this.renderMissionDescSuggestion(decodeURIComponent(missionDesc));
    }

    const productDescSuggestions = this.isFromExternalProduct(query) ?
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
            templetDescSuggestion={templetDescSuggestion}
            wrappedComponentRef={ref => this.taskFormInfoRef = ref}
            productDescSuggestions={productDescSuggestions}
          />
        </div>
      </div>
    );
  }
}
