/*
 * @Author: zhangjun
 * @Descripter: 报表标题
 * @Date: 2018-10-06 11:25:37
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-11 10:41:38
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportTitle.less';

const EMPTY_OBJECT = {};
export default function ReportTitle(props) {
  const { title, titleStyle } = props;
  return (
    <div className={styles.reportHead}>
      <span className={styles.reportHeadTitle} style={titleStyle}>{ title }</span>
    </div>
  );
}

ReportTitle.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.object,
};
ReportTitle.defaultProps = {
  title: '信息标题',
  titleStyle: EMPTY_OBJECT,
};
