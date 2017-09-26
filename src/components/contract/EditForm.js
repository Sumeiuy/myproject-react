/*
* @Description: 合作合约修改 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-22 14:29:12
*/
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';
import UploadFile from '../permission/UploadFile';
import Approval from '../permission/Approval';
import ApprovalRecord from '../permission/ApprovalRecord';

import styles from './editForm.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
const approvalRecordList = [{
  isOk: true,
  beginTime: 'abc于2017/08/31',
  stepName: '发起',
  suggestion: 'adad',
}];
export default class Edit extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  @autobind
  handleChangeAppraval(type, value) {
    console.log(type, value);
  }

  @autobind
  handleChangeBaseInfo(formData) {
    console.log('baseInfoData', formData);
  }

  render() {
    return (
      <div className={styles.editComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{111}</span>
        </div>
        <BaseInfoEdit
          contractName="合约名称"
          childType={{ list: EMPTY_ARRAY }}
          client={EMPTY_OBJECT}
          contractStarDate="2017-9-10"
          contractPalidity="2017-9-9"
          contractEndDate=""
          remark="备注备注"
          onChange={this.handleChangeBaseInfo}
        />
        <DraftInfo />
        <UploadFile
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
