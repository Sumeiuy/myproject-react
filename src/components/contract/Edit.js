/*
* @Description: 合作合约修改/新建 页面
* @Author: XuWenKang
* @Date:   2017-09-19 14:47:08
* @Last Modified by:   XuWenKang
* @Last Modified time: 2017-09-20 17:25:11
*/
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';

import BaseInfoEdit from './BaseInfoEdit';
import DraftInfo from './DraftInfo';

import styles from './edit.less';

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
  onSubmit() {
    message.error('adawd');
  }

  @autobind
  changeBaseInfo(formData) {
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
          childType={{ list: [] }}
          client={{}}
          contractStarDate="2017-9-10"
          contractPalidity="2017-9-9"
          contractEndDate="2017-8-8"
          remark="备注备注"
          onChange={this.changeBaseInfo}
        />
        <DraftInfo />
      </div>
    );
  }

}
