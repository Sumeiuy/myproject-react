/*
 * @Author: sunweibin
 * @Date: 2018-08-30 19:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-31 13:12:16
 * @description 临时委托任务发起任务的弹出层
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon } from 'antd';

import CommonModal from '../common/biz/CommonModal';
import confirm from '../common/confirm_';
import ApprovalBtnGroup from '../common/approvalBtns';
import DeputeForm from './DeputeForm';
import logable from '../../decorators/logable';

import styles from './createDeputeModal.less';

export default class CreateDeputeModal extends PureComponent {
  static propTypes = {
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }


  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCloseModalConfirm() {
    this.props.onClose();
  }

  @autobind
  handleModalClose() {
    confirm({
      shortCut: 'close',
      onOk: this.handleCloseModalConfirm,
    });
  }

  @autobind
  handleModalBtnGroupClick() {
    console.warn('点击按钮');
  }

  @autobind
  handleDeputeFormChange(formData) {
    console.warn('委托任务表单数据：', formData);
  }


  render() {
    const selfBtnGroup = (
      <ApprovalBtnGroup
        approval={{}}
        onClick={this.handleModalBtnGroupClick}
      />
    );

    return (
      <CommonModal
        visible
        size="large"
        modalKey="createTempDepute"
        title="新建委托信息"
        maskClosable={false}
        onCancel={this.handleModalClose}
        closeModal={this.handleModalClose}
        selfBtnGroup={selfBtnGroup}
      >
        <div className={styles.deputeFormWrap}>
          <div className={styles.warningTips}>
            <span className={styles.icon}><Icon type="exclamation-circle" /></span>
            <span className={styles.text}>委托说明：任务委托不影响任务完成率统计规则，即在统计任务完成率时，委托给他人的任务仍然会算在您的名下。</span>
          </div>
          <DeputeForm
            action="CREATE"
            onChange={this.handleDeputeFormChange}
            ptyMngOrgList={[]}
            queryPtyMngOrgList={_.noop}
            quryPtyMngList={_.noop}
          />
        </div>
      </CommonModal>
    );
  }
}

