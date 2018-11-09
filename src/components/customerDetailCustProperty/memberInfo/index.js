/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性tab-会员信息组件
 * @Date: 2018-11-08 18:56:49
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 20:02:35
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import ZLMemberInfo from './ZLMemberInfo';
import ZJMemberInfo from './ZJMemberInfo';

export default class MemberInfo extends PureComponent {
  static propTypes = {
    // 涨乐财富通会员信息
    zlUMemberInfo: PropTypes.object.isRequired,
    // 涨乐U会员等级变更记录
    zlUMemberLevelChangeRecords: PropTypes.object.isRequired,
  }

  render() {
    const {
      zlUMemberInfo,
      // zlUMemberLevelChangeRecords,
    } = this.props;
    return (
      <div>
        <ZLMemberInfo
          data={zlUMemberInfo}
        />
        <ZJMemberInfo
          data={zlUMemberInfo}
        />
      </div>
    );
  }
}
