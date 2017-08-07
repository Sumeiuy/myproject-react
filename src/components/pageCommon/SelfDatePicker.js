/*
 * @Author: LiuJianShu
 * @Date: 2017-08-03 16:04:14
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-08-04 09:06:43
 */

import React, { PropTypes, PureComponent } from 'react';
import moment from 'moment';
import { autobind } from 'core-decorators';
import { Row, Col, DatePicker, Radio, Button } from 'antd';

import { constants, optionsMap } from '../../config';
import { getDurationString, queryMoMDuration } from '../../utils/helper';

// 选择项字典
import styles from './SelfDatePicker.less';

const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const reactApp = document.querySelectorAll(constants.container)[0];

const historyTime = optionsMap.historyTime;
const compareArray = optionsMap.compare;

const defaultCycleType = historyTime[0].key;
// const dateFormat = 'YYYY/MM/DD';

export default class SelfDatePicker extends PureComponent {
  static propTypes = {
    updateQueryState: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const nowDuration = getDurationString(defaultCycleType);
    const beginMoment = moment(nowDuration.begin);
    const endMoment = moment(nowDuration.end);
    const nowDurationStr = nowDuration.durationStr;

    const lastBeginMoment = moment(nowDuration.begin).subtract(1, 'year');
    const lastEndMoment = moment(nowDuration.end).subtract(1, 'year');
    const lastDurationStr = `${lastBeginMoment.format('YYYY/MM/DD')}-${lastEndMoment.format('YYYY/MM/DD')}`;

    this.state = {
      compare: compareArray[0].key,
      duration: historyTime[0].key,
      open: false,
      disabled: false,
      beginMoment,
      endMoment,
      nowDurationStr,
      lastBeginMoment,
      lastEndMoment,
      lastDurationStr,
      oldState: {
        compare: compareArray[0].key,
        duration: historyTime[0].key,
        beginMoment,
        endMoment,
        nowDurationStr,
        lastBeginMoment,
        lastEndMoment,
        lastDurationStr,
      },
    };
  }

  @autobind
  makeExtraFooter() {
    const { nowDurationStr, lastDurationStr, disabled } = this.state;
    return (
      <div className={styles.extraFooter}>
        <h4>时间范围</h4>
        <RadioGroup
          value={this.state.duration}
          onChange={this.changeDuration}
        >
          <Row>
            {
              historyTime.map((item, index) => {
                const timeIndex = `Timeradio${index}`;
                return (
                  <Col span={4} key={timeIndex}>
                    <RadioButton value={item.key}>{item.name}</RadioButton>
                  </Col>
                );
              })
            }
          </Row>
        </RadioGroup>
        <RadioGroup onChange={this.compareChangeHandle} value={this.state.compare}>
          {
            compareArray.map((item) => {
              const compareKey = `compare${item.key}`;
              return (
                <Radio
                  key={compareKey}
                  value={item.key}
                  disabled={item.key === compareArray[1].key ? disabled : false}
                >
                  {item.name}
                </Radio>
              );
            })
          }
        </RadioGroup>
        <div className={styles.extraFooterBottom}>
          <div className={styles.bottomTime}>
            <h4>本期：{nowDurationStr}</h4>
            <h4>上期：{lastDurationStr}</h4>
          </div>
          <div className={styles.bottomBtn}>
            <Button onClick={this.cancelHanle}>取消</Button>
          </div>
        </div>
      </div>
    );
  }

