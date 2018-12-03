/**
 * @Author: sunweibin
 * @Date: 2018-06-12 17:19:01
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 17:24:32
 * @description 与流程有关的按钮组
 */

import React from 'react';
import PropTypes from 'prop-types';

import style from './index.less';

export default function ApprovalBtnGroup(props) {
  const list = props.approval.flowButtons ? props.approval.flowButtons : [];
  const resultMap = list.map(item => (
    <span
      className={style.spBtn}
      onClick={() => props.onClick(item)}
      key={item.flowBtnId}
    >
      {item.btnName}
    </span>
  ));
  return (
    <div className={style.dcFooter}>
      {resultMap}
    </div>
  );
}

ApprovalBtnGroup.propTypes = {
  approval: PropTypes.object,
  onClick: PropTypes.func.isRequired,
};
ApprovalBtnGroup.defaultProps = {
  approval: {},
};
