/**
 *@file
 *@author zhuyanwen
 * 客户分组添加成功页面
 * */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Button from '../../common/Button';
import styles from './addCusSuccess.less';
import { openRctTab, navTo } from '../../../utils';
import Clickable from '../../../components/common/Clickable';

export default class AddCusSuccess extends PureComponent {
  static propTypes = {
    closeTab: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    onDestroy: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      changeTime: 2,
    };
  }

  componentWillMount() {
    // 解决记住tab的问题
    // 设置标志位
    const { replace, location: { query, pathname } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        isOperateSuccess: 'Y',
      },
    });
    this.successSetInterval = setInterval(this.handleMovTime, 1000);
  }

  componentWillUnmount() {
    const { onDestroy } = this.props;
    onDestroy();
    this.clearTimeInterval();
  }

  @autobind
  clearTimeInterval() {
    // 清除interval
    clearInterval(this.successSetInterval);
    this.successSetInterval = null;
  }

  /* 跳转到客户分组管理列表 */
  @autobind
  LinkToGroupManage() {
    this.clearTimeInterval();
    const { push } = this.props;
    const url = '/customerPool/customerGroupManage';
    const param = {
      id: 'FSP_CUST_GROUP_MANAGE',
      title: '客户分组管理',
    };
    openRctTab({
      url,
      param,
      routerAction: push,
    });
  }

  @autobind
  handleMovTime() {
    let { changeTime } = this.state;
    this.setState({
      changeTime: --changeTime,
    }, () => {
      if (changeTime <= 0) {
        // 跳转之前关闭interval
        this.goToHome();
      }
    });
  }

  // 返回首页
  @autobind
  goToHome() {
    this.clearTimeInterval();
    const { closeTab, push, location: { state } } = this.props;
    const url = '/customerPool';
    const param = {
      id: 'tab-home',
      title: '首页',
    };
    closeTab();
    navTo({
      url,
      param,
      routerAction: push,
      pathname: url,
      query: _.omit(state, 'noScrollTop'),
    });
  }

  render() {
    const { changeTime } = this.state;
    return (
      <div className={styles.addCusSuccess}>
        <div className={styles.text}>添加分组</div>
        <hr />
        <div className={styles.successContent} >
          <div className={styles.img} />
          <div className={styles.text1}>保存成功，已完成分组添加!</div>
          <div className={styles.text2}>你可以在
            <Clickable
              onClick={this.LinkToGroupManage}
              eventName="/click/addCustSuccess/linkToCustGroup"
            >
              <span className={styles.linkTo}>客户分组</span>
            </Clickable>
            查看该分组
          </div>
          <p>页面会在 <b>{changeTime}</b> 秒内自动关闭</p>
          <div className={styles.successBtn}>
            <Clickable
              onClick={this.goToIndex}
              eventName="/click/addCustSuccess/backHome"
            >
              <Button type="primary">返回首页</Button>
            </Clickable>
          </div>
        </div>
      </div>
    );
  }
}
