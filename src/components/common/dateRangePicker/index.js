/**
 * @Author: sunweibin
 * @Date: 2018-03-16 15:21:56
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-12 10:59:30
 * @description 将airbnb的日历组件的样式修改为本项目中需要的样式
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon } from 'antd';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { dom } from '../../../helper';

import styles from './index.less';

const START_DATE = 'startDate';
const END_DATE = 'endDate';

export default class CommonDateRangePicker extends PureComponent {
  static propTypes = {
    displayFormat: PropTypes.string,
    startDatePlaceholderText: PropTypes.string,
    endDatePlaceholderText: PropTypes.string,
    initialEndDate: PropTypes.object,
    initialStartDate: PropTypes.object,
    onChange: PropTypes.func,
    disabledRange: PropTypes.func,
    isInsideOffSet: PropTypes.func,
    hasCustomerOffset: PropTypes.bool,
  }
  static defaultProps = {
    displayFormat: 'YYYY-MM-DD',
    startDatePlaceholderText: '开始时间',
    endDatePlaceholderText: '结束时间',
    initialEndDate: null,
    initialStartDate: null,
    onChange: _.noop,
    // 是否使用用户自定义的时间段区间
    hasCustomerOffset: false,
    // 判断时间是否不在可选时间之内
    // 表示无论什么情况下，该日期均不能选择，true为不能选，false表示为能选
    disabledRange: () => false,
    // 判断时间是否在用户的自定义区间内
    isInsideOffSet: () => true,
  }

  constructor(props) {
    super(props);
    const { initialEndDate, initialStartDate } = props;
    this.state = {
      focusedInput: null,
      startDate: initialStartDate,
      endDate: initialEndDate,
      // 判断起始和结束日期有无变化
      dateHasChanged: false,
      // 判断是否用户选择了第一个日期
      hasSelectFirstDate: false,
      // 判断用户第一次选择的是开始日期还是结束日期
      whichDateInputUserSelect: null,
      // 用户选择的第一个日期
      firstDateUserSelect: null,
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
    const { width: viewWidth } = dom.getRect(document.body);
    const { left, width: drpWidth, top, height } = dom.getRect(this.drp);
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
      dom.setStyle(picker, 'top', `${top + height + 10}px`);
    }
  }

  @autobind
  showCalendar() {
    if (this.drp && this.drp.querySelector('.DateRangePicker_picker')) {
      // 弹出层出来了
      this.calcCalendarPosition();
    } else {
      // 还没出来
      setTimeout(this.showCalendar, 10);
    }
  }

  @autobind
  setFirstDateSelectOnStart({ startDate, endDate }) {
    this.setState({
      whichDateInputUserSelect: START_DATE,
      hasSelectFirstDate: true,
      firstDateUserSelect: startDate,
    }, () => {
      this.fixEndDate({ startDate, endDate });
    });
  }

  @autobind
  setFirstDateSelectOnEnd({ startDate, endDate }) {
    this.setState({
      whichDateInputUserSelect: END_DATE,
      hasSelectFirstDate: true,
      firstDateUserSelect: endDate,
    }, () => {
      this.fixStartDate({ startDate, endDate });
    });
  }

  @autobind
  restoreDefault() {
    this.setState({
      dateHasChanged: false,
      hasSelectFirstDate: false,
      whichDateInputUserSelect: null,
      firstDateUserSelect: null,
    });
  }

  @autobind
  addMomentDay(day) {
    return day.clone().add(1, 'day');
  }

  @autobind
  subtractMomentDay(day) {
    return day.clone().subtract(1, 'day');
  }

  @autobind
  fixDate(day, nextDay) {
    let date = nextDay(day);
    while (!this.isInCustomerDateRangeOffset(date)) {
      date = nextDay(date);
    }
    return date;
  }

  @autobind
  fixEndDate({ startDate, endDate }) {
    let date = endDate;
    // 如果endDate不在用户自定义的范围内，则修补
    if (endDate !== null) {
      date = endDate.clone();
      if (!this.isInCustomerDateRangeOffset(endDate)) {
        // TODO 修改时间
        date = this.fixDate(endDate, this.subtractMomentDay);
      }
    }
    this.setState({ startDate, endDate: date, dateHasChanged: true });
  }

  @autobind
  fixStartDate({ startDate, endDate }) {
    let date = startDate;
    // 如果startDate不在用户自定义的范围内，则修补
    if (startDate !== null) {
      date = startDate.clone();
      if (!this.isInCustomerDateRangeOffset(startDate)) {
        // TODO 修改时间
        date = this.fixDate(startDate, this.addMomentDay);
      }
    }
    this.setState({ startDate: date, endDate, dateHasChanged: true });
  }

  // 切换了日期
  @autobind
  handleDatesChange({ startDate, endDate }) {
    // 如果修改了 起始时间 或者 结束时间段， 则必须同步修改相应的时间
    // 来确保所选则的时间段在可选择的范围内
    const {
      focusedInput,
      hasSelectFirstDate,
    } = this.state;
    if (focusedInput === START_DATE) {
      // 点击的时间段在起始时间段上，
      // 此时哪些disabled的时间不能点击的
      // 此处表示修改的是起始时间
      // TODO 判断用户有没有进行过第一次选择时间
      if (!hasSelectFirstDate) {
        // TODO 此处增加判断，如果结束时间此时不在用户选择的范围内，则将其修改为最后的日期
        this.setFirstDateSelectOnStart({ startDate, endDate });
      } else {
        this.setState({ startDate, endDate, dateHasChanged: true });
      }
    } else if (focusedInput === END_DATE) {
      // 点击的时间段在结束时间段上
      if (!hasSelectFirstDate) {
        // TODO 此处增加判断，如果开始时间不在用户选择的范围内，则将其修改为开始的时间
        this.setFirstDateSelectOnEnd({ startDate, endDate });
      } else {
        this.setState({ startDate, endDate, dateHasChanged: true });
      }
    }
  }

  @autobind
  handleFoucusChange(focusedInput) {
    const { focusedInput: prevFocusedInput } = this.state;
    if (prevFocusedInput === null && focusedInput !== null) {
      // 打开日历组件, 此处需要进行第一次打开的时间段进行设置
      this.showCalendar();
    }
    // TODO 此处增加判断，如果用户直接手动切换选择结束日期或者开始日期
    // if (prevFocusedInput !== null && hasSelectFirstDate) {
    //   // this.restoreDefault();
    // }
    this.setState({ focusedInput });
  }

  @autobind
  handleCalenderClose(obj) {
    // 判断时间是否改变了
    const { startDate, endDate } = obj;
    if (this.state.dateHasChanged) {
      this.restoreDefault();
      // 将用户选择起始和结束时间的moment对象传递出去
      this.props.onChange({ startDate, endDate });
    }
  }


  @autobind
  isInOffSet(day) {
    const { firstDateUserSelect } = this.state;
    return this.props.isInsideOffSet({
      day,
      firstDay: firstDateUserSelect,
    });
  }

  // 判断时间是否在用户自定义的时间区间内
  // 如果在规定的范围内，则返回true, 则该日期可选
  // 如果不在规定的范围内，则返回false, 则该日期不可选
  @autobind
  isInCustomerDateRangeOffset(day) {
    const { hasCustomerOffset } = this.props;
    const { hasSelectFirstDate } = this.state;
    if (hasCustomerOffset && hasSelectFirstDate) {
      return this.isInOffSet(day);
    }
    return true;
  }

  // 这边有点绕
  // 判断日历日期渲染的时候，该日期在不在disabledRange范围内，
  // 如果在则返回true,则表示该日期不可选
  // 如果是false，则判断是否日期在用户指定的区间范围内
  // 如果在则为true,表示日期可选
  // 如果不在，则表示日期不可选
  @autobind
  isOutsideRange(day) {
    const { disabledRange } = this.props;
    // 1.首先判断是否在disabledRange
    if (disabledRange(day)) {
      // 该日期无论什么情况都不可选
      return true;
    }
    if (!this.isInCustomerDateRangeOffset(day)) {
      return true;
    }
    return false;
  }

  // 组件外部，通过 ref ，清空起止时间
  @autobind
  clearAllDate() {
    this.setState({
      focusedInput: null,
      endDate: null,
      startDate: null,
    });
  }

  render() {
    const {
      focusedInput,
      endDate,
      startDate,
    } = this.state;
    // 挑选出airbnb的props
    const airbnbDrpProps = _.omit(this.props, [
      'onChange',
      'isOutsideRange',
      'hasCustomerOffset',
      'disabledRange',
      'isInsideOffSet',
      'initialEndDate',
      'initialStartDate',
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
          onDatesChange={this.handleDatesChange}
          isOutsideRange={this.isOutsideRange}
          monthFormat="YYYY[年]MMMM"
          onFocusChange={this.handleFoucusChange}
          startDateId="startDateID"
          endDateId="endDateID"
          focusedInput={focusedInput}
          navPrev={<Icon type="left" />}
          navNext={<Icon type="right" />}
          onClose={this.handleCalenderClose}
          {...airbnbDrpProps}
        />
      </div>
    );
  }
}
