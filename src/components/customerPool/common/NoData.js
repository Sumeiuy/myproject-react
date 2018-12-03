/**
 * @file components/customerPool/NoData.js
 *  客户池-客户列表无数据
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import styles from './noData.less';
import emptyImg from './empty.png';

import loadingEnd from '../../../decorators/loadingEnd';

@loadingEnd
export default class NoData extends PureComponent {
  render() {
    return (
      <div className={styles.nodata}>
        <div className="empty-container">
          <img src={emptyImg} alt="" />
          <p>没有找到相关客户</p>
        </div>
      </div>
    );
  }
}

