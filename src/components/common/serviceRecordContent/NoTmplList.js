/**
 * @Author: sunweibin
 * @Date: 2018-05-08 19:01:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-17 10:34:17
 * @description 空数据
 */

import React from 'react';
import nodatapng from './nodata.png';
import styles from './noTmplList.less';

export default () => (
  <div className={styles.noDataWrap}>
    <div className={styles.noData}>
      <div className={styles.nodataBlock}>
        <img src={nodatapng} alt="nodata" />
        <div className={styles.nodataText}>暂无模板列表</div>
      </div>
    </div>
  </div>
);
