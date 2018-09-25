/*
 * @Author: zhangjun
 * @Date: 2018-05-28 19:14:00
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-21 14:46:53
 */
import React, { Component } from 'react';
import moment from 'moment';
import { autobind } from 'core-decorators';
import Phone from '../components/common/phone';
import Mask from '../components/common/mask';
import logable from '../decorators/logable';
import fspGlobal from '../utils/fspGlobal';
import { date } from '../helper';

export default class PhoneWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMask: false,
    };
    this.startTime = '';
    this.endTime = '';
  }

  // 电话挂断和继续回调函数
  @autobind
  phoneCallback(data) {
    const { type } = data;
    if (type === 'connected') {
      this.handlePhoneConnected(data);
    }
    if (type === 'end') {
      this.handlePhoneEnd(data);
    }
  }

  // 点击电话号码打电话
  // TODO 日志查看：找不到方法 未验证
  @autobind
  @logable({ type: 'Click', payload: { name: '点击' } })
  handleClickPhone() {
    this.startTime = '';
  }

  // 电话接通方法
  @autobind
  handlePhoneConnected() {
    this.startTime = moment();
  }

  // 电话挂断方法
  @autobind
  handlePhoneEnd(data) {
    // 没有成功发起通话
    if (!moment.isMoment(this.startTime)) {
      return;
    }
    this.endTime = moment();
    const phoneDuration = date.calculateDuration(
      this.startTime.valueOf(),
      this.endTime.valueOf(),
    );
    this.setState({ showMask: false });
    const serviceContentDesc = `${this.startTime.format('HH:mm:ss')}给客户发起语音通话，时长${phoneDuration}。`;
    const payload = {
      ...data,
      // 服务方式
      serveWay: 'HTSC Phone',
      // 任务类型，1：MOT  2：自建
      taskType: '2',
      // 服务记录内容
      serveContentDesc: serviceContentDesc,
      // 服务时间
      serveTime: this.endTime.format('YYYY-MM-DD HH:mm'),
      // 反馈时间
      feedBackTime: moment().format('YYYY-MM-DD'),
      // 添加成功后需要显示message提示
      noHints: true,
    };
    fspGlobal.phoneCallback(payload);
  }

  // 显示和隐藏通话蒙版
  // TODO 日志查看：找不到方法 未验证
  @autobind
  @logable({ type: 'Click', payload: { name: '显示/隐藏' } })
  handleShowMask(data) {
    this.setState({ showMask: data });
  }

  render() {
    const { showMask } = this.state;
    return (
      <div className="phoneWrapper">
        <Phone
          headless
          onEnd={this.phoneCallback}
          onConnected={this.phoneCallback}
          onShowMask={this.handleShowMask}
          onClick={this.handleClickPhone}
        />
        <Mask
          visible={showMask}
          onClick={() => { this.handleShowMask(false); }}
        />
      </div>
    );
  }
}
