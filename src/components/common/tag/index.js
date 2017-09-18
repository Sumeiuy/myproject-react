/**
 * @description 通用的Tag组件
 * @author 孙伟斌
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';

import tagConfig from './config';
import styles from './index.less';

export default class Tag extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    color: PropTypes.string,
  };

  static defaultProps = {
    color: '',
  }

  render() {
    const { type, color } = this.props;
    const lowType = type.toLowerCase();
    let newStyle = {};
    if (color !== '') {
      newStyle = {
        backgroundColor: color,
      };
    }

    const tagCls = classnames({
      [styles[`tag-${lowType}`]]: true,
      [styles.htscTag]: true,
    });

    return (
      <span className={tagCls} style={newStyle}>{tagConfig[lowType]}</span>
    );
  }
}
