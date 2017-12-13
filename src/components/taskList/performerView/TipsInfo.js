/**
 * @Author: sunweibin
 * @Date: 2017-12-12 14:56:58
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-12-12 14:58:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import Icon from '../../common/Icon';
import styles from './tipsInfo.less';


export default class TipsInfo extends PureComponent {
  static propTypes = {
    title: PropTypes.node.isRequired,
    position: PropTypes.string,
    wrapperClass: PropTypes.string,
  }

  static defaultProps = {
    position: 'bottomLeft',
    wrapperClass: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  render() {
    const { title, position, wrapperClass } = this.props;

    return (
      <Tooltip
        title={title}
        overlayClassName={classnames({
          [styles.globalTips]: true,
          [wrapperClass]: true,
        })}
        mouseEnterDelay={0.2}
        autoAdjustOverflow
        placement={position}
      >
        <Icon className={styles.icon} type="tishi" />
      </Tooltip>
    );
  }
}
