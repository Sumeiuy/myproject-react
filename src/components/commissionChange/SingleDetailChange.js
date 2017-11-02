/**
 * @Author: sunweibin
 * @Date: 2017-11-01 18:37:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-01 23:50:12
 * @description 单佣金调整驳回后修改页面
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon } from 'antd';
import _ from 'lodash';

import RejectButtons from './RejectButtons';
import InfoTitle from '../common/InfoTitle';
import CommonUpload from '../common/biz/CommonUpload';
import AutoComplete from '../common/AutoComplete';
import CommissionLine from '../commissionAdjustment/CommissionLine';
import Transfer from '../common/biz/TableTransfer';
import ThreeMatchTip from '../commissionAdjustment/ThreeMatchTip';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import OtherCommissionSelectList from '../commissionAdjustment/OtherCommissionSelectList';
import {
  pagination,
  singleColumns,
} from '../commissionAdjustment/commissionTransferHelper/transferPropsHelper';

import styles from './change.less';

const { TextArea } = Input;

export default class SingleDetailChange extends PureComponent {
  static propTypes = {
    flowCode: PropTypes.string.isRequired,
    detailLoading: PropTypes.bool.isRequired,
    detail: PropTypes.object.isRequired,
    customer: PropTypes.object.isRequired,
    singleGJ: PropTypes.array.isRequired,
    optionalList: PropTypes.array.isRequired,
    threeMatchInfo: PropTypes.object.isRequired,
    otherRate: PropTypes.array.isRequired,
    approvalUserList: PropTypes.array.isRequired,
    onQueryDetail: PropTypes.func.isRequired,
    onQueryGJ: PropTypes.func.isRequired,
    onQueryProductList: PropTypes.func.isRequired,
    onQuery3Match: PropTypes.func.isRequired,
    onQueryOtherRate: PropTypes.func.isRequired,
    onQueryApprovalUser: PropTypes.func.isRequired,
    onQueryCustomer: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    // TODO state里面的初始值，使用detail里面的字段值
    this.state = {
      remark: '',
      newCommission: '',
      choiceApprover: false,
      approverName: '',
      approverId: '',
      attachment: '',
      otherComReset: new Date().getTime(), // 用来判断是否重置
      customer: {},
    };
  }

  componentDidMount() {
    const { flowCode } = this.props;
    this.props.onQueryDetail({
      flowCode,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { detailLoading: prevDL } = this.props;
    const { detailLoading: nextDL } = nextProps;
    if (prevDL && !nextDL) {
      const {
        detail,
        customer,
        approvalUserList,
      } = nextProps;
      // 表示初始化将detail的数据获取完毕
      const {
        newCommission,
        comments,
        attachmentNum,
        nextProcessLogin,
      } = detail.base;
      const currentApproval = _.filter(approvalUserList,
        user => user.empNo === nextProcessLogin)[0] || {};
      this.setState({
        customer,
        newCommission,
        remark: comments,
        attachment: attachmentNum,
        approverName: currentApproval.empName,
        approverId: currentApproval.empNo,
      });
    }
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 客户修改的目标估计佣金率来查询码值列表
  @autobind
  changeTargetGJCommission(v) {
    const { customer } = this.state;
    this.props.onQueryGJ({
      custId: customer.custEcom,
      commision: v,
    });
  }

  // 切换目标产品股基佣金率
  @autobind
  selectTargetGJCommission(v) {
    this.setState({
      newCommission: v.codeValue,
    });
    const { id } = this.state.customer; // 取出客户的row_id
    this.props.onQueryProductList({
      custRowId: id,
      commRate: v.codeValue,
    });
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  // 打开选择审批人弹窗
  @autobind
  openApproverBoard() {
    this.setState({
      choiceApprover: true,
    });
  }

  // 关闭审批人员选择弹出窗
  @autobind
  closeChoiceApproverModal() {
    this.setState({
      choiceApprover: false,
    });
  }

  // 选择审批人弹出层按确认键
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  // 提交修改
  @autobind
  handleSubmit() {

  }

  // 终止
  @autobind
  handleTerminate() {

  }

  // 返回
  @autobind
  handleBack() {

  }

  render() {
    const {
      newCommission,
      remark,
      choiceApprover,
      approverName,
      approverId,
      attachment,
      otherComReset,
      customer,
    } = this.state;
    const {
      singleGJ,
      optionalList,
      threeMatchInfo,
      approvalUserList,
      otherRate,
    } = this.props;

    // 单佣金调整中的产品选择配置
    const singleTransferProps = {
      firstTitle: '可选佣金产品',
      secondTitle: '已选产品',
      firstData: optionalList,
      secondData: [],
      firstColumns: singleColumns,
      secondColumns: singleColumns,
      transferChange: this.handleSingleTransferChange,
      checkChange: this.handleSingleTransferSubProductCheck,
      rowKey: 'id',
      defaultCheckKey: 'xDefaultOpenFlag',
      placeholder: '产品代码/产品名称',
      pagination,
      aboutRate: [newCommission, 'prodRate'],
      supportSearchKey: [['prodCode'], ['prodName']],
      totalData: optionalList,
    };

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList: [],
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment,
      needDefaultText: false,
    };

    return (
      <div className={styles.newApprovalBox}>
        <div className={styles.approvalBlock}>
          <InfoTitle head="基本信息" />
          <CommissionLine label="子类型" labelWidth="90px" required>
            <Input
              value="佣金调整"
              disabled
              style={{ width: '300px' }}
            />
          </CommissionLine>
          <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
            <Input
              value={`${customer.custName}(${customer.custEcom})-${customer.riskLevelLabel}`}
              disabled
              style={{ width: '300px' }}
            />
          </CommissionLine>
          <CommissionLine label="备注" labelWidth="90px">
            <TextArea
              placeholder="备注内容"
              value={remark}
              onChange={this.handleChangeRemark}
              style={{
                fontSize: '14px',
              }}
            />
          </CommissionLine>
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="佣金产品选择" />
          <CommissionLine
            label="目标股基佣金率"
            labelWidth="110px"
            needInputBox={false}
            extra={
              <span
                style={{
                  fontSize: '14px',
                  color: '#9b9b9b',
                  lineHeight: '26px',
                  paddingLeft: '4px',
                }}
              >
                ‰
              </span>
            }
          >
            <AutoComplete
              initValue={newCommission}
              dataSource={singleGJ}
              onChangeValue={this.changeTargetGJCommission}
              onSelectValue={this.selectTargetGJCommission}
              width="100px"
            />
          </CommissionLine>
          <Transfer {...singleTransferProps} />
          <ThreeMatchTip info={threeMatchInfo} />
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="其他佣金费率" />
          <OtherCommissionSelectList
            showTip
            reset={otherComReset}
            otherRatios={otherRate}
            onChange={this.changeOtherCommission}
          />
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="附件信息" />
          <CommonUpload {...uploadProps} />
        </div>
        <div className={styles.approvalBlock}>
          <InfoTitle head="审批人" />
          <CommissionLine label="选择审批人" labelWidth="110px">
            <div className={styles.checkApprover} onClick={this.openApproverBoard}>
              {approverName === '' ? '' : `${approverName}(${approverId})`}
              <div className={styles.searchIcon}>
                <Icon type="search" />
              </div>
            </div>
          </CommissionLine>
        </div>
        <RejectButtons
          onSubmit={this.handleSubmit}
          onBack={this.handleBack}
          onTerminate={this.handleTerminate}
        />
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={approvalUserList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}
