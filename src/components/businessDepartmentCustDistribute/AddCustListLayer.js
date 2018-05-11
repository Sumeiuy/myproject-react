/**
 * @Author: sunweibin
 * @Date: 2018-05-11 13:45:12
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-11 17:45:22
 * @description 用户选择添加客户列表
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import DropdowSelect from '../common/dropdownSelect';
import Select from '../common/Select';
import Icon from '../common/Icon';
import { custTableColumns } from './config';
import { createAddLayerCustTableDate } from './utils';

import styles from './addCustListLayer.less';

export default class AddCustListLayer extends Component {

  static contextTypes = {
    dict: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 用户选择的客户列表数据
      custList: [],
      // 用户选中的客户
      selectedRowKeys: [],
      // 筛选的状态条件
      status: ['all'],
      // 控制筛选条件第二行显示与隐藏
      showSecondLineFilter: false,
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
  handleExpandClick() {
    const { showSecondLineFilter } = this.state;
    this.setState({ showSecondLineFilter: !showSecondLineFilter });
  }

  @autobind
  handleSelectChange(selectedRowKeys) {
    // TODO 此处可能需要进行数据转化，将选中的数据的完整信息给保存下来
    this.setState({ selectedRowKeys });
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleModalOK() {
    const { custList } = this.state;
    this.props.onOK(custList);
  }

  // 筛选条件中的客户搜索
  @autobind
  handleCustSearch(keywords) {
    console.warn('handleCustSearch: ', keywords);
  }

  // 筛选条件中的服务经理搜索
  @autobind
  handleEmpSearch(keywords) {
    console.warn('handleEmpSearch: ', keywords);
  }

  // 筛选条件中的开发经理搜索
  @autobind
  handleDevEmpSearch(keywords) {
    console.warn('handleDevEmpSearch: ', keywords);
  }

  @autobind
  handleSelectCustItem(item) {
    // TODO 需要添加客户筛选的过滤条件进行过滤，客户过滤
    console.warn('handleSelectCustItem： ', item);
  }

  @autobind
  handleSelectEmpItem(item) {
    // TODO 需要添加客户筛选的过滤条件进行过滤，服务经理过滤
    console.warn('handleSelectEmpItem ', item);
  }

  @autobind
  handleSelectDevEmpItem(item) {
    // TODO 需要添加客户筛选的过滤条件进行过滤，开发经理过滤
    console.warn('handleSelectDevEmpItem ', item);
  }

  @autobind
  handleStatusChange(key, v) {
    // TODO 需要添加客户筛选的过滤条件进行过滤，状态过滤
    this.setState({ status: v });
  }

  render() {
    const { visible, data } = this.props;
    if (!visible) { return null; }

    const statusList = _.get(this.context, 'dict.accountStatusList') || [];
    // 因为Select组件的key值不能为空，所以必须将 不限的选项的key设置为'all'
    const decoratedStatusList = statusList.map(item =>
      ({ value: item.key || 'all', label: item.value, show: true }));

    const {
      selectedRowKeys, showSecondLineFilter,
      status,
    } = this.state;
    // 转换数据
    const newCustList = createAddLayerCustTableDate(_.get(data, 'custList'));
    const pageObject = _.get(data, 'page') || {};
    // 如果数据无空的情况下，不需要一下的rowSelection
    const selectedRowKeysSize = _.size(selectedRowKeys);
    const rowSelection = !pageObject.total ? {}
      : {
        selectedRowKeys,
        onChange: this.handleSelectChange,
        hideDefaultSelections: true,
        selections: [{
          key: 'all-data',
          text: pageObject.total !== selectedRowKeysSize ? '全选' : '取消全选',
          onSelect: () => {
            if (pageObject.total !== selectedRowKeysSize) {
              // 选中的个数不等于总数，此时显示的是全选，点击全部选中
              this.setState({
                selectedRowKeys: newCustList.map(item => item.key),
              });
            } else {
              // 若选中的个数等于总数，此时显示的是取消全选，点击则全不选
              this.setState({
                selectedRowKeys: [],
              });
            }
          },
        }],
      };

    return (
      <CommonModal
        title="添加客户"
        modalKey="addDistributeCustListModal"
        needBtn
        maskClosable={false}
        size="large"
        visible={visible}
        closeModal={this.handleModalClose}
        okText="提交"
        onOk={this.handleModalOK}
        onCancel={this.handleModalClose}
      >
        <div className={styles.filterContainer}>
          <div className={styles.filterArea}>
            <div className={styles.filterLine}>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>客户：</span>
                <DropdowSelect
                  value="孙伟斌（1111111）"
                  placeholder="经纪客户号/客户名称"
                  searchList={[]}
                  showObjKey="custName"
                  objId="custNumber"
                  emitSelectItem={this.handleSelectCustItem}
                  emitToSearch={this.handleCustSearch}
                  name="addCustListLayer-cust"
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>状态：</span>
                <Select
                  mode="multiple"
                  name="status"
                  value={status}
                  data={decoratedStatusList}
                  onChange={this.handleStatusChange}
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>服务经理：</span>
                <DropdowSelect
                  value="洪光情（11111111）"
                  placeholder="服务经理工号/名称"
                  searchList={[]}
                  showObjKey="empName"
                  objId="empId"
                  emitSelectItem={this.handleSelectEmpItem}
                  emitToSearch={this.handleEmpSearch}
                  name="addCustListLayer-emp"
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>开发经理：</span>
                <DropdowSelect
                  value="刘建树（222222）"
                  placeholder="开发经理工号/名称"
                  searchList={[]}
                  showObjKey="devEmpName"
                  objId="devEmpId"
                  emitSelectItem={this.handleSelectDevEmpItem}
                  emitToSearch={this.handleDevEmpSearch}
                  name="addCustListLayer-devEmp"
                />
              </div>
              <div className={styles.filterItem} onClick={this.handleExpandClick}>
                <span className={styles.expandText}>
                  {showSecondLineFilter ? '收起' : '展开' }
                  <Icon type={showSecondLineFilter ? 'shouqi2' : 'zhankai1'} />
                </span>
              </div>
            </div>
            <div className={styles.filterLine} />
          </div>
          <Table
            rowSelection={rowSelection}
            columns={custTableColumns}
            dataSource={newCustList}
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

AddCustListLayer.propTypes = {
  data: PropTypes.array,
  visible: PropTypes.bool,
  onOK: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterCust: PropTypes.func.isRequired,
};

AddCustListLayer.defaultProps = {
  visible: false,
  data: [],
};
