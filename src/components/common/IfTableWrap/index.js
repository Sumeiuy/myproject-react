/*
 * @Author: yuanhaojie
 * @Date: 2018-11-22 09:54:56
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-30 09:24:46
 * @Description: 表格无数据的占位显示
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isNumber from 'lodash/isNumber';
import styles from './index.less';
import loadingEnd from '../../../decorators/loadingEnd';

@loadingEnd
export default class IfTableWrap extends PureComponent {
  static propTypes = {
    // 是否渲染
    isRender: PropTypes.bool.isRequired,
    text: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.object,
    ]),
    iconStyle: PropTypes.object,
    noDataStyle: PropTypes.object,
    height: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    children: PropTypes.node.isRequired,
  }

  static defaultProps = {
    text: '',
    iconStyle: {},
    noDataStyle: {},
    height: '100%',
  }

  render() {
    const {
      isRender,
      text,
      iconStyle, // 设置图标的样式
      noDataStyle, // 可修改图标和文字的布局
      height = '', // 设置占位图高度，图标文字居中显示
      children,
    } = this.props;

    const heigtStyle = {
      height: isNumber(height) ? `${height}px` : height,
    };

    if (!isRender) {
      return (
        <div className={styles.noDataWrap} style={heigtStyle}>
          <div className={styles.placeholder} style={noDataStyle}>
            <div className={styles.noDataIcon} style={iconStyle} />
            <div>{text}</div>
          </div>
        </div>
      );
    }
    return children;
  }
}
