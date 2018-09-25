/**
 * @Description: PC电话拨号页面
 * @Author: hongguangqing
 * @Date: 2018-04-11 20:22:50
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-28 15:27:21
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import { message } from 'antd';

import Phone from '../../components/common/phone';
import logable from '../../decorators/logable';

const mapStateToProps = () => ({

});

@connect(mapStateToProps)
export default class PhoneHome extends PureComponent {
  static propTypes = {
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '选中号码' } })
  handleClick() {
    // 可以在这个事件里先发一条服务记录
    console.log('number clicked');
  }

  @autobind
  handleEnd({ duration }) {
    message.info(`通话时长: ${duration} 秒`);
  }

  render() {
    return (
      <Phone
        onClick={this.handleClick}
        onEnd={this.handleEnd}
        number="18905163020"
        custType="per"
        disable={false}
      />
    );
  }
}
