/**
 * @Author: sunweibin
 * @Date: 2018-03-16 15:21:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-17 15:03:54
 * @description 将airbnb的日历组件的样式修改为本项目中需要的样式
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon } from 'antd';
// import moment from 'moment';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { dom } from '../../../helper';

import styles from './index.less';

export default class CommonDateRangePicker extends PureComponent {
  static propTypes = {
    displayFormat: PropTypes.string,
    allowPastDays: PropTypes.bool,
    placeholderText: PropTypes.arrayOf(PropTypes.string),
    initialDate: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func,
  }
  static defaultProps = {
    allowPastDays: true,
    displayFormat: 'YYYY-MM-DD',
    placeholderText: ['开始时间', '结束时间'],
    initialDate: [null, null],
    onChange: _.noop,
  }

  constructor(props) {
    super(props);
    this.state = {
      endDate: props.initialDate[0],
      startDate: props.initialDate[1],
    };
  }

  @autobind
  drpWraperRef(input) {
    this.drp = input;
  }


  @autobind
  calcCalendarPosition() {
    const { width: viewWidth } = dom.getRect(document.body);
    const { left, width: drpWidth } = dom.getRect(this.drp);
    const picker = this.drp.querySelector('.DateRangePicker_picker');
    if (picker) {
      const { width } = dom.getRect(picker);
      const leftPlusWidth = left + width;
      if (leftPlusWidth > viewWidth) {
        const realLeft = left - (width - drpWidth);
        dom.setStyle(picker, 'left', `${realLeft}px`);
      } else {
        dom.setStyle(picker, 'left', `${left}px`);
      }
    }
  }

  @autobind
  handleDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  @autobind
  handleFoucusChange(focusedInput) {
    this.setState({ focusedInput });
    if (focusedInput !== null) {
      // focusedInput为null时候,就是隐藏
      // 不为null则就是显示日历
      // 此处需要对弹出框的位置进行重新计算
      setTimeout(() => { this.calcCalendarPosition(); }, 200);
    }
  }

  @autobind
  handleDisplayFormat() {
    return this.props.displayFormat;
  }

  @autobind
  handleCalenderClose(obj) {
    const { startDate, endDate } = obj;
    const { displayFormat } = this.props;
    this.props.onChange([
      startDate.format(displayFormat),
      endDate.format(displayFormat),
    ]);
  }

  render() {
    const {
      allowPastDays,
      placeholderText,
    } = this.props;
    const {
      focusedInput,
      endDate,
      startDate,
    } = this.state;
    // 此处是airbnb的组件中是否能够选择当前日期之前的日期
    // 如果需要选择当前日期之前的日期，则传递一个空函数即可
    const noop = allowPastDays ? _.noop : null;

    return (
      <div className={styles.drpWraper} ref={this.drpWraperRef}>
        <DateRangePicker
          showDefaultInputIcon
          small
          hideKeyboardShortcutsPanel
          customArrowIcon="~"
          startDate={startDate}
          endDate={endDate}
          startDatePlaceholderText={placeholderText[0]}
          endDatePlaceholderText={placeholderText[1]}
          onDatesChange={this.handleDatesChange}
          isOutsideRange={noop}
          monthFormat="YYYY[年]MMMM"
          onFocusChange={this.handleFoucusChange}
          startDateId="startDateID"
          endDateId="endDateID"
          focusedInput={focusedInput}
          displayFormat={this.handleDisplayFormat}
          navPrev={<Icon type="left" />}
          navNext={<Icon type="right" />}
          onClose={this.handleCalenderClose}
        />
      </div>
    );
  }
}
