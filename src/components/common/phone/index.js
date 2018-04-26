/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-04-26 16:51:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import bowser from 'bowser';
import _ from 'lodash';
import classnames from 'classnames';

import styles from './index.less';

const URL = bowser.msie
  // IE10跨域无法和父页面通信，部署在同域下
  ? '/fspa/phone/'
  // Chrome等WebRTC只可用在https域下,所以部署到移动端server
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

let popWin = null;

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
    // 是否禁用
    disable: PropTypes.object,
  }

  static defaultProps = {
    disable: true,
    style: {},
    onClick: _.noop,
    onEnd: _.noop,
  };

  // 点击号码弹出拨打电话的弹框
  @autobind
  handleClick() {
    const { number, custType, onClick, disable } = this.props;
    if (disable === true) {
      return;
    }
    onClick({
      number,
      custType,
    });

    const srcUrl = `${URL}?number=${number}&custType=${custType}&auto=true`;
    popWin = window.open(
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
      && popWin
    ) {
      this.props.onEnd(e.data);
      popWin.close();
      popWin = null;
    }
  }

  render() {
    const { number, style, disable } = this.props;
    const className = classnames({
      [styles.number]: true,
      [styles.active]: disable !== true,
    })
    return (
      <div
        className={className}
        onClick={this.handleClick}
        style={style}
      >
        {number}
      </div>
    );
  }
}
