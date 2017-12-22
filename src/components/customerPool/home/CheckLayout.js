/**
 * @file components/customerPool/home/CheckLayout.js
 *  文字列表，row如下图：-----, | 代表solid线
 *  50   | 50
 *  xxxx | xxxx
 *  --------------
 *  50   | 50
 *  xxxx | xxxx
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';
import classnames from 'classnames';

import styles from './checkLayout.less';

function CheckLayout({ dataSource = [] }) {
  return (
    <div className={styles.container}>
      <div className={classnames(styles.content, styles.left)}>
        <div className={classnames(styles.check, styles.bottomBorder)}>
          <div className={styles.count}>
            <span>{dataSource[0].item}</span>
            <span>{dataSource[0].unit}</span>
          </div>
          <div className={styles.title}>{'净转入资产'}</div>
        </div>
        <div className={classnames(styles.check)}>
          <div className={styles.count}>
            <span>{dataSource[1].item}</span>
            <span>{dataSource[1].unit}</span>
          </div>
          <div className={styles.title}>{'累计基础交易量'}</div>
        </div>
      </div>
      <div className={classnames(styles.content, styles.right)}>
        <div className={classnames(styles.check, styles.bottomBorder)}>
          <div className={styles.count}>
            <span>{dataSource[2].item}</span>
            <span>{dataSource[2].unit}</span>
          </div>
          <div className={styles.title}>{'累计综合交易量'}</div>
        </div>
        <div className={classnames(styles.check)}>
          <div className={styles.count}>
            <span>{dataSource[3].item}</span>
            <span>{dataSource[3].unit}</span>
          </div>
          <div className={styles.title}>{'股基累计净佣金'}</div>
        </div>
      </div>
    </div>
  );
}

CheckLayout.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default CheckLayout;
