/**
 * @Author: sunweibin
 * @Date: 2018-04-13 17:19:18
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-13 17:48:54
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
  }

  @autobind
  setServiceWrapRef(input) {
    this.serviceWayRef = input;
  }

  /**
   * 渲染服务方式 | 的下拉选项,
   */
  @autobind
  renderServiceSelectOptions(list = []) {
    return list.map(obj => (<Option key={obj.key} value={obj.key}>{obj.value}</Option>));
  }

  render() {
    const { value, width, onChange, options } = this.props;
    const containerCls = cx([styles.serveWayContainer, styles.serveWay]);
    return (
      <div className={containerCls}>
        <div className={styles.title}>服务方式:</div>
        <div className={styles.content} ref={this.setServiceWrapRef} >
          <Select
            value={value}
            style={width}
            onChange={onChange}
            getPopupContainer={() => this.serviceWayRef}
          >
            { this.renderServiceSelectOptions(options) }
          </Select>
        </div>
      </div>
    );
  }
}
