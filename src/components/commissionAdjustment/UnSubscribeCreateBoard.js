/**
 * @Author: sunweibin
 * @Date: 2017-11-08 15:52:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-09 16:22:16
 * @description 资讯退订新建的内容组件
 */
import React, { PureComponent } from 'react';
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
export default class UnSubscribeCreateBoard extends PureComponent {
  render() {
    return (<div />);
  }
}
