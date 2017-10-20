/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-19 21:03:44
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import moment from 'moment';
// import { message } from 'antd';
import { Icon } from 'antd';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import ApproveList from '../common/approveList';
import Approval from '../permission/Approval';
import Button from '../common/Button';
import AddClause from './AddClause';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import CommissionLine from '../commissionAdjustment/CommissionLine';

import { seibelConfig } from '../../config';
import styles from './editForm.less';

// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
const BOOL_TRUE = true;
// 合约条款的表头、状态
const { contract: { titleList } } = seibelConfig;
// 临时数据 待删
// const approvalRecordList = [{
//   isOk: true,
//   handler: '张三',
//   handleTime: '2017/08/31',
//   stepName: '流程发起',
//   comment: 'asdasdadasd',
// }];
export default class EditForm extends PureComponent {
  static propTypes = {
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 查询客户列表
    onSearchCutList: PropTypes.func.isRequired,
    onChangeForm: PropTypes.func.isRequired,
    // 操作类型
    operationType: PropTypes.string.isRequired,
    // 合约详情
    contractDetail: PropTypes.object.isRequired,
    // 条款名称列表
    clauseNameList: PropTypes.array.isRequired,
    // 合作部门列表
    searchCooperDeparment: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
    // 上传成功后的回调
    uploadAttachment: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
  }

  static defaultProps = {
    flowStepInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        ...props.contractDetail.baseInfo,
        formType: 'edit',
        terms: props.contractDetail.baseInfo.terms,
      },
      // 是否显示添加合约条款组件
      showAddClauseModal: false,
      // 选择审批人弹窗
      appravalInfo: {
        appraval: '',
        approverName: '',
        approverId: '',
      },
      choiceApprover: false,
    };
  }

  componentDidMount() {
    const { onSearchCutList } = this.props;
    onSearchCutList();
  }

  // 审批意见
  @autobind
  handleChangeAppraval(type, value) {
    this.setState({
      appravalInfo: {
        ...this.state.appravalInfo,
        [type]: value,
      },
    }, () => {
      this.props.onChangeForm(this.state.appravalInfo);
    });
  }

  // 向父组件更新数据
  @autobind
  handleChangeBaseInfo(data) {
    const { formData } = this.state;
    this.setState({
      ...this.state,
      formData: Object.assign(formData, data),
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  // 根据关键字查询客户
  @autobind
  handleSearchClient(value) {
    const { onSearchCutList } = this.props;
    onSearchCutList(value);
  }

  // 上传文件成功
  @autobind
  handleUploadSuccess(attachment) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        uuid: attachment,
      },
    }, () => {
      this.props.uploadAttachment(this.state.formData);
    });
  }

  // 显示添加条款组件
  @autobind
  handleShowAddClause() {
    this.setState({
      ...this.state,
      showAddClauseModal: true,
    });
  }

  // 关闭添加条款组件
  @autobind
  handleCloseModal() {
    this.setState({
      ...this.state,
      showAddClauseModal: false,
    });
  }

  // 添加合约条款
  @autobind
  handleAddClause(clauseData) {
    const { formData: { terms } } = this.state;
    const termItem = {
      termsName: clauseData.termsName.termVal, // 条款名称
      termsVal: clauseData.termsName.value, // 条款code
      paraName: clauseData.paraName.val, // 明细参数名称
      paraValue: clauseData.paraName.value, // 明细参数code
      paraVal: clauseData.paraVal, // 值
      divName: clauseData.divName.name, // 合作部门名称
      divValue: clauseData.value, // 合作部门code
    };
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        terms: [...terms, termItem],
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
      this.handleCloseModal();
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

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      appravalInfo: {
        ...this.state.appravalInfo,
        approverName: approver.empName,
        approverId: approver.empNo,
      },
    }, () => {
      this.props.onChangeForm(this.state.appravalInfo);
    });
  }
  // 表格删除事件
  @autobind
  deleteTableData(record, index) {
    const { formData: { terms } } = this.state;
    const testArr = _.cloneDeep(terms);
    const newTerms = _.remove(testArr, (n, i) => i !== index);
    this.setState({
      formData: {
        ...this.state.formData,
        terms: newTerms,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  render() {
    const {
      custList,
      contractDetail,
      operationType,
      clauseNameList,
      cooperDeparment,
      searchCooperDeparment,
      contractDetail: { baseInfo, attachmentList },
      flowStepInfo,
    } = this.props;
    const {
      formData,
      showAddClauseModal,
      choiceApprover,
      appravalInfo: { appraval, approverName, approverId },
    } = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: this.handleShowAddClause,
    };
    const draftInfo = {
      name: baseInfo.createdName,
      date: baseInfo.createTime,
      status: baseInfo.status,
    };
    const listData = flowStepInfo.flowButtons[0].flowAuditors;
    const newApproverList = listData.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        empNo: item.login || '',
        empName: item.empName || '无',
        belowDept: item.occupation || '无',
        key,
      };
    });
    // 表格中需要的操作
    const operation = {
      column: {
        key: 'delete', // 'check'\'delete'\'view'
        title: '操作',
      },
      operate: this.deleteTableData,
    };
    return (
      <div className={styles.editComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{baseInfo.contractNum}</span>
        </div>
        <BaseInfoEdit
          contractName="合约名称"
          custList={custList}
          contractDetail={contractDetail}
          onChange={this.handleChangeBaseInfo}
          onSearchClient={this.handleSearchClient}
          operationType={operationType}
        />
        { /* 拟稿人信息 */ }
        <DraftInfo data={draftInfo} />
        <div className={styles.editWrapper}>
          <InfoTitle
            head="合约条款"
            isRequired
          />
          <Button {...buttonProps}>新建</Button>
          <CommonTable
            data={formData.terms}
            titleList={titleList}
            operation={operation}
          />
        </div>
        <UploadFile
          edit={BOOL_TRUE}
          fileList={attachmentList}
          attachment={baseInfo.uuid}
          uploadAttachment={this.handleUploadSuccess}
        />
        <Approval
          type="appraval"
          head="审批"
          textValue={appraval}
          onEmitEvent={this.handleChangeAppraval}
        />
        <div className={styles.editWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={contractDetail.flowHistory} />
        </div>
        <div className={styles.editWrapper}>
          <InfoTitle head="审批人" />
          <CommissionLine label="选择审批人" labelWidth="110px" required>
            <div className={styles.checkApprover} onClick={this.openApproverBoard}>
              {approverName === '' ? '' : `${approverName}(${approverId})`}
              <div className={styles.searchIcon}>
                <Icon type="search" />
              </div>
            </div>
          </CommissionLine>
        </div>
        <div className={styles.cutSpace} />
        <AddClause
          isShow={showAddClauseModal}
          onConfirm={this.handleAddClause}
          onCloseModal={this.handleCloseModal}
          clauseNameList={clauseNameList}
          departmentList={cooperDeparment}
          searchDepartment={searchCooperDeparment}
        />
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }

}
