/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户联系方式
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 10:16:26
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import IFWrap from '../../common/biz/IfWrap';
import ContactWayModal from './ContactWayModal';
import { logPV } from '../../../decorators/logable';
import InfoItem from '../../common/infoItem';
import {
  DEFAULT_VALUE,
  DEFAULT_PRIVATE_VALUE,
  LINK_WAY_TYPE,
  getViewTextByBool,
  checkIsNeedTitle,
} from '../config';

import styles from '../common/contactWay.less';

const INFO_ITEM_WITDH_110 = '110px';
const INFO_ITEM_WITDH = '126px';
const {
  // 手机号码的标识
  MOBILE_TYPE_CODE,
  // 电子邮箱的标识
  EMAIL_TYPE_CODE,
  // 微信的标识
  WECHAT_TYPE_CODE,
  // qq的标识
  QQ_TYPE_CODE,
} = LINK_WAY_TYPE;

export default class ContactWay extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
    // 个人客户联系方式数据
    personalContactWay: PropTypes.object.isRequired,
    // 查询个人客户联系方式数据
    queryPersonalContactWay: PropTypes.func.isRequired,
    // 改变个人客户联系方式中的请勿发短信、请勿打电话
    changePhoneInfo: PropTypes.func.isRequired,
    // 新增|修改个人客户电话信息
    updatePerPhone: PropTypes.func.isRequired,
    // 新增|修改个人客户地址信息
    updatePerAddress: PropTypes.func.isRequired,
    // 新增|修改个人客户其他信息
    updatePerOther: PropTypes.func.isRequired,
    // 删除个人|机构客户的非主要联系方式
    delContact: PropTypes.func.isRequired,
    // 查询个人客户联系方式,用于修改编辑后刷新显示的信息
    queryCustomerProperty: PropTypes.func.isRequired,
  }

  static defaultProps = {
    noMessage: false,
    noCall: false,
  }

  static contextTypes = {
    custBasic: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // 编辑联系方式Modal的visible
      personalContactWayModal: false,
      // 是否进行过联系方式的修改
      hasUpdatedContact: false,
    };
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
    return _.isEmpty(data) ? (list[0] || {}) : data[0];
  }

  // 获取手机号码
  @autobind
  getPhoneNum() {
    const { phoneList } = this.props;
    const list = _.filter(phoneList, item => item.linkWayCode === MOBILE_TYPE_CODE);
    const value = this.getViewData(list).phone;
    return this.getPrivateValue(value);
  }

  // 获取电子邮件
  @autobind
  getEmail() {
    const { otherList } = this.props;
    const list = _.filter(otherList, item => item.linkWayCode === EMAIL_TYPE_CODE);
    const value = this.getViewData(list).number;
    return this.getPrivateValue(value);
  }

  // 获取微信
  @autobind
  getWechat() {
    const { otherList } = this.props;
    const list = _.filter(otherList, item => item.linkWayCode === WECHAT_TYPE_CODE);
    const value = this.getViewData(list).number;
    return this.getPrivateValue(value);
  }

  // 获取qq
  @autobind
  getQQ() {
    const { otherList } = this.props;
    const list = _.filter(otherList, item => item.linkWayCode === QQ_TYPE_CODE);
    const value = this.getViewData(list).number;
    return this.getPrivateValue(value);
  }

  @autobind
  getAddress() {
    const { addressList } = this.props;
    const value = this.getViewData(addressList).address;
    return this.getPrivateValue(value);
  }

  // 子组件修改|新增|编辑后
  @autobind
  saveUpdatedStatus() {
    this.setState({ hasUpdatedContact: true });
  }

  // 刷新个人客户的联系方式列表
  @autobind
  refreshPerContact() {
    const {
      location: {
        query: { custId },
      },
    } = this.props;
    this.props.queryPersonalContactWay({
      custId
    });
  }

  @autobind
  @logPV({
    pathname: '/modal/cust360PropertyAddPerContactWayModal',
    title: '客户联系方式'
  })
  handleContactWayEditClick() {
    const {
      location: {
        query: { custId },
      },
    } = this.props;
    this.props.queryPersonalContactWay({
      custId
    }).then(() => {
      this.setState({ personalContactWayModal: true });
    });
  }

  // 关闭个人客户添加联系方式的Modal
  @autobind
  handleContactWayModalClose() {
    const { hasUpdatedContact } = this.state;
    if (hasUpdatedContact) {
      // 如果修改了，则刷新
      const {
        location: {
          query: { custId },
        },
      } = this.props;
      this.props.queryCustomerProperty({
        custId,
      });
      this.setState({ hasUpdatedContact: false });
    }
    this.setState({ personalContactWayModal: false });
  }

  render() {
    const {
      location,
      noMessage,
      noCall,
      personalContactWay,
      changePhoneInfo,
      updatePerPhone,
      updatePerAddress,
      updatePerOther,
      delContact,
    } = this.props;
    const { personalContactWayModal } = this.state;

    return (
      <div className={styles.contactWayBox}>
        <div className={styles.title}>
          联系方式
          <span
            className={styles.contactWayEdit}
            onClick={this.handleContactWayEditClick}
          >
            更多
          </span>
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="手机号码"
            value={this.getPhoneNum()}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getPhoneNum())}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="电子邮件"
            value={this.getEmail()}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getEmail())}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="微信"
            value={this.getWechat()}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getWechat())}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="QQ"
            value={this.getQQ()}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getQQ())}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH_110}
            label="请勿发短信"
            value={getViewTextByBool(noMessage)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(getViewTextByBool(noMessage))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBox}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="请勿打电话"
            value={getViewTextByBool(noCall)}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(getViewTextByBool(noCall))}
            isNeedOverFlowEllipsis
          />
        </div>
        <div className={styles.infoItemBoxHalf}>
          <InfoItem
            width={INFO_ITEM_WITDH}
            label="地址"
            value={this.getAddress()}
            className={styles.infoItem}
            isNeedValueTitle={checkIsNeedTitle(this.getAddress())}
            isNeedOverFlowEllipsis
          />
        </div>
        <IFWrap isRender={personalContactWayModal}>
          <ContactWayModal
            location={location}
            data={personalContactWay}
            onClose={this.handleContactWayModalClose}
            changePhoneInfo={changePhoneInfo}
            updatePerPhone={updatePerPhone}
            updatePerAddress={updatePerAddress}
            updatePerOther={updatePerOther}
            delContact={delContact}
            refreshContact={this.refreshPerContact}
            saveUpdatedStatus={this.saveUpdatedStatus}
          />
        </IFWrap>
      </div>
    );
  }
}
