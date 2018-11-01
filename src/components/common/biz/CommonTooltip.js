/**
 * @Description: 公用 tooltip 组件
 * @Author: Liujianshu-K0240007
 * @Date: 2018-10-31 10:12:58
 * @Last Modified by: Liujianshu-K0240007
 * @Last Modified time: 2018-11-01 09:59:07
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import _ from 'lodash';

import styles from './commonTooltip.less';

export default function CommonTooltip(props) {
  const {
    title,
    content,
    placement,
    children,
    ...restProps
  } = props;
  const hasContent = !_.isEmpty(content);
  let tipsNode = title;
  // 如果有正文，渲染自定义的节点
  if (hasContent) {
    tipsNode = (
      <div className={styles.tipsNode}>
        <h3>{title}</h3>
        <h4>{content}</h4>
      </div>
    );
  }

  return (
    <Tooltip
      overlayClassName={styles.tooltip}
      title={tipsNode}
      placement={placement}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
}

CommonTooltip.propTypes = {
  // 标题
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element,
    PropTypes.node,
  ]),
  // 正文
  content: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element,
    PropTypes.node,
  ]),
  // 位置
  placement: PropTypes.string,
  // 调用的元素
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.element,
    PropTypes.node,
  ]),
};

CommonTooltip.defaultProps = {
  title: '',
  content: '',
  placement: 'bottom',
  children: '',
};
