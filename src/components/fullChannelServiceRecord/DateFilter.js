/**
 * @file components/fullChannelServiceRecord/DateFilter.js
 *  全渠道服务记录筛选区日期选择筛选
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './dateFilter.less';

const RangePicker = DatePicker.RangePicker;

const EMPTY_LIST = [];
const rangePickerStyle = { width: '222px' };
const dateFormat = 'YYYY/MM/DD';

export default class DateFilter extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      location: {
        query: {
          serviceTimeStart = '',
          serviceTimeEnd = '',
          feedbackTimeStart = '',
          feedbackTimeEnd = '',
        },
      },
    } = props;
    this.state = {
      serviceTimeStart,
      serviceTimeEnd,
      feedbackTimeStart,
      feedbackTimeEnd,
    };
  }

  @autobind
  onServiceTimeChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    this.setState({
      serviceTimeStart: dateStrings[0],
      serviceTimeEnd: dateStrings[1],
    });
  }

  @autobind
  onFeedbackTimeChange(dates, dateStrings) {
    console.log('From: ', dates[0], ', to: ', dates[1]);
    console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
    this.setState({
      feedbackTimeStart: dateStrings[0],
      feedbackTimeEnd: dateStrings[1],
    });
  }

  @autobind
  handleOk() {
    this.props.onChange(this.state);
  }

  disabledDate(current) {
    if (current) {
      return current.valueOf() < moment().subtract(6, 'months');
    }
    return Date.now();
  }

  render() {
    const {
      location: {
        query: {
          serviceTimeStart,
          serviceTimeEnd,
          feedbackTimeStart,
          feedbackTimeEnd,
        },
      },
    } = this.props;
    return (
      <div className={styles.dateFilter}>
        <span className={styles.label}>服务时间:</span>
        <div className={styles.rangePickerBox}>
          <RangePicker
            style={rangePickerStyle}
            defaultValue={
              serviceTimeStart && serviceTimeEnd ?
              [moment(serviceTimeStart, dateFormat), moment(serviceTimeEnd, dateFormat)]
              : EMPTY_LIST
            }
            showTime
            format={dateFormat}
            disabledDate={this.disabledDate}
            onChange={this.onServiceTimeChange}
            onOk={this.handleOk}
          />
        </div>
        <span className={styles.label}>反馈时间:</span>
        <div className={styles.rangePickerBox}>
          <RangePicker
            style={rangePickerStyle}
            defaultValue={
              feedbackTimeStart && feedbackTimeEnd ?
              [moment(feedbackTimeStart, dateFormat), moment(feedbackTimeEnd, dateFormat)]
              : EMPTY_LIST
            }
            showTime
            format={dateFormat}
            disabledDate={this.disabledDate}
            onChange={this.onFeedbackTimeChange}
            onOk={this.handleOk}
          />
        </div>
      </div>
    );
  }
}
