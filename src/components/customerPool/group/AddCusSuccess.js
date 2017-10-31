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
import { fspContainer } from '../../../config';
import styles from './addCusSuccess.less';
import { fspGlobal } from '../../../utils';

export default class AddCusSuccess extends PureComponent {
  static propTypes = {
    closeTab: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    onDestroy: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }

  componentWillUnmount() {
    const { onDestroy } = this.props;
    onDestroy();
  }

  /* 跳转到客户分组管理列表 */
  @autobind
  LinkToGroupManage() {
    const { push } = this.props;
    const url = '/customerPool/customerGroupManage';
    const param = {
      id: 'FSP_CUST_GROUP_MANAGE',
      title: '客户分组管理',
    };
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({ url, param });
    } else {
      push({
        pathname: url,
      });
    }
  }

  // 返回首页
  @autobind
  goToIndex() {
    const { closeTab, push, location: { state } } = this.props;
    const url = '/customerPool';
    const param = {
      id: 'tab-home',
      title: '首页',
    };

    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({ url, param });
      closeTab();
    } else {
      push({
        pathname: url,
        query: _.omit(state, 'noScrollTop'),
      });
    }
  }

  render() {
    return (
      <div className={styles.addCusSuccess}>
        <div className={styles.text}>添加分组</div>
        <hr />
        <div className={styles.successContent} >
          <div className={styles.img} />
          <div className={styles.text1}>保存成功，已完成分组添加!</div>
          <div className={styles.text2}>你可以在
            <span onClick={this.LinkToGroupManage} className={styles.linkTo}>
              客户分组
            </span>
            查看该分组
          </div>
          <div className={styles.successBtn}>
            <Button onClick={this.goToIndex} type="primary">返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
}
