/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户联系方式
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 19:55:33
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoItem from '../../common/infoItem';
import styles from './contactWay.less';

const INFO_ITEM_WITDH = '110px';
export default class ContactWay extends PureComponent {
  static propTypes = {
    // 电话列表
    phoneList: PropTypes.array.isRequired,
    // 其他联系方式列表，qq,微信，email等
    otherList: PropTypes.array.isRequired,
    // 地址列表
    addressList: PropTypes.array.isRequired,
  }

  @autobind
  getPhoneNum() {
    return '12323232323';
  }

  render() {
    return (
      <div className={styles.contactWayBox}>
        <div className={styles.title}>联系方式</div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='手机号码'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='电子邮件'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='微信'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='QQ'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='请勿发短信'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='请勿打电话'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBoxHalf}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label='地址'
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
      </div>
    );
  }
}
