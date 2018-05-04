/**
 * @Description: PC电话拨号页面
 * @Author: maoquan
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-05-03 18:16:29
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import bowser from 'bowser';
import _ from 'lodash';
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
    number: PropTypes.string.isRequired,
    // 客户类型
    custType: PropTypes.string.isRequired,
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
  }

  static defaultProps = {
    headless: false,
    disable: true,
    style: {},
    onClick: _.noop,
    onEnd: _.noop,
    onConnected: _.noop,
  };

  componentDidMount() {
    if (this.props.headless === true && window.$) {
      window.$('body').on(
        'click',
        '.callable',
        (e) => {
          const number = window.$(e.target).text();
          this.prepareCall(number);
        },
      );
    }
  }

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
    this.prepareCall(number);
  }

  prepareCall(number) {
    const { config, getConfig } = this.props;
    popWin = window.open(
      'about:blank',
      'phoneDialog',
      OPEN_FEATURES,
    );
    if (_.isEmpty(config)) {
      getConfig().then(() => this.call(number));
    } else {
      this.call(number);
    }
  }

  call(number) {
    const { custType, config } = this.props;
    const {
      sipInfo: { sipID, sipDomain, sipPasswd },
      wssInfo: { wssIP, wssPort, sipIP, sipPort },
    } = config;

    const configQueryString = [
      `sipID=${sipID}`,
      `sipDomain=${sipDomain}`,
      `sipPasswd=${sipPasswd}`,
      `sipIP=${sipIP}`,
      `sipPort=${sipPort}`,
      `wssIP=${wssIP}`,
      `wssPort=${wssPort}`,
    ].join('&');

    const srcUrl = `${URL}?number=${number}&custType=${custType}&auto=true&${configQueryString}`;
    popWin.location = srcUrl;
    window.addEventListener(
      'message',
      this.receiveMessage,
      false,
    );
  }

  @autobind
  receiveMessage({ data }) {
    window.removeEventListener('message', this.receiveMessage);
    if (data && data.type === TYPE_END && popWin) {
      this.props.onEnd(data);
      popWin.close();
      popWin = null;
    } else if (data && data.type === TYPE_CONNECTED) {
      this.props.onConnected(data);
    }
  }

  render() {
    const { headless, number, style, disable } = this.props;
    if (headless === true) {
      return null;
    }
    const className = classnames({
      [styles.number]: true,
      [styles.active]: disable !== true,
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
}
