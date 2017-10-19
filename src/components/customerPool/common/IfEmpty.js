/**
 * @file components/customerPool/common/IfEmpty.js
 *  暂无数据组件
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';

function IfEmpty(props) {
  const { isEmpty, children, className } = props;
  if (isEmpty) {
    return <div className={className}>暂无数据</div>;
  }
  return children;
}

IfEmpty.propTypes = {
  isEmpty: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  className: PropTypes.string,
};

IfEmpty.defaultProps = {
  className: '',
};

export default IfEmpty;
