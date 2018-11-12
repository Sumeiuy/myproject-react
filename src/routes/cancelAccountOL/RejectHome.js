/**
 * @Author: sunweibin
 * @Date: 2018-07-12 09:02:17
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-09-21 14:10:40
 * @description 线上销户的驳回后修改页面
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
import CancelAccountOLForm from '../../components/cancelAccountOL/CancelAccountOLForm';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { env, dom, dva, emp } from '../../helper';
import logable, { logCommon, logPV } from '../../decorators/logable';

import { APPROVAL_COLUMNS } from '../../components/cancelAccountOL/config';
import {
  convertSubmitLostReason,
  convertSubmitInvestVars,
  getSelectedKeys,
} from '../../components/cancelAccountOL/utils';
import { validateData } from '../../helper/page/cancelAccount';

import styles from './rejectHome.less';

const TextArea = Input.TextArea;

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 驳回后修改页面的详情数据
  detailInfoForUpdate: state.cancelAccountOL.detailInfoForUpdate,
  // 驳回后修改页面的按钮和审批人信息
  approvalForUpdate: state.cancelAccountOL.approvalForUpdate,
  // 下拉列表的字典接口
  optionsDict: state.cancelAccountOL.optionsDict,
  // 提交申请的结果
  submitResult: state.cancelAccountOL.submitResult,
  // 流程接口结果
  flowResult: state.cancelAccountOL.flowResult,
});

const mapDispatchToProps = {
  // 获取下拉框选项字典 api
  queryDict: effect('cancelAccountOL/queryDict', { forceFull: true }),
  // 获取驳回后修改页面的详情数据 api
  getDetailForUpdate: effect('cancelAccountOL/getDetailForUpdate', { forceFull: true }),
  // 驳回后修改页面的按钮和审批人信息
  getApprovalInfoForUpdate: effect('cancelAccountOL/getApprovalInfoForUpdate', { forceFull: true }),
  // 提交
  submitApply: effect('cancelAccountOL/submitApply', { forceFull: true }),
  // 走流程
  doApproval: effect('cancelAccountOL/doApproval', { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect('cancelAccountOL/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectHome extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取下拉框选项字典 api
    queryDict: PropTypes.func.isRequired,
    // 下拉框选项字典
    optionsDict: PropTypes.object.isRequired,
    // 驳回后修改页面的详情数据
    detailInfoForUpdate: PropTypes.object.isRequired,
    // 获取驳回后修改页面的详情数据 api
    getDetailForUpdate: PropTypes.func.isRequired,
    // 驳回后修改页面按钮和审批人信息
    approvalForUpdate: PropTypes.object.isRequired,
    // 获取驳回后修改页面的按钮和审批人信息
    getApprovalInfoForUpdate: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
    // 提交结果
    submitResult: PropTypes.object.isRequired,
    submitApply: PropTypes.func.isRequired,
    // 流程结果
    doApproval: PropTypes.func.isRequired,
    flowResult: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 审批意见
      idea: '',
      // 选择审批人弹框
      nextApprovalModal: false,
      // 禁用页面
      disablePage: false,
    };
    // 此处为 React 16.3 API
    this.rejectHomeRef = React.createRef();
  }

  componentDidMount() {
    this.setHomeHeight();
    // 初始化的时候，根据 flowId查询详情数据
    const { queryDict, optionsDict, location: { query: { flowId = '' } } } = this.props;
    const notGetDict = _.isEmpty(optionsDict);
    if (notGetDict) {
      queryDict();
    }
    // 获取到详情数据
    this.props.getDetailForUpdate({ flowId }).then(this.saveDetailToState);
    // 获取流程审批按钮和审批人信息
    this.props.getApprovalInfoForUpdate({ flowId });
  }

  componentWillUnmount() {
    this.props.clearReduxData({ detailInfoForUpdate: {} });
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
  saveDetailToState() {
    const { detailInfoForUpdate: { basicInfo, attachment } } = this.props;
    const {
      lostDirectionCode = '',
      stockExchange = '',
      investVars = {},
      lostReason = {},
      commet = '',
    } = basicInfo;

    this.setState({
      cust: basicInfo,
      attachment: attachment || '',
      lostDirection: _.lowerFirst(lostDirectionCode),
      stockExchange,
      investVars: getSelectedKeys(investVars),
      otherVarDetail: _.get(investVars, 'churnInvestOtherDetail') || '',
      lostReason: getSelectedKeys(lostReason),
      otherReasonDetail: _.get(lostReason, 'churnOtheReason') || '',
      comment: commet,
    });
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

  // 提交数据，因为后端在此业务中校验接口和保存接口放在一起，
  // 所以直接使用后端提供的提交接口就行
  @autobind
  doValidateAndSaveApply() {
    const { detailInfoForUpdate: { flowId, applyId } } = this.props;
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
      operate,
    } = this.state;
    const { optionsDict: { custInvestVarietyTypeList, custLossReasonTypeList } } = this.props;
    const vars = convertSubmitInvestVars(investVars, custInvestVarietyTypeList, otherVarDetail);
    const reasons = convertSubmitLostReason(lostReason, custLossReasonTypeList, otherReasonDetail);
    const query = {
      custNumber: cust.custId,
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
      flowCode: flowId,
      id: applyId,
    };
    // 驳回后修改存在终止的情况
    // 终止不需要调用保存接口
    // commit_yybfzr
    // commit_kfzxzg
    if (_.includes(['commit_yybfzr', 'commit_kfzxzg'], operate)) {
      this.props.submitApply(query).then(() => {
        logCommon({
          type: 'Submit',
          payload: {
            name: '线上销户申请驳回后修改提交',
            vlaue: JSON.stringify(query),
          },
        });
        this.selectNextApproval();
      });
    } else {
      this.doApproval(applyId);
    }
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
    const { detailInfoForUpdate: { flowId, basicInfo } } = this.props;
    const { operate, auditors, groupName, idea, itemId } = this.state;
    // 新建走流程，flowId 传空字符串
    this.props.doApproval({
      flowId,
      wobNum: flowId,
      operate,
      auditors,
      approverIdea: idea,
      groupName,
      itemId,
      custName: _.get(basicInfo, 'custName', ''),
    }).then(this.doSomethingAfterApproval);
  }

  @autobind
  doSomethingAfterApproval() {
    const { flowResult: { msg } } = this.props;
    if (msg === 'success') {
      // 隐藏按钮
      this.props.clearReduxData({ approvalForUpdate: {} });
      this.setState({ disablePage: true });
    }
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
  @logable({ type: 'Click', payload: { name: '提交' } })
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
    }, this.doValidateAndSaveApply);
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
      detailInfoForUpdate,
      approvalForUpdate,
    } = this.props;
    if (_.isEmpty(detailInfoForUpdate)) {
      return null;
    }

    const { idea, nextApprovalModal, nextApproverList, disablePage } = this.state;

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

    const draftInfo = `${detailInfoForUpdate.orgName} - ${detailInfoForUpdate.empName}(${detailInfoForUpdate.empId})`;

    return (
      <div className={styles.rejectUpdateHome} ref={this.rejectHomeRef}>
        <div className={styles.rejectHeader}>
          <div className={styles.rejectAppId}>{`编号${detailInfoForUpdate.id}`}</div>
        </div>
        <CancelAccountOLForm
          action="UPDATE"
          disablePage={disablePage}
          optionsDict={this.props.optionsDict}
          detailInfo={detailInfoForUpdate}
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
                <InfoItem label="申请时间" value={detailInfoForUpdate.createTime} width="70px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="状态" value={detailInfoForUpdate.statusDesc} width="70px" />
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
          <ApproveList data={detailInfoForUpdate.workflowHistoryBeans} />
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
