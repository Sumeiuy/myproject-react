/**
 * @Author: sunweibin
 * @Date: 2018-07-10 13:35:26
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-15 22:33:36
 * @description 新建线上销户申请弹出框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Modal } from 'antd';

import CommonModal from '../common/biz/CommonModal';
import confirm from '../common/confirm_';
import ApprovalBtnGroup from '../common/approvalBtns';
import TableDialog from '../common/biz/TableDialog';
import CancelAccountOLForm from './CancelAccountOLForm';
import logable, { logPV, logCommon } from '../../decorators/logable';

import { emp } from '../../helper';
import { validateData } from '../../helper/page/cancelAccount';

import { APPROVAL_COLUMNS } from './config';
import { convertSubmitLostReason, convertSubmitInvestVars } from './utils';

export default class CreateApply extends PureComponent {
  static propTypes = {
    // 关闭弹出层
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    doApproval: PropTypes.func.isRequired,
    queryCustList: PropTypes.func.isRequired,
    getApprovalInfo: PropTypes.func.isRequired,
    // 可选的客户列表
    custList: PropTypes.array.isRequired,
    // 新建流程的按钮以及审批人数组
    approval: PropTypes.object.isRequired,
    // 提交结果
    submitResult: PropTypes.object.isRequired,
    // 流程结果
    flowResult: PropTypes.object.isRequired,
    // 字典
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
    // 查询新建流程发起的审批按钮信息
    this.props.getApprovalInfo({ flowId: '' });
  }

  // 提交数据，因为后端在此业务中校验接口和保存接口放在一起，
  // 所以直接使用后端提供的提交接口就行
  @autobind
  doValidateAndSaveApply() {
    const {
      cust,
      attachment,
      comment,
      lostDirection,
      investVars,
      otherVarDetail,
      stockExchange,
      lostReason,
      otherReasonDetail,
    } = this.state;
    const { optionsDict: { custInvestVarietyTypeList, custLossReasonTypeList } } = this.props;
    const vars = convertSubmitInvestVars(investVars, custInvestVarietyTypeList, otherVarDetail);
    const reasons = convertSubmitLostReason(lostReason, custLossReasonTypeList, otherReasonDetail);
    const query = {
      custNumber: cust.brokerNumber,
      attachment,
      custId: cust.custRowId,
      custType: cust.custType,
      createdBy: emp.getId(),
      postnId: emp.getPstnId(),
      lastUpdBy: emp.getId(),
      divisionId: emp.getOrgId(),
      comment,
      directionCode: lostDirection,
      churnStockExchange: stockExchange,
      CustInvestVarietyDTOReq: vars,
      CustLossCauseDTOReq: reasons,
    };
    this.props.onSubmit(query).then(() => {
      logCommon({
        type: 'Submit',
        payload: {
          name: '线上销户申请新建提交',
          vlaue: JSON.stringify(query),
        },
      });
      // 线上销户保存申请单并且校验通过之后，打开选择审批人选择框
      this.selectNextApproval();
    });
  }

  @autobind
  selectNextApproval() {
    const { submitResult: { validate, validateMsg, id } } = this.props;
    if (!validate) {
      confirm({ content: validateMsg });
    } else {
      this.setState({
        itemId: id,
      }, this.openNextApprovalModal);
    }
  }

  @autobind
  doApproval() {
    const { cust, operate, auditors, groupName, itemId } = this.state;
    // 新建走流程，flowId 传空字符串
    this.props.doApproval({
      flowId: '',
      wobNum: '',
      operate,
      auditors,
      approverIdea: '',
      groupName,
      itemId,
      custName: cust.custName,
    }).then(this.doSomethingAfterApproval);
  }

  @autobind
  doSomethingAfterApproval() {
    const { flowResult: { msg } } = this.props;
    if (msg === 'success') {
      // 关闭弹出层，刷新列表
      this.props.onClose('isShowCreateModal', true);
    }
  }

  @autobind
  @logPV({
    pathname: '/modal/createCancelAccountOL/nextApproval',
    title: '新建线上销户申请-选择下一步审批人',
  })
  openNextApprovalModal() {
    const { defaultNextApproverList } = this.state;
    if (_.isEmpty(defaultNextApproverList)) {
      Modal.error({
        title: '系统未配置下一步审批人，请联系管理员处理！',
        okText: '确定',
      });
    } else {
      this.setState({
        nextApprovalModal: true,
      });
    }
  }

  @autobind
  handleModalBtnGroupClick(btn) {
    // 点击此处，需要先进行可以提交的规则校验
    const { valid, msg } = validateData(this.state);
    if (!valid) {
      confirm({ content: msg });
      return;
    }
    // 此处处理逻辑需要修改为先校验申请单信息，因为线上销户申请的校验合并在保存申请单接口中
    // 然后通过之后再选择审批人，提交流程
    // 此处需要增加选择审批人的操作
    // 将用户选择的按钮信息保存下来
    this.setState({
      operate: btn.operate,
      groupName: btn.nextGroupName,
      auditors: !_.isEmpty(btn.flowAuditors) ? btn.flowAuditors[0].login : '',
      nextApproverList: btn.flowAuditors,
      defaultNextApproverList: btn.flowAuditors,
    }, this.doValidateAndSaveApply);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleCloseModalConfirm() {
    this.props.onClose('isShowCreateModal');
  }

  @autobind
  handleModalClose() {
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
    }, this.doApproval);
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

  // 搜索下一步审批人
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '搜索下一步审批人',
      value: '$args[0]',
    },
  })
  handleSearchApproval(value) {
    const { defaultNextApproverList } = this.state;
    const filterNextApproverList = _.filter(defaultNextApproverList,
      item => (item.login.indexOf(value) > -1 || item.empName.indexOf(value) > -1));
    this.setState({ nextApproverList: filterNextApproverList });
  }

  render() {
    const {
      approval,
      queryCustList,
      custList,
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
      searchShow: true,
      placeholder: '员工工号/员工姓名',
      onSearch: this.handleSearchApproval,
      pagination: {
        pageSize: 10,
      },
    };

    return (
      <CommonModal
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
          custList={custList}
          onChange={this.handleDataChange}
          optionsDict={this.props.optionsDict}
        />
        <TableDialog {...nextApprovalProps} />
      </CommonModal>
    );
  }
}
