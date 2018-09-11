/**
 * @Author: wangjunjun
 * @Date: 2018-01-30 13:37:45
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-09-11 15:59:19
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from '../../decorators/withRouter';
import KeyAttention from '../../components/newHome/KeyAttention';
import ViewAndIntro from '../../components/newHome/ViewAndIntro';

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
    const keyAttentionProps = {
      data: [],
    };
    const viewAndIntroProps = {
      data: {},
    }
    return (
      <div className={styles.container}>
        <div className={styles.leftContent}>
          <div className={styles.mostFocusContentLink}>
            <KeyAttention {...keyAttentionProps} />
          </div>
          <div className={styles.interestContentLink}>猜你感兴趣</div>
          <div className={styles.competitionsLink}>投顾能力竞赛</div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.shotCutLink}>快捷导航</div>
          <div className={styles.tabPanesContainer}>tab信息</div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.productDateLink}>产品日历</div>
          <div className={styles.informationContainer}>
            <ViewAndIntro {...viewAndIntroProps} />
          </div>
          <div className={styles.newsInfoContainer}>每日晨报</div>
        </div>
      </div>
    );
  }
}
