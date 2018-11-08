/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户联系方式
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-07 14:59:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './contactWay.less';

export default class ContactWay extends PureComponent {
  static propTypes = {
    // 电话列表
    phoneList: PropTypes.array.isRequired,
    // 其他联系方式列表，qq,微信，email等
    otherList: PropTypes.array.isRequired,
    // 地址列表
    addressList: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className={styles.contactWayBox}>
        客户360-客户属性-个人客户联系方式
      </div>
    );
  }
}
