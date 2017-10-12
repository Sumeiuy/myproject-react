/*
* @Description: 合作合约新建 页面
* @Author: XuWenKang
* @Date:   2017-09-21 15:17:50
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-10-11 16:11:55
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoAdd from './BaseInfoAdd';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import Button from '../common/Button';
import AddClause from './AddClause';

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
  }

  static defaultProps = {
    contractDetail: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        formType: 'add',
        attachment: '',
        terms: [],
      },
      // 是否显示添加合约条款组件
      showAddClauseModal: false,
      // 操作类型
      operationType: subscribe,
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
      operationType: data.operation,
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
    console.log('SearchContractNum', data);
    if (data.childType && data.client.cusId) {
      this.props.onSearchContractNum(data);
    }
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    console.log('SearchContractDetail', data);
    this.props.onSearchContractDetail(data);
  }

  // 文件上传成功
  @autobind
  handleUploadSuccess(attachment) {
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        attachment,
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

  // 子组件更改操作类型 重置所有数据
  @autobind
  handleReset() {
    this.setState({
      ...this.state,
      formData: {
        formType: 'add',
        attachment: '',
        terms: [],
      },
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
    } = this.props;
    const { formData, showAddClauseModal, operationType } = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: this.handleShowAddClause,
    };
    const termsData = (operationType === subscribe) ? formData.terms : contractDetail.terms;
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
        />
        <div className={styles.editWrapper}>
          <InfoTitle head="合约条款" />
          {
            operationType === subscribe ?
              <Button {...buttonProps}>新建</Button>
            :
            null
          }
          <CommonTable
            data={termsData}
            titleList={titleList}
          />
        </div>
        <UploadFile
          edit={BOOL_TRUE}
          fileList={EMPTY_ARRAY}
          attachment={formData.attachment}
          uploadAttachment={this.handleUploadSuccess}
        />
        <div className={styles.cutSpace} />
        <AddClause
          isShow={showAddClauseModal}
          onConfirm={this.handleAddClause}
          onCloseModal={this.handleCloseModal}
          clauseNameList={clauseNameList}
          departmentList={cooperDeparment}
          searchDepartment={searchCooperDeparment}
        />
      </div>
    );
  }

}
