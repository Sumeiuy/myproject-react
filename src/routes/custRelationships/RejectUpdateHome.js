/**
 * @Author: sunweibin
 * @Date: 2018-06-12 15:12:22
 * @Last Modified by: zhangmei
 * @Last Modified time: 2018-11-12 14:10:39
 * @description 融资类业务驳回后修改页面
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import { Input } from 'antd';

import TableDialog from '../../components/common/biz/TableDialog';
import confirm from '../../components/common/confirm_';
import ApprovalBtnGroup from '../../components/common/approvalBtns';
import ApproveList from '../../components/common/approveList';
import InfoTitle from '../../components/common/InfoTitle';
import InfoItem from '../../components/common/infoItem';
import FinanceCustRelationshipForm from '../../components/custRelationships/FinanceCustRelationshipForm';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { env, dom, dva } from '../../helper';

import { APPROVAL_COLUMNS } from '../../components/custRelationships/config';
import { validateData } from '../../helper/page/custRelationship';
import logable, { logPV } from '../../decorators/logable';


import styles from './rejectUpdateHome.less';

const TextArea = Input.TextArea;

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 驳回后修改页面的详情数据
  detailForUpdate: state.custRelationships.detailForUpdate,
  // 关联关系树
  relationshipTree: state.custRelationships.relationshipTree,
  // 驳回后修改页面的按钮和审批人信息
  approvalForUpdate: state.custRelationships.approvalForUpdate,
  // 数据校验结果
  validateResult: state.custRelationships.validateResult,
  // 提交申请的结果
  submitResult: state.custRelationships.submitResult,
  // 流程接口结果
  flowResult: state.custRelationships.flowResult,
});

const mapDispatchToProps = {
  // 获取驳回后修改页面的详情数据 api
  getDetailForUpdate: effect('custRelationships/getDetailForUpdate'),
  // 根据客户类型获取关联关系树 api
  getRelationshipTree: effect('custRelationships/getRelationshipTree'),
  // 驳回后修改页面的按钮和审批人信息
  getApprovalInfoForUpdate: effect('custRelationships/getApprovalInfoForUpdate'),
  // 校验数据接口
  validateData: effect('custRelationships/validateData'),
  // 提交申请接口
  submitApply: effect('custRelationships/submitApply'),
  // 走流程接口
  doApproveFlow: effect('custRelationships/doApproveFlow'),
  // 清除Redux中的数据
  clearReduxData: effect('custRelationships/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectUpdateHome extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 驳回后修改页面的详情数据
    detailForUpdate: PropTypes.object.isRequired,
    // 关联关系树
    relationshipTree: PropTypes.array.isRequired,
    // 根据客户类型获取关联关系树 api
    getRelationshipTree: PropTypes.func.isRequired,
    // 获取驳回后修改页面的详情数据 api
    getDetailForUpdate: PropTypes.func.isRequired,
    // 驳回后修改页面按钮和审批人信息
    approvalForUpdate: PropTypes.object.isRequired,
    // 获取驳回后修改页面的按钮和审批人信息
    getApprovalInfoForUpdate: PropTypes.func.isRequired,
    // 校验数据
    validateData: PropTypes.func.isRequired,
    validateResult: PropTypes.object.isRequired,
    // 提交申请
    submitResult: PropTypes.string.isRequired,
    submitApply: PropTypes.func.isRequired,
    // 走流程
    flowResult: PropTypes.string.isRequired,
    doApproveFlow: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 审批意见
      idea: '',
      // 是否办理股票质押回购业务
      stockRepurchase: '',
      // 关联关系数据
      relationships: [],
      // 选择审批人弹框
      nextApprovalModal: false,
    };
    // 此处为 React 16.3 API
    this.rejectHomeRef = React.createRef();
  }

  componentDidMount() {
    this.setHomeHeight();
    // 初始化的时候，根据 flowId查询详情数据
    const { location: { query: { flowId = '' } } } = this.props;
    // 获取到详情数据后，在根据详情数据获取关联关系树
    this.props.getDetailForUpdate({ flowId }).then(() => {
      const {
        detailForUpdate: { custDetail = {}, appId, attachment },
      } = this.props;
      this.props.getRelationshipTree({ custType: custDetail.custTypeValue });
      // 保存客户信息
      this.setState({
        attachment,
        appId,
        cust: custDetail,
        stockRepurchase: custDetail.businessFlag,
        relationships: this.props.detailForUpdate.custRelationshipList,
      });
    });
    // 获取流程审批按钮和审批人信息
    this.props.getApprovalInfoForUpdate({ flowId });
  }

  @autobind
  setHomeHeight() {
    let height = dom.getCssStyle(document.documentElement, 'height');
    if (env.isInFsp()) {
      height = `${Number.parseInt(height, 10) - 55}px`;
    }
    dom.setStyle(this.rejectHomeRef.current, 'height', height);
  }

  @autobind
  doValidateBeforeSubmit() {
    const { cust, relationships, appId } = this.state;
    this.props.validateData({
      appId,
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
      appId,
    } = this.state;
    const { location: { query: { flowId = '' } } } = this.props;
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
      flowCode: flowId,
      appId,
    }).then(this.doApprovalFlow);
  }

  @autobind
  doApprovalFlow() {
    const { submitResult, location: { query: { flowId = '' } } } = this.props;
    if (!_.isEmpty(submitResult)) {
      const { groupName, operate, auditors, cust, idea } = this.state;
      this.props.doApproveFlow({
        itemId: submitResult,
        groupName,
        auditors,
        operate,
        custId: cust.custId,
        wobNum: flowId,
        flowId,
        approverIdea: idea,
      }).then(() => {
        const { flowResult } = this.props;
        if (flowResult === 'success') {
          // 此处流程走成功了之后，需要将按钮注销
          // 把审批人信息删除掉
          this.props.clearReduxData({ approvalForUpdate: {} });
        }
      });
    }
  }

  @autobind
  handleRejectUpdateChange(obj) {
    this.setState(obj);
  }

  @autobind
  handleApprovalIdeaChange(e) {
    this.setState({
      idea: e.target.value,
    });
  }

  @autobind
  @logable({ type: 'Click',
payload: { name: '提交' } })
  handleBtnGroupClick(btn) {
    // 点击此处，需要先进行可以提交的规则校验
    const { valid, msg } = validateData(this.state);
    if (!valid) {
      confirm({ content: msg });
      return;
    }
    // 保存用户点击的按钮的相关信息
    this.setState({
      operate: btn.operate,
      groupName: btn.nextGroupName,
      auditors: !_.isEmpty(btn.flowAuditors) ? btn.flowAuditors[0].login : '',
      nextApproverList: btn.flowAuditors,
      defaultNextApproverList: btn.flowAuditors,
    }, () => {
      // 如果只有一个审批人情况，则直接提交后端校验接口
      // 校验通过之后则条用新建接口
      if (_.size(btn.flowAuditors) === 1) {
        this.doValidateBeforeSubmit();
      } else {
        this.handleSelectApprovalModal();
      }
    });
  }

  @autobind
  @logPV({ pathname: '/modal/choiceApproval',
title: '选择审批人' })
  handleSelectApprovalModal() {
    const { defaultNextApproverList } = this.state;
    if (_.isEmpty(defaultNextApproverList)) {
      prompt({
        title: '系统未配置下一步审批人，请联系管理员处理！',
        type: 'error',
      });
    } else {
      this.setState({
        nextApprovalModal: true,
      });
    }
  }

  @autobind
  handleSelectApproval(approver) {
    this.setState({
      nextApprovalModal: false,
      auditors: approver.login,
    }, this.doValidateBeforeSubmit);
  }

  @autobind
  handleCancelSelectApproval() {
    this.setState({ nextApprovalModal: false });
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
      detailForUpdate,
      relationshipTree,
      approvalForUpdate,
    } = this.props;
    if (_.isEmpty(detailForUpdate)) {
      return null;
    }

    const { idea, nextApprovalModal, nextApproverList } = this.state;

    const nextApprovalProps = {
      visible: nextApprovalModal,
      onOk: this.handleSelectApproval,
      onCancel: this.handleCancelSelectApproval,
      dataSource: nextApproverList,
      columns: APPROVAL_COLUMNS,
      title: '选择下一审批人员',
      modalKey: 'relationRejectApplyNextApproverModal',
      rowKey: 'login',
      searchShow: true,
      placeholder: '员工工号/员工姓名',
      onSearch: this.handleSearchApproval,
      pagination: {
        pageSize: 10,
      },
    };

    const draftInfo = `${detailForUpdate.orgName} - ${detailForUpdate.empName}(${detailForUpdate.empId})`;

    return (
      <div className={styles.rejectUpdateHome} ref={this.rejectHomeRef}>
        <div className={styles.rejectHeader}>
          <div className={styles.rejectAppId}>{`编号${detailForUpdate.id}`}</div>
        </div>
        <FinanceCustRelationshipForm
          action="UPDATE"
          custDetail={detailForUpdate}
          relationshipTree={relationshipTree}
          onChange={this.handleRejectUpdateChange}
        />
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="拟稿人" value={draftInfo} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="申请时间" value={detailForUpdate.createTime} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="状态" value={detailForUpdate.statusDesc} width="70px" />
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批" />
          <div className={styles.modContent}>
            <div className={styles.approvalIdeaArea}>
              <div className={styles.leftLabel}>审批意见：</div>
              <div className={styles.rightInput}>
                <TextArea rows="3" value={idea} onChange={this.handleApprovalIdeaChange} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.module}>
          <InfoTitle head="审批记录" />
          <ApproveList data={detailForUpdate.workflowHistoryBeans} />
        </div>
        <div className={styles.approvalBtns}>
          <ApprovalBtnGroup
            approval={approvalForUpdate}
            onClick={this.handleBtnGroupClick}
          />
        </div>
        <TableDialog {...nextApprovalProps} />
      </div>
    );
  }
}
