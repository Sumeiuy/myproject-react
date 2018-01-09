/**
 * @file customerPool/TaskFormInfo.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Input, Mention, InputNumber } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import styles from './createTaskForm.less';


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { toContentState, toString } = Mention;
const Nav = Mention.Nav;

const PREFIX = ['$'];
const mentionTextStyle = {
  color: '#2d84cc',
  backgroundColor: '#ebf3fb',
  borderColor: '#ebf3fb',
};

export default class TaskFormInfo extends PureComponent {

  static propTypes = {
    form: PropTypes.object.isRequired,
    defaultMissionName: PropTypes.string.isRequired,
    defaultMissionType: PropTypes.string.isRequired,
    defaultExecutionType: PropTypes.string.isRequired,
    defaultMissionDesc: PropTypes.string.isRequired,
    defaultServiceStrategySuggestion: PropTypes.string,
    defaultInitialValue: PropTypes.number,
    defaultTaskSubType: PropTypes.string,
    users: PropTypes.array.isRequired,
    taskTypes: PropTypes.array,
    executeTypes: PropTypes.array,
    isShowErrorInfo: PropTypes.bool,
    isShowErrorTaskType: PropTypes.bool,
    isShowErrorExcuteType: PropTypes.bool,
    isShowErrorTaskSubType: PropTypes.bool,
  }

  static defaultProps = {
    taskTypes: [],
    executeTypes: [],
    defaultServiceStrategySuggestion: '',
    defaultInitialValue: null,
    defaultTaskSubType: '',
    isShowErrorInfo: false,
    isShowErrorTaskType: false,
    isShowErrorExcuteType: false,
    isShowErrorTaskSubType: false,
  }

  constructor(props) {
    super(props);
    // 用来处理页面一进来会触发mentionChange事件
    this.isFirstLoad = true;
    // 找到默认任务类型的子类型集合
    const currentTaskSubTypeCollection = this.getCurrentTaskSubTypes(props.defaultMissionType);
    const {
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorInfo,
      isShowErrorTaskSubType,
     } = props;
    this.state = {
      suggestions: [],
      inputValue: '',
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      isShowErrorTaskSubType,
      taskSubTypes: currentTaskSubTypeCollection,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isShowErrorInfo: nextError,
      isShowErrorExcuteType: nextExcuteTypeError,
      isShowErrorTaskType: nextTaskTypeError,
      isShowErrorTaskSubType: nextTaskSubTypeError,
    } = nextProps;
    const {
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType, isShowErrorTaskSubType,
     } = this.props;
    if (nextError !== isShowErrorInfo) {
      this.setState({
        isShowErrorInfo: nextError,
      });
    }
    if (nextExcuteTypeError !== isShowErrorExcuteType) {
      this.setState({
        isShowErrorExcuteType: nextExcuteTypeError,
      });
    }
    if (nextTaskTypeError !== isShowErrorTaskType) {
      this.setState({
        isShowErrorTaskType: nextTaskTypeError,
      });
    }
    if (nextTaskSubTypeError !== isShowErrorTaskSubType) {
      this.setState({
        isShowErrorTaskSubType: nextTaskSubTypeError,
      });
    }
  }

  getCurrentTaskSubTypes(currentMissionType) {
    const { taskTypes } = this.props;
    const currentTaskTypeCollection = _.find(taskTypes, item =>
      item.key === currentMissionType) || {};
    let currentTaskSubTypeCollection = [{}];
    if (!_.isEmpty(currentTaskTypeCollection) && !_.isEmpty(currentTaskTypeCollection.children)) {
      currentTaskSubTypeCollection = currentTaskTypeCollection.children;
    }
    return currentTaskSubTypeCollection;
  }

  handleSearchChange = (value, trigger) => {
    const { users } = this.props;
    const searchValue = value.toLowerCase();
    const dataSource = _.includes(PREFIX, trigger) ? users : {};
    const filtered = dataSource.filter(item =>
      item.name.toLowerCase().indexOf(searchValue) !== -1,
    );
    const suggestions = filtered.map(suggestion => (
      <Nav
        value={suggestion.type}
        data={suggestion}
      >
        <span>{suggestion.name}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  // @autobind
  // handleSelect(suggestion, data) {
  //   console.log('onSelect', typeof suggestion, 'data', data);
  // }


  @autobind
  handleTaskTypeChange(value) {
    if (!_.isEmpty(value) && value !== '请选择' && value !== '暂无数据') {
      const currentTaskSubTypeCollection = this.getCurrentTaskSubTypes(value);
      this.setState({
        isShowErrorTaskType: false,
        taskSubTypes: currentTaskSubTypeCollection,
      });
    } else {
      this.setState({
        isShowErrorTaskType: true,
        taskSubTypes: [{
          key: '请选择任务子类型',
          value: '请选择任务子类型',
        }],
      });
    }
  }

  @autobind
  handleExcuteTypeChange(value) {
    if (!_.isEmpty(value) && value !== '请选择' && value !== '暂无数据') {
      this.setState({
        isShowErrorExcuteType: false,
      });
    } else {
      this.setState({
        isShowErrorExcuteType: true,
      });
    }
  }

  @autobind
  handleTaskSubTypeChange(value) {
    if (!_.isEmpty(value) && value !== '请选择' && value !== '暂无数据') {
      this.setState({
        isShowErrorTaskSubType: false,
      });
    } else {
      this.setState({
        isShowErrorTaskSubType: true,
      });
    }
  }

  checkMention = (rule, value, callback) => {
    if (!this.isFirstLoad) {
      const content = toString(value);
      if (_.isEmpty(content) || content.length < 10 || content.length > 341) {
        this.setState({
          isShowErrorInfo: true,
        });
      } else {
        this.setState({
          isShowErrorInfo: false,
        });
      }
    }
    callback();
  }

  @autobind
  handleMentionBlur() {
    this.isFirstLoad = false;
  }

  handleCreatOptions(data) {
    if (!_.isEmpty(data)) {
      return data.map(item =>
        <Option key={`task${item.key}`} value={item.key}>{item.value}</Option>,
      );
    }
    return null;
  }

  handleCreateTaskSubType(data) {
    if (!_.isEmpty(data)) {
      return data.map(item =>
        <Option key={`subTask_${item.key}`} value={item.key}>{item.value}</Option>,
      );
    }
    return null;
  }

  // getSuggestionContainer = () => {
  //   return this.popover.getPopupDomNode();
  // }

  renderMention() {
    const { form: { getFieldDecorator }, defaultMissionDesc } = this.props;
    const { suggestions } = this.state;
    return (
      getFieldDecorator('templetDesc', {
        rules: [{ validator: this.checkMention }],
        initialValue: toContentState(defaultMissionDesc),
      })(
        <Mention
          mentionStyle={mentionTextStyle}
          style={{ width: '100%', height: 100 }}
          placeholder="请在描述客户经理联系客户前需要了解的客户相关信息，比如持仓情况。（字数限制：10-300字）"
          prefix={PREFIX}
          onSearchChange={this.handleSearchChange}
          suggestions={suggestions}
          getSuggestionContainer={() => this.fatherMention}
          onBlur={this.handleMentionBlur}
          multiLines
        />,
      )
    );
  }

  renderTipSection() {
    return (
      <div className={styles.info}>
        如果要在任务提示中包含对应每个客户的属性数值，可以用 $xx 插入参数，比如 $已开通业务。注意“ $ ”前要有空格。
      </div>
    );
  }

  render() {
    const {
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      isShowErrorTaskSubType,
      taskSubTypes,
    } = this.state;
    const {
      defaultMissionName,
      defaultMissionType,
      defaultExecutionType,
      defaultServiceStrategySuggestion,
      defaultInitialValue,
      taskTypes,
      executeTypes,
      form,
      defaultTaskSubType,
    } = this.props;

    const { getFieldDecorator } = form;

    const errorProps = isShowErrorInfo ? {
      hasFeedback: true,
      validateStatus: 'error',
      help: '任务提示不能小于10个字符，最多300个字符',
    } : null;

    const taskTypeErrorSelectProps = isShowErrorTaskType ? {
      hasFeedback: true,
      validateStatus: 'error',
      help: '请选择任务类型',
    } : null;

    const taskSubTypeErrorSelectProps = isShowErrorTaskSubType ? {
      hasFeedback: true,
      validateStatus: 'error',
      help: '请选择任务子类型',
    } : null;

    const excuteTypeErrorSelectProps = isShowErrorExcuteType ? {
      hasFeedback: true,
      validateStatus: 'error',
      help: '请选择执行方式',
    } : null;

    return (
      <Form >
        <ul className={styles.task_selectList}>
          {/**
           * 任务名称
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务名称</label>
            <FormItem
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('taskName',
                {
                  rules: [{ required: true, message: '任务名称不能为空，最多30个字符', max: 30 }],
                  initialValue: defaultMissionName,
                })(<Input placeholder="请输入任务名称" />)}
            </FormItem>
          </li>
          {/**
           * 任务类型
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务类型</label>
            {
              !_.isEmpty(taskTypes) ?
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...taskTypeErrorSelectProps}
                >
                  {getFieldDecorator('taskType',
                    {
                      initialValue: defaultMissionType,
                    })(<Select
                      onChange={this.handleTaskTypeChange}
                    >
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
          {/**
           * 任务子类型
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>任务子类型</label>
            {
              !_.isEmpty(taskSubTypes) ?
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...taskSubTypeErrorSelectProps}
                >
                  {getFieldDecorator('taskSubType',
                    {
                      initialValue: defaultTaskSubType,
                    })(<Select onChange={this.handleTaskSubTypeChange}>
                      {this.handleCreateTaskSubType(taskSubTypes)}
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
          {/**
           * 执行方式
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>执行方式</label>
            {
              !_.isEmpty(executeTypes) ?
                <FormItem
                  wrapperCol={{ span: 12 }}
                  {...excuteTypeErrorSelectProps}
                >
                  {getFieldDecorator('executionType',
                    {
                      initialValue: defaultExecutionType,
                    })(<Select onChange={this.handleExcuteTypeChange}>
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
            <label htmlFor="dd" className={styles.task_label}><i className={styles.required_i}>*</i>有效期(天)</label>
            <FormItem
              wrapperCol={{ span: 12 }}
              className={styles.timelyIntervalValueItem}
            >
              {getFieldDecorator('timelyIntervalValue',
                {
                  rules: [{ required: true, message: '有效期只能为正整数', pattern: /^\+?[1-9][0-9]*$/ }],
                  initialValue: defaultInitialValue,
                })(<InputNumber step={1} min={0} max={365} style={{ width: '100%' }} />)}
            </FormItem>
            {/* <div className={styles.tip}>有效期自任务审批通过后开始计算</div> */}
          </li>
        </ul>
        <div className={styles.task_textArea}>
          <p>
            <label htmlFor="desc"><i>*</i>服务策略（适用于所有客户）</label>
          </p>
          <FormItem>
            {getFieldDecorator('serviceStrategySuggestion',
              {
                rules: [{ required: true, min: 10, max: 300, message: '服务策略不能小于10个字符，最多300个字符' }],
                initialValue: defaultServiceStrategySuggestion,
              })(<TextArea
                id="desc"
                rows={5}
                placeholder="请在此介绍该新建任务的服务策略，以指导客户经理或投顾实施任务。（字数限制：10-300字）"
                style={{ width: '100%' }}
                maxLength={300}
              />,
            )}
          </FormItem>
        </div>
        <div
          className={styles.task_textArea}
          ref={
            (ref) => {
              // ref多次重绘可能是null, 这里要判断一下
              if (!this.fatherMention && ref) {
                this.fatherMention = ref;
              }
            }
          }
        >
          <p>
            <label htmlFor="desc"><i>*</i>任务提示</label>
          </p>
          <FormItem
            {...errorProps}
          >
            {
              this.renderMention()
            }
            {
              this.renderTipSection()
            }
          </FormItem>
        </div>
      </Form >
    );
  }
}
