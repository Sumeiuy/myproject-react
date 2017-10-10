/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-10-09 16:10:21
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import Approval from '../permission/Approval';
import ApprovalRecord from '../permission/ApprovalRecord';
import Button from '../common/Button';
import AddClause from './AddClause';

import styles from './editForm.less';

// const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const BOOL_TRUE = true;
const clauseNameList = [
  {
    label: '条款名称1',
    value: '1',
    show: true,
    valueList: [
      {
        label: '明细1',
        value: '1',
        show: true,
      },
      {
        label: '明细2',
        value: '2',
        show: true,
      },
    ],
  },
  {
    label: '条款名称2',
    value: '2',
    show: true,
    valueList: [
      {
        label: '明细1',
        value: '1',
        show: true,
      },
      {
        label: '明细2',
        value: '2',
        show: true,
      },
    ],
  },
];
const titleList = [
  {
    dataIndex: 'termsName',
    key: 'termsName',
    title: '条款名称',
  },
  {
    dataIndex: 'paraName',
    key: 'paraName',
    title: '明细参数',
  },
  {
    dataIndex: 'paraVal',
    key: 'paraVal',
    title: '值',
  },
  {
    dataIndex: 'divName',
    key: 'divName',
    title: '合作部门',
  },
];
// 临时数据 待删
const approvalRecordList = [{
  isOk: true,
  handler: '张三',
  handleTime: '2017/08/31',
  stepName: '流程发起',
  comment: 'asdasdadasd',
}];
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
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        formType: 'edit',
        attachment: '',
        terms: [],
      },
      // 是否显示添加合约条款组件
      showAddClauseModal: false,
    };
  }

  componentDidMount() {
    const { onSearchCutList } = this.props;
    onSearchCutList();
  }

  componentWillReceiveProps(nextProps) {
    const newTerms = nextProps.contractDetail.terms;
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        terms: newTerms,
      },
    });
  }

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
    console.log('添加合约条款', clauseData);
    this.handleCloseModal();
  }

  // 根据关键词搜索合作部门
  @autobind
  handleSearchDepartment(keyword) {
    console.log(keyword);
  }


  render() {
    const { custList, contractDetail, operationType } = this.props;
    const { formData, showAddClauseModal } = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: this.handleShowAddClause,
    };
    return (
      <div className={styles.editComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{111}</span>
        </div>
        <BaseInfoEdit
          contractName="合约名称"
          custList={custList}
          contractDetail={contractDetail}
          onChange={this.handleChangeBaseInfo}
          onSearchClient={this.handleSearchClient}
          operationType={operationType}
        />
        <DraftInfo />
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
          fileList={EMPTY_ARRAY}
          attachment={formData.attachment}
          uploadAttachment={this.handleUploadSuccess}
        />
        <Approval
          type="appraval"
          head="审批"
          textValue=""
          onEmitEvent={this.handleChangeAppraval}
        />
        <ApprovalRecord
          head="审批记录"
          info={approvalRecordList}
          statusType=""
        />
        <div className={styles.cutSpace} />
        <AddClause
          isShow={showAddClauseModal}
          onConfirm={this.handleAddClause}
          onCloseModal={this.handleCloseModal}
          clauseNameList={clauseNameList}
          departmentList={EMPTY_ARRAY}
          searchDepartment={this.handleSearchDepartment}
        />
      </div>
    );
  }

}
