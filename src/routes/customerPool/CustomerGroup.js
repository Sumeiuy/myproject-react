/**
 *@file
 *@author zhuyanwen
 * 客户分组功能开发
 * */
import React, { PureComponent } from 'react';
import { withRouter } from 'dva/router';
import { Button } from 'antd';
import styles from './CustomerGroup.less';
@withRouter
export default class CustomerGroup extends PureComponent {
  static propTypes = {
  }
  render() {
    return (
      <div className={styles.CustomerGroup}>
        <div className={styles.selectContent}>
          <div className={styles.text}>添加分组</div>
          <hr />
          <div className={styles.selectBtn} >
            <Button className={styles.hasGroupBtn}>
              <div className={styles.btnText}>添加到已有分组</div>
              <div className={styles.choosed} />
            </Button>
            <Button className={styles.newGroupBtn}>添加到新建分组</Button>
          </div>
        </div>
      </div>
    );
  }
}
