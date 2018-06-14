/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请新建页面
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-14 20:29:24
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import FinanceCustRelationshipForm from './FinanceCustRelationshipForm';
import Modal from '../common/biz/CommonModal';
import confirm from '../common/confirm_';
import ApprovalBtnGroup from '../common/approvalBtns';
import TableDialog from '../common/biz/TableDialog';

import { approvalColumns } from './config';
import { validateData } from '../../helper/page/custRelationship';

export default class CreateApply extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    // 获取客户详情
    getCustDetail: PropTypes.func.isRequired,
    custDetail: PropTypes.object.isRequired,
    // 获取可申请客户列表
    queryCustList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    // 获取关联关系树
    getRelationshipTree: PropTypes.func.isRequired,
    relationshipTree: PropTypes.array.isRequired,
    // 新建页面的按钮和审批人信息
    approval: PropTypes.object.isRequired,
    getApprovalInfo: PropTypes.func.isRequired,
    // 校验数据
    validateData: PropTypes.func.isRequired,
    validateResult: PropTypes.object.isRequired,
    // 提交申请
    submitResult: PropTypes.string.isRequired,
    submitApply: PropTypes.func.isRequired,
    // 走流程
    flowResult: PropTypes.string.isRequired,
    doApproveFlow: PropTypes.func.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      // 选择下一步审批人
      nextApprovalModal: false,
      // 下一步审批人列表
      nextApproverList: [],
      // 用户选择的客户
      cust: {},
      // 是否办理股票质押回购业务
      stockRepurchase: '',
      // 关联关系
      relationships: [],
      // 附件uuid
      attachment: '',
    };
  }
  componentDidMount() {
    // 新建页面获取审批按钮和审批人信息，新建不需要传flowId
    this.props.getApprovalInfo({});
  }

  @autobind
  doValidateBeforeSubmit() {
    const { cust, relationships } = this.state;
    this.props.validateData({
      custId: cust.custId,
      custType: cust.custTypeValue,
      relationshipList: relationships,
    }).then(this.doSomethindAfterValid);
  }

  @autobind
  doSomethindAfterValid() {
    const { validateResult: { msg = '接口错误', valid = false } } = this.props;
    if (valid) {
      // 校验通过之后提交数据
      this.doSubmit();
    } else {
      confirm({ content: msg });
    }
  }

  @autobind
  doSubmit() {
    const {
      relationships,
      attachment,
      auditors,
      stockRepurchase,
      cust,
    } = this.state;
    this.props.submitApply({
      relationshipList: relationships,
      attachment,
      empLogin: auditors,
      businessFlag: stockRepurchase,
      custId: cust.custId,
      custRowId: cust.custRowId,
      custType: cust.custTypeValue,
      IDTypeValue: cust.custIDTypeValue,
      IDNum: cust.custIDNum,
    }).then(this.doApprovalFlow);
  }

  @autobind
  doApprovalFlow() {
    const { submitResult } = this.props;
    if (!_.isEmpty(submitResult)) {
      const { groupName, operate, auditors, cust } = this.state;
      this.props.doApproveFlow({
        itemId: submitResult,
        groupName,
        auditors,
        operate,
        custId: cust.custId,
      }).then(() => {
        const { flowResult } = this.props;
        if (flowResult === 'success') {
          this.props.onCloseModal('isShowCreateModal', true);
        }
      });
    }
  }

  @autobind
  handleModalClose() {
    // 关闭新建申请弹出层的时候，弹出提示是否
    confirm({
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
  handleModalBtnGroupClick(btn) {
    // 点击此处，需要先进行可以提交的规则校验
    const { valid, msg } = validateData(this.state);
    if (!valid) {
      confirm({ content: msg });
      return;
    }
    // 此处需要增加选择审批人的操作
    // 将用户选择的按钮信息保存下来
    // 弹出审批人选择框
    this.setState({
      operate: btn.operate,
      groupName: btn.nextGroupName,
      auditors: !_.isEmpty(btn.flowAuditors) ? btn.flowAuditors[0].login : '',
      nextApproverList: btn.flowAuditors,
    }, () => {
      // 如果只有一个审批人情况，则直接提交后端校验接口
      // 校验通过之后则条用新建接口
      if (_.size(btn.flowAuditors) === 1) {
        this.doValidateBeforeSubmit();
      } else {
        this.setState({
          nextApprovalModal: true,
        });
      }
    });
  }

  @autobind
  handleCancelSelectApproval() {
    this.setState({ nextApprovalModal: false });
  }

  @autobind
  handleSelectApproval(approver) {
    this.setState({
      nextApprovalModal: false,
      auditors: approver.login,
    }, this.doValidateBeforeSubmit);
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
      nextApprovalModal,
      nextApproverList,
    } = this.state;

    const selfBtnGroup = (
      <ApprovalBtnGroup
        approval={approval}
        onClick={this.handleModalBtnGroupClick}
      />
    );

    const nextApprovalProps = {
      visible: nextApprovalModal,
      onOk: this.handleSelectApproval,
      onCancel: this.handleCancelSelectApproval,
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      modalKey: 'relationApplyNextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };

    return (
      <Modal
        visible
        size="large"
        modalKey="myModal"
        title="客户关联关系信息申请"
        maskClosable={false}
        onCancel={this.handleModalClose}
        closeModal={this.handleModalClose}
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
        <TableDialog {...nextApprovalProps} />
      </Modal>
    );
  }
}