  // 环比同比切换事件
  @autobind
  compareChangeHandle(e) {
    const compare = e.target.value;
    const { duration } = this.state;
    if (compare === 'MoM') {
      const { beginMoment, endMoment } = this.state;
      const begin = beginMoment.format('YYYYMMDD');
      const end = endMoment.format('YYYYMMDD');
      const compareDuration = queryMoMDuration(begin, end, duration);
      this.setState({
        open: true,
        compare,
        lastBeginMoment: compareDuration.begin,
        lastEndMoment: compareDuration.end,
        lastDurationStr: compareDuration.durationStr,
      });
    } else {
      const nowDuration = getDurationString(duration);
      const beginMoment = moment(nowDuration.begin);
      const endMoment = moment(nowDuration.end);
      const nowDurationStr = nowDuration.durationStr;
      const lastBeginMoment = moment(nowDuration.begin).subtract(1, 'year');
      const lastEndMoment = moment(nowDuration.end).subtract(1, 'year');
      const lastDurationStr = `${lastBeginMoment.format('YYYY/MM/DD')}-${lastEndMoment.format('YYYY/MM/DD')}`;
      this.setState({
        compare,
        open: true,
        beginMoment,
        endMoment,
        nowDurationStr,
        lastBeginMoment,
        lastEndMoment,
        lastDurationStr,
      });
    }
  }
  // 预定义时间范围切换事件
  @autobind
  changeDuration(e) {
    console.warn('事件范围切换');
    const { compare } = this.state;
    const duration = e.target.value;
    const nowDuration = getDurationString(duration);
    const beginMoment = moment(nowDuration.begin);
    const endMoment = moment(nowDuration.end);
    const nowDurationStr = nowDuration.durationStr;
    // 环比
    if (compare === 'MoM') {
      console.warn('环比');
      const begin = beginMoment.format('YYYYMMDD');
      const end = endMoment.format('YYYYMMDD');
      const compareDuration = queryMoMDuration(begin, end, duration);
      this.setState({
        duration,
        open: true,
        disabled: false,
        beginMoment,
        endMoment,
        nowDurationStr,
        lastBeginMoment: compareDuration.begin,
        lastEndMoment: compareDuration.end,
        lastDurationStr: compareDuration.durationStr,
      });
    } else {
      const lastBeginMoment = moment(nowDuration.begin).subtract(1, 'year');
      const lastEndMoment = moment(nowDuration.end).subtract(1, 'year');
      const lastDurationStr = `${lastBeginMoment.format('YYYY/MM/DD')}-${lastEndMoment.format('YYYY/MM/DD')}`;
      this.setState({
        duration,
        open: true,
        disabled: false,
        beginMoment,
        endMoment,
        nowDurationStr,
        lastBeginMoment,
        lastEndMoment,
        lastDurationStr,
      });
    }
  }
  // 确认事件
  @autobind
  okHandle() {
    this.saveMoment('ok');
  }
  // 取消事件
  @autobind
  cancelHanle() {
    this.saveMoment('cancel');
  }
  // 给 DatePicker 添加 wrapper
  @autobind
  findContainer() {
    return reactApp;
  }
  @autobind
  disabledDate(current) {
    // 不能选择大于今天的日期
    return current && current.valueOf() > Date.now();
  }
  // 用户自己选的时间段事件
  @autobind
  rangePickerChange(dates, dateStrings) {
    const { compare } = this.state;
    const beginMoment = dates[0];
    const endMoment = dates[1];
    const nowDurationStr = `${beginMoment.format('YYYY/MM/DD')}-${endMoment.format('YYYY/MM/DD')}`;

    let lastBegin;
    let lastEnd;
    let lastDurationStr;
    if (compare === compareArray[0].key) {
      lastBegin = moment(dateStrings[0]).subtract(1, 'year');
      lastEnd = moment(dateStrings[1]).subtract(1, 'year');
      lastDurationStr = `${lastBegin.format('YYYY/MM/DD')}-${lastEnd.format('YYYY/MM/DD')}`;
    } else {
      console.warn('环比');
    }
    this.setState({
      compare: compareArray[0].key,
      duration: null,
      open: true,
      disabled: true,
      beginMoment,
      endMoment,
      nowDurationStr,
      lastDurationStr,
      oldBeginMoment: beginMoment,
      oldEndMoment: endMoment,
      oldDurationStr: nowDurationStr,
      oldLastDurationStr: lastDurationStr,
    });
  }
  // 保存选择的时间
  @autobind
  saveMoment(type) {
    if (type === 'cancel') {
      const { oldState } = this.state;
      this.setState({
        open: false,
        disabled: false,
        ...oldState,
      });
    } else {
      const {
        beginMoment,
        endMoment,
        nowDurationStr,
        compare,
        duration,
        lastBeginMoment,
        lastEndMoment,
        lastDurationStr,
      } = this.state;
      this.setState({
        open: false,
        disabled: false,
        oldState: {
          beginMoment,
          endMoment,
          nowDurationStr,
          compare,
          duration,
          lastBeginMoment,
          lastEndMoment,
          lastDurationStr,
        },
      });
      this.saveDurationToHome();
    }
  }

  @autobind
  saveDurationToHome() {
    const { updateQueryState } = this.props;
    const {
      beginMoment,
      endMoment,
      lastBeginMoment,
      lastEndMoment,
      duration,
    } = this.state;
    let newDuration;
    if (duration === 'null') {
      newDuration = 'month';
    } else {
      newDuration = duration;
    }
    updateQueryState({
      begin: moment(beginMoment).format('YYYYMMDD'),
      end: moment(endMoment).format('YYYYMMDD'),
      cycleType: newDuration,
      contrastBegin: moment(lastBeginMoment).format('YYYYMMDD'), // 上期开始时间
      contrastEnd: moment(lastEndMoment).format('YYYYMMDD'), // 上期结束时间
    });
  }
  render() {
    const { beginMoment, endMoment, open } = this.state;
    return (
      <RangePicker
        allowClear={false}
        renderExtraFooter={() => this.makeExtraFooter()}
        disabledDate={this.disabledDate}
        value={[beginMoment, endMoment]}
        getCalendarContainer={this.findContainer}
        onChange={this.rangePickerChange}
        open={open}
        onOk={this.okHandle}
        showTime
      />
    );
  }
}
