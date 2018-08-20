/**
 * @Author: XuWenKang
 * @Description: 批量添加服务记录项
 * @Date: 2018-08-17 11:31:18
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-20 13:38:47
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, Checkbox, DatePicker } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import moment from 'moment';
import logable from '../../../../decorators/logable';
import CommonUpload from '../../../common/biz/CommonUpload';
import Icon from '../../../common/Icon';

import styles from './batchAddServiceRecordItem.less';

const Option = Select.Option;
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
          // 判断所选得一级反馈里是否有二级反馈的选项，如果有的话所选二级反馈不能为空
          !_.isEmpty(this.getFirstFeedbackItem(data[FIRST_FEEDBACK_KEY]).childList) &&
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

  // 根据当前选择的一级反馈是否有二级反馈列表来判断是否显示二级反馈的选框
  @autobind
  getSecondClassName() {
    const { data: { serveCustFeedBack } } = this.props;
    const firstFeedbackItem = this.getFirstFeedbackItem(serveCustFeedBack);
    return classnames({
      // 当前已经选择的一级反馈为空，或者该一级反馈下没有二级反馈列表(由于选择的code可能为数字，所以不能用_.isEmpty判断)
      [styles.hide]: !serveCustFeedBack || _.isEmpty(firstFeedbackItem.childList),
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
    type: 'DropdownSelect',
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
    const feedbackLabel = (
      <span className={styles.labelText}>
        <i>* </i>
        客户反馈
      </span>
    );
    const timeLabel = (
      <span className={styles.labelText}>
        <i>* </i>
        反馈时间
      </span>
    );
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
        <FormItem
          label={feedbackLabel}
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
          label={timeLabel}
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
        <div className={`${styles.formItem} clearfix`}>
          <div className={styles.label}>
            附件：
          </div>
          <div className={styles.upload}>
            <div className={uploadHideClass}>
              <CommonUpload
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
