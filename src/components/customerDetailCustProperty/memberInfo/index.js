/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性tab-会员信息组件
 * @Date: 2018-11-08 18:56:49
 * @Last Modified by: wangyikai
 * @Last Modified time: 2018-11-12 14:43:21
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import ZLMemberInfo from './ZLMemberInfo';
import ZJMemberInfo from './ZJMemberInfo';

export default class MemberInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 涨乐财富通会员信息
    zlUMemberInfo: PropTypes.object.isRequired,
    // 涨乐U会员等级变更记录
    zlUMemberLevelChangeRecords: PropTypes.object.isRequired,
     // 紫金积分会员信息
     zjPointMemberInfo: PropTypes.object.isRequired,
    // 紫金积分会员积分兑换流水
    zjPointExchangeFlow: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: PropTypes.func.isRequired,
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: PropTypes.func.isRequired,
  }

  render() {
    const {
      location,
      zlUMemberInfo,
      zlUMemberLevelChangeRecords,
      zjPointMemberInfo,
      zjPointExchangeFlow,
      queryZLUmemberLevelChangeRecords,
      queryZjPointExchangeFlow
    } = this.props;
    return (
      <div>
        <ZLMemberInfo
          location={location}
          data={zlUMemberInfo}
          dataSource={zlUMemberLevelChangeRecords}
          queryZLUmemberLevelChangeRecords={queryZLUmemberLevelChangeRecords}
        />
        <ZJMemberInfo
          location={location}
          data={zjPointMemberInfo}
          dataSource={zjPointExchangeFlow}
          queryZjPointExchangeFlow={queryZjPointExchangeFlow}
        />
      </div>
    );
  }
}
