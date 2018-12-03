/**
 * @file customerPool/TaskFormInfo.js
 *  客户池-自建任务表单
 * @author yangquanjian
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Select, Input, Mention, InputNumber
} from 'antd';
import { createForm } from 'rc-form';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { regxp } from '../../../helper';
import styles from './createTaskForm.less';
import logable from '../../../decorators/logable';

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
// Mention 弹出下拉框样式
const suggestionStyle = {
  maxHeight: '160px',
  overflow: 'auto',
};
// 字数限制，最大长度
const MAX_LENGTH = 1000;

@createForm()
export default class TaskFormInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    defaultMissionName: PropTypes.string.isRequired,
    defaultMissionType: PropTypes.string.isRequired,
    defaultExecutionType: PropTypes.string,
    defaultMissionDesc: PropTypes.string.isRequired,
    defaultServiceStrategySuggestion: PropTypes.string,
    defaultInitialValue: PropTypes.number,
    users: PropTypes.array.isRequired,
    taskTypes: PropTypes.array,
    executeTypes: PropTypes.array,
    isShowErrorInfo: PropTypes.bool,
    isShowErrorTaskType: PropTypes.bool,
    isShowErrorExcuteType: PropTypes.bool,
    isShowErrorIntervalValue: PropTypes.bool,
    isShowErrorStrategySuggestion: PropTypes.bool,
    isShowErrorTaskName: PropTypes.bool,
    templetDescSuggestion: PropTypes.object,
    productDescSuggestions: PropTypes.array.isRequired,
  }

  static defaultProps = {
    taskTypes: [],
    executeTypes: [],
    defaultServiceStrategySuggestion: '',
    defaultInitialValue: null,
    isShowErrorInfo: false,
    isShowErrorTaskType: false,
    isShowErrorExcuteType: false,
    defaultExecutionType: '',
    isShowErrorIntervalValue: false,
    isShowErrorStrategySuggestion: false,
    isShowErrorTaskName: false,
    templetDescSuggestion: {},
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
      isShowErrorIntervalValue,
      isShowErrorTaskName,
      isShowErrorStrategySuggestion,
      templetDescSuggestion,
      productDescSuggestions,
    } = props;
    let suggestions = [];
    if (!_.isEmpty(productDescSuggestions)) {
      suggestions = _.map(productDescSuggestions, item => (
        !_.isEmpty(item) && (
        <Nav
          value={item.type}
          data={item.type}
        >
          <span>{item.name}</span>
        </Nav>
        )
      ));
    } else if (!_.isEmpty(templetDescSuggestion)) {
      // 初始化的时候，如果外部有标签任务提示带入mention，
      // 那么将suggestion填充默认值，为了让标签任务提示高亮显示
      suggestions = [
        <Nav
          value={templetDescSuggestion.type}
          data="sightLabel"
        >
          <span>{templetDescSuggestion.name}</span>
        </Nav>,
      ];
    }
    this.state = {
      suggestions,
      inputValue: '',
      isShowErrorInfo,
      isShowErrorTaskType,
      isShowErrorExcuteType,
      isShowErrorIntervalValue,
      isShowErrorTaskName,
      isShowErrorStrategySuggestion,
      taskSubTypes: currentTaskSubTypeCollection,
      currentMention: toContentState(props.defaultMissionDesc || ''),
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      isShowErrorInfo: nextError,
      isShowErrorExcuteType: nextExcuteTypeError,
      isShowErrorTaskType: nextTaskTypeError,
      isShowErrorIntervalValue: nextErrorIntervalValue,
      isShowErrorTaskName: nextErrorTaskName,
      isShowErrorStrategySuggestion: nextErrorStrategySuggestion,
    } = nextProps;
    const {
      isShowErrorInfo,
      isShowErrorExcuteType,
      isShowErrorTaskType,
      isShowErrorIntervalValue,
      isShowErrorTaskName,
      isShowErrorStrategySuggestion,
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
    if (nextErrorIntervalValue !== isShowErrorIntervalValue) {
      this.setState({
        isShowErrorIntervalValue: nextErrorIntervalValue,
      });
    }
    if (nextErrorStrategySuggestion !== isShowErrorStrategySuggestion) {
      this.setState({
        isShowErrorStrategySuggestion: nextErrorStrategySuggestion,
      });
    }
    if (nextErrorTaskName !== isShowErrorTaskName) {
      this.setState({
        isShowErrorTaskName: nextErrorTaskName,
      });
    }
  }

  getCurrentTaskSubTypes(currentMissionType) {
    const { taskTypes } = this.props;
    const currentTaskTypeCollection = _.find(taskTypes, item => item.key === currentMissionType) || {};
    let currentTaskSubTypeCollection = [{}];
    if (!_.isEmpty(currentTaskTypeCollection) && !_.isEmpty(currentTaskTypeCollection.children)) {
      currentTaskSubTypeCollection = currentTaskTypeCollection.children;
    }
    return currentTaskSubTypeCollection;
  }

  @autobind
  getData() {
    return toString(this.state.currentMention);
  }

  @autobind
  handleMentionChange(contentState) {
    if (!this.isFirstLoad) {
      let isShowErrorInfo = false;
      let content = _.replace(toString(contentState), regxp.returnLine, '');
      content = _.trim(content);
      if (_.isEmpty(content) || content.length > MAX_LENGTH) {
        isShowErrorInfo = true;
      }
      this.setState({
        currentMention: contentState,
        isShowErrorInfo,
      });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '任务类型:',
      value: '$args[0]',
    },
  })
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '执行方式',
      value: '$args[0]',
    },
  })
  handleExcuteTypeChange(value) {
    this.setState({
      isShowErrorExcuteType: _.isEmpty(value) || value === '请选择' || value === '暂无数据',
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '任务提示' } })
  handleSearchChange(value, trigger) {
    const { users, templetDescSuggestion, productDescSuggestions } = this.props;
    const searchValue = value.toLowerCase();
    const dataSource = _.includes(PREFIX, trigger)
      ? [...users, templetDescSuggestion, ...productDescSuggestions] : [];
    const filtered = dataSource.filter(item => item.name && item.name.toLowerCase().indexOf(searchValue) !== -1, );
    const suggestions = filtered.map(suggestion => (
      <Nav
        value={suggestion.type}
        // 来自瞄准镜，则添加一个sightLabel标记
        data={suggestion.isSightingScope ? 'sightLabel' : suggestion}
      >
        <span>{suggestion.name}</span>
      </Nav>
    ));
    this.setState({ suggestions });
  }

  @autobind
  handleMentionBlur() {
    this.isFirstLoad = false;
  }

  @autobind
  handleIntervalValueChange(value) {
    const isShowErrorIntervalValue = !regxp.positiveInteger.test(value)
      || Number(value) <= 0
      || Number(value) > 365;
    this.setState({
      isShowErrorIntervalValue,
    });
  }

  @autobind
  handleMissionNameChange(e) {
    const value = e.target.value;
    this.setState({
      isShowErrorTaskName: _.isEmpty(value) || value.length > 30,
    });
  }

  @autobind
  handleStrategySuggestionChange(e) {
    let value = _.replace(e.target.value, regxp.returnLine, '');
    value = _.trim(value);
    this.setState({
      isShowErrorStrategySuggestion: _.isEmpty(value) || value.length > MAX_LENGTH,
    });
  }

  handleCreatOptions(data) {
    if (!_.isEmpty(data)) {
      return data.map(item => <Option key={`task${item.key}`} value={item.key}>{item.value}</Option>, );
    }
    return null;
  }

  handleCreateTaskSubType(data) {
    if (!_.isEmpty(data)) {
      return data.map(item => <Option key={`subTask_${item.key}`} value={item.key}>{item.value}</Option>, );
    }
    return null;
  }

  renderMention() {
    const { defaultMissionDesc } = this.props;
    const { suggestions } = this.state;
    return (
      <div className={styles.wrapper}>
        <Mention
          mentionStyle={mentionTextStyle}
          suggestionStyle={suggestionStyle}
          style={{ width: '100%', height: 100 }}
          placeholder="请在描述客户经理联系客户前需要了解的客户相关信息，比如持仓情况。"
          prefix={PREFIX}
          onSearchChange={this.handleSearchChange}
          suggestions={suggestions}
          getSuggestionContainer={() => this.fatherMention}
          multiLines
          defaultValue={toContentState(defaultMissionDesc)}
          onChange={this.handleMentionChange}
          onBlur={this.handleMentionBlur}
        />
      </div>
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
      isShowErrorIntervalValue,
      isShowErrorStrategySuggestion,
      isShowErrorTaskName,
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
    } = this.props;

    const { getFieldDecorator } = form;

    const errorProps = isShowErrorInfo ? {
      validateStatus: 'error',
      help: `任务提示不能为空，最多${MAX_LENGTH}个汉字`,
    } : null;

    const taskTypeErrorSelectProps = isShowErrorTaskType ? {
      validateStatus: 'error',
      help: '请选择任务类型',
    } : null;

    const excuteTypeErrorSelectProps = isShowErrorExcuteType ? {
      validateStatus: 'error',
      help: '请选择执行方式',
    } : null;

    const taskNameErrorProps = isShowErrorTaskName ? {
      validateStatus: 'error',
      help: '任务名称不能为空，最多30个字符',
    } : null;

    const timelyIntervalValueErrorProps = isShowErrorIntervalValue ? {
      validateStatus: 'error',
      help: '有效期只能为正整数，不能超过365天',
    } : null;

    const serviceStrategySuggestionErrorProps = isShowErrorStrategySuggestion ? {
      validateStatus: 'error',
      help: `服务策略不能为空，最多${MAX_LENGTH}个汉字`,

    } : null;

    return (
      <Form>
        <ul className={styles.task_selectList}>
          {/**
           * 任务名称
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}>
              <i className={styles.required_i}>*</i>
任务名称:
            </label>
            <FormItem
              wrapperCol={{ span: 12 }}
              {...taskNameErrorProps}
            >
              {getFieldDecorator('taskName',
                {
                  initialValue: defaultMissionName,
                })(<Input
                  placeholder="请输入任务名称"
                  onChange={this.handleMissionNameChange}
                />)}
            </FormItem>
          </li>
          {/**
           * 任务类型
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}>
              <i className={styles.required_i}>*</i>
任务类型:
            </label>
            {
              !_.isEmpty(taskTypes)
                ? (
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
                         </Select>,)}
                  </FormItem>
                )
                : (
                  <FormItem
                    wrapperCol={{ span: 12 }}
                    {...taskTypeErrorSelectProps}
                  >
                    <Select defaultValue="暂无数据">
                      <Option key="null" value="0">暂无数据</Option>
                    </Select>
                  </FormItem>
                )
            }
          </li>
          {/**
           * 执行方式
           */}
          <li>
            <label htmlFor="dd" className={styles.task_label}>
              <i className={styles.required_i}>*</i>
