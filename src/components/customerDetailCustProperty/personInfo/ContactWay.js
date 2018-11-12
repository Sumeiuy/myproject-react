/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户联系方式
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-09 09:31:53
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoItem from '../../common/infoItem';
import {
  DEFAULT_VALUE,
  DEFAULT_PRIVATE_VALUE,
  LINK_WAY_TYPE,
} from '../config';
import styles from './contactWay.less';

const INFO_ITEM_WITDH = '110px';
const EMPTY_OBJECT = {};
const {
  // 手机号码的标识
  mobileTypeCode,
  // 电子邮箱的标识
  emailTypeCode,
  // 微信的标识
  weChatTypeCode,
  // qq的标识
  qqTypeCode,
} = LINK_WAY_TYPE;
export default class ContactWay extends PureComponent {
  static propTypes = {
    // 电话列表
    phoneList: PropTypes.array.isRequired,
    // 其他联系方式列表，qq,微信，email等
    otherList: PropTypes.array.isRequired,
    // 地址列表
    addressList: PropTypes.array.isRequired,
    hasDuty: PropTypes.bool.isRequired,
    // 请勿发短信
    noMessage: PropTypes.bool,
    // 请勿打电话
    noCall: PropTypes.bool,
  }

  static defaultPropTypes = {
    noMessage: false,
    noCall: false,
  }

  // 获取需要隐私控制的数据，有权限则展示字段，有权限没有数据则展示--，无权限则展示***
  @autobind
  getPrivateValue(value) {
    const { hasDuty } = this.props;
    return hasDuty ? (value || DEFAULT_VALUE) : DEFAULT_PRIVATE_VALUE;
  }

  // 获取显示的数据，优先取mainFlag为true即主联系方式的数据，没有则任取一条
  @autobind
  getViewData(list) {
    const data = _.filter(list, item => !!item.mainFlag);
    return _.isEmpty(data) ? (list[0] || EMPTY_OBJECT) : data[0];
  }

  // 获取手机号码
  @autobind
  getPhoneNum() {
    const { phoneList } = this.props;
    const list = _.filter(phoneList, item => item.linkWayCode === mobileTypeCode);
    const value = this.getViewData(list).phone;
    return this.getPrivateValue(value);
  }

  // 获取电子邮件
  @autobind
  getEmail() {
    const { otherList } = this.props;
    const list = _.filter(otherList, item => item.linkWayCode === emailTypeCode);
    const value = this.getViewData(list).number;
    return this.getPrivateValue(value);
  }

  // 获取微信
  @autobind
  getWechat() {
    const { otherList } = this.props;
    const list = _.filter(otherList, item => item.linkWayCode === weChatTypeCode);
    const value = this.getViewData(list).number;
    return this.getPrivateValue(value);
  }

  // 获取qq
  @autobind
  getQQ() {
    const { otherList } = this.props;
    const list = _.filter(otherList, item => item.linkWayCode === qqTypeCode);
    const value = this.getViewData(list).number;
    return this.getPrivateValue(value);
  }

  @autobind
  getAddress() {
    const { addressList } = this.props;
    const value = this.getViewData(addressList).address;
    return this.getPrivateValue(value);
  }

  // 根据传入的值（bool || null）决定返回的显示值
  @autobind
  getViewTextByBool(bool) {
    if (_.isBoolean(bool)) {
      return bool ? '是' : '否';
    }
    return DEFAULT_VALUE;
  }

  render() {
    const {
      noMessage,
      noCall,
    } = this.props;
    return (
      <div className={styles.contactWayBox}>
        <div className={styles.title}>联系方式</div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="手机号码"
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="电子邮件"
            value={this.getEmail()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="微信"
            value={this.getWechat()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="QQ"
            value={this.getQQ()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="请勿发短信"
            value={this.getViewTextByBool(noMessage)}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="请勿打电话"
            value={this.getViewTextByBool(noCall)}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBoxHalf}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="地址"
            value={this.getAddress()}
            className={styles.infoItem}
          />
        </div>
      </div>
    );
  }
}
