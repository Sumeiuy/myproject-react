/*
 * @Author: sunweibin
 * @Date: 2018-09-06 09:06:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-25 16:42:04
 * @description 临时委托他人处理任务驳回后修改
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { connect } from 'dva';
import _ from 'lodash';
import { Input } from 'antd';

import confirm from '../../components/common/confirm_';
import ApprovalBtnGroup from '../../components/common/approvalBtns';
import ApproveList from '../../components/common/approveList';
import InfoTitle from '../../components/common/InfoTitle';
import InfoItem from '../../components/common/infoItem';
import DeputeForm from '../../components/tempDepute/DeputeForm';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import { logCommon } from '../../decorators/logable';
import { env, dom, dva } from '../../helper';
import { DEFAULT_CHECK_REAULT, validateAll } from '../../components/tempDepute/utilsCheck';

import styles from './rejectHome.less';

const TextArea = Input.TextArea;

const effect = dva.generateEffect;

const mapStateToProps = state => ({
  // 受托人员列表
  deputeEmpList: state.tempDepute.deputeEmpList,
  // 受托人可选部门
  deputeOrgList: state.tempDepute.deputeOrgList,
  // 驳回后修改页面的详情数据
  detailUpdate: state.tempDepute.detailUpdate,
  // 驳回后修改页面的按钮和审批人信息
  approvalUpdate: state.tempDepute.approvalUpdate,
  // 提交申请的结果
  submitResult: state.tempDepute.submitResult,
  // 流程接口结果
  flowResult: state.tempDepute.flowResult,
  // 是否可以发起委托的校验结果
  checkResult: state.tempDepute.checkResult,
});

const mapDispatchToProps = {
  // 获取驳回后修改页面的详情数据 api
  getDetailForUpdate: effect('tempDepute/getDetailForUpdate', { forceFull: true }),
  // 驳回后修改页面的按钮和审批人信息
  getApprovalInfoForUpdate: effect('tempDepute/getApprovalInfoForUpdate', { forceFull: true }),
  // 提交
  submitApply: effect('tempDepute/saveApply', { forceFull: true }),
  // 走流程
  doApproval: effect('tempDepute/doApprove', { forceFull: true }),
  // 查询可受托部门列表
  queryCanDeputeOrg: effect('tempDepute/queryCanDeputeOrg', { forceFull: true }),
  // 查询可受托人员列表
  queryCanDeputeEmp: effect('tempDepute/queryCanDeputeEmp', { loading: false, forceFull: true }),
  // 检查是否可以发起委托
  checkApplyAbility: effect('tempDepute/checkApplyAbility', { forceFull: true }),
  // 清除Redux中的数据
  clearReduxData: effect('tempDepute/clearReduxData', { loading: false }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectHome extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 驳回后修改页面的详情数据
    detailUpdate: PropTypes.object.isRequired,
    // 获取驳回后修改页面的详情数据 api
    getDetailForUpdate: PropTypes.func.isRequired,
    // 驳回后修改页面按钮和审批人信息
    approvalUpdate: PropTypes.object.isRequired,
    // 获取驳回后修改页面的按钮和审批人信息
    getApprovalInfoForUpdate: PropTypes.func.isRequired,
    // 提交结果
    submitResult: PropTypes.object.isRequired,
    submitApply: PropTypes.func.isRequired,
    // 流程结果
    doApproval: PropTypes.func.isRequired,
    flowResult: PropTypes.object.isRequired,
    // 受托部门列表
    deputeOrgList: PropTypes.array.isRequired,
    queryCanDeputeOrg: PropTypes.func.isRequired,
    // 受托人员列表
    deputeEmpList: PropTypes.array.isRequired,
    queryCanDeputeEmp: PropTypes.func.isRequired,
    // 校验是否可以发起委托
    checkResult: PropTypes.object.isRequired,
    checkApplyAbility: PropTypes.func.isRequired,
    // 清除Redux中的数据
    clearReduxData: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      // 审批意见
      idea: '',
      // 禁用页面
      disablePage: false,
      // 输入项校验结果
      checkResult: DEFAULT_CHECK_REAULT,
    };
    // 此处为 React 16.3 API
    this.rejectHomeRef = React.createRef();
  }

  componentDidMount() {
    this.setHomeHeight();
    // 初始化的时候，根据 flowId查询详情数据
    const {
      getDetailForUpdate,
      getApprovalInfoForUpdate,
      location: { query: { flowId = '' } },
    } = this.props;
    // 获取到详情数据
    getDetailForUpdate({ flowId }).then(this.saveDetailToState);
    // 获取流程审批按钮和审批人信息
    getApprovalInfoForUpdate({ flowId });
  }

  componentWillUnmount() {
    // 页面销毁清空数据
    this.props.clearReduxData({ detailUpdate: {} });
  }

  @autobind
  setHomeHeight() {
    let height = dom.getCssStyle(document.documentElement, 'height');
    if (env.isInFsp()) {
      height = `${Number.parseInt(height, 10) - 55}px`;
    }
    dom.setStyle(this.rejectHomeRef.current, 'height', height);
  }

  // 将详情信息初始化的数据保存至 state 里面，一遍后续接口的调用
  @autobind
  saveDetailToState() {
    const {
      queryCanDeputeEmp,
      queryCanDeputeOrg,
      detailUpdate: { applyBasicInfo = {} },
    } = this.props;
    const {
      deputeReason,
      assigneeId,
      assigneeOrgId,
      assigneeTimeStart,
      assigneeTimeEnd,
    } = applyBasicInfo;

    this.setState({
      deputeReason,
      assigneeId,
      assigneeOrgId,
      deputeTimeStart: assigneeTimeStart,
      deputeTimeEnd: assigneeTimeEnd,
    });
    // 驳回后修改，需要将委托信息的数据回填
    // 但是此时受托人部门列表和受托服务经理列表没有数据，所以导致组件中显示不出来
    // 所以在初始化的时候需要基于详情的数据查询一把部门和员工列表数据
    queryCanDeputeEmp({ keyword: assigneeId, org: assigneeOrgId });
    queryCanDeputeOrg();
  }

  // 修改表单数据之后，在父组件接收变化之后的值
  @autobind
  handleRejectUpdateChange(obj) {
    this.setState(obj);
  }

  // 填写审批意见
  @autobind
  handleApprovalIdeaChange(e) {
    this.setState({
      idea: e.target.value,
    });
  }

  // 提交之前先进行是否可以委托的申请
  @autobind
  doCheckApplyAbility() {
    const { assigneeId, assigneeOrgId, operate } = this.state;
    if (operate === 'commit') {
      const {
        location: { query: { flowId = '' } },
        checkApplyAbility,
      } = this.props;
      // 在驳回后修改，如果点击的是提交，则需要走校验、提交、流程
      // 如果是终止，则直接走流程
      checkApplyAbility({
        assigneeOrgId,
        assigneeId,
        flowId,
      }).then(this.doSubmitApplyAfterValidate);
      // 记录校验日志
      logCommon({
        type: 'Submit',
        payload: {
          name: '临时委托任务校验',
          vlaue: JSON.stringify({ assigneeId, assigneeOrgId }),
        },
      });
    } else {
      this.doApproval();
    }
  }

  // 校验成功后再进行提交委托申请
  @autobind
  doSubmitApplyAfterValidate() {
    const {
      checkResult,
      submitApply,
    } = this.props;
    if (!checkResult.validate) {
      confirm({ content: checkResult.msg });
    } else {
      // 提交之后走流程
      const { detailUpdate: { flowId, itemId } } = this.props;
      const params = _.pick(this.state, ['assigneeId', 'assigneeOrgId', 'deputeReason', 'deputeTimeStart', 'deputeTimeEnd']);
      submitApply({ ...params, flowId, itemId }).then(this.doApproval);
       // 记录校验日志
      logCommon({
        type: 'Submit',
        payload: {
          name: '临时委托任务驳回后修改提交',
          vlaue: JSON.stringify({ ...params, flowId }),
        },
      });
    }
  }

  // 提交后，走流程
  @autobind
  doApproval() {
    const {
      doApproval,
      detailUpdate: { flowId, itemId },
    } = this.props;
    const { operate, auditors, groupName, idea, flowClass, currentNodeName } = this.state;
    const query = {
      flowId,
      itemId,
      wobNum: flowId,
      operate,
      auditors,
      approverIdea: idea,
      groupName,
      flowClass,
      currentNodeName,
    };
    doApproval(query).then(this.doSomethingAfterApproval);
    // 日志记录
    logCommon({
      type: 'Submit',
      payload: {
        name: '临时委托任务驳回后修改提交流程',
        vlaue: JSON.stringify(query),
      },
    });
  }

  @autobind
  doSomethingAfterApproval() {
    const {
      clearReduxData,
      flowResult: { msg },
    } = this.props;
    if (msg === 'success') {
      // 隐藏按钮
      clearReduxData({ approvalUpdate: {} });
      this.setState({ disablePage: true });
    }
  }

  @autobind
  handleBtnGroupClick(btn) {
    // 点击此处，需要先进行可以提交的规则校验
    const { checkResult, valid } = validateAll(this.state);
    if (!valid) {
      this.setState({ checkResult });
    } else {
      // 驳回后修改后再次提交，其审批人是受托人
      const { assigneeId } = this.state;
      this.setState({
        operate: btn.operate,
        groupName: btn.nextGroupName,
        auditors: assigneeId,
        flowClass: btn.flowClass,
        currentNodeName: btn.currentNodeName,
      }, this.doCheckApplyAbility);
    }
  }

  render() {
    const {
      detailUpdate,
      approvalUpdate,
      deputeOrgList,
      deputeEmpList,
      queryCanDeputeEmp,
    } = this.props;
    // if (_.isEmpty(detailUpdate)) {
    //   return null;
    // }

    const {
      idea,
      disablePage,
      checkResult,
    } = this.state;

    // 拟稿人信息
    const draftInfo = `${detailUpdate.orgName} - ${detailUpdate.drafterName}(${detailUpdate.drafterId})`;

    return (
      <div className={styles.rejectUpdateHome} ref={this.rejectHomeRef}>
        <div className={styles.rejectHeader}>
          <div className={styles.rejectAppId}>{`编号${detailUpdate.itemId}`}</div>
        </div>
        <DeputeForm
          action="UPDATE"
          checkResult={checkResult}
          disablePage={disablePage}
          deputeOrgList={deputeOrgList}
          deputeEmpList={deputeEmpList}
          detailInfo={detailUpdate.applyBasicInfo || {}}
          quryPtyMngList={queryCanDeputeEmp}
          onChange={this.handleRejectUpdateChange}
        />
        <div className={styles.module}>
          <InfoTitle head="拟稿信息" />
          <div className={styles.modContent}>
            <ul className={styles.propertyList}>
              <li className={styles.item}>
                <InfoItem label="拟稿人" value={draftInfo} width="112px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="申请时间" value={detailUpdate.applyTime} width="112px" />
              </li>
              <li className={styles.item}>
                <InfoItem label="状态" value={detailUpdate.statusName} width="112px" />
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
          <ApproveList data={detailUpdate.workflowHistoryBeans} />
        </div>
        <div className={styles.approvalBtns}>
          <ApprovalBtnGroup
            approval={approvalUpdate}
            onClick={this.handleBtnGroupClick}
          />
        </div>
      </div>
    );
  }
}
