/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户提示组件
 */

import React, { PropTypes, PureComponent } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import Icon from '../../common/Icon';
import styles from './tipsInfo.less';


export default class TipsInfo extends PureComponent {
  static propTypes = {
    title: PropTypes.object.isRequired,
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
