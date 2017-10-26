/*eslint-disable */
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

import EditBaseInfo from './EditBaseInfo';
import DraftInfo from './DraftInfo';
import UploadFile from './UploadFile';
import InfoTitle from '../common/InfoTitle';
import CommonTable from '../common/biz/CommonTable';
import ApproveList from '../common/approveList';
import Approval from '../permission/Approval';
import Button from '../common/Button';
import AddClause from './AddClause';

import { seibelConfig } from '../../config';
import { dateFormat } from '../../utils/helper';
import styles from './editForm.less';

// const EMPTY_OBJECT = {};
// const EMPTY_ARRAY = [];
const EMPTY_PARAM = '暂无';
const BOOL_TRUE = true;
// 合约条款的表头、状态
const { contract: { titleList } } = seibelConfig;
export default class EditForm extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {

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
    // const { } = this.props;
    const {} = this.state;
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: () => this.showModal('addClauseModal'),
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
        <EditBaseInfo />
        <div className={styles.editWrapper}>
          <InfoTitle
            head="协议产品"
            isRequired
          />
        </div>

      </div>
    );
  }

}
/*eslint-disable */