/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性tab-会员信息组件
 * @Date: 2018-11-08 18:56:49
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 20:02:35
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import ZLMemberInfo from './ZLMemberInfo';
import ZJMemberInfo from './ZJMemberInfo';

export default class MemberInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员信息
    queryZLUmemberInfo: PropTypes.func.isRequired,
    zlUMemberInfo: PropTypes.object.isRequired,
    // 获取涨乐财富通U会员等级变更记录
    queryZLUmemberLevelChangeRecords: PropTypes.func.isRequired,
    zlUMemberLevelChangeRecords: PropTypes.object.isRequired,
    // 获取紫金积分会员信息
    queryZjPointMemberInfo: PropTypes.func.isRequired,
    zjPointMemberInfo: PropTypes.object.isRequired,
    // 获取紫金积分会员积分兑换流水
    queryZjPointExchangeFlow: PropTypes.func.isRequired,
    zjPointExchangeFlow: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    this.queryData(custId);
  }

  componentDidUpdate(prevProps) {
    const {
      location: {
        query: {
          custId: prevCustId,
        },
      },
    } = prevProps;
    const {
      location: {
        query: {
          custId,
        },
      },
    } = this.props;
    // url中custId发生变化时重新请求相关数据
    if (prevCustId !== custId) {
      this.queryData(custId);
    }
  }

  @autobind
  queryData(custId) {
    const {
      queryZLUmemberInfo,
      queryZjPointMemberInfo,
    } = this.props;
    queryZLUmemberInfo({custId});
    queryZjPointMemberInfo({custId});
  }


  render() {
    const {
      zlUMemberInfo,
      zjPointMemberInfo,
    } = this.props;
    return (
      <div>
        <ZLMemberInfo
          data={zlUMemberInfo}
        />
        <ZJMemberInfo
          data={zjPointMemberInfo}
        />
      </div>
    );
  }
}
