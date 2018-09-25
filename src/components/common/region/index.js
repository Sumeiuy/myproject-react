/**
 * @Author: sunweibin
 * @Date: 2018-05-14 09:35:22
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-31 09:33:35
 * @description 获取区间值的组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popover, Button, Input, Icon } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { getRegionText } from './utils';
import logable from '../../../decorators/logable';

import styles from './index.less';

export default class Region extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.number),
    regionUnit: PropTypes.string,
  }

  static defaultProps = {
    placeholder: '不限',
    value: [],
    regionUnit: '元',
  }

  // 此处为React 16.3的新 API
  static getDerivedStateFromProps(nextProps, prevState) {
    const { value } = nextProps;
    const { start, end } = prevState;
    // 如果 value 的数组值变化了，则需要更新 state
    if (!_.isEqual(value, [start, end])) {
      return {
        start: value[0] || '',
        end: value[1] || '',
        regionText: getRegionText(value[0], value[1]),
      };
    }

    // 此处表示不修改 state 值，必须
    return null;
  }

  constructor(props) {
    super(props);
    const { value } = props;
    const start = value[0] || '';
    const end = value[1] || '';
    const regionText = getRegionText(start, end);
    this.state = {
      start,
      end,
      regionText,
      // 弹出层人工控制
      visible: false,
    };
  }

  // 设置区间的值，通过 Input 组件的 onChange 调用
  // position 的取值为 'start' | 'end'
  @autobind
  setRegionIput(position, value) {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ [position]: value });
    }
  }

  @autobind
  handleRegionEndInputChange(e) {
    const { value } = e.target;
    this.setRegionIput('end', value);
  }

  @autobind
  handleRegionStartInputChange(e) {
    const { value } = e.target;
    this.setRegionIput('start', value);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '确定' } })
  handleRegionOKClick() {
    const { start, end } = this.state;
    this.setState({
      regionText: getRegionText(start, end),
      visible: false,
    });
    // 需要隐藏 Popover
    this.handlePopoverVisibleChange(false);
    // 将区间值包装成 [start,end] 数组传递出去
    this.props.onChange([start, end]);
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '重置' } })
  handleRegionReset() {
    this.setState({
      start: '',
      end: '',
    });
  }

  @autobind
  handlePopoverVisibleChange(visible) {
    this.setState({ visible });
  }

  @autobind
  renderRegionContent() {
    const { regionUnit } = this.props;
    const { start, end } = this.state;
    return (
      <div className={styles.regionContent}>
        <div className={styles.regionInput}>
          <Input
            value={start}
            addonAfter={regionUnit}
            onChange={this.handleRegionStartInputChange}
          />
          <span className={styles.linker}>-</span>
          <Input
            value={end}
            addonAfter={regionUnit}
            onChange={this.handleRegionEndInputChange}
          />
        </div>
        <div className={styles.regionBtns}>
          <Button onClick={this.handleRegionReset}>重置</Button>
          <Button type="primary" onClick={this.handleRegionOKClick}>确定</Button>
        </div>
      </div>
    );
  }

  render() {
    const { regionText, visible } = this.state;
    const regionContent = this.renderRegionContent();
    return (
      <Popover
        arrowPointAtCenter
        visible={visible}
        onVisibleChange={this.handlePopoverVisibleChange}
        placement="bottom"
        trigger="click"
        content={regionContent}
      >
        <span className={styles.regionToggle}>
          <span className={styles.regionText}>{regionText}</span>
          <Icon type="caret-down" />
        </span>
      </Popover>
    );
  }
}

