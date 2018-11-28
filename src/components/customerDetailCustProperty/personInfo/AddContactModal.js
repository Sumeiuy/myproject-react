/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 11:15:54
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

import styles from './addContactModal.less';

const TabPane = Tabs.TabPane;

export default class AddContactModal extends Component {
  static propTypes = {
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

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '确认',
    },
  })
  handleModalOK() {
    this.props.onOK();
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
    const { activeTabKey } = this.state;
    // 是否有主手机联系方式
    const hasMainTellPhone = false;
    // 是否有邮箱地址
    const hasMainEmail = false;
    // 是否有主地址
    const hasMainAddress = false;
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
              {this.renderWarning(hasMainTellPhone)}
              <PerPhoneContactForm
                action="CREATE"
              />
            </TabPane>
            <TabPane tab="地址信息" key="address">
              {this.renderWarning(hasMainAddress)}
              <PerAddressContactForm
                action="CREATE"
              />
            </TabPane>
            <TabPane tab="其他信息" key="other">
              {this.renderWarning(hasMainEmail)}
              <PerOtherContactForm
                action="CREATE"
              />
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
