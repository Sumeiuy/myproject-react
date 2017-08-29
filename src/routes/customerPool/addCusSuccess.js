/**
 *@file
 *@author zhuyanwen
 * 客户分组添加成功页面
 * */
import React, { PureComponent, PropTypes } from 'react';
import { withRouter } from 'dva/router';
import { Button } from 'antd';
import styles from './addCusSuccess.less';


@withRouter
export default class addCusSuccess extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }
  componentWillMount() {
    console.info(this.props);
  }
  render() {
    return (
      <div className={styles.addCusSuccess}>
        <div className={styles.text}>添加分组</div>
        <hr />
        <div className={styles.successContent} >
          <div className={styles.img} />
          <div className={styles.text1}>保存成功，已完成分组添加!</div>
          <div className={styles.text2}>你可以在重点关注客户群查看该分组下所有客户</div>
          <div className={styles.successBtn}>
            <Button onClick={() => this.handleSuccess()}type="primary">确定</Button>
          </div>
        </div>
      </div>
    );
  }
}
