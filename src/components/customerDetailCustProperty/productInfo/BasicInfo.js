/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-产品机构客户基本信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-07 15:03:19
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './basicInfo.less';

export default class BasicInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className={styles.basicInfoBox}>
        2
      </div>
    );
  }
}
