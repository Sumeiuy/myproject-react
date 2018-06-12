/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请新建页面
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 17:26:51
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import FinanceCustRelationshipForm from './FinanceCustRelationshipForm';
import CommonModal from '../common/biz/CommonModal';
import commonConfirm from '../common/confirm_';
import ApprovalBtnGroup from '../common/approvalBtns';

export default class CreateApply extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    // 获取客户详情
    getCustDetail: PropTypes.func.isRequired,
    custDetail: PropTypes.object.isRequired,
    // 获取可申请客户列表
    queryCustList: PropTypes.func.isRequired,
    custList: PropTypes.object.isRequired,
    // 获取关联关系树
    getRelationshipTree: PropTypes.func.isRequired,
    relationshipTree: PropTypes.array.isRequired,
    // 新建页面的按钮和审批人信息
    approval: PropTypes.object.isRequired,
    getApprovalInfo: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
    };
  }
  componentDidMount() {
    // 新建页面获取审批按钮和审批人信息，新建不需要传flowId
    this.props.getApprovalInfo({});
  }

  @autobind
  handleModalClose() {
    // 关闭新建申请弹出层的时候，弹出提示是否
    commonConfirm({
      shortCut: 'close',
      onOk: this.handleCloseModalConfim,
    });
  }

  @autobind
  handleCloseModalConfim() {
    this.props.onCloseModal('isShowCreateModal');
  }

  @autobind
  handleFinanceCustRelationFormChange(obj) {
    this.setState(obj);
  }

  @autobind
  handleModalConfirmClick() {
    console.warn('点击提交按钮');
    // TODO 此处需要增加选择审批人的操作
    this.props.onSubmit({});
  }

  render() {
    const {
      custDetail,
      custList,
      getCustDetail,
      queryCustList,
      getRelationshipTree,
      relationshipTree,
      approval,
    } = this.props;
    const {
      isShowModal,
    } = this.state;

    const selfBtnGroup = (
      <ApprovalBtnGroup
        approval={approval}
        onClick={this.handleModalConfirmClick}
      />
    );

    return (
      <CommonModal
        size="large"
        modalKey="myModal"
        title="客户关联关系信息申请"
        maskClosable={false}
        visible={isShowModal}
        onCancel={this.handleModalClose}
        closeModal={this.handleModalClose}
        onOk={this.handleModalConfirmClick}
        selfBtnGroup={selfBtnGroup}
      >
        <FinanceCustRelationshipForm
          action="CREATE"
          custDetail={custDetail}
          custList={custList}
          getCustDetail={getCustDetail}
          queryCustList={queryCustList}
          getRelationshipTree={getRelationshipTree}
          relationshipTree={relationshipTree}
          onChange={this.handleFinanceCustRelationFormChange}
        />
      </CommonModal>
    );
  }
}
