/*
* @Description: 合作合约新建 页面
* @Author: XuWenKang
* @Date:   2017-09-21 15:17:50
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-27 09:57:39
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoAdd from './BaseInfoAdd';
import UploadFile from './UploadFile';

import styles from './addForm.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const BOOL_TRUE = true;
export default class AddForm extends PureComponent {
  static propTypes = {
    custList: PropTypes.array.isRequired,
    onSearchCutList: PropTypes.func.isRequired,
    onChangeForm: PropTypes.func.isRequired,
    onSearchContractNum: PropTypes.func.isRequired,
    onSearchContractDetail: PropTypes.func.isRequired,
    contractNumList: PropTypes.array.isRequired,
    contractDetail: PropTypes.object,
  }

  static defaultProps = {
    contractDetail: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    const { onSearchCutList } = this.props;
    onSearchCutList();
  }

  @autobind
  handleChangeBaseInfo(data) {
    // console.log('baseInfoData', formData);
    const formData = data;
    formData.formType = 'add';
    this.props.onChangeForm(formData);
  }

  @autobind
  handleSearchClient(value) {
    const { onSearchCutList } = this.props;
    onSearchCutList(value);
  }

  @autobind
  handleSearchContractNum(data) {
    console.log('SearchContractNum', data);
    if (data.childType && data.client.cusId) {
      this.props.onSearchContractNum(data);
    }
  }

  @autobind
  handleSearchContractDetail(data) {
    console.log('SearchContractDetail', data);
    this.props.onSearchContractDetail(data);
  }

  render() {
    const { custList, contractDetail, contractNumList } = this.props;
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
        />
        <UploadFile
          edit={BOOL_TRUE}
          fileList={EMPTY_ARRAY}
        />
        <div className={styles.cutSpace} />
      </div>
    );
  }

}
