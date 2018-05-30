/**
 * @Description: PC电话拨号页面
 * @Author: maoquan
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-30 18:16:32
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import bowser from 'bowser';
import _ from 'lodash';
import qs from 'query-string';
import classnames from 'classnames';
import styles from './phone.less';

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

const TYPE_CONNECTED = 'connected';
const TYPE_END = 'end';

let popWin = null;

export default class Phone extends PureComponent {
  static propTypes = {
    // 是否需要展示号码，如果作为HOOK处理FSP上所有电话行为，则为true
    headless: PropTypes.bool,
    // 电话号码
    number: PropTypes.string,
    // 客户类型
    custType: PropTypes.string,
    // 点击号码回调
    onClick: PropTypes.func,
    // 接通电话回调
    onConnected: PropTypes.func,
    // 挂断电话回调
    onEnd: PropTypes.func,
    // 页面自定义样式
    style: PropTypes.object,
    // 是否禁用
    disable: PropTypes.bool,
    // 电话配置信息
    config: PropTypes.object.isRequired,
    // 获取电话配置
    getConfig: PropTypes.func.isRequired,
    // 用户信息
    empInfo: PropTypes.object.isRequired,
    // 客户的名称
    name: PropTypes.string,
    // 用户数据，回调时回传
    userData: PropTypes.object,
    // 显示和隐藏通话蒙版
    handleShowMask: PropTypes.func,
    // 点击打电话
    handleClickPhone: PropTypes.func,
  }

  static defaultProps = {
    number: '0',
    custType: 'per',
    headless: false,
    disable: false,
    style: {},
    onClick: _.noop,
    onEnd: _.noop,
    onConnected: _.noop,
    name: '',
    userData: {},
    handleShowMask: _.noop,
    handleClickPhone: _.noop,
  };

  // 是否已绑定message事件
  boundMessageEvent = false;

  componentDidMount() {
    if (this.props.headless === true && window.$) {
      window.$('body').on(
        'click',
        '.callable',
        (e) => {
          if (this.canCall()) {
            const number = window.$(e.target).text() || window.$(e.target).val();
            this.prepareCall(number);
            // 点击打电话
            this.props.handleClickPhone();
            // 显示通话蒙版
            this.props.handleShowMask(true);
          }
        },
      );
    }
  }

  canCall() {
    const { empInfo, disable } = this.props;
    return empInfo.canCall === true && disable !== true;
  }

  @autobind
  handleClick() {
    const { number, custType, onClick } = this.props;
    if (this.canCall() !== true) {
      return;
    }
    onClick({
      number,
      custType,
    });
    this.prepareCall(number);
  }

  prepareCall(number) {
    const { getConfig } = this.props;
    popWin = window.open(
      'about:blank',
      'phoneDialog',
      OPEN_FEATURES,
    );
    getConfig().then(() => this.call(number));
  }

  call(number) {
    const { custType, config, name, userData } = this.props;
    const {
      sipInfo: { sipID, sipDomain, sipPasswd },
      wssInfo: { wssIp, wssPort, sipIp, sipPort },
    } = config;

    const configQueryString = [
      `sipID=${sipID}`,
      `sipDomain=${sipDomain}`,
      `sipPasswd=${sipPasswd}`,
      `sipIP=${sipIp}`,
      `sipPort=${sipPort}`,
      `wssIP=${wssIp}`,
      `wssPort=${wssPort}`,
    ].join('&');

    const userQueryString = qs.stringify(userData);

    const srcUrl = `${URL}?number=${number}&custType=${custType}&auto=true&name=${name}&${configQueryString}&${userQueryString}`;
    popWin.location = srcUrl;
    if (!this.boundMessageEvent) {
      this.boundMessageEvent = true;
      window.addEventListener(
        'message',
        this.receiveMessage,
        false,
      );
    }
  }

  @autobind
  receiveMessage({ data }) {
    if (data && data.type === TYPE_END && popWin) {
      this.props.onEnd(data);
      // 隐藏通话蒙版
      this.props.handleShowMask(false);
      popWin.close();
      popWin = null;
    } else if (data && data.type === TYPE_CONNECTED) {
      this.props.onConnected(data);
    }
  }

  render() {
    const { headless, number, style } = this.props;
    if (headless === true) {
      return null;
    }
    const className = classnames({
      [styles.number]: true,
      [styles.active]: this.canCall(),
    });
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

  componentWillUnmount() {
    if (this.boundMessageEvent) {
      this.boundMessageEvent = false;
      window.removeEventListener('message', this.receiveMessage);
    }
  }
}
