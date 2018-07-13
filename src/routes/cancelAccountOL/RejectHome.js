/**
 * @Author: sunweibin
 * @Date: 2018-07-12 09:02:17
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-12 12:09:33
 * @description 线上销户的驳回后修改页面
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import { Input } from 'antd';

import TableDialog from '../../components/common/biz/TableDialog';
// import confirm from '../../components/common/confirm_';
import ApprovalBtnGroup from '../../components/common/approvalBtns';
import ApproveList from '../../components/common/approveList';
import InfoTitle from '../../components/common/InfoTitle';
import InfoItem from '../../components/common/infoItem';
import CancelAccountOLForm from '../../components/cancelAccountOL/CancelAccountOLForm';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { env, dom, dva } from '../../helper';

import { APPROVAL_COLUMNS } from '../../components/cancelAccountOL/config';

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
    // 流程结果
    flowResult: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 审批意见
      idea: '',
      // 选择审批人弹框
      nextApprovalModal: false,
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
    this.props.getDetailForUpdate({ flowId });
    // 获取流程审批按钮和审批人信息
    // this.props.getApprovalInfoForUpdate({ flowId });
  }

  @autobind
  setHomeHeight() {
    let height = dom.getCssStyle(document.documentElement, 'height');
    if (env.isInFsp()) {
      height = `${Number.parseInt(height, 10) - 55}px`;
    }
    dom.setStyle(this.rejectHomeRef.current, 'height', height);
  }

  // @autobind
  // doValidateBeforeSubmit() {
  //   const { cust, relationships, appId } = this.state;
  //   this.props.validateData({
  //     appId,
  //     custId: cust.custId,
  //     custType: cust.custTypeValue,
  //     relationshipList: relationships,
  //   }).then(this.doSomethindAfterValid);
  // }

  // @autobind
  // doSomethindAfterValid() {
  //   const { validateResult: { msg = '接口错误', valid = false } } = this.props;
  //   if (valid) {
  //     // 校验通过之后提交数据
  //     this.doSubmit();
  //   } else {
  //     confirm({ content: msg });
  //   }
  // }

  // @autobind
  // doSubmit() {
  //   const {
  //     relationships,
  //     attachment,
  //     auditors,
  //     stockRepurchase,
  //     cust,
  //     appId,
  //   } = this.state;
  //   const { location: { query: { flowId = '' } } } = this.props;
  //   this.props.submitApply({
  //     relationshipList: relationships,
  //     attachment,
  //     empLogin: auditors,
  //     businessFlag: stockRepurchase,
  //     custId: cust.custId,
  //     custRowId: cust.custRowId,
  //     custType: cust.custTypeValue,
  //     IDTypeValue: cust.custIDTypeValue,
  //     IDNum: cust.custIDNum,
  //     flowCode: flowId,
  //     appId,
  //   }).then(this.doApprovalFlow);
  // }

  // @autobind
  // doApprovalFlow() {
  //   const { submitResult, location: { query: { flowId = '' } } } = this.props;
  //   if (!_.isEmpty(submitResult)) {
  //     const { groupName, operate, auditors, cust, idea } = this.state;
  //     this.props.doApproveFlow({
  //       itemId: submitResult,
  //       groupName,
  //       auditors,
  //       operate,
  //       custId: cust.custId,
  //       wobNum: flowId,
  //       flowId,
  //       approverIdea: idea,
  //     }).then(() => {
  //       const { flowResult } = this.props;
  //       if (flowResult === 'success') {
  //         // 此处流程走成功了之后，需要将按钮注销
  //         // 把审批人信息删除掉
  //         this.props.clearReduxData({ approvalForUpdate: {} });
  //       }
  //     });
  //   }
  // }

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
  handleBtnGroupClick(btn) {
    // 点击此处，需要先进行可以提交的规则校验
    // const { valid, msg } = validateData(this.state);
    // if (!valid) {
    //   confirm({ content: msg });
    //   return;
    // }
    // 保存用户点击的按钮的相关信息
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

  render() {
    const {
      detailInfoForUpdate,
      approvalForUpdate,
    } = this.props;
    if (_.isEmpty(detailInfoForUpdate)) {
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
      searchShow: false,
    };

    return (
      <div className={styles.rejectUpdateHome} ref={this.rejectHomeRef}>
        <div className={styles.rejectHeader}>
          <div className={styles.rejectAppId}>{`编号${detailInfoForUpdate.id}`}</div>
        </div>
        <CancelAccountOLForm
          action="UPDATE"
          optionsDict={this.props.optionsDict}
          detailInfo={detailInfoForUpdate}
          onChange={this.handleRejectUpdateChange}
        />
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="拟稿人" value={detailInfoForUpdate.empName} width="70px" />
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
