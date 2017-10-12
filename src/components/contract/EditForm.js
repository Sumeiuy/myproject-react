/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-11 16:48:44
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
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
// 合约条款的表头
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
    approverList: PropTypes.array,
  }

  static defaultProps = {
    approverList: [],
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
      choiceApprover: false,
      approverName: '',
      approverId: '',
    };
  }

  componentDidMount() {
    const { onSearchCutList } = this.props;
    onSearchCutList();
  }

  // 不需要
  // componentWillReceiveProps(nextProps) {
  //   const newTerms = nextProps.contractDetail.terms;
  //   this.setState({
  //     ...this.state,
  //     formData: {
  //       ...this.state.formData,
  //       terms: newTerms,
  //     },
  //   });
  // }

  // 审批意见
  @autobind
  handleChangeAppraval(type, value) {
    console.log(type, value);
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
    console.warn('上传成功', attachment);
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
    console.log('添加合约条款', clauseData, terms);
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
    console.warn('approver', approver);
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
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
      contractDetail: { baseInfo },
      approverList,
    } = this.props;
    const {
      formData,
      showAddClauseModal,
      choiceApprover,
      approverName,
      approverId,
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
    const newApproverList = approverList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });
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
        <DraftInfo data={draftInfo} />
        <div className={styles.editWrapper}>
          <InfoTitle head="合约条款" />
          <Button {...buttonProps}>新建</Button>
          <CommonTable
            data={formData.terms}
            titleList={titleList}
          />
        </div>
        <UploadFile
          edit={BOOL_TRUE}
          fileList={contractDetail.attachmentList}
          attachment={contractDetail.baseInfo.uuid}
          uploadAttachment={this.handleUploadSuccess}
        />
        <Approval
          type="appraval"
          head="审批"
          textValue=""
          onEmitEvent={this.handleChangeAppraval}
        />
        <div className={styles.editWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={contractDetail.flowHistory} />
        </div>
        <div className={styles.editWrapper}>
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
