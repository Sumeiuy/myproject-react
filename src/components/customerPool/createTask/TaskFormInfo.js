/**
 * @file customerPool/CreateTaskForm.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Form, Select, Input, DatePicker, Mention } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { autobind } from 'core-decorators';
import styles from './createTaskForm.less';


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { toContentState, toString } = Mention;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];


export default class TaskFormInfo extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    defaultMissionName: PropTypes.string.isRequired,
    defaultMissionType: PropTypes.string.isRequired,
    defaultExecutionType: PropTypes.string.isRequired,
    defaultMissionDesc: PropTypes.string.isRequired,
    defaultServiceStrategySuggestion: PropTypes.string,
    users: PropTypes.array.isRequired,
    taskTypes: PropTypes.array,
    executeTypes: PropTypes.array,
    startValue: PropTypes.object.isRequired,
    endValue: PropTypes.object.isRequired,
  }

  static defaultProps = {
    taskTypes: [],
    executeTypes: [],
    defaultServiceStrategySuggestion: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      startFormat: 'YYYY/MM/DD(E)',
      endFormat: 'YYYY/MM/DD(E)',
      suggestions: [],
    };
  }

  componentWillMount() {
    const { startValue, endValue } = this.props;
    this.setState({
      startValue,
      endValue,
    });
    // users = this.props.users;
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

  // 提及
  // @autobind
  // onSelect(suggestion) {
  //   console.log('onSelect', suggestion);
  // }
  // @autobind
  handleSearchChange=(value, trigger) => {
    const { users } = this.props;
    const dataSource = trigger === '$' ? users : [];
    this.setState({
      suggestions: dataSource.filter(item => item.indexOf(value) !== -1),
    });
  }
  // @autobind
  // handleChange(editorState) {
  //   console.log(toString(editorState));
  // }
  checkMention = (rule, value, callback) => {
    if (toString(value).length < 10) {
      callback(new Error('任务描述不能小于10个字符!'));
    } else {
      callback();
    }
  }
  // 提及

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


  render() {
    const {
      startFormat,
      endFormat,
      startValue,
      endValue,
      suggestions,
    } = this.state;
    const {
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultServiceStrategySuggestion,
      defaultMissionDesc,
      taskTypes,
      executeTypes,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form >
        <ul className={styles.task_selectList}>
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务名称</label>
            <FormItem
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('taskName',
                {
                  rules: [{ required: true, message: '任务名称不能为空!' }],
                  initialValue: defaultMissionName,
                })(
                  <Input placeholder="请输入任务名称" />,
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
                  {getFieldDecorator('taskType',
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
                  <Select defaultValue="暂无数据">
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
                  <Select defaultValue="暂无数据">
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
                initialValue: defaultServiceStrategySuggestion,
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
            {getFieldDecorator('templetDesc', {
              rules: [{ validator: this.checkMention }],
              initialValue: toContentState(defaultMissionDesc),
            })(
              <Mention
                style={{ width: '100%', height: 100 }}
                multiLines
                onChange={this.handleChange}
                placeholder="请在描述客户经理联系客户钱需要了解的客户相关信息，比如持仓情况。（字数限制：10-1000字）"
                prefix={['$']}
                onSearchChange={this.handleSearchChange}
                suggestions={suggestions}
                onSelect={this.onSelect}
              />,
            )}
            <div className={styles.info}>
              任务描述中 &#123;XXXX&#125; 部分后台会根据客户自动替换为该客户对应的属性值，编辑任务描述时请尽量避免修改这些参数描述。
            </div>
          </FormItem>
        </div>
      </Form>
    );
  }
}
