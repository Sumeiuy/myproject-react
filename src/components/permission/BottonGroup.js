/**
 * author: shenxuxiang
 * file:   BottonGroup.js
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import style from './bottonGroup.less';
// 取消按钮的 operate
const KEY_CANCEL = 'cancel';
export default function BottnGroup(props) {
  const list = props.list.flowButtons ? props.list.flowButtons : [];
  const resultMap = list.map((item) => {
    const clickBotton = () => {
      if (typeof (props.onEmitEvent) === 'function') {
        props.onEmitEvent(item);
      }
    };
    return (
      <span
        className={item.operate === KEY_CANCEL ? style.cancelBtn : style.spBtn}
        onClick={clickBotton}
        key={item.flowBtnId}
      >{item.btnName}</span>
    );
  });
  if (_.isEmpty(list)) {
    return null;
  }
  return (
    <div className={style.dcFooter}>
      {resultMap}
    </div>
  );
}

BottnGroup.propTypes = {
  list: PropTypes.object,
  onEmitEvent: PropTypes.func,
};
BottnGroup.defaultProps = {
  list: {},
  onEmitEvent: null,
};
