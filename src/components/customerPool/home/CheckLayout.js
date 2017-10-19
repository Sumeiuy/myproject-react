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

function CheckLayout({ dataSource }) {
  return (
    <div className={styles.container}>
      <div className={classnames(styles.content, styles.left)}>
        <div className={classnames(styles.check, styles.bottomBorder)}>
          <div className={styles.count}>{dataSource[0] || '--'}</div>
          <div className={styles.title}>{'净新增客户资产'}</div>
        </div>
        <div className={classnames(styles.check)}>
          <div className={styles.count}>{dataSource[1] || '--'}</div>
          <div className={styles.title}>{'累计基础交易量'}</div>
        </div>
      </div>
      <div className={classnames(styles.content, styles.right)}>
        <div className={classnames(styles.check, styles.bottomBorder)}>
          <div className={styles.count}>{dataSource[2] || '--'}</div>
          <div className={styles.title}>{'累计综合交易量'}</div>
        </div>
        <div className={classnames(styles.check)}>
          <div className={styles.count}>{dataSource[3] || '--'}</div>
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
