/**
 * @Author: sunweibin
 * @Date: 2018-08-07 18:23:46
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-16 10:11:08
 * @desc 通用的选择审批人弹框
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
import _ from 'lodash';

import CommonTable from '../biz/CommonTable';
import CommonModal from '../biz/CommonModal';
import logable from '../../../decorators/logable';
import {
  APPROVER_TABLE_COLUMNS,
  SERACH_INPUT_STYLE,
  APPROVER_TABLE_SCROLL,
} from './config';

import styles from './index.less';

const Search = Input.Search;

export default class CommonApprovalModal extends PureComponent {
  static propTypes = {
    rowKey: PropTypes.string.isRequired,
    modalKey: PropTypes.string.isRequired,
    title: PropTypes.string,
    visible: PropTypes.bool.isRequired,
    approverList: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    searchable: PropTypes.bool,
    pagination: PropTypes.object,
  }

  static defaultProps = {
    title: '选择审批人员',
    approverList: [],
    searchable: true,
    pagination: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      approverRadio: '',
      listAfterFilter: props.approverList,
    };
  }

  @autobind
  isCheckedRadio(record) {
    const { approverRadio } = this.state;
    return record.empNo === approverRadio;
  }

  @autobind
  closeApprovalModal() {
    this.setState({ approverRadio: '' });
    this.props.onClose(this.props.modalKey);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '关闭' } })
  handleModalClose() {
    this.closeApprovalModal();
  }

  @autobind
  handleModalOK() {
    const { approverRadio, listAfterFilter } = this.state;
    const approver = _.find(listAfterFilter, item => item.empNo === approverRadio);
    this.props.onOk(approver);
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '取消' } })
  handleModalCancel() {
    this.closeApprovalModal();
  }

  // 点击Radio
  @autobind
  @logable({ type: 'ViewItem', payload: { name: '选择处理人员' } })
  handleApproverRadioClick(record) {
    this.setState({ approverRadio: record.empNo });
  }

  // 过滤审批人员列表
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '关键字搜索处理人员',
      value: '$args[0]',
    },
  })
  handleApprovalSearch(v) {
    const list = this.props.approverList;
    const listAfterFilter = _.filter(list, (user) => {
      const { empNo, empName } = user;
      if (empNo.indexOf(v) > -1 || empName.indexOf(v) > -1) {
        return true;
      }
      return false;
    });
    this.setState({
      approverRadio: '',
      listAfterFilter,
    });
  }

  render() {
    const { visible, pagination, searchable, title, modalKey, rowKey } = this.props;
    const { listAfterFilter } = this.state;
    // 表格中需要的操作
    const operation = {
      column: {
        key: 'radio', // 'check'\'delete'\'view'
        title: '',
        radio: this.isCheckedRadio,
        width: 60,
      },
      operate: this.handleApproverRadioClick,
      operateKey: 'empNo',
    };
    return (
      <CommonModal
        title={title}
        modalKey={modalKey}
        needBtn
        maskClosable={false}
        size="normal"
        visible={visible}
        closeModal={this.handleModalClose}
        onOk={this.handleModalOK}
        onCancel={this.handleModalCancel}
      >
        <div className={styles.approverBox}>
          {
            !searchable ? null
            : (
              <div className={styles.serarhApprover}>
                <Search
                  enterButton
                  size="large"
                  placeholder="员工号/员工姓名"
                  style={SERACH_INPUT_STYLE}
                  onSearch={this.handleApprovalSearch}
                />
              </div>
            )
          }
          <div className={styles.approverListBox}>
            <CommonTable
              rowKey={rowKey}
              pagination={pagination}
              data={listAfterFilter}
              titleList={APPROVER_TABLE_COLUMNS}
              operation={operation}
              scroll={APPROVER_TABLE_SCROLL}
              size="middle"
              align="left"
            />
          </div>
        </div>
      </CommonModal>
    );
  }
}
