/**
 * @file customerPool/taskFlow/steps/Header.js
 *  客户池-自建任务表单-选择客户头部
 * @author wangjunjun
 */

import React from 'react';
import PropTypes from 'prop-types';

import styles from './header.less';

function Header({
  title,
  switchTarget,
  onClick,
}) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{title}</p>
      <span className={styles.switchTarget} onClick={onClick}>切换至{switchTarget}</span>
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  switchTarget: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Header;
