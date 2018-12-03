/**
 * @Author: sunweibin
 * @Date: 2018-03-16 15:21:56
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-02 20:39:08
 * @description 将airbnb的日历组件的样式修改为本项目中需要的样式
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from 'react-dates';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import { Icon } from 'antd';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import { dom } from '../../../helper';
import styles from './index.less';

const START_DATE = 'startDate';
const END_DATE = 'endDate';

export default class CommonDateRangePicker extends PureComponent {
  static getDerivedStateFromProps(props, state) {
    const { prevProps } = state;
    let nextState = {
      prevProps: props,
    };
    if (props.initialStartDate !== prevProps.initialStartDate) {
      nextState = {
        ...nextState,
        startDate: props.initialStartDate,
      };
    }
    if (props.initialEndDate !== prevProps.initialEndDate) {
      nextState = {
        ...nextState,
        endDate: props.initialEndDate,
      };
    }
    return nextState;
  }

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
    defaultVisible: PropTypes.bool,
    // 日期组件是否需要position: fixed,默认不需要
    isFixed: PropTypes.bool,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
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
    defaultVisible: false,
    isFixed: false,
  }

  constructor(props) {
    super(props);
    const { initialEndDate, initialStartDate, defaultVisible } = props;
    this.state = {
      // 渲染日历浮层出现在 startDate or endDate 下面
      curFocusedInput: defaultVisible ? START_DATE : null,
      startDate: initialStartDate,
      endDate: initialEndDate,
      prevProps: props,
    };
  }

  // 组件内全局对象，不能写到组件外，组件外全局对象，会被多个组件共用，相互干扰
  focusedInput = null;

  firstDateUserSelect = null;

  // 用户选择的第一个日期
  isSetRangeOfEndDate = false;

  // 首次聚焦组件在 endDate 处的标志，用于圈定日历浮层范围用
  lastDate = null; // 记录上次选中的 startDate 和 endDate，用于回滚数据用

  // 格式化日期
  @autobind
  formateDate(date) {
    const { displayFormat } = this.props;
    return date.format(displayFormat);
  }

  @autobind
  restoreDefault() {
    this.firstDateUserSelect = null;
    this.focusedInput = null;
    this.isSetRangeOfEndDate = false;
    this.lastDate = null;
  }

  @autobind
  addDay(day) {
    return day.clone().add(1, 'day');
  }

  @autobind
  subtractDay(day) {
    return day.clone().subtract(1, 'day');
  }

  @autobind
  fixDate(day, iterationFunc) {
    let date = day;
    // 是否在 圈定的时间范围 内
    while (!this.isInCustomerDateRangeOffset(date)) {
      date = iterationFunc(date);
    }
    return date;
  }

  @autobind
  fixStartOrEndTime({ startDate, endDate }) {
    const isFocuseEndDate = this.focusedInput === END_DATE;
    const fixFunc = isFocuseEndDate ? this.subtractDay : this.addDay;
    const needFixDate = isFocuseEndDate ? endDate : startDate;
    const newDate = this.fixDate(needFixDate, fixFunc);
    return isFocuseEndDate ? { startDate, endDate: newDate } : { startDate: newDate, endDate };
  }

  @autobind
  drpWraperRef(input) {
    this.drpWraper = input;
  }

  // 切换了日期
  // 如果修改了 起始时间 或者 结束时间段， 则必须同步修改相应的时间
  // 来确保所选则的时间段在可选择的范围内
  @autobind
  handleDatesChange({ startDate, endDate }) {
    // 日历浮层已展示，重置状态
    this.isSetRangeOfEndDate = false;
    const { initialEndDate, initialStartDate, hasCustomerOffset } = this.props;
    // 当且仅当，endDate 有初始值 且 自定义时间范围，赋值startDate时，startDate > endDate 时，会清空 endDate
    if (endDate === null && initialEndDate && hasCustomerOffset) {
      this.lastDate = { startDate: initialStartDate, endDate: initialEndDate };
    } else {
      this.lastDate = null;
    }
    // 此方法内：focusedInput 为 END_DATE 的情况：赋值 startDate 后，光标在 endDate 处
    // 每次对开始日期做更改，都要重新圈定日历浮层中的可选范围
    if (this.focusedInput === END_DATE) {
      // 记录当前选中的值
      this.firstDateUserSelect = startDate;
    }
    // 修正 另一个值 的显示
    const changeDate = this.fixStartOrEndTime({ startDate, endDate });
    // 更新到 state 中，用于 render 时显示
    this.setState(changeDate);
  }

  @autobind
  handleFoucusChange(curFocusedInput) {
    if (this.focusedInput === null && curFocusedInput !== null) {
      // 日历浮层出现前，重置状态
      this.restoreDefault();
    }
    this.focusedInput = curFocusedInput;
    // 用于 render 显示 日历浮层
    this.setState({ curFocusedInput });
    // 首次聚焦日历组件为 END_DATE时，需要圈定可选范围： startEnd 向后推 59 天
    if (curFocusedInput === END_DATE && this.firstDateUserSelect === null) {
      // 更新当前选中的值
      this.firstDateUserSelect = this.props.initialStartDate;
      // 日历浮层未展示，设置状态
      this.isSetRangeOfEndDate = true;
    }
    const { isFixed } = this.props;
    if (this.focusedInput !== null && isFixed) {
      // focusedInput为null时候,就是隐藏
      // 不为null则就是显示日历,isCalcCalendarPosition判断日历弹窗是否需要去计算位置
      // 此处需要对弹出框的位置进行重新计算
      setTimeout(() => { this.calcCalendarPosition(); }, 200);
    }
  }

  // 计算日历下拉框的位置
  @autobind
  calcCalendarPosition() {
    const { width: viewWidth } = dom.getRect(document.body);
    const {
      left, top, width: drpWidth, height: drpHeight
    } = dom.getRect(this.drpWraper);
    const picker = this.drpWraper.querySelector('.DateRangePicker_picker');
    if (picker) {
      const { width } = dom.getRect(picker);
      const leftPlusWidth = left + width;
      const realTop = top + drpHeight;
      if (leftPlusWidth > viewWidth) {
        const realLeft = left - (width - drpWidth);
        dom.setStyle(picker, 'left', `${realLeft}px`);
      } else {
        dom.setStyle(picker, 'left', `${left}px`);
      }
      dom.setStyle(picker, 'top', `${realTop}px`);
      dom.setStyle(picker, 'visibility', 'visible');
    }
  }

  // 触发该方法时刻：
  // 1.startDate 有值，且首次 触发 赋值 endDate。(此刻组件的onClose事件（浮层消失）会先于 onDatesChange 方法执行)
  // 2.用户点击组件之外的区域
  @autobind
  handleCalenderClose({ startDate, endDate }) {
    // 关闭日历浮层，重置状态
    this.isSetRangeOfEndDate = false;
    if (this.lastDate && endDate === null) {
      // 时间段不完整，回滚到上一个 时间段
      this.setState(this.lastDate);
      return;
    }
    let newSelectDate = { startDate, endDate };
    // 此方法内 firstDateUserSelect 为 null，是首次触发 赋值 的标志
    // 首次 触发赋值，需要 修正 startDate 值
    if (this.firstDateUserSelect === null) {
      // 更新当前选中的值
      this.firstDateUserSelect = endDate;
      // 修正 startDate 值
      newSelectDate = this.fixStartOrEndTime({ startDate, endDate });
      // 更新 state，用于 render 时显示
      this.setState(newSelectDate);
    }
    // 将用户选择起始和结束时间的moment对象传递出去
    this.props.onChange(newSelectDate);
  }


  @autobind
  isInOffSet(day) {
    return this.props.isInsideOffSet({
      firstDay: this.firstDateUserSelect,
      focusedInput: this.focusedInput,
      flag: this.isSetRangeOfEndDate,
      day,
    });
  }

  // 判断时间是否在用户自定义的时间区间内
  // 如果在规定的范围内，则返回true, 则该日期可选
  // 如果不在规定的范围内，则返回false, 则该日期不可选
  @autobind
  isInCustomerDateRangeOffset(day) {
    const { hasCustomerOffset } = this.props;
    if (hasCustomerOffset && this.firstDateUserSelect && day) {
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
      endDate: null,
      startDate: null,
    });
  }

  render() {
    const {
      curFocusedInput,
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
      'defaultVisible',
      'isFixed',
      'className',
    ]);

    const { isFixed } = this.props;
    const drpWraperCls = classnames({
      [styles.drpWraper]: true,
      [styles.drpWraperFixed]: isFixed,
      [this.props.className]: true,
    });

    return (
      <div className={drpWraperCls} ref={this.drpWraperRef}>
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
          focusedInput={curFocusedInput}
          navPrev={<Icon type="left" />}
          navNext={<Icon type="right" />}
          onClose={this.handleCalenderClose}
          {...airbnbDrpProps}
        />
      </div>
    );
  }
}
