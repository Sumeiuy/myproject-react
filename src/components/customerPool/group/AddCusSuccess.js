/**
 *@file
 *@author zhuyanwen
 * 客户分组添加成功页面
 * */
import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { autobind } from 'core-decorators';
import Button from '../../common/Button';
import { fspContainer } from '../../../config';
import styles from './addCusSuccess.less';
import { fspGlobal } from '../../../utils';

@withRouter
export default class AddCusSuccess extends PureComponent {
  static propTypes = {
    closeTab: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
    resetSuccess: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired,
  }

  componentWillUnmount() {
    const { resetSuccess } = this.props;
    resetSuccess();
  }

  /* 跳转到fsp的分组详情 */
  @autobind
  LinkToGroupDetail() {
    const url = `/custgroup/manage/viewGroupInfo?groupId=${this.props.groupId}`;
    const param = {
      id: 'FSP_ST_TAB_CUSTCENTER_CUSTGROUP_VIEW',
      title: '查看客户分组信息',
      forceRefresh: true,
      closable: true,
    };
    fspGlobal.openFspTab({ url, param });
    this.props.closeTab();
  }

  // 返回首页
  @autobind
  goToIndex() {
    const { go, closeTab } = this.props;
    const url = '/customerPool';
    const param = {
      id: 'tab-home',
      title: '首页',
    };
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({ url, param });
      closeTab();
    } else {
      go(-2);
    }
  }

  render() {
    const { groupName } = this.props;
    return (
      <div className={styles.addCusSuccess}>
        <div className={styles.text}>添加分组</div>
        <hr />
        <div className={styles.successContent} >
          <div className={styles.img} />
          <div className={styles.text1}>保存成功，已完成分组添加!</div>
          <div className={styles.text2}>你可以在
            <span onClick={this.LinkToGroupDetail} className={styles.linkTo}>{groupName}
            </span>
            查看该分组下所有客户
          </div>
          <div className={styles.successBtn}>
            <Button onClick={this.goToIndex} type="primary">返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
}
