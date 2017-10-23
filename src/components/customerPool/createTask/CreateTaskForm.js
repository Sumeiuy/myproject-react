/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Form, Mention } from 'antd';
import _ from 'lodash';
import moment from 'moment';
// import classnames from 'classnames';
import { autobind } from 'core-decorators';
import styles from './createTaskForm.less';
import TaskFormInfo from './TaskFormInfo';


// const FormItem = Form.Item;
const create = Form.create;
// const Option = Select.Option;
// const { TextArea } = Input;
// const { toContentState } = Mention;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const { toString } = Mention;

@create()
export default class CreateTaskForm extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    previousData: PropTypes.object,
  }

  static defaultProps = {
    dict: {},
    createTaskResult: {},
    createTask: () => { },
    previousData: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
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
    // const { statusData } = this.state;
    const arr = [];
    _.map(custIdexPlaceHolders, (item) => {
      // item.substring(1, item.length);
      arr.push(item.substring(1, item.length));
    });
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
        defaultServiceStrategySuggestion: previousData.serviceStrategySuggestion,
        startValue: previousData.triggerDate,
        endValue: previousData.closingDate,
      });
    }
  }


  @autobind
  handleCreatAddDate(days, type) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const m = d.getMonth() + 1;
    const newDay = `${d.getFullYear()}/${m}/${d.getDate()}`;
    const e = d.getDay();
    if (type === 'end') {
      this.setState({
        endValue: moment(newDay, `YYYY/MM/DD(${WEEK[e]})`),
        endFormat: `YYYY/MM/DD(${WEEK[e]})`,
      });
    } else {
      this.setState({
        startValue: moment(newDay, `YYYY/MM/DD(${WEEK[e]})`),
        startFormat: `YYYY/MM/DD(${WEEK[e]})`,
      });
    }
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户： performanceCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool

  @autobind
  handleInit(query = {}) {
    let entertype = '';
    let count = '0';
    if (!_.isEmpty(query)) {
      entertype = query.entertype;
      count = query.count;
    }

    const { dict: { custIdexPlaceHolders } } = this.props;
    let defaultMissionName = '';
    let defaultMissionType = '';
    let defaultExecutionType = '';
    const defaultServiceStrategySuggestion = '';
    let defaultMissionDesc = '';
    let startTime = 1;
    let endTime = 4;
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
    console.warn('entertype--', entertype);
    switch (entertype) {
      case 'businessCustPool':
        defaultMissionName = '提醒客户办理已满足条件的业务';
        defaultMissionType = 'businessRecommend';
        defaultExecutionType = 'Mission';
        defaultMissionDesc = `用户已达到到办理 ${custIdexPlaceHolders[0]} 业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。`;
        startTime = 1;
        endTime = 8;
        break;
      case 'searchCustPool':
        defaultMissionType = 'other';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        startTime = 1;
        endTime = 4;
        break;
      case 'performanceIncrementCustPool':
        defaultMissionName = '新客户回访';
        defaultMissionType = 'newCustVisit';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = `用户在 ${custIdexPlaceHolders[1]} 开户，建议跟踪服务了解客户是否有问题需要解决。注：如果客户状态为流失，则：用户在 {流失日}流失，建议跟踪服务了解客户是否有问题需要解决。`;
        startTime = 1;
        endTime = 8;
        break;
      case 'performanceBusinessOpenCustPool':
        defaultMissionName = '业务开通回访';
        defaultMissionType = 'stockCustVisit';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = `用户在 2 周内办理了 ${custIdexPlaceHolders[2]} 业务，建议跟踪服务了解客户是否有问题需要解决。`;
        startTime = 1;
        endTime = 8;
        // {14日内开通的业务}
        break;
      case 'custGroupList':
        defaultMissionName = '';
        defaultMissionType = '请选择';
        defaultExecutionType = '请选择';
        startTime = 1;
        endTime = 8;
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
      defaultServiceStrategySuggestion,
      firstUserName,
      count,
      custIdList,
      searchReq,
    });
    this.handleCreatAddDate(startTime, 'start');
    this.handleCreatAddDate(endTime, 'end');
  }


  render() {
    const { dict, form } = this.props;
    const { taskTypes, executeTypes } = dict;
    // const { getFieldDecorator } = form;
    const {
      startValue,
      endValue,
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultMissionDesc,
      defaultServiceStrategySuggestion,
      firstUserName,
      count,
      statusData,
    } = this.state;
    console.log('state--', this.state);
    return (
      <div>
        <div className={styles.task_title}>为{firstUserName} <b>{count}</b> 位客户新建任务</div>
        <div className={styles.task_from}>
          <TaskFormInfo
            defaultMissionName={defaultMissionName}
            defaultMissionType={defaultMissionType}
            defaultExecutionType={defaultExecutionType}
            defaultMissionDesc={defaultMissionDesc}
            defaultServiceStrategySuggestion={defaultServiceStrategySuggestion}
            users={statusData}
            taskTypes={taskTypes}
            executeTypes={executeTypes}
            startValue={startValue}
            endValue={endValue}
            form={form}
          />
        </div>
      </div>
    );
  }
}
