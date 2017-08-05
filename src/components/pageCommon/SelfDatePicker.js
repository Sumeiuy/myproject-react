/*
 * @Author: LiuJianShu
 * @Date: 2017-08-03 16:04:14
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-08-04 09:06:43
 */

import React, { PureComponent } from 'react';
import moment from 'moment';
import { autobind } from 'core-decorators';
import { Row, Col, DatePicker, Radio, Button } from 'antd';

import { constants, optionsMap } from '../../config';
import { getDurationString } from '../../utils/helper';

// 选择项字典
import styles from './SelfDatePicker.less';

const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const reactApp = document.querySelectorAll(constants.container)[0];

const historyTime = optionsMap.historyTime;
const compareArray = optionsMap.compare;
const currentMoment = moment();

const defaultCycleType = historyTime[0].key;
// const dateFormat = 'YYYY/MM/DD';

export default class SelfDatePicker extends PureComponent {
  // static propTypes = {
  // }

  // static defaultProps = {
  // }
  constructor(props) {
    super(props);
    // const yearStart = moment().startOf('year').format('YYYY-MM-DD');
    // const monthStart = moment().startOf('month').format('YYYY-MM-DD');
    // const quarterStart = moment().startOf('quarter').format('YYYY-MM-DD');
    // const yearEnd = moment().endOf('year').format('YYYY-MM-DD');
    // const monthEnd = moment().endOf('month').format('YYYY-MM-DD');
    // const quarterEnd = moment().endOf('quarter').format('YYYY-MM-DD');

    // const lastCycleType = historyTime[3].key;
    const now = getDurationString(defaultCycleType);
    // const last = getDurationString(lastCycleType);
    // .subtract(distance, 'days')
    const beginMoment = moment(now.begin);
    const endMoment = moment(now.end);
    const nowDurationStr = now.durationStr;

    const lastBeginMoment = moment(now.begin).subtract(1, 'year');
    const lastEndMoment = moment(now.end).subtract(1, 'year');
    const lastDurationStr = `${lastBeginMoment.format('YYYY/MM/DD')}-${lastEndMoment.format('YYYY/MM/DD')}`;
    // const lastBeginMoment = moment(last.begin);
    // const lastEndMoment = moment(last.end);
    // const lastDurationStr = last.durationStr;

    // const quarter = moment().quarter();
    // console.warn('quarter', quarter);
    // console.warn(moment(moment().format('YYYY-MM-DD')).startOf('quarter').quarter(1).format());
    // console.warn('yearStart', yearStart);
    // console.warn('monthStart', monthStart);
    // console.warn('quarterStart', quarterStart);
    // console.warn('yearEnd', yearEnd);
    // console.warn('monthEnd', monthEnd);
    // console.warn('quarterEnd', quarterEnd);
    // console.warn('moment', moment().startOf('year'));
    this.state = {
      compare: compareArray[0].key,
      duration: historyTime[0].key,
      beginMoment,
      endMoment,
      nowDurationStr,
      lastBeginMoment,
      lastEndMoment,
      lastDurationStr,
    };
  }

