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
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './checkLayout.less';

function renderItem(data, title, itemStyle = null) {
  return (
    <div className={classnames(styles.check, itemStyle)}>
      <div className={styles.count}>
        <span title={`${data.item}${data.unit}`}>{data.item}<span>{data.unit}</span></span>
      </div>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

function CheckLayout({ dataSource = [] }) {
  return (
    <div className={styles.container}>
      <div className={classnames(styles.content, styles.left)}>
        {renderItem(dataSource[0], '净新增客户资产', styles.bottomBorder)}
        {renderItem(dataSource[1], '累计基础交易量')}
      </div>
      <div className={classnames(styles.content, styles.right)}>
        {renderItem(dataSource[2], '累计综合交易量', styles.bottomBorder)}
        {renderItem(dataSource[3], '股基累计净佣金')}
      </div>
    </div>
  );
}

CheckLayout.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default CheckLayout;
