/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-27 09:59:29
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';
import UploadFile from './UploadFile';
import Approval from '../permission/Approval';
import ApprovalRecord from '../permission/ApprovalRecord';

import styles from './editForm.less';

// const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const BOOL_TRUE = true;
const approvalRecordList = [{
  isOk: true,
  beginTime: 'abc于2017/08/31',
  stepName: '发起',
  suggestion: 'adad',
}];
export default class EditForm extends PureComponent {
  static propTypes = {
    custList: PropTypes.array.isRequired,
    onSearchCutList: PropTypes.func.isRequired,
    onChangeForm: PropTypes.func.isRequired,
    operationType: PropTypes.string.isRequired,
    contractDetail: PropTypes.object.isRequired,
  }

  static defaultProps = {

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
  handleChangeAppraval(type, value) {
    console.log(type, value);
  }

  @autobind
  handleChangeBaseInfo(data) {
    // console.log('baseInfoData', formData);
    const formData = data;
    formData.formType = 'edit';
    this.props.onChangeForm(formData);
  }

  @autobind
  handleSearchClient(value) {
    const { onSearchCutList } = this.props;
    onSearchCutList(value);
  }

  render() {
    const { custList, contractDetail, operationType } = this.props;
    return (
      <div className={styles.editComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{111}</span>
        </div>
        <BaseInfoEdit
          contractName="合约名称"
          childType={contractDetail.subType}
          client={contractDetail.custId}
          custList={custList}
          contractStarDate={contractDetail.startDt}
          contractPalidity={contractDetail.vailDt}
          contractEndDate={contractDetail.endDt}
          remark={contractDetail.description}
          onChange={this.handleChangeBaseInfo}
          onSearchClient={this.handleSearchClient}
          operationType={operationType}
        />
        <DraftInfo />
        <UploadFile
          edit={BOOL_TRUE}
          fileList={EMPTY_ARRAY}
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
      </div>
    );
  }

}
