/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-列表项
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-18 16:54:13
*/

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import styles from './combinationListItem.less';

export default class CombinationListItem extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className={styles.itemBox}>
        <div className={styles.headBox}>
          <span className={styles.combinationName} title={'组合名称'}>组合名称组合名称</span>
          <span className={styles.earnings}>
            <i>近7天收益率</i>
            <em className={styles.up}>+5.12%</em>
          </span>
          <span className={styles.tips}>
            <i>高风险</i>
            <em>推荐</em>
          </span>
          <span className={styles.link}>
            <a>历史报告</a>
            |
            <a>订购客户</a>
          </span>
        </div>
        <div className={styles.titleBox}>
          <span className={styles.securityName}>证券名称</span>
          <span className={styles.securityCode}>证券代码</span>
          <span className={styles.direction}>调仓方向</span>
          <span className={styles.time}>时间</span>
          <span className={styles.cost}>成本价</span>
          <span className={styles.reason}>理由</span>
        </div>
        <div className={styles.bodyBox}>
          <span className={styles.securityName}>
            <a>证券名称</a>
          </span>
          <span className={styles.securityCode}>
            <a>证券名称</a>
          </span>
          <span className={styles.direction}>买</span>
          <span className={styles.time}>2018/02/12 12:00</span>
          <span className={styles.cost}>3.20</span>
          <span className={styles.reason}>理由理由理由理由理由</span>
        </div>
      </div>
    );
  }
}
