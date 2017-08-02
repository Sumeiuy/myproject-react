/**
 * @fileOverview pageCommon/DurationSelect.js
 * @author sunweibin
 * @description 时间段选择器
 */

import React, { PropTypes, PureComponent } from 'react';
import { Radio } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { getDurationString } from '../../utils/helper';
import { optionsMap } from '../../config';
import Icon from '../common/Icon';
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
    collectData: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const value = 'month';
    const obj = getDurationString(value);
    this.state = {
      open: false,
      ...obj,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 因为Url中只有boardId会变化
    const { location: { query: { boardId } } } = nextProps;
    const { location: { query: { boardId: preBId } } } = this.props;
    if (Number(boardId || '1') !== Number(preBId || '1')) {
      const duration = getDurationString('month');
      this.setState({
        open: false,
        ...duration,
      });
    }
  }

   // 期间变化
  @autobind
  handleDurationChange(e) {
    const value = e.target.value;
    const duration = getDurationString(value);
    // const { replace, location: { query, pathname } } = this.props;
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
          <Icon type="rili" />
        </div>
        <div className={toggleDurationPicker}>
          <div className="pickerHead">{durationStr}</div>
          <div className="divider" />
          <div className="pickerFoot">
            <RadioGroup
              value={cycleType || 'month'}
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
