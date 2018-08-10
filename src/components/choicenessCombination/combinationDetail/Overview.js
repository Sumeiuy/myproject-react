/**
 * @Description: 组合概览组件
 * @Author: Liujianshu
 * @Date: 2018-05-08 15:56:39
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-12 17:05:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import _ from 'lodash';

import { number } from '../../../helper';
import { weekMonthYear } from '../config';
import styles from './overview.less';

const EMPTY_TEXT = '无';
export default class Overview extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    titleName: PropTypes.string.isRequired,
  }


  @autobind
  getNumberClassName(num) {
    const bigThanZero = num >= 0;
    const numberClassName = classnames({
      [styles.up]: bigThanZero,
      [styles.down]: !bigThanZero,
    });
    return numberClassName;
  }

  // 与零作比较，大于 0 则加上 + 符号
  @autobind
  compareWithZero(value) {
    return value > 0 ? `+${value}` : value;
  }

  render() {
    const {
      data,
      data: {
        adjustNumber,
        earnNumber,
        stockName,
        withdraw,
        weekEarnings,
      },
      titleName,
    } = this.props;
    const showWeekMonthYear = [...weekMonthYear];
    if (!_.isEmpty(data) && !_.isNumber(weekEarnings)) {
      showWeekMonthYear.shift();
    }
    return (
      <div className={styles.overview}>
        <h2 className={styles.title}>{ titleName || EMPTY_TEXT}</h2>
        <div className={styles.left}>
          <div className={styles.leftInfo}>
            <h3>
              近 3 个月调仓
              <span> {adjustNumber} </span>
              次，
              <span className={styles.fs20}> {earnNumber} </span>
              次赚了钱。
            </h3>
            <h3>
              近 3 个月买入的
              <em>涨幅最高</em>的股票
              <span className={styles.fs18}> {stockName || EMPTY_TEXT} </span>
            </h3>
            <h3>
              组合成立以来最大回撤
              <span className={`${this.getNumberClassName(withdraw)} ${styles.fs18}`}>
                {this.compareWithZero(number.toFixed(withdraw))}%
              </span>
            </h3>
          </div>
        </div>
        <div className={styles.right}>
          {
            showWeekMonthYear.map((item, index) => {
              const { name, key, percent, ranking, total } = item;
              const nameKey = `$${name}${index}`;
              const num = number.toFixed(data[percent]);
              const cls = `icon${key}`;
              return (
                <div className={styles.rightItem} key={nameKey}>
                  <div className={`${styles.rightIcon} ${styles[cls]}`}>
                    {name}
                  </div>
                  <div className={styles.rightInfo}>
                    <h3 className="clearfix">
                      <span className={this.getNumberClassName(num)}>
                        {this.compareWithZero(num)}%
                      </span>
                      收益率
                    </h3>
                    <h3 className="clearfix">
                      <span>
                        <em className={styles.position}>{data[ranking]}</em>/{data[total]}
                      </span>
                      同类排名
                    </h3>
                  </div>
                </div>);
            })
          }
        </div>
      </div>
    );
  }
}
