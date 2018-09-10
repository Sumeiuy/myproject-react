/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-20 13:46:09
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from '../../decorators/withRouter';

import styles from './home.less';

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class Home extends PureComponent {

  static propTypes = {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.mostFocusContentLink}>重点关注</div>
          <div className={styles.interestContentLink}>猜你感兴趣</div>
          <div className={styles.competitionsLink}>投顾能力竞赛</div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.shotCutLink}>快捷导航</div>
          <div className={styles.tabPanesContainer}>tab信息</div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.productDateLink}>产品日历</div>
          <div className={styles.informationContainer}>策略资讯</div>
          <div className={styles.newsInfoContainer}>每日晨报</div>
        </div>
      </div>
    );
  }
}
