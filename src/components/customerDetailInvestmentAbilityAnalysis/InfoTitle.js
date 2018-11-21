/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:16:31
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-20 15:38:42
 */

import React from 'react';
import PropTypes from 'prop-types';

import styles from './infoTitle.less';

export default function InfoTitle(props) {
  const { title } = props;
  return (
    <div className={styles.header}>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

InfoTitle.propTypes = {
  title: PropTypes.string
};
InfoTitle.defaultProps = {
  title: '',
};
