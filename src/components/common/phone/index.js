/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-26 11:34:41
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

export default class Phone extends PureComponent {
  static propTypes = {
    // 电话号码
    number: PropTypes.string.isRequired,
    // 客户类型
    custType: PropTypes.string.isRequired,
    // 点击号码回调
    onClick: PropTypes.func,
    // 挂断电话回调
    onEnd: PropTypes.func,
    // 页面自定义样式
    style: PropTypes.object,
  }

  static defaultProps = {
    style: {},
    onClick: _.noop,
    onEnd: _.noop,
  };

  // 点击号码弹出拨打电话的弹框
  @autobind
  handleClick() {
    const { number, custType, onClick } = this.props;
    onClick({
      number,
      custType,
    });

    const srcUrl = `${URL}?number=${number}&custType=${custType}&auto=true`;
    opener = window.open(
      srcUrl,
      'phoneDialog',
      OPEN_FEATURES,
    );
    window.addEventListener(
      'message',
      this.receiveMessage,
      false,
    );
  }

  @autobind
  receiveMessage(e) {
    window.removeEventListener('message', this.receiveMessage);
    if (e.data
      && e.data.type === 'end'
      && opener
      && _.isFunction(opener.close)
    ) {
      this.props.onEnd(e.data);
      opener.close();
      opener = null;
    }
  }

  render() {
    const { number, style } = this.props;
    return (
      <div className={styles.wrap}>
        <div
          className={styles.phoneNum}
          onClick={this.handleClick}
          style={style}
        >
          {number}
        </div>
      </div>
    );
  }
}
