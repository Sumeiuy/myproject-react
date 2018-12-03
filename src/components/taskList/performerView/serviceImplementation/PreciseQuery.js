/*
 * @Description:精准查找某个客户
 * @Author: WangJunjun
 * @Date: 2018-05-23 11:08:03
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-24 18:51:08
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './preciseQuery.less';

export default function PreciseQuery(props) {
  const {
    value, maxValue, handlePreciseQueryEnterPress, handlePreciseQueryChange
  } = props;
  return (
    <div className={styles.preciseQueryBox}>
      <Input
        value={value}
        onChange={handlePreciseQueryChange}
        onKeyUp={handlePreciseQueryEnterPress}
      />
      /
      {maxValue}
人
    </div>
  );
}

PreciseQuery.propTypes = {
  value: PropTypes.string.isRequired,
  maxValue: PropTypes.number.isRequired,
  handlePreciseQueryChange: PropTypes.func.isRequired,
  handlePreciseQueryEnterPress: PropTypes.func.isRequired,
};
