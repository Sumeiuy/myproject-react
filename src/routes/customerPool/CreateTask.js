/**
 * @file customerPool/CreateTask.js
 *  客户池-自建任务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Form, Select, Input, Button, DatePicker } from 'antd';
import { createForm } from 'rc-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { autobind } from 'core-decorators';
import styles from './createTask.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
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

@createForm()
@connect(mapStateToProps, mapDispatchToProps)
export default class CreateTask extends PureComponent {

  static propTypes = {
    data: PropTypes.array,
    form: PropTypes.object.isRequired,
    getTaskDictionary: PropTypes.func.isRequired,
    taskDictionary: PropTypes.object.isRequired,
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      startValue: null,
      endValue: null,
      endOpen: false,
    };
  }

  componentWillMount() {
    const { getTaskDictionary } = this.props;
    getTaskDictionary();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
    console.log(value);
  }

  @autobind
  onEndChange(value) {
    this.onChange('endValue', value);
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


  render() {
    const { form, taskDictionary } = this.props;
    console.log(taskDictionary);
    const { getFieldDecorator } = form;
    const { endOpen } = this.state;
    const dateFormat = 'YYYY/MM/DD';
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
                      {getFieldDecorator('note')(
                        <Input />,
                      )}
                    </FormItem>
                  </li>
                  <li>
                    <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务类型</label>
                    <FormItem
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('gender')(
                        <Select>
                          <Option value="male">male</Option>
                          <Option value="female">female</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </li>
                  <li>
                    <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>执行方式</label>
                    <FormItem
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('gender')(
                        <Select>
                          <Option value="male">male</Option>
                          <Option value="female">female</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </li>
                  <li>
                    <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>触发日期</label>
                    <FormItem
                      wrapperCol={{ span: 12 }}
                    >
                      {getFieldDecorator('date-picker-start')(
                        <DatePicker
                          disabledDate={this.disabledStartDate}
                          showTime
                          format="YYYY/MM/DD(E)"
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
                      {getFieldDecorator('date-picker-end')(
                        <DatePicker
                          disabledDate={this.disabledEndDate}
                          showTime
                          defaultValue={moment('2015/01/01', dateFormat)} format={dateFormat}
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
                    {getFieldDecorator('note')(
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
                    {getFieldDecorator('note')(
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
                    <Button type="primary" htmlType="submit" loading>
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
