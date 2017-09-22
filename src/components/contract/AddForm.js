/*
* @Description: 合作合约新建 页面
* @Author: XuWenKang
* @Date:   2017-09-21 15:17:50
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-22 14:28:47
*/
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import { message } from 'antd';

import BaseInfoAdd from './BaseInfoAdd';
import UploadFile from '../permission/UploadFile';

import styles from './addForm.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
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
  handleChangeBaseInfo(formData) {
    console.log('baseInfoData', formData);
  }

  render() {
    return (
      <div className={styles.editComponent}>
        <BaseInfoAdd
          contractName="合约名称"
          childType={{ list: EMPTY_ARRAY }}
          client={EMPTY_OBJECT}
          contractStarDate="2017-9-10"
          contractPalidity="2017-9-9"
          contractEndDate="2017-8-8"
          remark="备注备注"
          onChange={this.handleChangeBaseInfo}
        />
        <UploadFile
          fileList={EMPTY_ARRAY}
        />
        <div className={styles.cutSpace} />
      </div>
    );
  }

}
