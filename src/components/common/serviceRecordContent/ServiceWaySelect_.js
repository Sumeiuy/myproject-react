/**
 * @Author: sunweibin
 * @Date: 2018-04-13 17:19:18
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-05 18:23:24
 * @desc 服务方式的Select
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Select } from 'antd';
import _ from 'lodash';

import styles from './index.less';

const { Option } = Select;
// 涨乐财富通的服务方式的 key 值
const ZLFINS_SERVICE_WAY_KEY = 'ZLFins';

export default class ServiceWaySelect extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
    serviceRecordInfo: PropTypes.object.isRequired,
    isPhoneCall: PropTypes.bool,
    disabledZLFinsOption: PropTypes.func,
  }

  static defaultProps = {
    isPhoneCall: false,
    disabledZLFinsOption: () => false,
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
    return _.map(list, (obj) => {
      if (obj.key === ZLFINS_SERVICE_WAY_KEY && this.props.disabledZLFinsOption()) {
        return null;
      }
      return (<Option key={obj.key} value={obj.key}>{obj.value}</Option>);
    });
  }

  render() {
    const { value } = this.state;
    const {
      width,
      options,
      isPhoneCall,
      serviceRecordInfo: { autoGenerateRecordInfo },
    } = this.props;

    return (
      <div className={styles.serveWay}>
        <div className={styles.title}>服务方式:</div>
        <div className={styles.content} ref={this.setServiceWrapRef}>
          {
            isPhoneCall && autoGenerateRecordInfo.serveWay === 'HTSC Phone' ? '电话'
              : (
                <Select
                  value={value}
                  style={width}
                  onChange={this.handleSelectChange}
                  getPopupContainer={() => this.serviceWayRef}
                >
                  {this.renderServiceSelectOptions(options)}
                </Select>
              )
          }
        </div>
      </div>
    );
  }
}
