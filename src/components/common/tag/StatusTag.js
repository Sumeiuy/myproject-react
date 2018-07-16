/**
 * @Author: sunweibin
 * @Date: 2018-07-06 14:21:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-06 15:32:00
 * @description 根据新的需求，申请单列表项里面的状态标签需要使用新的样式
 * 为了保证不影响之前的其他申请单中的状态标签，所以状态标签作为Tag的类属性传递出去
 *
 * @example
   import Tag from '/src/components/common/tag';

   const StatusTag = Tag.statusTag;

   <StatusTag
    size="normal"      // 状态标签的大小 默认 normal, 目前只支持normal
    type="processing"  // 状态标签类型，即相对应的状态的小写英文字符串
                       // 取值 default|ghost|processing|complete|stop|reject
                       // 对应状态： 默认|镂空|处理中|已完成|终止|驳回
    text=""            // 状态标签文本
    style={}           // 自定义样式
   />
  *
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './statusTag.less';

export default function StatusTag(props) {
  const {
    text,
    size,
    type,
    style,
  } = props;

  const statusCls = cx({
    [styles.statusTag]: true,
    [styles[`statusTag-${type}`]]: true,
    [styles[`statusTag-${size}`]]: true,
  });

  return (
    <span className={statusCls} style={style}>{text}</span>
  );
}

StatusTag.propTypes = {
  size: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
};
StatusTag.defaultProps = {
  size: 'normal',
  text: '',
  type: 'default',
  style: {},
};
