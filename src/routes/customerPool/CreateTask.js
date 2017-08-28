/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { createForm } from 'rc-form';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';
import { autobind } from 'core-decorators';
import styles from './createTask.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const effects = {
  getTaskDictionary: 'customerPool/getTaskDictionary',
};

const fectchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  taskDictionary: state.customerPool.taskDictionary, // 绩效指标
});

const mapDispatchToProps = {
  getTaskDictionary: fectchDataFunction(true, effects.getTaskDictionary),
};

@connect(mapStateToProps, mapDispatchToProps)
@createForm()
export default class CreateTask extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.array,
    form: PropTypes.object.isRequired,
    getTaskDictionary: PropTypes.func.isRequired,
    taskDictionary: PropTypes.object,
  }

  static defaultProps = {
    data: [],
    taskDictionary: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
      startFormat: 'YY/MM/DD(E)',
      endFormat: 'YY/MM/DD(E)',
    };
  }

  componentWillMount() {
    const { getTaskDictionary, location: { query } } = this.props;
    console.log(query);
    this.handleCreatAddDate(1, 'start');
    this.handleCreatAddDate(4, 'end');
    getTaskDictionary();
  }

  componentWillReceiveProps(nextProps) {
    const { location: preLocation } = this.props;
    const { location: nextLocation } = nextProps;
    if (preLocation !== nextLocation) {
      console.log(nextLocation);
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
  handleStartOpenChange(open) {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  @autobind
  handleEndOpenChange(open) {
    this.setState({ endOpen: open });
  }

  @autobind
  disabledStartDate(startValue) {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  @autobind
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
        endValue: moment(newDay, `YY/MM/DD(${WEEK[e]})`),
        endFormat: `YY/MM/DD(${WEEK[e]})`,
      });
    } else {
      this.setState({
        startValue: moment(newDay, `YY/MM/DD(${WEEK[e]})`),
        startFormat: `YY/MM/DD(${WEEK[e]})`,
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
          endFormat: `YY/MM/DD(${WEEK[e]})`,
        });
      } else {
        this.setState({
          startFormat: `YY/MM/DD(${WEEK[e]})`,
        });
      }
    }
  }

  render() {
    const { form, taskDictionary } = this.props;
    const { executeType, missionTypes } = taskDictionary;
    const { getFieldDecorator } = form;
    const { endOpen, endFormat, startFormat, startValue, endValue } = this.state;
    return (
      <div className={styles.taskBox}>
        <div className={styles.taskInner}>
          <div className={styles.taskcontent}>
            <div className={styles.task_title}>自建任务</div>
            <div className={styles.task_from}>
              <Form onSubmit={this.handleSubmit}>
                <ul className={styles.task_selectList}>
                  <li>
                    <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务名称</label>
                    <FormItem
                      wrapperCol={{ span: 12 }}
                      validateStatus="error"
                      help="任务名称不能为空"
                    >
                      {getFieldDecorator('missionName')(
                        <Input />,
                      )}
                    </FormItem>
                  </li>
                  <li>
                    <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务类型</label>
                    <FormItem
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('missionType')(
                        <Select>
                          {this.handleCreatOptions(missionTypes)}
                        </Select>,
                      )}
                    </FormItem>
                  </li>
                  <li>
                    <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>执行方式</label>
                    <FormItem
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('executionType')(
                        <Select>
                          {this.handleCreatOptions(executeType)}
                        </Select>,
                      )}
                    </FormItem>
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
                            showTime
                            format={startFormat}
                            placeholder="开始时间"
                            onChange={this.onStartChange}
                            onOpenChange={this.handleStartOpenChange}
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
                            showTime
                            format={endFormat}
                            placeholder="结束时间"
                            onChange={this.onEndChange}
                            open={endOpen}
                            onOpenChange={this.handleEndOpenChange}
                            style={{ width: '100%' }}
                          />,
                      )}
                    </FormItem>
                  </li>
                </ul>
                <div className={styles.task_textArea}>
                  <p>
                    <label htmlFor="desc"><i>*</i>服务策略建议（适用于所有目标客户）</label>
                  </p>
                  <FormItem>
                    {getFieldDecorator('serviceStrategySuggestion',
                      {
                        initialValue: '客户已达到办理 业务的条件，可以联系客户并客户介绍符合开通条件的业务，根据客户的反馈情况决定是否需要向客户推荐开通相关业务。',
                      })(
                        <TextArea
                          id="desc"
                          rows={5}
                          style={{ width: '100%' }}
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
                        initialValue: '用户已达到到办理 {可开通业务列表}业务的条件，请联系客户办理相关业务。注意提醒客户准备业务办理必须的文件。',
                      })(
                        <TextArea
                          id="desc"
                          rows={5}
                          style={{ width: '100%' }}
                        />,
                    )}
                  </FormItem>
                </div>
                <div className={styles.task_btn}>
                  <FormItem>
                    <Button>
                      取消
                    </Button>
                    <Button type="primary" htmlType="submit" > { /* loading */}
                      提交
                    </Button>
                  </FormItem>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
