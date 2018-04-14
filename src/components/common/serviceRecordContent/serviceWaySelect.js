/**
 * @Author: sunweibin
 * @Date: 2018-04-13 17:19:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-14 15:46:31
 * @desc 服务方式的Select
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import cx from 'classnames';
import { Select } from 'antd';

import styles from './serviceWaySelect.less';

const { Option } = Select;

export default class ServiceWaySelect extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     value: props.value,
  //   };
  // }

  @autobind
  setServiceWrapRef(input) {
    this.serviceWayRef = input;
  }

  @autobind
  handleSelectChange(value) {
    this.props.onChange(value);
  }

  /**
   * 渲染服务方式 | 的下拉选项,
   */
  @autobind
  renderServiceSelectOptions(list = []) {
    const { empInfo } = this.props;
    return list.map((obj) => {
      if (false && !empInfo.tgFlag && obj.key === 'ZLFins') {
        // 只有投顾入岗才能看到 涨乐财富通
        return null;
      }
      return (<Option key={obj.key} value={obj.key}>{obj.value}</Option>);
    });
  }

  render() {
    const { value, width, options } = this.props;
    console.warn('ServiceWaySelect: value', value);
    const containerCls = cx([styles.serveWayContainer, styles.serveWay]);
    return (
      <div className={containerCls}>
        <div className={styles.title}>服务方式:</div>
        <div className={styles.content} ref={this.setServiceWrapRef}>
          <Select
            value={value}
            style={width}
            onChange={this.handleSelectChange}
            getPopupContainer={() => this.serviceWayRef}
          >
            { this.renderServiceSelectOptions(options) }
          </Select>
        </div>
      </div>
    );
  }
}
