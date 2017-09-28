/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Form, Select, Input, DatePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import styles from './createTaskForm.less';
import { fspGlobal } from '../../../utils';
import Button from '../../common/Button';

const FormItem = Form.Item;
const create = Form.create;
const Option = Select.Option;
const { TextArea } = Input;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];

@create()
export default class CreateTaskForm extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    dict: PropTypes.object,
    createTask: PropTypes.func,
    createTaskResult: PropTypes.object,
    goBack: PropTypes.func.isRequired,
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
      startFormat: 'YYYY/MM/DD(E)',
      endFormat: 'YYYY/MM/DD(E)',
      fromShow: true,
      successShow: false,
      firstUserName: '',
      searchReq: null,
      custList: null,
    };
  }

  componentWillMount() {
    const { location: { query } } = this.props;
    this.handleInit(query);
  }

  componentWillReceiveProps(nextProps) {
    const { createTaskResult: preCreateTaskResult } = this.props;
    const { createTaskResult: nextcreateTaskResult } = nextProps;
    if (preCreateTaskResult !== nextcreateTaskResult) {
      // this.handleCreateTaskSuccess(nextcreateTaskResult);
    }
  }

  @autobind
  onChange(field, value) {
    this.setState({
      [field]: value,
    });
  }

  @autobind
  onStartChange(value) {
    this.onChange('startValue', value);
    this.handleDateFormat(value, 'start');
  }

  @autobind
  onEndChange(value) {
    this.onChange('endValue', value);
    this.handleDateFormat(value, 'end');
  }

  @autobind
  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const m = d.getMonth() + 1;
    const newDay = `${d.getFullYear()}/${m}/${d.getDate()}`;
    const e = d.getDay();
    const nowDay = moment(newDay, `YYYY/MM/DD(${WEEK[e]})`);
    return startValue.valueOf() <= nowDay.valueOf() || startValue.valueOf() > endValue.valueOf();
  }

  @autobind
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }


  // 自建任务提交
  handleSubmit = (e) => {
    e.preventDefault();
    const { form, createTask } = this.props;
    const { custList, searchReq } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const value = { ...values, custList, searchReq };
        console.log('Received values of form: ', value);
        createTask(value);
      }
    });
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

  handleCreatOptions(data) {
    if (!_.isEmpty(data)) {
      return data.map(item =>
        <Option key={`task${item.key}`} value={item.key}>{item.value}</Option>,
      );
    }
    return null;
  }

  handleDateFormat(value, type) {
    if (!_.isEmpty(value)) {
      const { _d } = value;
      const d = new Date(_d);
      const e = d.getDay();
      if (type === 'end') {
        this.setState({
          endFormat: `YYYY/MM/DD(${WEEK[e]})`,
        });
      } else {
        this.setState({
          startFormat: `YYYY/MM/DD(${WEEK[e]})`,
        });
      }
    }
  }

  // 从业务目标池客户：businessCustPool
  // 标签、搜索目标客户：searchCustPool
  // 绩效目标客户 - 净新增客户：performanceIncrementCustPool
  // 绩效目标客户 - 业务开通：performanceBusinessOpenCustPool

  @autobind
  handleInit(query) {
    const entertype = query.entertype || '';
    let defaultMissionName = '';
    let defaultMissionType = '';
    let defaultExecutionType = '';
    let defaultMissionDesc = '';
    let startTime = 1;
    let endTime = 4;
    let custList = null;
    let searchReq = null;
    let firstUserName = '';
    const count = query.count || '0';
    if (query.ids) {
      custList = decodeURIComponent(query.ids).split(',');
      console.log('ids: ', decodeURIComponent(query.ids).split(','));
    } else if (query.condition) {
      searchReq = JSON.parse(decodeURIComponent(query.condition));
      console.log('condition: ', JSON.parse(decodeURIComponent(query.condition)));
    } else if (query.name) {
      firstUserName = decodeURIComponent(query.name) || '';
      if (firstUserName.length > 10) {
        firstUserName = `${firstUserName.substring(0, 10)}...`;
      } else {
        firstUserName += '等';
      }
    }
    switch (entertype) {
      case 'businessCustPool':
        defaultMissionName = '提醒客户办理已满足条件的业务';
        defaultMissionType = 'businessRecommend';
        defaultExecutionType = 'Mission';
        defaultMissionDesc = '用户已达到到办理 {可开通业务列表}业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。';
        startTime = 1;
        endTime = 8;
        break;
      case 'searchCustPool':
        defaultMissionName = '提醒客户办理已满足条件的业务';
        defaultMissionType = 'businessRecommend';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '';
        startTime = 1;
        endTime = 4;
        break;
      case 'performanceIncrementCustPool':
        defaultMissionName = '新客户回访';
        defaultMissionType = 'newCustVisit';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '用户在 {开户日} 开户，建议跟踪服务了解客户是否有问题需要解决。注：如果客户状态为流失，则：用户在 {流失日}流失，建议跟踪服务了解客户是否有问题需要解决。';
        startTime = 1;
        endTime = 8;
        break;
      case 'performanceBusinessOpenCustPool':
        defaultMissionName = '业务开通回访';
        defaultMissionType = 'stockCustVisit';
        defaultExecutionType = 'Chance';
        defaultMissionDesc = '用户在 2 周内办理了 {14日内开通的业务} 业务，建议跟踪服务了解客户是否有问题需要解决。';
        startTime = 1;
        endTime = 8;
        break;
      default:
        defaultMissionType = 'businessRecommend';
        defaultExecutionType = 'Chance';
        break;
    }
    this.setState({
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultMissionDesc,
      firstUserName,
      count,
      custList,
      searchReq,
    });
    this.handleCreatAddDate(startTime, 'start');
    this.handleCreatAddDate(endTime, 'end');
  }
  @autobind
    /* 关闭当前页 */
  closeTab() {
    // fspGlobal.closeRctTabById('RCT_FSP_TASK');
    fspGlobal.closeRctTabById('RCT_FSP_CUSTOMER_LIST');
    // this.props.goBack();
  }
  render() {
    const { dict, form } = this.props;
    const { taskTypes, executeTypes } = dict;
    const { getFieldDecorator } = form;
    const { endFormat,
      startFormat,
      startValue,
      endValue,
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultMissionDesc,
      firstUserName,
      count,
    } = this.state;
    return (
      <div className={`${styles.taskInner}`}>
        <div className={styles.taskcontent}>
          <div className={styles.task_title}>为{firstUserName} <b>{count}</b> 位客户新建任务</div>
          <div className={styles.task_from}>
            <Form onSubmit={this.handleSubmit}>
              <ul className={styles.task_selectList}>
                <li>
                  <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务名称</label>
                  <FormItem
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('missionName',
                      {
                        rules: [{ required: true, message: '任务名称不能为空!' }],
                        initialValue: defaultMissionName,
                      })(
                        <Input />,
                    )}
                  </FormItem>
                </li>
                <li>
                  <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务类型</label>
                  {
                    !_.isEmpty(taskTypes) ?
                      <FormItem
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator('missionType',
                          {
                            initialValue: defaultMissionType,
                          })(
                            <Select>
                              {this.handleCreatOptions(taskTypes)}
                            </Select>,
                        )}
                      </FormItem>
                      :
                      <FormItem
                        wrapperCol={{ span: 12 }}
                      >
                        <Select>
                          <Option key="null" value="0">暂无数据</Option>
                        </Select>
                      </FormItem>
                  }
                </li>
                <li>
                  <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>执行方式</label>
                  {
                    !_.isEmpty(executeTypes) ?
                      <FormItem
                        wrapperCol={{ span: 12 }}
                      >
                        {getFieldDecorator('executionType',
                          {
                            initialValue: defaultExecutionType,
                          })(
                            <Select>
                              {this.handleCreatOptions(executeTypes)}
                            </Select>,
                        )}
                      </FormItem>
                      :
                      <FormItem
                        wrapperCol={{ span: 12 }}
                      >
                        <Select>
                          <Option key="null" value="0">暂无数据</Option>
                        </Select>
                      </FormItem>
                  }
                </li>
                <li>
                  <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>触发日期</label>
                  <FormItem
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('triggerDate',
                      {
                        initialValue: startValue,
                      })(
                        <DatePicker
                          disabledDate={this.disabledStartDate}
                          allowClear={false}
                          showToday={false}
                          format={startFormat}
                          placeholder="开始时间"
                          onChange={this.onStartChange}
                          style={{ width: '100%' }}
                        />,
                      )}
                  </FormItem>
                </li>
                <li>
                  <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>截止日期</label>
                  <FormItem
                    wrapperCol={{ span: 12 }}
                  >
                    {getFieldDecorator('closingDate',
                      {
                        initialValue: endValue,
                      })(
                        <DatePicker
                          disabledDate={this.disabledEndDate}
                          allowClear={false}
                          showToday={false}
                          format={endFormat}
                          placeholder="结束时间"
                          onChange={this.onEndChange}
                          style={{ width: '100%' }}
                        />,
                    )}
                  </FormItem>
                </li>
              </ul>
              <div className={styles.task_textArea}>
                <p>
                  <label htmlFor="desc"><i>*</i>服务策略（适用于所有客户）</label>
                </p>
                <FormItem>
                  {getFieldDecorator('serviceStrategySuggestion',
                    {
                      rules: [{ required: true, min: 10, message: '服务策略不能小于10个字符!' }],
                    })(
                      <TextArea
                        id="desc"
                        rows={5}
                        placeholder="请在此介绍该新建任务的服务策略，以指导客户经理或投顾实施任务。（字数限制：10-1000字）"
                        style={{ width: '100%' }}
                        maxLength={1000}
                      />,
                    )}
                </FormItem>
              </div>
              <div className={styles.task_textArea}>
                <p>
                  <label htmlFor="desc"><i>*</i>任务描述</label>
                </p>
                <FormItem>
                  {getFieldDecorator('missionDesc',
                    {
                      rules: [{ required: true, min: 10, message: '任务描述不能小于10个字符!' }],
                      initialValue: defaultMissionDesc,
                    })(
                      <TextArea
                        id="desc"
                        rows={5}
                        placeholder="请在描述客户经理联系客户钱需要了解的客户相关信息，比如持仓情况。（字数限制：10-1000字）"
                        style={{ width: '100%' }}
                        maxLength={1000}
                      />,
                    )}
                  <div className={styles.info}>
                    任务描述中 &#123;XXXX&#125; 部分后台会根据客户自动替换为该客户对应的属性值，编辑任务描述时请尽量避免修改这些参数描述。
                    </div>
                </FormItem>
              </div>
              <div className={styles.task_btn}>
                <FormItem>
                  <Button onClick={this.props.goBack}>
                    取消
                    </Button>
                  <Button type="primary" htmlType="submit">提交</Button> { /* loading */}
                </FormItem>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}
