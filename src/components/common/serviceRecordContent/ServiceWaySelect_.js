/**
 * @Author: sunweibin
 * @Date: 2018-04-13 17:19:18
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-05 14:10:49
 * @desc 服务方式的Select
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Select } from 'antd';
import _ from 'lodash';

import { PHONE } from './utils';

import styles from './index.less';

const { Option } = Select;

export default class ServiceWaySelect extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    const value = _.get(props.options, '[0].key') || '';
    this.state = { value };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    this.setState({ value });
  }

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
      if (!empInfo.tgQyFlag && obj.key === 'ZLFins') {
        // 只有投顾入岗才能看到 涨乐财富通
        return null;
      }
      return (<Option key={obj.key} value={obj.key}>{obj.value}</Option>);
    });
  }

  render() {
    const { value } = this.state;
    const { width, options, serviceRecordInfo: { caller } } = this.props;
    // const selectValue = !_.isEmpty(value) ? value : options[0].key;
    // const containerCls = cx([styles.serveWayContainer, styles.serveWay]);
    return (
      <div className={styles.serveWay}>
        <div className={styles.title}>服务方式:</div>
        <div className={styles.content} ref={this.setServiceWrapRef}>
          {
            caller === PHONE ? '电话' :
            <Select
              value={value}
              style={width}
              onChange={this.handleSelectChange}
              getPopupContainer={() => this.serviceWayRef}
            >
              {this.renderServiceSelectOptions(options)}
            </Select>
          }
        </div>
      </div>
    );
  }
}
