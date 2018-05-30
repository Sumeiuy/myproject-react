import React from 'react';
import imgSrc from '../img/empty.png';
import styles from './emptyData.less';

export default function EmptyData() {
  return (
    <div className={styles.empty}>
      <div className={styles.content}>
        <img className={styles.icon} src={imgSrc} alt="" />
        <p className={styles.text}>暂无数据</p>
      </div>
    </div>
  );
}
