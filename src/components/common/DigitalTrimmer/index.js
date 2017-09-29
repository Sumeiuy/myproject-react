/**
 * @file DigitalTrimmer.js
 * 通过鼠标或键盘，输入范围内的数值
 * author baojiajia
 */
import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import style from './style.less';

export default class DigitalTrimmer extends PureComponent {
  static propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    defaultValue: PropTypes.number,
    getValue: PropTypes.func.isRequired,
  }

  static defaultProps = {
    min: 1.6,
    max: 3,
    step: 0.1,
    defaultValue: 1.6,
  }

  componentDidMount() {
    this.props.getValue(this.props.defaultValue);
  }

  @autobind
  onChange(v) {
    this.props.getValue(v);
  }
  render() {
    const { min, max, step, defaultValue } = this.props;
    return (
      <InputNumber
        className={style.inputBox}
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={this.onChange}
      />
    );
  }
}

