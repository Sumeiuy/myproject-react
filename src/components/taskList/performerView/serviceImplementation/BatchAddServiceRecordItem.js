/**
 * @Author: XuWenKang
 * @Description: 批量添加服务记录项
 * @Date: 2018-08-17 11:31:18
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-20 13:38:47
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Select,
  Checkbox,
  DatePicker,
  Radio,
  Input,
} from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import logable from '../../../../decorators/logable';
import CommonUpload from '../../../common/biz/CommonUpload';
import Icon from '../../../common/Icon';

import styles from './batchAddServiceRecordItem.less';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const FormItem = Form.Item;

// 任务详情里是否选中的key值
const IS_CHECKED_KEY = 'isChecked';
// 任务详情里一级反馈的key值
const FIRST_FEEDBACK_KEY = 'serveCustFeedBack';
// 任务详情里二级反馈的key值
const SECOND_FEEDBACK_KEY = 'serveCustFeedBack2';
// 任务详情里反馈时间的key值
const FEEDBACK_TIME_KEY = 'feedBackTime';
// 任务详情里附件的key值
const FEEDBACK_ATTACHMENT_KEY = 'uuid';
// 任务详情里回访结果的key值
const VISIT_RESULT_KEY = 'visitResult';
// 任务详情里回访结果成功的value值
const VISIT_RESULT_SUCCESS_VALUE = 'Success';
// 任务详情里回访结果失败的value值
const VISIT_RESULT_FAILED_VALUE = 'Lost';
// 任务详情里失败原因的key值
const VISIT_FAILURE_DESC_KEY = 'visitFailureDesc';


export default class BatchAddServiceRecordItem extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    // 当前任务在其他待办任务数组里的索引
    index: PropTypes.number.isRequired,
    // 数据发生变化时的回调函数
    onFormChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: {},
  }

  // 根据当前选择的一级反馈code从客户数据的客户反馈列表中找出对应的一级反馈项
  @autobind
  getFirstFeedbackItem(code) {
    const { data: { feedbackList } } = this.props;
    return _.filter(feedbackList, item => item.id === code)[0] || EMPTY_OBJECT;
  }

  // 下拉框错误信息显示
  @autobind
  getSelectValdateInfo() {
    const { data } = this.props;
    if (data[IS_CHECKED_KEY]) {
      // 判断当前一级反馈是否为空
      if (!data[FIRST_FEEDBACK_KEY]) {
        return {
          validateStatus: 'error',
          help: '请选择一级反馈',
        };
      }
      if (
          // 判断是否需要显示二级反馈选框，如果需要的话所选二级反馈不能为空
          this.checkIsNeedSecondFeedback(data[FIRST_FEEDBACK_KEY]) &&
          !data[SECOND_FEEDBACK_KEY]
        ) {
        return {
          validateStatus: 'error',
          help: '请选择二级反馈',
        };
      }
    }
    return {
      validateStatus: '',
      help: '',
    };
  }

  // 时间选择错误信息显示
  @autobind
  getTimeValdateInfo() {
    const { data } = this.props;
    if (data[IS_CHECKED_KEY] && _.isEmpty(data[FEEDBACK_TIME_KEY])) {
      return {
        validateStatus: 'error',
        help: '请选择反馈时间',
      };
    }
    return {
      validateStatus: '',
      help: '',
    };
  }

  // 回访结果错误信息显示
  @autobind
  getRadioValdateInfo() {
    const { data } = this.props;
    if (data[IS_CHECKED_KEY] && _.isEmpty(data[VISIT_RESULT_KEY])) {
      return {
        validateStatus: 'error',
        help: '请选择回访结果',
      };
    }
    return {
      validateStatus: '',
      help: '',
    };
  }

  // 失败原因错误信息显示
  @autobind
  getReasonValdateInfo() {
    const { data } = this.props;
    if (data[IS_CHECKED_KEY] && _.isEmpty(data[VISIT_FAILURE_DESC_KEY])) {
      return {
        validateStatus: 'error',
        help: '请输入失败原因',
      };
    }
    return {
      validateStatus: '',
      help: '',
    };
  }

  // 根据当前选择的一级反馈是否有二级反馈列表来判断是否显示二级反馈的选框
  @autobind
  getSecondClassName() {
    const { data } = this.props;
    return classnames({
      // 当前已经选择的一级反馈为空，或者该一级反馈不需要显示二级反馈(由于选择的code可能为数字，所以不能用_.isEmpty判断)
      [styles.hide]: !data[FIRST_FEEDBACK_KEY] ||
        !this.checkIsNeedSecondFeedback(data[FIRST_FEEDBACK_KEY]),
      [styles.secondSelectBox]: true,
    });
  }

  // 一级反馈option
  @autobind
  getFirstFeedbackOptionList() {
    const { data: { feedbackList } } = this.props;
    return feedbackList.map(item => (
      <Option value={item.id} key={item.id}>{item.name}</Option>
    ));
  }

  // 二级反馈option
  @autobind
  getSecondFeedbackOptionList() {
    const { data: { serveCustFeedBack } } = this.props;
    const list = this.getFirstFeedbackItem(serveCustFeedBack).childList || EMPTY_ARRAY;
    return list.map(item => (
      <Option value={item.id} key={item.id}>{item.name}</Option>
    ));
  }

  @autobind
  getDisabledDate(current) {
    return current > moment().endOf('day');
  }

  @autobind
  getFormItemLabel(text, isRequired = true) {
    return (
      <span className={styles.labelText}>
        <i>{isRequired ? '*' : ' '} </i>
        {text}
      </span>
    );
  }

  // 判断是否需要选择二级反馈
  @autobind
  checkIsNeedSecondFeedback(firstCode) {
    const firstItem = this.getFirstFeedbackItem(firstCode);
    const { childList = EMPTY_ARRAY } = firstItem;
    // 如果该一级反馈的二级反馈只有一个选项，并且该二级反馈的name字段和一级反馈name相同，就不需要显示选择二级反馈的选框
    if (childList.length === 1 &&
      childList[0].name === firstItem.name) {
      return false;
    }
    return true;
  }

  @autobind
  handleFormChange(key, value) {
    const { index, onFormChange } = this.props;
    onFormChange({
      index,
      key,
      value,
    });
  }

  // 选择代办任务
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '选择代办任务',
      value: '$args[1]',
    },
  })
  handleChangeCheckbox(value) {
    this.handleFormChange(IS_CHECKED_KEY, value);
  }

  // 选择一级反馈
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择一级反馈',
      value: '$args[0]',
    },
  })
  handleFirstFeedbackChange(value) {
    this.handleFormChange(FIRST_FEEDBACK_KEY, value);
    // 如果该当前一级反馈不需要手动选择二级反馈时，自动把该一级反馈下的第一个二级反馈的id回填
    if (!this.checkIsNeedSecondFeedback(value)) {
      const firstItem = this.getFirstFeedbackItem(value);
      const { childList } = firstItem;
      this.handleFormChange(SECOND_FEEDBACK_KEY, childList[0].id);
    } else {
      this.handleFormChange(SECOND_FEEDBACK_KEY, '');
    }
  }

  // 选择一级反馈
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '选择二级反馈',
      value: '$args[0]',
    },
  })
  handleSecondFeedbackChange(value) {
    this.handleFormChange(SECOND_FEEDBACK_KEY, value);
  }

  // 选择反馈时间
  @autobind
  @logable({
    type: 'CalendarSelect',
    payload: {
      name: '选择反馈时间',
      value: '$args[1]',
    },
  })
  hanldeDateChange(date, dateStr) {
    this.handleFormChange(FEEDBACK_TIME_KEY, dateStr);
  }

  // 修改失败原因
  @autobind
  handleChangeVisitResult(e) {
    this.handleFormChange(VISIT_FAILURE_DESC_KEY, e.target.value);
  }

  // 修改回访结果
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '回访结果',
      value: '$args[0]',
    },
  })
  handleChangeRadio(value) {
    this.handleFormChange(VISIT_RESULT_KEY, value);
  }

  @autobind
  handleUploadSuccess(attachment) {
    this.handleFormChange(FEEDBACK_ATTACHMENT_KEY, attachment);
  }

  render() {
    const {
      data = EMPTY_OBJECT,
    } = this.props;

    const selectValdateInfo = this.getSelectValdateInfo();
    const timeValdateInfo = this.getTimeValdateInfo();
    const radioValdateInfo = this.getRadioValdateInfo();
    const reasonValdateInfo = this.getReasonValdateInfo();
    const uploadHideClass = classnames({
      [styles.hide]: !data[IS_CHECKED_KEY],
    });
    const hackUploadHideClass = classnames({
      [styles.hide]: data[IS_CHECKED_KEY],
    });

    return (
      <div className={styles.itemBox}>
        <div className={styles.title}>
          <Checkbox
            checked={data[IS_CHECKED_KEY]}
            onChange={e => this.handleChangeCheckbox(e.target.checked, data.flowId)}
          />
          <span className={styles.titleText}>{data.eventName}</span>
        </div>
        {/* 非mot回访任务，显示客户反馈下拉框和反馈时间，mot回访任务显示回访结果 */}
        {
          data.isMotVisit ?
            <div className={styles.motVisitBox}>
              <FormItem
                label={this.getFormItemLabel('回访结果')}
                validateStatus={radioValdateInfo.validateStatus}
                help={radioValdateInfo.help}
              >
                <RadioGroup
                  disabled={!data[IS_CHECKED_KEY]}
                  value={data[VISIT_RESULT_KEY]}
                  onChange={e => this.handleChangeRadio(e.target.value)}
                >
                  <Radio value={VISIT_RESULT_SUCCESS_VALUE}>成功</Radio>
                  <Radio value={VISIT_RESULT_FAILED_VALUE}>失败</Radio>
                </RadioGroup>
              </FormItem>
              {/* 回访结果选择失败时才展示失败原因输入框 */}
              {
                data[VISIT_RESULT_KEY] === VISIT_RESULT_FAILED_VALUE ?
                  <FormItem
                    label={this.getFormItemLabel('失败原因')}
                    validateStatus={reasonValdateInfo.validateStatus}
                    help={reasonValdateInfo.help}
                  >
                    <TextArea
                      disabled={!data[IS_CHECKED_KEY]}
                      value={data[VISIT_FAILURE_DESC_KEY]}
                      onChange={this.handleChangeVisitResult}
                    />
                  </FormItem>
                :
                  null
              }
            </div>
          :
            <div>
              <FormItem
                label={this.getFormItemLabel('客户反馈')}
                validateStatus={selectValdateInfo.validateStatus}
                help={selectValdateInfo.help}
              >
                <Select
                  disabled={!data[IS_CHECKED_KEY]}
                  onChange={this.handleFirstFeedbackChange}
                  value={data[FIRST_FEEDBACK_KEY]}
                >
                  <Option value="">请选择</Option>
                  {this.getFirstFeedbackOptionList()}
                </Select>
                <div className={this.getSecondClassName()}>
                  <Select
                    disabled={!data[IS_CHECKED_KEY]}
                    onChange={this.handleSecondFeedbackChange}
                    value={data[SECOND_FEEDBACK_KEY]}
                  >
                    <Option value="">请选择</Option>
                    {this.getSecondFeedbackOptionList()}
                  </Select>
                </div>
              </FormItem>
              <FormItem
                label={this.getFormItemLabel('反馈时间')}
                validateStatus={timeValdateInfo.validateStatus}
                help={timeValdateInfo.help}
              >
                <DatePicker
                  className={styles.feedbackDatePicker}
                  disabledDate={this.getDisabledDate}
                  disabled={!data[IS_CHECKED_KEY]}
                  value={moment(data[FEEDBACK_TIME_KEY])}
                  onChange={this.hanldeDateChange}
                  allowClear={false}
                />
              </FormItem>
            </div>
        }
        <div className={`${styles.formItem} clearfix`}>
          <div className={styles.label}>
            附件：
          </div>
          <div className={styles.upload}>
            <div className={uploadHideClass}>
              <CommonUpload
                attachmentList={EMPTY_ARRAY}
                edit
                uploadAttachment={this.handleUploadSuccess}
                attachment={''}
                needDefaultText={false}
              />
            </div>
            <div className={hackUploadHideClass}>
              <div className={styles.hackUpload}>
                <Icon type="fujian1" />
                上传附件
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
