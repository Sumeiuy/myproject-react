/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-14 10:31:15
 * @description 添加联系方式的Modal
 */

import React, { PureComponent } from 'react';
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

export default class AddContactModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
      // 显示主手机联方式提示
      showMainMobile: false,
      // 显示主电子邮件记录提示
      showMainEmail: false,
      // 显示主地址提示
      showMainAddress: false,
    };
    this.perPhoneFormRef = React.createRef();
    this.perAddressFormRef = React.createRef();
    this.perOtherFormRef = React.createRef();
  }

  // 获取电话信息组件实例
  @autobind
  getPerPhoneForm() {
    return this.perPhoneFormRef.current;
  }

  // 获取地址信息组件实例
  @autobind
  getPerAddressForm() {
    return this.perAddressFormRef.current;
  }

  // 获取其他信息组件实例
  @autobind
  getPerOtherForm() {
    return this.perOtherFormRef.current;
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '添加个人客户联系方式-取消' },
  })
  handleModalCancelButton() {
    this.props.onClose();
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '添加个人客户联系方式-关闭' },
  })
  handleCloseModal() {
    this.props.onClose();
  }

  // 提交
  @autobind
  handlePerContactSubmit(type, query) {
    const {
      location: {
        query: { custId },
      },
    } = this.props;
    // 新增id值为空
    this.props.onOK(type, {
      data: query,
      id: '',
      custId,
    });
  }

  // 校验电话信息
  @autobind
  checkPerPhoneForSubmit() {
    // 1. 如果添加的是个人客户的电话信息，则判断是否有主手机联系方式
    const {
      contactWayData: { tellphoneInfo },
    } = this.props;
    if (hasMainMobile(tellphoneInfo)) {
      this.setState({ showMainMobile: false });
      // TODO 此处需要校验选择的数据
      const phoneForm = this.getPerPhoneForm();
      // 校验完成后调用提交回调
      phoneForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.handlePerContactSubmit('phone', values);
        }
      });
    } else {
      this.setState({ showMainMobile: true });
    }
  }

  // 校验地址信息
  @autobind
  checkPerAddressForSubmit() {
    // 2. 如果添加的是个人客户的地址信息，则判断存在主地址不
    const {
      contactWayData: { addressInfo },
    } = this.props;
    if (hasMainContact(addressInfo)) {
      this.setState({ showMainAddress: false });
      // TODO 此处需要校验选择的数据
      const addressForm = this.getPerAddressForm();
      // 校验完成后调用提交回调
      addressForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.handlePerContactSubmit('address', values);
        }
      });
    } else {
      this.setState({ showMainAddress: true });
    }
  }

  // 新建时进行添加联系方式的能力校验
  @autobind
  checkPerOtherForSubmit() {
    // 3. 如果添加的是个人客户的其他信息的电子邮件，则判断存在主电子邮件不
    const {
      contactWayData: { otherInfo },
    } = this.props;
    const otherForm = this.getPerOtherForm();
    const contactWayCode = otherForm.getFieldValue('contactWayCode');
    if (
      !hasMainEmail(otherInfo)
      && !_.isEmpty(contactWayCode)
      && isEmailContactWay(contactWayCode)
    ) {
      // 不存在主电子邮件,但是选择的是电子邮件
      this.setState({ showMainEmail: true });
    } else {
      this.setState({ showMainEmail: false });
      // 校验完成后调用提交回调
      otherForm.validateFields({ force: true }, (err, values) => {
        if (!err) {
          this.handlePerContactSubmit('other', values);
        }
      });
    }
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '添加个人客户联系方式-确认',
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
        name: `添加联系方式-${ADD_CONTACT_TABS[activeTabKey]}`,
      }
    });
  }

  // 渲染警告提示
  @autobind
  renderWarning(show) {
    const { activeTabKey } = this.state;
    // 如果没有规定的数据，则显示该提示信息
    return (
      <IFWrap isRender={show}>
        <div className={styles.waringTip}>
          <Icon className={styles.waringIcon} type="jingshi" />
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
      <Button key="perContactAddCancel" onClick={this.handleModalCancelButton}>取消</Button>,
      <Button key="perContactAddOK" type="primary" onClick={this.handleModalOK}>确认</Button>,
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
                ref={this.perPhoneFormRef}
                action="CREATE"
              />
            </TabPane>
            <TabPane tab="地址信息" key="address">
              {this.renderWarning(showMainAddress)}
              <PerAddressContactForm
                ref={this.perAddressFormRef}
                action="CREATE"
              />
            </TabPane>
            <TabPane tab="其他信息" key="other">
              {this.renderWarning(showMainEmail)}
              <PerOtherContactForm
                ref={this.perOtherFormRef}
                action="CREATE"
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
