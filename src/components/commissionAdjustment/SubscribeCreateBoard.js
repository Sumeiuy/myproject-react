/**
 * @Author: sunweibin
 * @Date: 2017-11-08 15:51:25
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-09 16:21:52
 * @description 资讯订阅新建的内容组件
 */
import React, { PureComponent } from 'react';
// import { autobind } from 'core-decorators';
import { connect } from 'react-redux';

// redux store
const mapStateToProps = state => ({
  // 目标股基佣金率码值列表@baojiajia请删除
  gjList: state.commission.singleGJCommission,
});

// redux dispatch
const mapDispatchToProps = {
};

@connect(mapStateToProps, mapDispatchToProps, Object.assign, { withRef: true })
export default class SubscribeCreateBoard extends PureComponent {
  render() {
    return (<div />);
  }
}
