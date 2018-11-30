/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: liqianwen
 * @Last Modified time: 2018-11-29 11:23:53
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import Phone from '../../components/common/phone';

export default class PhoneHome extends PureComponent {
  @autobind
  handleEnd({ duration }) {
    message.info(`通话时长: ${duration} 秒`);
  }

  render() {
    return (
      <Phone
        onEnd={this.handleEnd}
        number="18905163020"
        custType="per"
        disable={false}
      />
    );
  }
}
