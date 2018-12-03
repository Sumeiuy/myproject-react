/*
 * @Author: zhangjun
 * @Date: 2018-05-21 14:31:45
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-22 14:46:06
 */
import { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';
import _ from 'lodash';
import env from '../../../helper/env';

export default class IEWarningModal extends PureComponent {
  componentDidMount() {
    // 获取环境信息
    const envs = env.getEnv();
    const browserVersion = envs.$browser_version;
    if (_.includes(browserVersion, 'Internet Explorer 10')) {
      this.warning();
    }
  }

  @autobind
  warning() {
    Modal.warning({
      mask: false,
      title: '您正在使用的浏览器IE10，和理财服务平台页面有兼容问题，建议您升级为IE11!',
      okText: '确定',
    });
  }

  render() {
    return null;
  }
}
