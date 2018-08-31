/*
 * @Author: sunweibin
 * @Date: 2018-08-30 19:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-31 17:52:11
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
    // 审批人信息
    approval: PropTypes.object.isRequired,
    // 受托服务经理列表
    deputeEmpList: PropTypes.array.isRequired,
    // 受托服务经理部门列表
    deputeOrgList: PropTypes.array.isRequired,
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
    // 查询受托服务经理部门
    queryCanDeputeOrg: PropTypes.func.isRequired,
    // 查询受托服务经理
    queryCanDeputeEmp: PropTypes.func.isRequired,
    // 查询审批意见
    getApprovalInfo: PropTypes.func.isRequired,
    // 提交
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // 初次进入需要先查一把受托服务经理部门的列表
    const { deputeOrgList, queryCanDeputeOrg, getApprovalInfo } = this.props;
    const hasNotGetOrgList = _.isEmpty(deputeOrgList);
    if (hasNotGetOrgList) {
      // 因为委托申请新建整个期间只需要查一次部门
      queryCanDeputeOrg();
    }
    // 初始化查询下一步审批人列表信息，新建的时候没有flowId所以传空字符串
    getApprovalInfo({ flow: '' });
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
  @logable({ type: 'ButtonClick', payload: { name: '提交' } })
  handleModalBtnGroupClick(btn) {
    console.warn('点击按钮： ', btn);
    // 点击此处，需要先进行可以提交的规则校验
    // const { valid, msg } = validateData(this.state);
    // if (!valid) {
    //   confirm({ content: msg });
    // } else {

    // }
  }

  @autobind
  handleDeputeFormChange(formData) {
    console.warn('委托任务表单数据：', formData);
  }


  render() {
    const {
      approval,
      deputeOrgList,
      deputeEmpList,
      queryCanDeputeEmp,
    } = this.props;

    const selfBtnGroup = (
      <ApprovalBtnGroup
        approval={approval}
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
            deputeOrgList={deputeOrgList}
            deputeEmpList={deputeEmpList}
            quryPtyMngList={queryCanDeputeEmp}
            checkResult={{}}
          />
        </div>
      </CommonModal>
    );
  }
}

