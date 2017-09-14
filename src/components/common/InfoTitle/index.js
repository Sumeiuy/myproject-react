/**
 * @file InfoTitle.js
 * author shenxuxiang
 */
import React from 'react';
import PropTypes from 'prop-types';
import style from './infotitle.less';

export default function InfoTitle(props) {
  return (
    <div className={style.mlcHead}>
      <span className={style.mlcHeadIcon} />
      <span className={style.mlcHeadTitle}>{ props.head }</span>
    </div>
  );
}

InfoTitle.propTypes = {
  head: PropTypes.string,
};
InfoTitle.defaultProps = {
  head: '信息标题',
};
