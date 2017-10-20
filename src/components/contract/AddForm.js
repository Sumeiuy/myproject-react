/*
* @Description: 合作合约新建 页面
* @Author: XuWenKang
* @Date:   2017-09-21 15:17:50
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-19 21:03:52
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Icon } from 'antd';
import _ from 'lodash';

import BaseInfoAdd from './BaseInfoAdd';
// import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import CommonUpload from '../common/biz/CommonUpload';
import Button from '../common/Button';
import AddClause from './AddClause';
import ChoiceApproverBoard from '../commissionAdjustment/ChoiceApproverBoard';
import CommissionLine from '../commissionAdjustment/CommissionLine';

import { seibelConfig } from '../../config';
import styles from './addForm.less';
// 操作类型列表
const { contract: { operationList } } = seibelConfig;
// 订购的类型
const subscribe = operationList[0].value;
// 合约条款的表头
const { contract: { titleList } } = seibelConfig;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const BOOL_TRUE = true;

export default class AddForm extends PureComponent {
  static propTypes = {
    // 客户列表
    custList: PropTypes.array.isRequired,
    // 查询客户列表
    onSearchCutList: PropTypes.func.isRequired,
    onChangeForm: PropTypes.func.isRequired,
    // 查询合约编号
    onSearchContractNum: PropTypes.func.isRequired,
    // 查询合约详情
    onSearchContractDetail: PropTypes.func.isRequired,
    // 合约编号列表
    contractNumList: PropTypes.array.isRequired,
    // 合约详情
    contractDetail: PropTypes.object,
    // 条款名称列表
    clauseNameList: PropTypes.array.isRequired,
    // 合作部门列表
    searchCooperDeparment: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
    approverList: PropTypes.array,
    // 审批人
    getFlowStepInfo: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
  }

  static defaultProps = {
    contractDetail: EMPTY_OBJECT,
    approverList: EMPTY_ARRAY,
    // 审批人
    flowStepInfo: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        formType: 'add',
        uuid: '',
        terms: [],
      },
      // 是否显示添加合约条款组件
      showAddClauseModal: false,
      // 操作类型
      operationType: subscribe,
      // 选择审批人弹窗
      choiceApprover: false,

      // 选择审批人弹窗
      appravalInfo: {
        appraval: '',
        approverName: '',
        approverId: '',
      },
    };
  }

  componentDidMount() {
    const { onSearchCutList } = this.props;
    onSearchCutList();
  }

  // 更新数据到父组件
  @autobind
  handleChangeBaseInfo(data) {
    const { formData } = this.state;
    this.setState({
      ...this.state,
      operationType: data.workflowname,
      formData: Object.assign(formData, data),
    }, () => {
      this.props.onChangeForm(this.state.formData);
    });
  }

  // 根据关键词查询客户
  @autobind
  handleSearchClient(value) {
    const { onSearchCutList } = this.props;
    onSearchCutList(value);
  }

  // 查询合约编号列表
  @autobind
  handleSearchContractNum(data) {
    if (data.subType && data.client.cusId) {
      this.props.onSearchContractNum(data);
    }
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    this.props.onSearchContractDetail(data);
  }

  // 文件上传成功
  @autobind
  handleUploadSuccess(attachment) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        uuid: attachment,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
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
      divIntegrationId: clauseData.divName.value, // 合作部门code
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

  // 子组件更改操作类型/重新关闭打开弹窗 重置所有数据
  @autobind
  handleReset() {
    const formData = {
      formType: 'add',
      terms: [],
    };
    this.setState({
      ...this.state,
      formData,
    }, () => {
      if (this.BaseInfoAddComponent) {
        this.BaseInfoAddComponent.resetState();
      }
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
      contractNumList,
      clauseNameList,
      cooperDeparment,
      searchCooperDeparment,
      getFlowStepInfo,
      flowStepInfo,
    } = this.props;
    const {
      formData,
      showAddClauseModal,
      operationType,
      choiceApprover,
      appravalInfo: { approverName, approverId },
    } = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: this.handleShowAddClause,
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
    const termsData = (operationType === subscribe) ? formData.terms : contractDetail.terms || [];

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
        <BaseInfoAdd
          contractName="合约名称"
          childType={{ list: EMPTY_ARRAY }}
          client={EMPTY_OBJECT}
          custList={custList}
          contractDetail={contractDetail}
          contractNumList={contractNumList}
          onChange={this.handleChangeBaseInfo}
          onSearchClient={this.handleSearchClient}
          onSearchContractNum={this.handleSearchContractNum}
          onSearchContractDetail={this.handleSearchContractDetail}
          onReset={this.handleReset}
          getFlowStepInfo={getFlowStepInfo}
          ref={(BaseInfoAddComponent) => { this.BaseInfoAddComponent = BaseInfoAddComponent; }}
        />
        <div className={styles.editWrapper}>
          <InfoTitle
            head="合约条款"
            isRequired
          />
          {
            operationType === subscribe ?
              <Button {...buttonProps}>新建</Button>
            :
            null
          }
          <CommonTable
            data={termsData}
            titleList={titleList}
            operation={operation}
          />
        </div>
        {/* <UploadFile
          edit={BOOL_TRUE}
          fileList={EMPTY_ARRAY}
          attachment={formData.uuid}
          uploadAttachment={this.handleUploadSuccess}
        /> */}
        <InfoTitle head="附件" />
        <CommonUpload
          attachmentList={EMPTY_ARRAY}
          edit={BOOL_TRUE}
          uploadAttachment={this.handleUploadSuccess}
          attachment={formData.uuid}
          needDefaultText={false}
        />
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
