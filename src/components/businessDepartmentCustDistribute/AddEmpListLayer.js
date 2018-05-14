/**
 * @Author: sunweibin
 * @Date: 2018-05-14 16:23:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-14 16:59:22
 * @description 添加服务经理弹出层
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import DropdowSelect from '../common/dropdownSelect';

import { empAddTableColumns } from './config';

import styles from './addCustListLayer.less';

export default class AddEmpListLayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // 用户选择的服务经理列表数据
      empList: [],
      // 用户选中的服务经理的key集合
      selectedRowKeys: [],
    };
  }

  // 分页显示总条数和选中总条数
  @autobind
  showTotal(total) {
    const { selectedRowKeys } = this.state;
    // 选中个数
    const selectedRowKeysSize = _.size(selectedRowKeys);
    return (
      <span>已选中<span className={styles.selectedNum}>{selectedRowKeysSize}</span>{`条 /共${total} 条`}</span>
    );
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleModalOK() {
    const { empList } = this.state;
    this.props.onOK(empList);
    this.handleModalClose();
  }

  @autobind
  handleSelectChange(selectedRowKeys) {
    // TODO 此处可能需要进行数据转化，将选中的数据的完整信息给保存下来
    this.setState({ selectedRowKeys });
  }

  // 筛选条件中的服务经理搜索
  @autobind
  handleEmpSearch(keywords) {
    console.warn('handleEmpSearch: ', keywords);
  }

  @autobind
  handleSelectEmpItem(item) {
    console.warn('handleSelectEmpItem ', item);
  }

  render() {
    const { visible, data } = this.props;
    if (!visible) { return null; }

    const { selectedRowKeys } = this.state;
    const newEmpList = _.get(data, 'custList') || [];
    // 获取分页器数据
    const pageObject = _.get(data, 'page') || {};

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
      hideDefaultSelections: true,
    };

    return (
      <CommonModal
        title="添加服务经理"
        modalKey="addDistributeEmpListModal"
        needBtn
        maskClosable={false}
        visible={visible}
        closeModal={this.handleModalClose}
        okText="确认"
        onOk={this.handleModalOK}
        onCancel={this.handleModalClose}
      >
        <div className={styles.filterContainer}>
          <div className={styles.filterArea}>
            <div className={styles.filterLine}>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>服务经理：</span>
                <DropdowSelect
                  value="孙伟斌（1111111）"
                  placeholder="经纪客户号/客户名称"
                  searchList={[]}
                  showObjKey="empName"
                  objId="empId"
                  emitSelectItem={this.handleSelectEmpItem}
                  emitToSearch={this.handleEmpSearch}
                  name="addEmpListLayer-emp"
                />
              </div>
            </div>
          </div>
          <Table
            rowSelection={rowSelection}
            columns={empAddTableColumns}
            dataSource={newEmpList}
            pagination={{
              total: pageObject.total,
              showTotal: this.showTotal,
            }}
          />
        </div>
      </CommonModal>
    );
  }
}

AddEmpListLayer.propTypes = {
  data: PropTypes.array,
  visible: PropTypes.bool,
  onOK: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterEmp: PropTypes.func.isRequired,
};

AddEmpListLayer.defaultProps = {
  visible: false,
  data: [],
};
