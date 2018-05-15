/**
 * @Author: sunweibin
 * @Date: 2018-05-14 16:23:14
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-15 17:43:25
 * @description 添加服务经理弹出层
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table, Input } from 'antd';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';

import { empAddTableColumns } from './config';

import styles from './addCustListLayer.less';

const Search = Input.Search;

export default class AddEmpListLayer extends Component {

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.data !== prevState.empList) {
      return {
        empList: nextProps.data || [],
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const empList = props.data || [];
    this.state = {
      // 供用户选择的服务经理列表数据
      empList,
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
    const { data = [] } = this.props;
    const { selectedRowKeys } = this.state;
    if (!_.isEmpty(selectedRowKeys)) {
      const empList = selectedRowKeys.map(key => _.find(data, item => item.empId === key));
      this.props.onOK(empList);
    }
    this.handleModalClose();
  }

  // 选择相关的服务经理
  @autobind
  handleSelectChange(selectedRowKeys) {
    // TODO 目前此处由前端进行分页因此，
    // 等到按确认按钮后再讲相关的值转化为服务经理数据
    this.setState({ selectedRowKeys });
  }

  @autobind
  handleFilterEmpList(value) {
    // 根据 value 匹配服务经理的工号或者姓名来筛选服务经理列表
    // 使用props中的原始数据,来进行过滤
    const { data } = this.props;
    const empList = _.filter(
      data,
      item => _.startsWith(item.empId, value) || _.includes(item.empName, value),
    );
    this.setState({ empList });
  }

  @autobind
  handleFilterEmpListChange(e) {
    // 此处判断如果 value 为空，则将 empList 展示全部数据
    const value = e.target.value;
    if (_.isEmpty(value)) {
      const { data } = this.props;
      this.setState({ empList: data });
    }
  }

  render() {
    const { visible } = this.props;
    if (!visible) { return null; }

    const { selectedRowKeys, empList } = this.state;
    // const newEmpList = _.get(data, 'empList') || [];
    // 获取分页器数据
    // const pageObject = _.get(data, 'page') || {};
    const total = _.size(empList);

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
                <Search
                  placeholder="服务经理工号/姓名"
                  onSearch={this.handleFilterEmpList}
                  onChange={this.handleFilterEmpListChange}
                  enterButton
                />
              </div>
            </div>
          </div>
          <Table
            className={styles.addEmpListLayerTable}
            rowKey="empId"
            rowSelection={rowSelection}
            columns={empAddTableColumns}
            dataSource={empList}
            pagination={{
              total,
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
  onClose: PropTypes.func.isRequired,
  onOK: PropTypes.func.isRequired,
};

AddEmpListLayer.defaultProps = {
  visible: false,
  data: [],
};
