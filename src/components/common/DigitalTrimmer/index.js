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
    value: PropTypes.number,
    getValue: PropTypes.func.isRequired,
    ref: PropTypes.func.isRequired,
  }

  static defaultProps = {
    min: 1.6,
    max: 3,
    step: 0.1,
    value: 1.6,
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  @autobind
  onChange(value) {
    this.setState({
      value,
    });
    this.props.getValue(value);
  }

  @autobind
  reset() {
    this.setState({
      value: this.props.value,
    });
  }

  render() {
    const { min, max, step } = this.props;
    const { value } = this.state;
    return (
      <InputNumber
        className={style.inputBox}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={this.onChange}
      />
    );
  }
}