  @autobind
  compareChangeHandle(e) {
    this.setState({
      compare: e.target.value,
    });
  }
  // 事件范围切换
  @autobind
  handleDurationChange(e) {
    const duration = e.target.value;
    const now = getDurationString(defaultCycleType);
    const preMonth = getDurationString('lastMonth');
    let year = currentMoment.year();
    const quarter = currentMoment.quarter();
    const lastYear = year - 1;
    let lastQuarter = quarter - 1;

    console.warn('moment duration', moment.duration(2, 'years'));
    let newBegin;
    let newEnd;
    let newDurationStr;
    let newLastBegin;
    let newLastEnd;
    let newLastDurationStr;
    switch (duration) {
      case 'month':
        console.warn('月');
        newBegin = moment(now.begin);
        newEnd = moment(now.end);
        newDurationStr = now.durationStr;
        newLastBegin = moment(now.begin).subtract(1, 'year');
        newLastEnd = moment(now.end).subtract(1, 'year');
        newLastDurationStr = `${newLastBegin.format('YYYY/MM/DD')}-${newLastEnd.format('YYYY/MM/DD')}`;
        break;
      case 'quarter':
        console.warn('季');
        newBegin = moment(moment().startOf('quarter').quarter(quarter));
        newEnd = moment().subtract(1, 'days');
        newDurationStr = `${newBegin.format('YYYY/MM/DD')}-${newEnd.format('YYYY/MM/DD')}`;
        newLastBegin = newBegin.subtract(1, 'year');
        newLastEnd = newEnd.subtract(1, 'year');
        newLastDurationStr = `${newLastBegin.format('YYYY/MM/DD')}-${newLastEnd.format('YYYY/MM/DD')}`;
        break;
      case 'year':
        console.warn('年');
        newBegin = moment(moment().startOf('year'));
        newEnd = moment().subtract(1, 'days');
        newDurationStr = `${newBegin.format('YYYY/MM/DD')}-${newEnd.format('YYYY/MM/DD')}`;
        newLastBegin = newBegin.subtract(1, 'year');
        newLastEnd = newEnd.subtract(1, 'year');
        newLastDurationStr = `${newLastBegin.format('YYYY/MM/DD')}-${newLastEnd.format('YYYY/MM/DD')}`;
        break;
      case 'lastMonth':
        console.warn('上月');
        newBegin = moment(preMonth.begin);
        newEnd = moment(preMonth.end);
        newDurationStr = preMonth.durationStr;
        newLastBegin = newBegin.subtract(1, 'year');
        newLastEnd = newEnd.subtract(1, 'year');
        newLastDurationStr = `${newLastBegin.format('YYYY/MM/DD')}-${newLastEnd.format('YYYY/MM/DD')}`;
        break;
      case 'lastQuarter':
        console.warn('上季');
        if (quarter <= 1) {
          year--;
          lastQuarter = 4;
        }
        newBegin = moment(moment().year(year).startOf('quarter').quarter(lastQuarter));
        newEnd = moment(moment().year(year).endOf('quarter').quarter(lastQuarter));
        newDurationStr = `${newBegin.format('YYYY/MM/DD')}-${newEnd.format('YYYY/MM/DD')}`;
        newLastBegin = newBegin.subtract(1, 'year');
        newLastEnd = newEnd.subtract(1, 'year');
        newLastDurationStr = `${newLastBegin.format('YYYY/MM/DD')}-${newLastEnd.format('YYYY/MM/DD')}`;
        break;
      case 'lastYear':
        console.warn('去年');
        // lastYear
        newBegin = moment(moment().year(lastYear).startOf('year'));
        // newBegin = moment(moment().startOf('quarter').quarter(quarter - 1));
        newEnd = moment(moment().year(year).endOf('year'));
        newDurationStr = `${newBegin.format('YYYY/MM/DD')}-${newEnd.format('YYYY/MM/DD')}`;
        newLastBegin = newBegin.subtract(1, 'year');
        newLastEnd = newEnd.subtract(1, 'year');
        newLastDurationStr = `${newLastBegin.format('YYYY/MM/DD')}-${newLastEnd.format('YYYY/MM/DD')}`;
        break;
      default:
        console.warn('默认');
        break;
    }
    this.setState({
      duration,
      beginMoment: newBegin,
      endMoment: newEnd,
      nowDurationStr: newDurationStr,
      lastBeginMoment: newLastBegin,
      lastEndMoment: newLastEnd,
      lastDurationStr: newLastDurationStr,
    });
  }
  @autobind
  makeExtraFooter() {
    const { nowDurationStr, lastDurationStr } = this.state;
    return (
      <div className={styles.extraFooter}>
        <h4>时间范围</h4>
        <RadioGroup
          value={this.state.duration}
          onChange={this.handleDurationChange}
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
                <Radio key={compareKey} value={item.key}>{item.name}</Radio>
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
            <Button>取消</Button>
            <Button type="primary">确定</Button>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  timeChangeHandle() {
    console.warn(111111111111111111111);
  }
  @autobind
  findContainer() {
    return reactApp;
  }
  @autobind
  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
  @autobind
  rangePickerChange(dates, dateStrings) {
    let { lastDurationStr } = this.state;
    console.warn('dates', dates);
    console.warn('dateStrings', dateStrings);
    const dateArrar = dateStrings.map(item => moment(item));
    const distance = dateArrar[1].diff(dateArrar[0], 'days') + 1;
    const distanceBeginDay = dateArrar[0].subtract(distance, 'days').format('YYYY/MM/DD');
    const distanceEndDay = dateArrar[1].subtract(distance, 'days').format('YYYY/MM/DD');
    lastDurationStr = `${distanceBeginDay}-${distanceEndDay}`;

    this.setState({
      nowDurationStr: dateStrings.join('-'),
      lastDurationStr,
    });
  }
  render() {
    const { beginMoment, endMoment } = this.state;
    return (
      <RangePicker
        renderExtraFooter={() => this.makeExtraFooter()}
        disabledDate={this.disabledDate}
        value={[beginMoment, endMoment]}
        getCalendarContainer={this.findContainer}
        onChange={this.rangePickerChange}
        showToday={false}
        showTime
        open
      />
    );
  }
}
