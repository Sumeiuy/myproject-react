/*
 * @Author: sunweibin
 * @Date: 2018-11-27 13:52:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 14:37:01
 * @description 添加联系方式的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Tabs } from 'antd';
import _ from 'lodash';

import logable, { logCommon } from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
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
      activeTabKey: '',
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

    return (
      <Modal
        visible
        title="添加联系方式"
        modalKey="addPersonalContactWayModal"
        closeModal={this.handleCloseModal}
        onOk={this.handleModalOK}
      >
        <div className={styles.addContactWrap}>
          <Tabs onChange={this.handleTabChange} activeKey={activeTabKey}>
          </Tabs>
        </div>
      </Modal>
    );
  }
}
