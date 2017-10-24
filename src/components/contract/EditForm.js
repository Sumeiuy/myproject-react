/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
* @Last Modified by: LiuJianShu
* @Last Modified time: 2017-10-24 09:24:54
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import ApproveList from '../common/approveList';
import Approval from '../permission/Approval';
import Button from '../common/Button';
import AddClause from './AddClause';

import { seibelConfig } from '../../config';
import styles from './editForm.less';

// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
const BOOL_TRUE = true;
// 合约条款的表头、状态
const { contract: { titleList } } = seibelConfig;
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
      addClauseModal: false,
      // 审批意见
      appraval: '',
      // 合约条款默认数据
      defaultData: {},
      // 是否是编辑
      editClause: false,
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
      ...this.state,
      formData: {
        ...this.state.formData,
        [type]: value,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
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

  // 合约条款弹窗提交事件
  @autobind
  handleAddClause(termData) {
    const { formData: { terms } } = this.state;
    const { edit, editIndex, termItem } = termData;
    const newTerms = terms;
    if (edit) {
      newTerms[editIndex] = termItem;
    } else {
      newTerms.push(termItem);
    }
    this.setState({
      ...this.state,
      formData: {
        ...this.state.formData,
        terms: newTerms,
      },
    }, () => {
      this.props.onChangeForm(this.state.formData);
      this.closeModal('addClauseModal');
    });
  }
  // 表格编辑事件
  @autobind
  editTableData(record, index) {
    // 更新数据，打开合约条款弹窗
    this.setState({
      editClause: true,
      defaultData: {
        data: record,
        index,
      },
    }, this.showModal('addClauseModal'));
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
  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }
  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
      defaultData: {},
      editClause: false,
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
    } = this.props;
    const {
      formData,
      addClauseModal,
      defaultData,
      editClause,
    } = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: () => this.showModal('addClauseModal'),
    };
    const draftInfo = {
      name: baseInfo.createdName,
      date: baseInfo.createTime,
      status: baseInfo.status,
    };
    // 表格中需要的操作
    const operation = {
      column: {
        // beizhu = edit , shanchu = delete
        key: [
          {
            key: 'beizhu',
            operate: this.editTableData,
          },
          {
            key: 'shanchu',
            operate: this.deleteTableData,
          },
        ], // 'check'\'delete'\'view'
        title: '操作',
      },
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
          textValue={formData.appraval}
          onEmitEvent={this.handleChangeAppraval}
        />
        <div className={styles.editWrapper}>
          <InfoTitle head="审批记录" />
          <ApproveList data={contractDetail.flowHistory} />
        </div>
        <div className={styles.cutSpace} />
        {
          addClauseModal ?
            <AddClause
              isShow={addClauseModal}
              onConfirm={this.handleAddClause}
              onCloseModal={() => this.closeModal('addClauseModal')}
              edit={editClause}
              clauseNameList={clauseNameList}
              departmentList={cooperDeparment}
              searchDepartment={searchCooperDeparment}
              defaultData={defaultData}
            />
          :
            null
        }
      </div>
    );
  }

}
