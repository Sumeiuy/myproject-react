/**
 * @fileOverview pageCommon/DurationSelect.js
 * @author sunweibin
 * @description 时间段选择器
 */

import React, { PropTypes, PureComponent } from 'react';
import { Radio, DatePicker } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';

import { getDurationString } from '../../utils/helper';
import { optionsMap } from '../../config';
import Icon from '../common/Icon';
import styles from './DurationSelect.less';

moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 时间筛选条件
const timeOptions = optionsMap.time;
const historyTime = optionsMap.historyTime;
const compareArray = optionsMap.compare;

// 渲染5个头部期间Radio
const timeRadios = timeOptions.map((item, index) => {
  const timeIndex = `Timeradio${index}`;
  return React.createElement(RadioButton, { key: timeIndex, value: `${item.key}` }, `${item.name}`);
});
const historyTimeRadios = (
  historyTime.map((item, index) => {
    const timeIndex = `Timeradio${index}`;
    return <RadioButton key={timeIndex} value={item.key}>{item.name}</RadioButton>;
  })
);

export default class DurationSelect extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { pathname } } = props;
    // 判断是否在 history 路由里
    const isHistory = pathname === '/history';
    const value = 'month';
    const obj = getDurationString(value);
    const beginMoment = moment(obj.begin);
    const endMoment = moment(obj.end);
    this.state = {
      open: false,
      cycleType: value,
      beginMoment,
      endMoment,
      selfDatePickerOpen: false,
      compare: compareArray[0].key,
      isHistory,
      ...obj,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 因为Url中只有boardId会变化
    const { location: { query: { boardId }, pathname } } = nextProps;
    const { location: { query: { boardId: preBId }, pathname: prePathname } } = this.props;
    if (Number(boardId || '1') !== Number(preBId || '1')) {
      const duration = getDurationString('month');
      this.setState({
        open: false,
        ...duration,
      });
    }
    if (!_.isEqual(pathname, prePathname)) {
      const isHistory = pathname === '/history';
      this.setState({
        isHistory,
      });
    }
  }
  // 环比同比切换事件
  @autobind
  compareChangeHandle(e) {
    const compare = e.target.value;
    const { cycleType } = this.state;
    let lastBegin;
    let lastEnd;
    if (compare === 'MoM') {
      const { beginMoment, endMoment } = this.state;
      const begin = beginMoment.format('YYYYMMDD');
      const end = endMoment.format('YYYYMMDD');
      const distanceDays = moment(end).diff(moment(begin), 'days') + 1;
      const lastBeginMoment = moment(begin).subtract(distanceDays, 'days');
      const lastEndMoment = moment(end).subtract(distanceDays, 'days');
      lastBegin = lastBeginMoment.format('YYYYMMDD');
      lastEnd = lastEndMoment.format('YYYYMMDD');
    } else {
      const nowDuration = getDurationString(cycleType);
      const lastBeginMoment = moment(nowDuration.begin).subtract(1, 'year');
      const lastEndMoment = moment(nowDuration.end).subtract(1, 'year');
      lastBegin = lastBeginMoment.format('YYYYMMDD');
      lastEnd = lastEndMoment.format('YYYYMMDD');
    }
    this.setState({
      compare,
      selfDatePickerOpen: false,
      lastBegin,
      lastEnd,
    }, this.saveDurationToHome);
  }
  // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    const duration = getDurationString(value);
    const { updateQueryState, collectData } = this.props;
    collectData({
      text: duration.cycleType,
    });
    this.setState({
      open: false,
      ...duration,
    });
    // 需要改变query中的查询变量
    // 修改查询使用参数
    updateQueryState({
      begin: duration.begin,
      end: duration.end,
      cycleType: duration.cycleType,
    });
  }
  @autobind
  hideDurationPicker() {
    this.setState({
      open: false,
    });
    document.removeEventListener('click', this.hideDurationPicker);
  }

  @autobind
  handleDurationClick() {
    // 需要给document一个click事件
    document.addEventListener('click', this.hideDurationPicker, false);
    this.setState({
      open: true,
    });
  }
  // 给 DatePicker 添加 wrapper
  @autobind
  findContainer() {
    return document.querySelectorAll('.durationSelect')[0];
  }
  @autobind
  disabledDate(current) {
    // 不能选择大于今天的日期
    return current && current.valueOf() > moment(moment().format('YYYYMMDD')).subtract(1, 'days').valueOf();
  }
  // 用户自己选的时间段事件
  @autobind
  rangePickerChange(dates, dateStrings) {
    const { compare } = this.state;
    const beginMoment = dates[0];
    const endMoment = dates[1];
    const durationStr = `${beginMoment.format('YYYY/MM/DD')}-${endMoment.format('YYYY/MM/DD')}`;

    let lastBegin;
    let lastEnd;
    if (compare === 'MoM') {
      const distanceDays = moment(dateStrings[1]).diff(moment(dateStrings[0]), 'days') + 1;
      const lastBeginMoment = moment(dateStrings[0]).subtract(distanceDays, 'days');
      const lastEndMoment = moment(dateStrings[1]).subtract(distanceDays, 'days');
      lastBegin = lastBeginMoment.format('YYYYMMDD');
      lastEnd = lastEndMoment.format('YYYYMMDD');
    } else {
      const lastBeginMoment = moment(dateStrings[0]).subtract(1, 'year');
      const lastEndMoment = moment(dateStrings[1]).subtract(1, 'year');
      lastBegin = lastBeginMoment.format('YYYYMMDD');
      lastEnd = lastEndMoment.format('YYYYMMDD');
    }
    this.setState({
      cycleType: null,
      durationStr,
      open: false,
      selfDatePickerOpen: false,
      beginMoment,
      endMoment,
      lastBegin,
      lastEnd,
    }, this.saveDurationToHome);
  }
  @autobind
  openChange(status) {
    this.setState({
      selfDatePickerOpen: status,
    });
  }
  @autobind
  showSelfDatePicker() {
    this.setState({
      selfDatePickerOpen: true,
    });
  }

  // 历史看板预定义时间范围切换事件
  @autobind
  historyChangeDuration(e) {
    const { compare } = this.state;
    const cycleType = e.target.value;
    const nowDuration = getDurationString(cycleType);
    const beginMoment = moment(nowDuration.begin);
    const endMoment = moment(nowDuration.end);
    const begin = nowDuration.begin;
    const end = nowDuration.end;
    const durationStr = nowDuration.durationStr;
    let lastBegin;
    let lastEnd;
    // 环比
    if (compare === 'MoM') {
      const distanceDays = moment(end).diff(moment(begin), 'days') + 1;
      const lastBeginMoment = moment(begin).subtract(distanceDays, 'days');
      const lastEndMoment = moment(end).subtract(distanceDays, 'days');
      lastBegin = lastBeginMoment.format('YYYYMMDD');
      lastEnd = lastEndMoment.format('YYYYMMDD');
    } else {
      const lastBeginMoment = moment(begin).subtract(1, 'year');
      const lastEndMoment = moment(end).subtract(1, 'year');
      lastBegin = lastBeginMoment.format('YYYYMMDD');
      lastEnd = lastEndMoment.format('YYYYMMDD');
    }
    this.setState({
      cycleType,
      open: false,
      selfDatePickerOpen: false,
      durationStr,
      beginMoment,
      endMoment,
      lastBegin,
      lastEnd,
    }, this.saveDurationToHome);
  }

  @autobind
  saveDurationToHome() {
    const { updateQueryState } = this.props;
    const {
      cycleType,
      beginMoment,
      endMoment,
      lastBegin,
      lastEnd,
    } = this.state;
    let newDuration;
    if (cycleType) {
      newDuration = cycleType;
    } else {
      newDuration = 'month';
    }
    updateQueryState({
      begin: moment(beginMoment).format('YYYYMMDD'),
      end: moment(endMoment).format('YYYYMMDD'),
      cycleType: newDuration,
      contrastBegin: lastBegin, // 上期开始时间
      contrastEnd: lastEnd, // 上期结束时间
    });
  }


  render() {
    const {
      isHistory,
      cycleType,
      durationStr,
      open,
      beginMoment,
      endMoment,
      selfDatePickerOpen,
    } = this.state;

    const timeArray = isHistory ? historyTime : timeOptions;
    const durationTip = cycleType && _.filter(timeArray, { key: cycleType })[0].name;
    const toggleDurationPicker = classnames({
      durationPicker: true,
      hasHistoryPicker: isHistory,
      hide: !open,
    });
    return (
      <div className="durationSelect">
        <div className="duration">
          <Icon type="rili" />
          <div className="text" onClick={this.handleDurationClick}>
            {durationStr}
            <span>
              {durationTip}
            </span>
          </div>
          {/* 同环比按钮 */}
          {
            isHistory ?
              <div className={styles.compareDiv}>
                <RadioGroup onChange={this.compareChangeHandle} value={this.state.compare}>
                  {
                    compareArray.map((item) => {
                      const compareKey = `compare${item.key}`;
                      return (
                        <Radio
                          key={compareKey}
                          value={item.key}
                        >
                          {item.name}
                        </Radio>
                      );
                    })
                  }
                </RadioGroup>
              </div>
            :
              null
          }
        </div>
        {/* 选择时间段 */}
        <div className={toggleDurationPicker}>
          <div className="pickerHead">{durationStr}</div>
          <div className="divider" />
          <div className="pickerFoot">
            <div className={styles.pickerFootRadio}>
              {
                isHistory ?
                  <RadioGroup
                    value={cycleType}
                    onChange={this.historyChangeDuration}
                  >
                    {historyTimeRadios}
                  </RadioGroup>
                :
                  <RadioGroup
                    value={cycleType}
                    onChange={this.handleDurationChange}
                  >
                    {timeRadios}
                  </RadioGroup>
              }
            </div>
            {
              isHistory ?
                <div className={styles.pickerFootCustom}>
                  <a onClick={this.showSelfDatePicker}>自定义</a>
                </div>
              :
                null
            }
          </div>
        </div>
        {
          isHistory ?
            <RangePicker
              allowClear={false}
              disabledDate={this.disabledDate}
              value={[beginMoment, endMoment]}
              getCalendarContainer={this.findContainer}
              format="YYYY/MM/DD"
              onChange={this.rangePickerChange}
              open={selfDatePickerOpen}
              onOpenChange={this.openChange}
            />
          :
            null
        }
      </div>
    );
  }

}
