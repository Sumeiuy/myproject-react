/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:40:02
 * @description 添加机构客户联系方式的Modal
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
import AddOrgPhoneContactForm from './AddOrgPhoneContactForm';
import AddOrgAddressContactForm from './AddOrgAddressContactForm';
import {
  ORG_ADD_CONTACT_TABS,
} from './config';

import styles from './addOrgContactWayModal.less';

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
        name: ORG_ADD_CONTACT_TABS[activeTabKey]
      }
    });
  }

  render() {
    const { activeTabKey } = this.state;
    // 是否有主要联系人信息
    const hasMainContactor = false;
    // 是否有主地址
    const hasMainAddress = false;

    return (
      <Modal
        size="middle"
        visible
        title="添加客户联系方式"
        maskClosable={false}
        modalKey="addOrgContactWayModal"
        closeModal={this.handleCloseModal}
        onOk={this.handleModalOK}
        style={{ width: '780px'}}
      >
        <div className={styles.addContactWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey}>
            <TabPane tab="电话信息" key="phone">
              <div>
                <IFWrap isRender={!hasMainContactor}>
                  <div className={styles.waringTip}>
                    <Icon className={styles.waringIcon} type="jingshi"/>
                    <span className={styles.waringText}>请客户先通过线上自助或线下临柜的方式维护主要联系人</span>
                  </div>
                </IFWrap>
                <AddOrgPhoneContactForm
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
                <AddOrgAddressContactForm
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
