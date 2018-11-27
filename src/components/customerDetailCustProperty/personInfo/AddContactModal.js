/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 19:21:18
 * @description 添加联系方式的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import _ from 'lodash';

import IFWrap from '../../common/biz/IfWrap';
import Icon from '../../common/Icon';
import logable, { logCommon } from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import AddPhoneContactForm from './AddPhoneContactForm';
import AddAddressContactForm from './AddAddressContactForm';
import AddOtherContactForm from './AddOtherContactForm';
import {
  ADD_CONTACT_TABS,
} from './config';

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
    type: 'Click',
    payload: {
      name: '关闭',
    },
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
        name: ADD_CONTACT_TABS[activeTabKey]
      }
    });
  }

  render() {
    const { activeTabKey } = this.state;
    // 是否有主手机联系方式
    const hasMainTellPhone = false;
    // 是否有邮箱地址
    const hasMainEmail = false;
    // 是否有主地址
    const hasMainAddress = false;

    return (
      <Modal
        size="middle"
        visible
        title="添加联系方式"
        maskClosable={false}
        modalKey="addPersonalContactWayModal"
        closeModal={this.handleCloseModal}
        onOk={this.handleModalOK}
        style={{ width: '780px'}}
      >
        <div className={styles.addContactWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey}>
            <TabPane tab="电话信息" key="phone">
              <div>
                <IFWrap isRender={!hasMainTellPhone}>
                  <div className={styles.waringTip}>
                    <Icon className={styles.waringIcon} type="jingshi"/>
                    <span className={styles.waringText}>请客户先通过线上自助或线下临柜的方式维护主联系方式</span>
                  </div>
                </IFWrap>
                <AddPhoneContactForm
                  action="CREATE"
                />
              </div>
            </TabPane>
            <TabPane tab="地址信息" key="address">
              <div>
                <IFWrap isRender={!hasMainAddress}>
                  <div className={styles.waringTip}>
                    <Icon className={styles.waringIcon} type="jingshi"/>
                    <span className={styles.waringText}>请客户先通过线上自助或线下临柜的方式维护主要地址</span>
                  </div>
                </IFWrap>
                <AddAddressContactForm
                  action="CREATE"
                />
              </div>
            </TabPane>
            <TabPane tab="其他信息" key="other">
              <div>
                <IFWrap isRender={!hasMainEmail}>
                  <div className={styles.waringTip}>
                    <Icon className={styles.waringIcon} type="jingshi"/>
                    <span className={styles.waringText}>请客户先通过线上自助或线下临柜的方式维护主要邮箱</span>
                  </div>
                </IFWrap>
                <AddOtherContactForm
                  action="CREATE"
                />
              </div>
            </TabPane>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