执行方式:
            </label>
            {
              !_.isEmpty(executeTypes)
                ? (
                  <FormItem
                    wrapperCol={{ span: 12 }}
                    {...excuteTypeErrorSelectProps}
                  >
                    {getFieldDecorator('executionType',
                      {
                        initialValue: defaultExecutionType,
                      })(<Select onChange={this.handleExcuteTypeChange}>
                        {this.handleCreatOptions(executeTypes)}
                         </Select>,)}
                  </FormItem>
                )
                : (
                  <FormItem
                    wrapperCol={{ span: 12 }}
                    {...excuteTypeErrorSelectProps}
                  >
                    <Select defaultValue="暂无数据">
                      <Option key="null" value="0">暂无数据</Option>
                    </Select>
                  </FormItem>
                )
            }
          </li>
          <li>
            <label htmlFor="dd" className={styles.task_label}>
              <i className={styles.required_i}>*</i>
有效期(天):
            </label>
            <FormItem
              wrapperCol={{ span: 12 }}
              className={styles.timelyIntervalValueItem}
              {...timelyIntervalValueErrorProps}
            >
              {getFieldDecorator('timelyIntervalValue',
                {
                  initialValue: defaultInitialValue,
                })(<InputNumber
                  step={1}
                  min={0}
                  max={365}
                  style={{ width: '100%' }}
                  onChange={this.handleIntervalValueChange}
                />)}
            </FormItem>
          </li>
        </ul>
        <div className={styles.task_textArea}>
          <p>
            <label htmlFor="desc">
              <i>*</i>
服务策略:
              <br />
（适用于所有客户）
            </label>
          </p>
          <FormItem
            {...serviceStrategySuggestionErrorProps}
          >
            {getFieldDecorator('serviceStrategySuggestion',
              {
                initialValue: defaultServiceStrategySuggestion,
              })(<TextArea
                id="desc"
                rows={5}
                placeholder="请在此介绍该新建任务的服务策略，以指导客户经理或投顾实施任务。"
                style={{ width: '100%' }}
                maxLength={MAX_LENGTH}
                onChange={this.handleStrategySuggestionChange}
              />, )}
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
            <label htmlFor="desc">
              <i>*</i>
任务提示:
            </label>
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
      </Form>
    );
  }
}
