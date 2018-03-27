/**
 * @Author: sunweibin
 * @Date: 2018-03-16 15:21:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-03-26 17:29:09
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

// import { dom } from '../../../helper';
// import { isInclusivelyAfterDay, isInclusivelyBeforeDay } from './utils';

import styles from './index.less';

export default class CommonDateRangePicker extends PureComponent {
  static propTypes = {
    displayFormat: PropTypes.string,
    placeholderText: PropTypes.arrayOf(PropTypes.string),
    initialDate: PropTypes.arrayOf(PropTypes.object).isRequired,
    onChange: PropTypes.func,
    isOutsideRange: PropTypes.func,
    selectStart: PropTypes.func,
    selectEnd: PropTypes.func,
  }
  static defaultProps = {
    displayFormat: 'YYYY-MM-DD',
    placeholderText: ['开始时间', '结束时间'],
    initialDate: [null, null],
    onChange: _.noop,
    selectStart: _.noop,
    selectEnd: _.noop,
    isOutsideRange: () => false,
  }

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      startDate: props.initialDate[0],
      endDate: props.initialDate[1],
      dateHasChanged: false,
    };
  }

  @autobind
  drpWraperRef(input) {
    this.drp = input;
  }

  // 格式化日期
  @autobind
  formateDate(date) {
    const { displayFormat } = this.props;
    return date.format(displayFormat);
  }

  // 计算日历下拉框的位置
  @autobind
  calcCalendarPosition() {
    // const { width: viewWidth } = dom.getRect(document.body);
    // const { left, width: drpWidth } = dom.getRect(this.drp);
    // const picker = this.drp.querySelector('.DateRangePicker_picker');
    // if (picker) {
    //   const { width } = dom.getRect(picker);
    //   const leftPlusWidth = left + width;
    //   if (leftPlusWidth > viewWidth) {
    //     const realLeft = left - (width - drpWidth);
    //     dom.setStyle(picker, 'left', `${realLeft}px`);
    //   } else {
    //     dom.setStyle(picker, 'left', `${left}px`);
    //   }
    // }
  }

  // 切换了日期
  @autobind
  handleDatesChange({ startDate, endDate }) {
    const { focusedInput } = this.state;
    if (focusedInput === 'startDateID') {
      this.props.selectStart(startDate);
    } else if (focusedInput === 'endDateID') {
      this.props.selectEnd(endDate);
    }
    this.setState({ startDate, endDate, dateHasChanged: true });
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
  handleCalenderClose(obj) {
    // 判断时间是否改变了
    const { startDate, endDate } = obj;
    if (this.state.dateHasChanged) {
      this.setState({ dateHasChanged: false });
      // 将用户选择起始和结束时间的moment对象传递出去
      this.props.onChange({ startDate, endDate });
    }
  }

  render() {
    const {
      placeholderText,
      displayFormat,
      isOutsideRange,
    } = this.props;
    const {
      focusedInput,
      endDate,
      startDate,
    } = this.state;
    // 挑选出airbnb的props
    const airbnbDrpProps = _.omit(this.props, [
      'displayFormat',
      'placeholderText',
      'initialDate',
      'onChange',
      'isOutsideRange',
      'selectStart',
      'selectEnd',
    ]);

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
          isOutsideRange={isOutsideRange}
          monthFormat="YYYY[年]MMMM"
          onFocusChange={this.handleFoucusChange}
          startDateId="startDateID"
          endDateId="endDateID"
          focusedInput={focusedInput}
          displayFormat={displayFormat}
          navPrev={<Icon type="left" />}
          navNext={<Icon type="right" />}
          onClose={this.handleCalenderClose}
          {...airbnbDrpProps}
        />
      </div>
    );
  }
}
