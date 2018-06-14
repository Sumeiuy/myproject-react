/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请新建页面
 * @Date: 2018-06-08 13:10:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-14 16:38:40
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

import {
  approvalColumns,
  marriagedCode,
  realControllerTypeCode,
  fuqiTypeCode,
  productManagerTypeCode,
} from './config';

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
  hasCust() {
    const { cust } = this.state;
    return !_.isEmpty(cust);
  }

  @autobind
  hasStockRepurchase() {
    const { stockRepurchase } = this.state;
    return !_.isEmpty(stockRepurchase);
  }

  @autobind
  checkRelationForCustMarriage() {
    // 检测客户的婚姻状态与关联关系
    // 若所选客户的婚姻状况为“已婚”
    // 则“家庭成员”中“夫妻”类必填，且同一申请单中夫妻关系只能填写一条
    const { cust, relationships } = this.state;
    if (cust.custTypeValue === 'per' && marriagedCode === cust.marriageValue) {
      const count = _.countBy(relationships, ship => ship.relationSubTypeValue === fuqiTypeCode);
      if (count.true === 0) {
        confirm({ content: '没有维护家庭成员夫妻类关联关系！' });
        return false;
      } else if (count.true > 1) {
        confirm({ content: '家庭成员夫妻类关联关系超过1条！' });
        return false;
      }
    }
    return true;
  }

  @autobind
  checkRelationForOrgCust() {
    // 若所选客户为普通机构客户，则关联关系中，
    // “实际控制人”类别必填，且同一申请单中实际控制人关系只能填写一条
    const { cust, relationships } = this.state;
    if (cust.custTypeValue === 'org') {
      const count = _.countBy(relationships,
        ship => ship.relationSubTypeValue === realControllerTypeCode);
      if (count.true === 0) {
        confirm({ content: '没有维护实际控制人关联关系！' });
        return false;
      } else if (count.true > 1) {
        confirm({ content: '实际控制人关联关系超过1条！' });
        return false;
      }
    }
    return true;
  }

  @autobind
  checkRelationForProductCust() {
    // 若所选客户为产品客户，则关联关系中，
    // “产品管理人”类别必填，且同一申请单中产品管理人关系只能填写一条
    const { cust, relationships } = this.state;
    if (cust.custTypeValue === 'prod') {
      const count = _.countBy(relationships,
        ship => ship.relationSubTypeValue === productManagerTypeCode);
      if (count.true === 0) {
        confirm({ content: '没有维护产品管理人关联关系！' });
        return false;
      } else if (count.true > 1) {
        confirm({ content: '产品管理人关联关系超过1条！' });
        return false;
      }
    }
    return true;
  }

  @autobind
  checkRealtionDuplicate() {
    // 同一申请单中同一类型的关系信息关系人三要素（关系人名称、关系人证件类型、关系人证件号码）不得重复
    // 首先将关联关
    const { relationships } = this.state;
    const result = [];
    let resultBool = true;
    _.each(relationships, (item) => {
      const {
        relationTypeValue,
        relationTypeLable,
        partyName,
        partyIDTypeValue,
        partyIDNum,
      } = item;
      // 将三要素合并成字符串，放入到result数组中，来判断是否已经存在该值，
      // 如果该值存在，则表示有关联关系的三要素是相同的，弹出提示框
      const threeKeyMergeStr = `${relationTypeValue}${partyName}${partyIDTypeValue}${partyIDNum}`;
      if (_.includes(result, threeKeyMergeStr)) {
        // 如果已经存在了
        confirm({ content: `${relationTypeLable}关联关系三要素信息填写重复！` });
        resultBool = false;
        return false;
      }
      result.push(threeKeyMergeStr);
      return true;
    });
    return resultBool;
  }

  @autobind
  checkeRelationships() {
    const { relationships } = this.state;
    // 校验关联关系比较复杂，
    if (_.isEmpty(relationships)) {
      confirm({ content: '关联关系不能为空' });
      return false;
    }
    // 个人客户校验夫妻关系
    if (!this.checkRelationForCustMarriage()) return false;
    // 普通机构客户校验实际控制人关系
    if (!this.checkRelationForOrgCust()) return false;
    // 产品客户校验产品管理人关联关系
    if (!this.checkRelationForProductCust()) return false;
    // 校验同一关联关系中中 三要素
    if (!this.checkRealtionDuplicate()) return false;
    return true;
  }

  @autobind
  checkSubmitData() {
    // 1 校验客户
    if (!this.hasCust()) {
      confirm({ content: '客户不能为空' });
      return false;
    }
    // 2.校验是否选择了是否办理股票质押回购业务
    if (!this.hasStockRepurchase()) {
      confirm({ content: '请选择是否办理股票质押回购业务' });
      return false;
    }
    // 3.校验关联关系
    return this.checkeRelationships();
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
    const { validateResult: { msg = '接口错误', isValid = false } } = this.props;
    if (isValid) {
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
    if (!this.checkSubmitData()) return;
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
    }, () => {
      this.doValidateBeforeSubmit();
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
