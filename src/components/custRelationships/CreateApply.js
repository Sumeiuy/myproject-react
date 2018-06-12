/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请新建页面
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 19:06:03
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

export default class CreateApply extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
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
  checkHasCust() {
    const { cust } = this.state;
    return !_.isEmpty(cust);
  }

  @autobind
  checkHasStockRepurchase() {
    const { stockRepurchase } = this.state;
    return !_.isEmpty(stockRepurchase);
  }

  @autobind
  checkeRelationships() {
    const { relationships } = this.state;
    // 校验关联关系比较复杂，
    if (_.isEmpty(relationships)) {
      confirm({ content: '关联关系不能为空' });
      return false;
    }
    // TODO 添加其余校验
    return true;
  }

  @autobind
  checkSubmitData() {
    // 1 校验客户
    if (!this.checkHasCust()) {
      confirm({ content: '客户不能为空' });
      return false;
    }
    // 2.校验是否选择了是否办理股票质押回购业务
    if (!this.checkHasStockRepurchase()) {
      confirm({ content: '请选择是否办理股票质押回购业务' });
      return false;
    }
    // 3.校验关联关系
    return this.checkeRelationships();
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
    if (!this.checkSubmitData()) return;
    // 此处需要增加选择审批人的操作
    // 将用户选择的按钮信息保存下来
    this.setState({
      operate: btn.operate,
      groupName: btn.nextGroupName,
      auditors: !_.isEmpty(btn.flowAuditors) ? btn.flowAuditors[0].login : '',
      nextApproverList: btn.flowAuditors,
      nextApprovalModal: true,
    });
    // this.props.onSubmit({});
  }

  @autobind
  handleCancelSelectApproval() {
    this.setState({ nextApprovalModal: false });
  }

  @autobind
  handleSelectApproval(approver) {
    console.warn('选择下一步审批人:', approver);
    // TODO 此处选择完审批人后，要发起申请请求
    this.setState({
      nextApproverModal: false,
    });
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
      modalKey: 'phoneApplyNextApproverModal',
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
        <TableDialog {...nextApprovalProps} />
      </Modal>
    );
  }
}
