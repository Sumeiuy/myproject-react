/**
 * @file src/components/commissionAdjustment/ChoiceApproverBoard.js
 * @description 佣金调整选择审批人员弹出层
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
// import _ from 'lodash';

import CommonTable from '../common/biz/CommonTable';
import CommonModal from '../common/biz/CommonModal';
import styles from './choiceApproverBoard.less';

const Search = Input.Search;

export default class ChoiceApproverBoard extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    approverList: PropTypes.array,
    onClose: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    onSearchApprover: PropTypes.func.isRequired,
  }

  static defaultProps = {
    approverList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      approverRadio: 0,
    };
  }

  @autobind
  onCloseModal() {
    this.props.onClose();
  }

  // 点击确认
  @autobind
  onOk() {
    const { approverRadio } = this.state;
    this.props.onOk(this.props.approverList[approverRadio]);
    this.onCloseModal();
  }

  @autobind
  onCancel() {
    this.setState({
      approverRadio: 0,
    });
    this.onCloseModal();
  }

  // 点击Radio
  @autobind
  handleApproverRadio(record, index) {
    this.setState({
      approverRadio: index,
    });
  }

  render() {
    const { visible, onSearchApprover, approverList } = this.props;
    const { approverRadio } = this.state;
    // 表头
    const tableHeader = [
      {
        dataIndex: 'empId',
        key: 'empId',
        title: '工号',
      },
      {
        dataIndex: 'empName',
        key: 'empName',
        title: '姓名',
      },
      {
        dataIndex: 'org',
        key: 'org',
        title: '所属营业部',
      },
    ];

    // 表格中需要的操作
    const operation = {
      column: {
        key: 'radio', // 'check'\'delete'\'view'
        title: '',
        radio: approverRadio,
      },
      operate: this.handleApproverRadio,
    };

    return (
      <CommonModal
        title="选择审批人员"
        modalKey="choiceApprover"
        needBtn
        maskClosable={false}
        size="normal"
        visible={visible}
        closeModal={this.onCloseModal}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        <div className={styles.approverBox}>
          <div className={styles.serarhApprover}>
            <Search
              size="large"
              placeholder="员工号/员工姓名"
              style={{
                width: '300px',
              }}
              onSearch={onSearchApprover}
            />
          </div>
          <div className={styles.approverListBox}>
            <CommonTable
              data={approverList}
              titleList={tableHeader}
              operation={operation}
              scroll={{ y: 294 }}
            />
          </div>
        </div>
      </CommonModal>
    );
  }
}
