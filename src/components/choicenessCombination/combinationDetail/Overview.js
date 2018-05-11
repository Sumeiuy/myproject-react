/**
 * @Description: 组合概览组件
 * @Author: Liujianshu
 * @Date: 2018-05-08 15:56:39
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-11 09:23:08
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
// import _ from 'lodash';

// import Icon from '../../common/Icon';
import styles from './overview.less';

export default class Overview extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 时间默认值
      time: '',
    };
  }

  render() {
    const {
      data: {
        composeName,
        adjustNumber,
        earnNumber,
        stockName,
        withdraw,
        weekEarnings,
        weekCurrentRank,
        weekAmout,
        monthEarnings,
        monthCurrentRank,
        monthAmout,
        yearEarnings,
        yearCurrentRank,
        yearAmout,
      },
    } = this.props;
    return (
      <div className={styles.overview}>
        <h2 className={styles.title}>{composeName}</h2>
        <div className={styles.left}>
          <div className={styles.leftInfo}>
            <h3>
              近 3 个月调仓
              <span> {adjustNumber} </span>
              次，
              <span className={styles.fs20}> {earnNumber} </span>
              次赚了钱。
            </h3>
            <h3>近 3 个月买入了<em>涨幅最高</em>的股票 <span className={styles.fs18}>{stockName}</span></h3>
            <h3>最大回撤<span className={styles.fs18}>{withdraw}%</span></h3>
          </div>
        </div>
        <div className={styles.right}>
          {
            weekEarnings
            ?
              <div className={styles.rightItem}>
                <div className={`${styles.rightIcon} ${styles.iconWeek}`}>周</div>
                <div className={styles.rightInfo}>
                  <h3 className="clearfix">
                    <span className={styles.red}>{weekEarnings}%</span>收益率
                  </h3>
                  <h3 className="clearfix">
                    <span><em className={styles.position}>{weekCurrentRank}</em>/{weekAmout}</span>
                    同类排名
                  </h3>
                </div>
              </div>
            :
              null
          }
          <div className={styles.rightItem}>
            <div className={`${styles.rightIcon} ${styles.iconMonth}`}>月</div>
            <div className={styles.rightInfo}>
              <h3 className="clearfix">
                <span className={styles.green}>{monthEarnings}%</span>
                收益率
              </h3>
              <h3 className="clearfix">
                <span>
                  <em className={styles.position}>{monthCurrentRank}</em>/{monthAmout}
                </span>
                同类排名
              </h3>
            </div>
          </div>
          <div className={styles.rightItem}>
            <div className={`${styles.rightIcon} ${styles.iconYear}`}>年</div>
            <div className={styles.rightInfo}>
              <h3 className="clearfix"><span className={styles.red}>{yearEarnings}%</span>收益率</h3>
              <h3 className="clearfix">
                <span><em className={styles.position}>{yearCurrentRank}</em>/{yearAmout}</span>
                同类排名
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
