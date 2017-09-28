/*
* @Description: 合作合约新建 页面
* @Author: XuWenKang
* @Date:   2017-09-21 15:17:50
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-27 18:07:16
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoAdd from './BaseInfoAdd';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';

import styles from './addForm.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const BOOL_TRUE = true;
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
    const { custList, contractDetail, contractNumList } = this.props;
    const { formData } = this.state;
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
        <div className={styles.cutSpace} />
      </div>
    );
  }

}
