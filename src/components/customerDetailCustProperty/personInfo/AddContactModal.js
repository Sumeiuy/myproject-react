/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 17:50:46
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
      // 存在主手机联系方式不
      hasMainMobile: true,
      // 存在主电子邮件
      hasMainEmail: true,
      // 存在主地址
      hasMainAddress: true,
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

  // 新建时进行添加联系方式的能力校验
  @autobind
  checkBeforSubmit() {
    const { activeTabKey } = this.state;
    const { data } = this.props;
    if (activeTabKey === 'phone') {
      // 1. 如果添加的是个人客户的电话信息，则判断是否有主手机联系方式
      return hasMainMobile(data.tellphoneInfo);
    } else if (activeTabKey === 'address') {
      // 2. 如果添加的是个人客户的地址信息，则判断存在主地址不
      return hasMainContact(data.addressInfo);
    } else if (activeTabKey === 'other') {
      const { otherData } = this.state;
      // 3. 如果添加的是个人客户的其他信息的电子邮件，则判断存在主电子邮件不
      if (isEmailContactWay(otherData.contactWayCode)) {
        return hasMainEmail(data.otherInfo);
      }
      return true;
    }
    return true;
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '确认',
    },
  })
  handleModalOK() {
    if (this.checkBeforSubmit()) {
      // 校验通过之后，判断当前是哪个Tab提交哪个数据
      this.props.onOK();
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
  renderWarning(hasData) {
    const { activeTabKey } = this.state;
    return (
      <IFWrap isRender={!hasData}>
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
      hasMainMobile,
      hasMainAddress,
      hasMainEmail,
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
              {this.renderWarning(hasMainMobile)}
              <PerPhoneContactForm
                action="CREATE"
                onChange={this.handlePhoneChange}
              />
            </TabPane>
            <TabPane tab="地址信息" key="address">
              {this.renderWarning(hasMainAddress)}
              <PerAddressContactForm
                action="CREATE"
                onChange={this.handleOtherChange}
              />
            </TabPane>
            <TabPane tab="其他信息" key="other">
              {this.renderWarning(hasMainEmail)}
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
