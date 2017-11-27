/**
 * @fileOverview components/customerPool/BasicInfo.js
 * @author wangjunjun
 * @description 执行者视图右侧详情的目标客户提示组件
 */

import React, { PropTypes, PureComponent } from 'react';
import { Tooltip } from 'antd';
import Icon from '../../common/Icon';
import styles from './tipsInfo.less';


export default class TipsInfo extends PureComponent {
  static propTypes = {
    title: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }


  render() {
    const { title } = this.props;
    return (
      <Tooltip
        title={title}
        overlayClassName={styles.globalTips}
        mouseEnterDelay={0.2}
        autoAdjustOverflow
        placement="bottomLeft"
        getPopupContainer={this.getPopupContainer}
      >
        <Icon className={styles.icon} type="tishi" />
      </Tooltip>
    );
  }
}
