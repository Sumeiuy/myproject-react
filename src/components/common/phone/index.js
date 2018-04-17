/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-04-13 10:50:47
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import styles from './index.less';

export default class Phone extends PureComponent {
  static propTypes = {
    // 电话号码
    phoneNum: PropTypes.string.isRequired,
    // 客户类型
    custType: PropTypes.string.isRequired,
    // 切换拨打电话弹框是否显示方法
    onTogglePhoneDialog: PropTypes.func.isRequired,
    // 页面自定义样式
    style: PropTypes.object,
  }

  static defaultProps = {
    style: {},
  };

  // 点击号码弹出拨打电话的弹框
  @autobind
  handleClickPhoneNum() {
    const { phoneNum, custType, onTogglePhoneDialog } = this.props;
    onTogglePhoneDialog({
      flag: true,
      phoneNum,
      custType,
    });
  }

  render() {
    const { phoneNum, style } = this.props;
    return (
      <div className={styles.wrap}>
        <div
          className={styles.phoneNum}
          onClick={this.handleClickPhoneNum}
          style={style}
        >
          {phoneNum}
        </div>
      </div>
    );
  }
}
