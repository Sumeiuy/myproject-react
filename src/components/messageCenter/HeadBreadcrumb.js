/*
 * @Author: zhangjun
 * @description 消息中心头部面包屑
 * @Date: 2018-08-27 14:15:27
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-27 17:26:21
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Icon from '../common/Icon';
import styles from './headBreadcrumb.less';

export default class HeadBreadcrumb extends PureComponent {
  static contextTypes = {
    goBack: PropTypes.func.isRequired,
  }

  @autobind
  toMessageCenter() {
    const { goBack } = this.context;
    goBack();
  }

  render() {
    return (
      <div className={styles.headBreadcrumb}>
        <span className={styles.headMessageCenter} onClick={this.toMessageCenter}>消息中心</span>
        <Icon type="xiangyou1" className={styles.separator} />
        <span className={styles.detail}>详情</span>
      </div>
    );
  }
}
