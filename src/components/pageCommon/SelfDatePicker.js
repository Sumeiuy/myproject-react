/*
 * @Author: LiuJianShu
 * @Date: 2017-08-03 16:04:14
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-08-04 09:06:43
 */

import React, { PureComponent } from 'react';
import moment from 'moment';
import 'moment-transform';
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
const compare = optionsMap.compare;
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

    const defaultCycleType = historyTime[0].key;
    const lastCycleType = historyTime[3].key;
    const now = getDurationString(defaultCycleType);
    const last = getDurationString(lastCycleType);

    const beginMoment = moment(now.begin);
    const today = moment();
    console.warn('今天', today.format('YYYY-MM-DD'));
    console.warn('三十天之前', today.transform('YYYY-MM--30').format('YYYY-MM-DD'));
    const endMoment = moment(now.end);
    const nowDurationStr = now.durationStr;

    const lastBeginMoment = moment(last.begin);
    const lastEndMoment = moment(last.end);
    const lastDurationStr = last.durationStr;
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
      compare: compare[0].key,
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

  @autobind
  handleDurationChange() {
    console.warn(1111111);
  }
  @autobind
  makeExtraFooter() {
    const { nowDurationStr, lastDurationStr } = this.state;
    return (
      <div className={styles.extraFooter}>
        <h4>时间范围</h4>
        <RadioGroup
          value={'month'}
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
            compare.map((item) => {
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
        defaultValue={[beginMoment, endMoment]}
        getCalendarContainer={this.findContainer}
        onChange={this.rangePickerChange}
        showToday={false}
        showTime
        open
      />
    );
  }
}
