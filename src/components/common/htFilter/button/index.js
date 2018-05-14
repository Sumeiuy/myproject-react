/**
 * @file test/List.js
 * @author maoquan(maoquan@htsc.com)
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import classNames from 'classnames';
import styles from './button.less';

export default class HTbutton extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node.isRequired,
    isextra: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    type: 'normal',
    isextra: false,
    disabled: false,
  }

  render() {
    const buttonTypeClass = classNames({
      [styles.button]: true,
      [styles.normal]: this.props.type === 'normal', // 默认
      [styles.primary]: this.props.type === 'submit', // 确定等
      [styles.cancel]: this.props.type === 'cancel', // 取消等
      [styles.extraButton]: this.props.isextra, // 字符超过4个以后使用大字符样式
      [styles.disabled]: this.props.disabled,
    });

    const { isextra, ...restProps } = this.props;

    return (
      <div className={`${styles.buttonContainer} ${this.props.className}`}>
        <Button {...restProps} className={buttonTypeClass}>
          <span>{this.props.children}</span>
        </Button>
      </div>
    );
  }
}
