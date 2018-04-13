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
import PhoneDialog from '../phoneDialog';
import styles from './index.less';

export default class Phone extends PureComponent {
  static propTypes = {
    // 电话号码
    phoneNum: PropTypes.string.isRequired,
    // 客户类型（per代表个人客户，org代表机构客户，prod代表产品客户）
    custType: PropTypes.string.isRequired,
    // 页面自定义样式
    style: PropTypes.object,
  }

  static defaultProps = {
    style: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      // 默认状态下打电话弹窗不可见 false 不可见  true 可见
      isShowPhoneDialog: false,
      // 默认状态下auto为false，此时不能自动拨号
      // 点击电话号码拨号弹框弹出来auto置为true，此时自动拨号
      auto: false,
    };
  }

  // 点击号码弹出拨打电话的弹框
  @autobind
  handleClickPhoneNum() {
    this.setState({
      isShowPhoneDialog: true,
      auto: true,
    });
  }

  // 关闭拨打电话的弹框方法
  @autobind
  handleCloseDialog() {
    this.setState({
      isShowPhoneDialog: false,
      auto: false,
    });
  }

  render() {
    const { phoneNum, custType, style } = this.props;
    const { isShowPhoneDialog, auto } = this.state;
    return (
      <div className={styles.wrap}>
        <div
          className={styles.phoneNum}
          onClick={this.handleClickPhoneNum}
          style={style}
        >
          {phoneNum}
        </div>
        {
          isShowPhoneDialog ?
            <PhoneDialog
              phoneNum={phoneNum}
              custType={custType}
              auto={auto}
              handleCloseDialog={this.handleCloseDialog}
            />
            :
            null
        }
      </div>
    );
  }
}
