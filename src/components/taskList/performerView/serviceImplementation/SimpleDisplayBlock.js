/*
 * @Description: 展示区块，用来显示服务策略和任务提示的
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:43:12
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-27 16:09:43
 */

import React from 'react';
import PropTypes from 'prop-types';
import ForgeryRichText from '../../../common/ForgeryRichText';
import styles from './simpleDisplayBlock.less';

export default function SimpleDisplayBlock({ title, data }) {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h5 className={styles.title}>{title}</h5>
        <div className={styles.content}><ForgeryRichText text={data} /></div>
      </div>
    </div>
  );
}

SimpleDisplayBlock.propTypes = {
  title: PropTypes.string,
  data: PropTypes.string,
};

SimpleDisplayBlock.defaultProps = {
  title: '',
  data: '',
};
