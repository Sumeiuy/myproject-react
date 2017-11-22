/**
 * @fileOverview components/customerPool/labelInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的模块标签
 */

import React, { PropTypes } from 'react';
import classnames from 'classnames';

import styles from './labelInfo.less';

const LabelInfo = (props) => {
  const { value, wrapperClass } = props;
  const cls = classnames({
    [styles.label]: true,
    [wrapperClass]: !!wrapperClass,
  });
  return (
    <p className={cls}>
      {value}
    </p>
  );
};

LabelInfo.propTypes = {
  value: PropTypes.string,
  wrapperClass: PropTypes.string,
};

LabelInfo.defaultProps = {
  value: '',
  wrapperClass: '',
};

export default LabelInfo;
