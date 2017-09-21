/**
 *@file
 *@author zhuyanwen
 * 客户分组添加成功页面
 * */
import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { autobind } from 'core-decorators';
import Button from '../../common/Button';
import styles from './addCusSuccess.less';


@withRouter
export default class AddCusSuccess extends PureComponent {
  static propTypes = {
    goback: PropTypes.func.isRequired,
    groupId: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
  }
  @autobind
  /* 回退 */
  closeTab() {
    console.log(this.props);
    const { goback } = this.props;
    // console.log(goback)
    goback();
  }
  /* 跳转到fsp的分组详情 */
  @autobind
  LinkToGroupDetail() {
    /* const { groupId } = this.props; */
  }
  render() {
    const { groupName } = this.props;
    console.log('this.props---', this.props);
    return (
      <div className={styles.addCusSuccess}>
        <div className={styles.text}>添加分组</div>
        <hr />
        <div className={styles.successContent} >
          <div className={styles.img} />
          <div className={styles.text1}>保存成功，已完成分组添加!</div>
          <div className={styles.text2}>你可以在
            <span onClick={() => this.LinkToGroupDetail()} className={styles.linkTo}>{groupName}
            </span>
            查看该分组下所有客户
          </div>
          <div className={styles.successBtn}>
            <Button onClick={this.closeTab} type="primary">返回首页</Button>
          </div>
        </div>
      </div>
    );
  }
}
