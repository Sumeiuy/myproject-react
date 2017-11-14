/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Form, Mention } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { RestoreScrollTop } from '../../common/hocComponent';
import styles from './createTaskForm.less';
import TaskFormInfo from './TaskFormInfo';


const create = Form.create;
const { toString } = Mention;

@RestoreScrollTop
@create()
export default class CreateTaskForm extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    previousData: PropTypes.object,
    isShowTitle: PropTypes.bool,
    isShowErrorInfo: PropTypes.bool,
    isShowErrorTaskType: PropTypes.bool.isRequired,
    isShowErrorExcuteType: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => { },
    previousData: {},
    isShowTitle: false,
    isShowErrorInfo: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      fromShow: true,
      successShow: false,
      firstUserName: '',
      searchReq: null,
      custIdList: null,
      statusData: [],
      defauleData: {},
    };
  }

  componentWillMount() {
    const {
      location: { query },
      dict: { custIdexPlaceHolders },
      previousData,
    } = this.props;
    const arr = _.map(custIdexPlaceHolders, item => ({
      name: item.slice(1, -1),
      type: item.slice(1, -1),
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
        defaultExecutionType: previousData.executionType,
        defaultMissionDesc: toString(previousData.templetDesc),
        defaultInitialValue: previousData.timelyIntervalValue,
        defaultServiceStrategySuggestion: previousData.serviceStrategySuggestion,
      });
    }
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool

  @autobind
  handleInit(query = {}) {
    let source = '';
    let count = '0';
    if (!_.isEmpty(query)) {
      source = query.source;
      count = query.count;
    }
    const { dict: { custIdexPlaceHolders } } = this.props;
    let defaultMissionName = '';
    let defaultMissionType = '';
    let defaultExecutionType = '';
    const defaultServiceStrategySuggestion = '';
    let defaultInitialValue = null;
    let defaultMissionDesc = '';
    let custIdList = null;
    let searchReq = null;
    let firstUserName = '';

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
        defaultMissionType = 'BusinessRecomm'; // 任务类型
        defaultExecutionType = 'Mission'; // 执行方式
        // 任务提示
        defaultMissionDesc = `用户已达到办理 ${custIdexPlaceHolders[0]} 业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。`;
        defaultInitialValue = 8; // 有效期
        break;
      case 'search':
        defaultMissionType = '请选择';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        defaultInitialValue = 4;
        break;
      case 'tag':
        defaultMissionType = '请选择';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        defaultInitialValue = 4;
        break;
      case 'custIndicator':
        defaultMissionName = '新客户回访';
        defaultMissionType = 'AccoutService';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = `用户在 ${custIdexPlaceHolders[2]} 开户，建议跟踪服务了解客户是否有问题需要解决。`;
        defaultInitialValue = 8;
        break;
      case 'numOfCustOpened':
        defaultMissionName = '业务开通回访';
        defaultMissionType = 'AccoutService';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = `用户在 2 周内办理了 ${custIdexPlaceHolders[1]} 业务，建议跟踪服务了解客户是否有问题需要解决。`;
        defaultInitialValue = 8;
        // {14日内开通的业务}
        break;
      case 'custGroupList':
        defaultMissionName = '';
        defaultMissionType = '请选择';
        defaultExecutionType = '请选择';
        break;
      default:
        defaultMissionType = '请选择';
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
    });
  }


  render() {
    const {
      dict,
      form,
      isShowTitle = false,
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
    } = this.props;
    const { custServerTypeFeedBackDict, executeTypes } = dict;
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

    return (
      <div>
        {!isShowTitle ?
          <div className={styles.task_title}>为{firstUserName} <b>{count}</b> 位客户新建任务</div>
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
            taskTypes={custServerTypeFeedBackDict}
            executeTypes={executeTypes}
            form={form}
            isShowErrorInfo={isShowErrorInfo}
            isShowErrorExcuteType={isShowErrorExcuteType}
            isShowErrorTaskType={isShowErrorTaskType}
          />
        </div>
      </div>
    );
  }
}
