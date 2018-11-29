/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 20:42:27
 * @description 添加联系方式的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs, Button } from 'antd';
import _ from 'lodash';


import IFWrap from '../../common/biz/IfWrap';
import Icon from '../../common/Icon';
import logable, { logCommon } from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import PerPhoneContactForm from './PerPhoneContactForm';
import PerAddressContactForm from './PerAddressContactForm';
import PerOtherContactForm from './PerOtherContactForm';

import {
  ADD_CONTACT_TABS,
  MODAL_STYLE,
  WARNING_MESSAGE,
} from '../common/config';
import {
  hasMainMobile,
  hasMainEmail,
  hasMainContact,
  isEmailContactWay,
} from '../common/utils';

import styles from './addContactModal.less';

const TabPane = Tabs.TabPane;

export default class AddContactModal extends Component {
  static propTypes = {
    // 已经存在的联系方式的数据，主要是用于判断权限
    contactWayData: PropTypes.object.isRequired,
    // 关闭弹框
    onClose: PropTypes.func.isRequired,
    // 点击确定
    onOK: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 当前的Tab
      activeTabKey: 'phone',
      // 新增的电话信息数据
      phoneData: {},
      // 新增的地址信息数据
      addressData: {},
      // 新增的其他信息数据
      otherData: {},
      // 显示主手机联方式提示
      showMainMobile: false,
      // 显示主电子邮件记录提示
      showMainEmail: false,
      // 显示主地址提示
      showMainAddress: false,
    };
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '取消' },
  })
  handleCloseModal() {
    this.props.onClose();
  }

  // 校验电话信息
  @autobind
  checkPerPhoneForSubmit() {
    // 1. 如果添加的是个人客户的电话信息，则判断是否有主手机联系方式
    const { phoneData } = this.state;
    const {
      contactWayData: { tellphoneInfo },
      location: {
        query: { custId },
      },
    } = this.props;
    if(hasMainMobile(tellphoneInfo)) {
      this.setState({ showMainMobile: false });
      // TODO 此处需要校验选择的数据
      // 校验完后,提交电话数据
      // 新增id值为空
      this.props.onOK('phone', {
        data: phoneData,
        id: '',
        custId,
      });
    } else {
      this.setState({ showMainMobile: true });
    }
  }

  // 校验地址信息
  @autobind
  checkPerAddressForSubmit() {
    const { addressData } = this.state;
    // 2. 如果添加的是个人客户的地址信息，则判断存在主地址不
    const {
      contactWayData: { addressInfo },
      location: {
        query: { custId },
      },
     } = this.props;
    if (hasMainContact(addressInfo)) {
      this.setState({ showMainAddress: false });
      // TODO 此处需要校验选择的数据
      // 校验完后,提交地址数据
      this.props.onOK('address', {
        data: addressData,
        id: '',
        custId,
      });
    } else {
      this.setState({ showMainAddress: true });
    }
  }

  // 新建时进行添加联系方式的能力校验
  @autobind
  checkPerOtherForSubmit() {
    const { otherData } = this.state;
    // 3. 如果添加的是个人客户的其他信息的电子邮件，则判断存在主电子邮件不
    const {
      contactWayData: { otherInfo },
      location: {
        query: { custId },
      },
    } = this.props;
    if (
      !hasMainEmail(otherInfo)
      && !_.isEmpty(otherData.contactWayCode)
      && isEmailContactWay(otherData.contactWayCode)
      ) {
      // 不存在主电子邮件,但是选择的是电子邮件
      this.setState({ showMainEmail: true });
    } else  {
      this.setState({ showMainEmail: false });
      // TODO 此处需要校验选择的数据格式
      // 校验完后,提交地址数据
      this.props.onOK('other', {
        data: otherData,
        id: '',
        custId,
      });
    }

  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '确认',
    },
  })
  handleModalOK() {
    const { activeTabKey } = this.state;
    if (activeTabKey === 'phone') {
      this.checkPerPhoneForSubmit();
    } else if (activeTabKey === 'address') {
      this.checkPerAddressForSubmit();
    } else if (activeTabKey === 'other') {
      this.checkPerOtherForSubmit();
    }
  }

  // 切换Tab
  @autobind
  handleTabChange(activeTabKey) {
    this.setState({ activeTabKey });
    // 需要记录tab切换日志
    logCommon({
      type: 'Click',
      payload: {
        name: ADD_CONTACT_TABS[activeTabKey],
      }
    });
  }

  // 保存用户填写的电话信息数据
  @autobind
  handlePhoneChange(phoneData) {
    this.setState({ phoneData });
  }

  // 保存用户填写的地址信息数据
  @autobind
  handleAddressChange(addressData) {
    this.setState({ addressData });
  }

  // 保存用户填写的其他信息数据
  @autobind
  handleOtherChange(otherData) {
    this.setState({ otherData });
  }

  // 渲染警告提示
  @autobind
  renderWarning(show) {
    const { activeTabKey } = this.state;
    // 如果没有规定的数据，则显示该提示信息
    return (
      <IFWrap isRender={show}>
        <div className={styles.waringTip}>
          <Icon className={styles.waringIcon} type="jingshi"/>
          <span className={styles.waringText}>{WARNING_MESSAGE[`per_${activeTabKey}`]}</span>
        </div>
     </IFWrap>
    );
  }

  render() {
    const {
      activeTabKey,
      showMainAddress,
      showMainMobile,
      showMainEmail,
    } = this.state;
    // Modal的底部按钮
    const footBtns = [
      <Button onClick={this.handleCloseModal}>取消</Button>,
      <Button type="primary" onClick={this.handleModalOK}>确认</Button>,
    ];

    return (
      <Modal
        visible
        size="middle"
        title="添加联系方式"
        maskClosable={false}
        modalKey="addPersonalContactWayModal"
        closeModal={this.handleCloseModal}
        style={MODAL_STYLE}
        selfBtnGroup={footBtns}
      >
        <div className={styles.addContactWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey}>
            <TabPane tab="电话信息" key="phone">
              {this.renderWarning(showMainMobile)}
              <PerPhoneContactForm
                action="CREATE"
                onChange={this.handlePhoneChange}
              />
            </TabPane>
            <TabPane tab="地址信息" key="address">
              {this.renderWarning(showMainAddress)}
              <PerAddressContactForm
                action="CREATE"
                onChange={this.handleAddressChange}
              />
            </TabPane>
            <TabPane tab="其他信息" key="other">
              {this.renderWarning(showMainEmail)}
              <PerOtherContactForm
                action="CREATE"
                onChange={this.handleOtherChange}
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
