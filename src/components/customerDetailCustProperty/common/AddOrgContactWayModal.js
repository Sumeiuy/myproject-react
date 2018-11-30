/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-30 17:16:06
 * @description 添加机构客户联系方式的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs, Button } from 'antd';
// import _ from 'lodash';

import IFWrap from '../../common/biz/IfWrap';
import Icon from '../../common/Icon';
import logable, { logCommon } from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import OrgPhoneContactForm from './OrgPhoneContactForm';
import OrgAddressContactForm from './OrgAddressContactForm';
import {
  ADD_CONTACT_TABS,
  MODAL_STYLE,
  WARNING_MESSAGE,
} from './config';
import { hasMainContact } from './utils';

import styles from './addOrgContactWayModal.less';

const TabPane = Tabs.TabPane;

export default class AddContactModal extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭弹框
    onClose: PropTypes.func.isRequired,
    // 点击确定
    onOK: PropTypes.func.isRequired,
    // 联系方式数据
    contactWayData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 当前的Tab
      activeTabKey: 'phone',
      // 展示主联系人提示
      showMainLinkMan: false,
      // 展示主地址提示
      showMainAddress: false,
    };

    this.orgPhoneFormRef = React.createRef();
    this.orgAddressFormRef = React.createRef();
  }

  @autobind
  getOrgAddressForm() {
    return this.orgAddressFormRef.current;
  }

  @autobind
  getOrgPhoneForm() {
    return this.orgPhoneFormRef.current;
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '关闭',
    },
  })
  handleCloseModal() {
    this.props.onClose();
  }

  // 提交
  @autobind
  handleOrgContactSubmit(type, query) {
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
  checkOrgPhoneForSubmit() {
    // 1. 如果添加的是机构客户的电话信息，则判断是否有主联系人
    const {
      contactWayData: { tellphoneInfo },
    } = this.props;
    if(hasMainContact(tellphoneInfo)) {
      this.setState({ showMainLinkMan: false });
      const phoneForm = this.getOrgPhoneForm();
      // 校验完成后调用提交回调
      phoneForm.validateFields((err, values) => {
        if (!err) {
          // TOOD 此处需要针对手机信息，固定电话、邮箱做特殊处理
          const { emailValue, landlineValue, mobileValue, ...restValue } = values;
          // 新增的时候需要将这三个值转换成对象,因为后端的接口需要这样弄,
          // 因为机构客户的联系人信息有多个手机信息、固定电话、邮箱
          this.handleOrgContactSubmit('phone', {
            ...restValue,
            email: {
              id: '',
              value: emailValue,
              contactWayCode: '',
            },
            mobile: {
              id: '',
              value: mobileValue,
              contactWayCode: '',
            },
            landline: {
              id: '',
              value: landlineValue,
              contactWayCode: '',
            },
          });
        }
      });
    } else {
      this.setState({ showMainLinkMan: true });
    }
  }

  // 校验地址信息
  @autobind
  checkOrgAddressForSubmit() {
    // 2. 如果添加的是机构客户的地址信息，则判断存在主地址不
    const {
      contactWayData: { addressInfo },
     } = this.props;
    if (hasMainContact(addressInfo)) {
      this.setState({ showMainAddress: false });
       const addressForm = this.getOrgAddressForm();
       // 校验完成后调用提交回调
       addressForm.validateFields((err, values) => {
         if (!err) {
           this.handleOrgContactSubmit('address', values);
         }
       });
    } else {
      this.setState({ showMainAddress: true });
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
      this.checkOrgPhoneForSubmit();
    } else if (activeTabKey === 'address') {
      this.checkOrgAddressForSubmit();
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
        name: ADD_CONTACT_TABS[activeTabKey]
      }
    });
  }

  // 渲染警告提示
  @autobind
  renderWarning(show) {
    const { activeTabKey } = this.state;
    return (
      <IFWrap isRender={show}>
        <div className={styles.waringTip}>
          <Icon className={styles.waringIcon} type="jingshi"/>
          <span className={styles.waringText}>{WARNING_MESSAGE[`org_${activeTabKey}`]}</span>
        </div>
      </IFWrap>
    );
  }

  render() {
    const {
      activeTabKey,
      showMainLinkMan,
      showMainAddress,
    } = this.state;
    // Modal的底部按钮
    const footBtns = [
      <Button key="orgContactAddCancel" onClick={this.handleCloseModal}>取消</Button>,
      <Button key="orgContactAddOK" type="primary" onClick={this.handleModalOK}>确认</Button>,
    ];

    return (
      <Modal
        size="middle"
        visible
        title="添加客户联系方式"
        maskClosable={false}
        modalKey="addOrgContactWayModal"
        closeModal={this.handleCloseModal}
        style={MODAL_STYLE}
        selfBtnGroup={footBtns}
      >
        <div className={styles.addContactWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey}>
            <TabPane tab="电话信息" key="phone">
              {this.renderWarning(showMainLinkMan)}
              <OrgPhoneContactForm
                ref={this.orgPhoneFormRef}
                action="CREATE"
              />
            </TabPane>
            <TabPane tab="地址信息" key="address">
              {this.renderWarning(showMainAddress)}
              <OrgAddressContactForm
                ref={this.orgAddressFormRef}
                action="CREATE"
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
