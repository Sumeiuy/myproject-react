/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-(普通机构, 产品机构)客户联系方式
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-09 09:30:54
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

const INFO_ITEM_WITDH110 = '110px';
const INFO_ITEM_WITDH = '126px';
const EMPTY_OBJECT = {};
const {
  // 公司地址标识(办公地址)
  COMPANY_ADDRESS_TYPE_CODE,
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
  }

  // 获取显示的数据，优先取mainFlag为true即主联系方式的数据，没有则任取一条
  @autobind
  getViewData(list) {
    const mainData = this.getMainFlagData(list);
    return _.isEmpty(mainData) ? (list[0] || EMPTY_OBJECT) : mainData;
  }

  @autobind
  getPrivateValue(value) {
    const { hasDuty } = this.props;
    return hasDuty ? (value || DEFAULT_VALUE) : DEFAULT_PRIVATE_VALUE;
  }

  // 获取mainFlag为true即是主联系方式的数据
  @autobind
  getMainFlagData(list) {
    const filteredList = _.filter(list, item => !!item.mainFlag);
    return filteredList[0] || EMPTY_OBJECT;
  }

  // 机构客户联络人取主联系人的姓名，没有则不展示
  @autobind
  getLinkMan() {
    const { phoneList } = this.props;
    const mainData = this.getMainFlagData(phoneList);
    return this.getPrivateValue(mainData.name);
  }

  // 机构客户联系电话优先取主联系人的手机号码，没有则取固定电话,都没有则不展示
  @autobind
  getPhoneNum() {
    const { phoneList } = this.props;
    const mainData = this.getMainFlagData(phoneList);
    return this.getPrivateValue(mainData.mobile || mainData.telphone);
  }

  // 机构客户电子邮件取主联系人的电子邮件，没有则不展示
  @autobind
  getEmail() {
    const { phoneList } = this.props;
    const mainData = this.getMainFlagData(phoneList);
    return this.getPrivateValue(mainData.email);
  }

  // 机构客户办公地址优先取主联系人公司地址，没有则取其他的公司地址，都没有则不显示
  @autobind
  getCompanyAddress() {
    const { addressList } = this.props;
    const list = _.filter(
      addressList, item => item.typeCode === COMPANY_ADDRESS_TYPE_CODE
    );
    const value = this.getViewData(list).address;
    return this.getPrivateValue(value);
  }

  render() {
    return (
      <div className={styles.contactWayBox}>
        <div className={styles.title}>联系方式</div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH110}
            label="联络人"
            value={this.getLinkMan()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="联系电话"
            value={this.getPhoneNum()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBoxHalf}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="办公地址"
            value={this.getCompanyAddress()}
            className={styles.infoItem}
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH110}
            label="电子邮件"
            value={this.getEmail()}
            className={styles.infoItem}
          />
        </div>
      </div>
    );
  }
}
