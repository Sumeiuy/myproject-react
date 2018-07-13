/**
 * @Author: sunweibin
 * @Date: 2018-07-10 13:35:26
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-12 18:12:42
 * @description 新建线上销户申请弹出框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Modal from '../common/biz/CommonModal';
import confirm from '../common/confirm_';
import ApprovalBtnGroup from '../common/approvalBtns';
import TableDialog from '../common/biz/TableDialog';
import CancelAccountOLForm from './CancelAccountOLForm';
import logable, { logPV } from '../../decorators/logable';

import { APPROVAL_COLUMNS } from './config';

export default class CreateApply extends PureComponent {
  static propTypes = {
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
    queryCustList: PropTypes.func.isRequired,
    getCustDetail: PropTypes.func.isRequired,
    getApprovalInfo: PropTypes.func.isRequired,
    // 可选的客户列表
    custList: PropTypes.array.isRequired,
    // 选中的客户信息
    custDetail: PropTypes.object.isRequired,
    // 新建流程的按钮以及审批人数组
    approval: PropTypes.object.isRequired,
    // 提交结果
    submitResult: PropTypes.object.isRequired,
    // 流程结果
    flowResult: PropTypes.object.isRequired,
    // 查询字典
    queryDict: PropTypes.func.isRequired,
    optionsDict: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 选择审批人的弹出对话框
      nextApprovalModal: false,
      // 用户选择的按钮的信息
      operate: '',
      groupName: '',
      auditors: '',
      nextApproverList: [],
      // 用户选中的客户
      cust: {},
      // 用户选择的流失去向
      lostDirection: '',
      // 用户填写的证券营业部
      stockExchange: '',
      // 用户选择的投资品种
      investVars: {},
      // 用户选择的流失原因
      lostReason: {},
      // 备注
      comment: '',
      // 附件uuid
      attachment: '',
    };
  }

  componentDidMount() {
    const { queryDict, optionsDict } = this.props;
    const notGetDict = _.isEmpty(optionsDict);
    if (notGetDict) {
      queryDict();
    }
  }

  // 提交数据，因为后端在此业务中校验接口和保存接口放在一起，
  // 所以直接使用后端提供的提交接口就行
  @autobind
  doSubmitPassValidate() {
    // logCommon({

    // });
  }

  @autobind
  @logPV({
    pathname: '/modal/createCancelAccountOL/nextApproval',
    title: '新建线上销户申请-选择下一步审批人',
  })
  openNextApprovalModal() {
    this.setState({
      nextApprovalModal: true,
    });
  }

  @autobind
  handleModalBtnGroupClick(btn) {
    // 点击此处，需要先进行可以提交的规则校验
    // const { valid, msg } = validateData(this.state);
    // if (!valid) {
    //   confirm({ content: msg });
    //   return;
    // }
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
        this.doSubmit();
      } else {
        this.openNextApprovalModal();
      }
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCloseModalConfirm() {
    this.props.onClose('isShowCreateModal');
  }

  @autobind
  handleModalClose() {
    // 关闭新建申请弹出层的时候，弹出提示是否
    confirm({
      shortCut: 'close',
      onOk: this.handleCloseModalConfirm,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '确认' } })
  handleSelectApproval(approver) {
    this.setState({
      nextApprovalModal: false,
      auditors: approver.login,
    }, this.doValidateBeforeSubmit);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCancelSelectApproval() {
    this.setState({ nextApprovalModal: false });
  }

  // 将子组件中的数据变换传递出来
  @autobind
  handleDataChange(obj) {
    this.setState(obj);
  }

  render() {
    const {
      approval,
      queryCustList,
      getCustDetail,
      custList,
      custDetail,
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
      columns: APPROVAL_COLUMNS,
      title: '选择下一审批人员',
      modalKey: 'cancelAccountOLNextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };

    return (
      <Modal
        visible
        size="large"
        modalKey="createCancelAccountOLModal"
        title="新建线上销户申请"
        maskClosable={false}
        onCancel={this.handleModalClose}
        closeModal={this.handleModalClose}
        selfBtnGroup={selfBtnGroup}
      >
        <CancelAccountOLForm
          action="CREATE"
          queryCustList={queryCustList}
          getCustDetail={getCustDetail}
          custList={custList}
          custDetail={custDetail}
          onChange={this.handleDataChange}
          optionsDict={this.props.optionsDict}
        />
        <TableDialog {...nextApprovalProps} />
      </Modal>
    );
  }
}
