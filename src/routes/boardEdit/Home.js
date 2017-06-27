/**
 * @descript 看板编辑页面
 * @author sunweibin
 */

import React, { PureComponent } from 'react';

import SimpleEditor from '../../components/Edit/SimpleEditor';

import styles from './Home.less';

export default class BoardManageHome extends PureComponent {
  render() {
    return (
      <div className="page-invest content-inner">
        <div className={styles.editPageHd}>
          <div className={styles.HdName}>看板编辑</div>
        </div>
        <div className={styles.editBasicHd}>
          <div className={styles.editBasic}>
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板类型:</div>
              <SimpleEditor />
            </div>
            <div className={styles.hDivider} />
            <div className={styles.basicInfo}>
              <div className={styles.title}>看板名称:</div>
              <SimpleEditor />
            </div>
            <div className={styles.hDivider} />
            <div className={styles.basicInfo}>
              <div className={styles.title}>可见范围:</div>
              <SimpleEditor />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
