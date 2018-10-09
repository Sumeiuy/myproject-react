/*
 * @Author: zhangjun
 * @Descripter: 报表标题
 * @Date: 2018-10-06 11:25:37
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-08 21:55:56
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './reportTitle.less';

const EMPTY_OBJECT = {};
export default function ReportTitle(props) {
  const { titleStyle } = props;
  return (
    <div className={styles.reportHead}>
      <span className={styles.reportHeadTitle} style={titleStyle}>{ props.title }</span>
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
