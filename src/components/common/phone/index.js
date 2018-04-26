/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-25 17:47:18
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import bowser from 'bowser';
import _ from 'lodash';

import styles from './index.less';

const URL = bowser.msie
  ? '/fspa/phone/'
  : 'https://crm.htsc.com.cn:2443/phone/';

const OPEN_FEATURES = `
  width=300,
  height=400,
  location=no,
  menubar=no,
  resizable=no,
  scrollbars=no,
  status=no
`;

let opener = null;

function receiveMessage(e) {
  window.removeEventListener('message', receiveMessage);
  console.log(e);
  if (opener && _.isFunction(opener.close)) {
    opener.close();
    opener = null;
  }
}

export default class Phone extends PureComponent {
  static propTypes = {
    // 电话号码
    phoneNum: PropTypes.string.isRequired,
    // 客户类型
    custType: PropTypes.string.isRequired,
    // 点击号码回调
    onClick: PropTypes.func,
    // 页面自定义样式
    style: PropTypes.object,
  }

  static defaultProps = {
    style: {},
    onClick: _.noop,
  };

  // 点击号码弹出拨打电话的弹框
  @autobind
  handleClickPhoneNum() {
    const { phoneNum, custType, onClick } = this.props;
    onClick({
      flag: true,
      phoneNum,
      custType,
    });

    const srcUrl = `${URL}?number=${phoneNum}&custType=${custType}&auto=true`;
    opener = window.open(
      srcUrl,
      'phoneDialog',
      OPEN_FEATURES,
    );
    window.addEventListener(
      'message',
      receiveMessage,
      false,
    );
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
