/**
 * @Description: PC电话拨号页面
 * @Author: maoquan
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: liqianwen
 * @Last Modified time: 2018-11-29 12:03:55
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';
import bowser from 'bowser';
import _ from 'lodash';
import qs from 'query-string';
import classnames from 'classnames';
import { Phone as XPhone } from 'lego-soft-phone';
import sotfCallInstall from './SotfCallInstall0426.msi';
import prompt from '../prompt_';
import Mask from '../mask';
import { env } from '../../../helper';
import logable from '../../../decorators/logable';
import styles from './phone.less';

const URL = bowser.msie
  // IE10跨域无法和父页面通信，部署在同域下
  ? '/fspa/phone/'
  // Chrome等WebRTC只可用在https域下,所以部署到移动端server
  // 生产地址 https://crm.htsc.com.cn:1443/phone/
  // 测试地址 https://crm.htsc.com.cn:2443/phone/
  : 'https://crm.htsc.com.cn:1443/phone/';

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
const TYPE_WEBPHONEUNLOAD = 'webPhoneUnload';

// 检查是否安装打电话插件
function checkIEHasCallPlugin() {
  const xPhone = new XPhone({});
  try {
    // 初始化
    xPhone.phone.Init2('');
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    xPhone.release();
  }
  return true;
}

// 检查浏览器的版本
// 部分高版本chrome、firefox无法支持PC拨打电话,目前在大多数浏览器都能使用，所以先把版本号设置成较大值
function checkBowserVersion() {
  // 获取浏览器版本的大版本号
  const bowserVersion = parseInt(bowser.version.split('.')[0], 10);
  // 判断chrome和firefox浏览器的版本号
  if ((env.isChrome() && bowserVersion > 1000)
    || (env.isFirefox() && bowserVersion > 1000)) {
    return true;
  }
  return false;
}

// 创建一个会缓存 checkIEHasCallPlugin 结果的函数
const memoizeCheck = _.memoize(checkIEHasCallPlugin);

export default class Phone extends PureComponent {
  static propTypes = {
    // 是否需要展示号码，如果作为HOOK处理FSP上所有电话行为，则为true
    headless: PropTypes.bool,
    // 电话号码
    number: PropTypes.string,
    // 客户类型
    custType: PropTypes.string,
    // 点击号码回调 如果要传回调函数的话，回调函数中必须传个promise
    onClick: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
    ]),
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
  }

  static defaultProps = {
    number: '0',
    custType: 'per',
    headless: false,
    disable: false,
    style: {},
    onClick: null,
    onEnd: _.noop,
    onConnected: _.noop,
    name: '',
    userData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      showMask: false,
    };
    this.popWin = null;
  }

  componentDidMount() {
    if (this.props.headless === true && window.$) {
      window.$('body').on(
        'click',
        '.callable',
        (e) => {
          if (this.canCall()) {
            const number = window.$(e.target).text() || window.$(e.target).val();
            // 在ie下才需要检测打电话控件是否安装
            if (bowser.msie) {
              if (!memoizeCheck()) {
                this.handlePluginError();
                return;
              }
            }
            // 检测chrome、firefox浏览器的版本号， 部分高版本chrome、firefox无法支持PC拨打电话
            if (env.isChrome() || env.isFirefox()) {
              if (checkBowserVersion()) {
                this.handleBowserVersionError();
                return;
              }
            }
            // 点击打电话
            if (this.props.onClick) {
              this.props.onClick().then(() => {
                this.prepareCall(number);
              });
            } else {
              this.prepareCall(number);
            }
            // 显示通话蒙版
            this.showMask();
          }
        },
      );
    }
  }

  componentWillUnmount() {
    if (this.boundMessageEvent) {
      this.boundMessageEvent = false;
      window.removeEventListener('message', this.receiveMessage);
    }
  }

  // 是否已绑定message事件
  boundMessageEvent = false;

  canCall() {
    const { empInfo, disable } = this.props;
    return empInfo.canCall === true && disable !== true;
  }

  // 未安装插件弹框提示
  @autobind
  handlePluginError() {
    Modal.error({
      title: '提示',
      content: (
        <div>
          您尚未安装通话插件，请先下载并安装通话插件，安装完成后请关闭浏览器并重新打开。
          <p className={styles.pluginDownload}><a href={sotfCallInstall}>立即下载</a></p>
        </div>
      ),
      okText: '确定',
    });
  }

   // 高版本的chrome、firefox浏览器弹框提示
   @autobind
  handleBowserVersionError() {
    prompt({
      title: '当前浏览器版本不支持拨号功能！',
      type: 'warning',
      okText: '关闭',
      className: styles.promptError,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '拨打电话' }
  })
   handleClick() {
     const { number, custType, onClick } = this.props;
     if (this.canCall() !== true) {
       return;
     }
     // 在ie下才需要检测打电话控件是否安装
     if (bowser.msie) {
       if (!memoizeCheck()) {
         this.handlePluginError();
         return;
       }
     }
     // 检测chrome、firefox浏览器的版本号， 部分高版本chrome、firefox无法支持PC拨打电话
     if (env.isChrome() || env.isFirefox()) {
       if (checkBowserVersion()) {
         this.handleBowserVersionError();
         return;
       }
     }
     if (onClick) {
       onClick({
         number,
         custType,
       }).then(() => {
         this.prepareCall(number);
       });
     } else {
       this.prepareCall(number);
     }
     this.showMask();
   }


  // 显示通话蒙版
  @autobind
  @logable({
    type: 'Click',
    payload: { name: '显示' }
  })
  showMask() {
    this.setState({ showMask: true });
  }

  // 隐藏通话蒙版
  @autobind
  @logable({
    type: 'Click',
    payload: { name: '隐藏' }
  })
  hideMask() {
    this.setState({ showMask: false });
  }

  prepareCall(number) {
    const { getConfig } = this.props;
    this.popWin = window.open(
      'about:blank',
      'phoneDialog',
      OPEN_FEATURES,
    );
    getConfig().then(() => this.call(number));
  }

  call(number) {
    const {
      custType, config, name, userData
    } = this.props;
    const {
      sipInfo: { sipID, sipDomain, sipPasswd },
      wssInfo: {
        wssIp, wssPort, sipIp, sipPort
      },
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
    this.popWin.location = srcUrl;
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
    if (data && data.type === TYPE_END && this.popWin) {
      this.props.onEnd(data);
      // 隐藏通话蒙版
      this.hideMask();
      this.popWin.close();
      this.popWin = null;
    } else if (data && data.type === TYPE_CONNECTED) {
      this.props.onConnected(data);
    } else if (data && data.type === TYPE_WEBPHONEUNLOAD) {
      this.hideMask();
    }
  }

  render() {
    const { headless, number, style } = this.props;
    const { showMask } = this.state;
    if (headless === true) {
      return (
        <Mask visible={showMask} onClick={this.hideMask} />
      );
    }
    const className = classnames({
      [styles.number]: true,
      [styles.active]: this.canCall(),
    });
    return (
      <div>
        <div
          className={className}
          onClick={this.handleClick}
          style={style}
        >
          {number}
        </div>
        <Mask visible={showMask} onClick={this.hideMask} />
      </div>
    );
  }
}
