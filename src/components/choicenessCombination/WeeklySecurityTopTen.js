/*
 * @Author: XuWenKang
 * @Description: 精选组合-近一周表现前十的证券
 * @Date: 2018-04-17 16:38:02
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-17 17:25:35
 */
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import InfoTitle from '../common/InfoTitle';
import Icon from '../common/Icon';
import styles from './weeklySecurityTopTen.less';

const titleStyle = {
  fontSize: '16px',
};


export default class WeeklySecurityTopTen extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={styles.weeklySecurityTopTenBox}>
        <InfoTitle
          head="近一周表现前十的证券"
          titleStyle={titleStyle}
        />
        <div className={styles.titleBox}>
          <span className={styles.securityName}>证券名称及代码</span>
          <span className={styles.adjustTime}>调入时间</span>
          <span className={styles.upAndDown}>涨跌幅</span>
          <span className={styles.combinationName}>组合名称</span>
          <span className={styles.combinationName}>持仓客户</span>
        </div>
        <ul className={styles.bodyBox}>
          <li>
            <div className={styles.summary}>
              <span className={styles.securityName} title={'神马股票（20938）'}>神马股票（20938）</span>
              <span className={styles.adjustTime}>2018/01/21 12:00</span>
              <span className={styles.upAndDown}>+0.88%</span>
              <span className={styles.combinationName}>组合名称</span>
              <span className={styles.combinationName}><a><Icon type="kehuzu" /></a></span>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
