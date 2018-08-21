/*
 * @Author: zhangjun
 * @description 首页推荐列表
 * @Date: 2018-08-17 15:16:00
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-17 15:39:56
 */
import React from 'react';
import _ from 'lodash';

import Icon from '../common/Icon';
import { RECOMMEND_LIST } from './config';
import styles from './recommendList.less';

export default function RecommendList() {
  const recommendListData = _.map(RECOMMEND_LIST, item => (
    <div className={styles.recommendItem} key={item.key}>
      <Icon type={item.type} className={styles.icon} />
      <div className={styles.recommendContent}>
        <span className={styles.recommendTitle}>{item.title}</span>
        <p className={styles.recommendDesc}>{item.describe}</p>
      </div>
    </div>
  ));
  return (
    <div className={styles.recommendList}>
      {recommendListData}
    </div>
  );
}
