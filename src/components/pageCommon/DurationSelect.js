/**
 * @fileOverview pageCommon/DurationSelect.js
 * @author sunweibin
 * @description 时间段选择器
 */

import React, { PropTypes, PureComponent } from 'react';
import { Icon, Radio } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { getDurationString } from '../../utils/helper';
import { optionsMap } from '../../config';
import './DurationSelect.less';

// 需要用到的常量
// RadioButton
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

// 时间筛选条件
const timeOptions = optionsMap.time;
// 渲染5个头部期间Radio
const timeRadios = timeOptions.map((item, index) => {
  const timeIndex = `Timeradio${index}`;
  return React.createElement(RadioButton, { key: timeIndex, value: `${item.key}` }, `${item.name}`);
});

export default class DurationSelect extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { query } } = props;
    const value = query.cycleType || 'month';
    const obj = getDurationString(value);
    this.state = {
      open: false,
      ...obj,
    };
  }

   // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    const obj = getDurationString(value);
    const { replace, location: { query, pathname } } = this.props;
    this.setState({
      open: false,
      ...obj,
    });
    // 需要改变query中的查询变量
    replace({
      pathname,
      query: {
        ...query,
        begin: obj.begin,
        end: obj.end,
        cycleType: obj.cycleType,
      },
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

  render() {
    const { cycleType, durationStr, open } = this.state;
    const durationTip = _.filter(timeOptions, { key: cycleType })[0].name;
    const toggleDurationPicker = classnames({
      durationPicker: true,
      hide: !open,
    });
    return (
      <div className="durationSelect">
        <div className="duration" onClick={this.handleDurationClick}>
          <div className="text">{`${durationStr}`}<span>{`(${durationTip})`}</span></div>
          <Icon type="calendar" />
        </div>
        <div className={toggleDurationPicker} onMouseEnter={this.handleMouseEnter}>
          <div className="pickerHead">{durationStr}</div>
          <div className="divider" />
          <div className="pickerFoot">
            <RadioGroup
              defaultValue={cycleType || 'month'}
              onChange={this.handleDurationChange}
            >
              {timeRadios}
            </RadioGroup>
          </div>
        </div>
      </div>
    );
  }

}
