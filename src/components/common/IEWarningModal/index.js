/*
 * @Author: zhangjun
 * @Date: 2018-05-21 14:31:45
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-05-21 15:07:01
 */
import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Modal } from 'antd';

export default class IEWarningModal extends PureComponent {
  componentDidMount() {
    this.warning();
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
    return (
      <div />
    );
  }
}
