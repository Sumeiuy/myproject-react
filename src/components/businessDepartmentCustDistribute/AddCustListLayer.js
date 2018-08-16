/**
 * @Author: sunweibin
 * @Date: 2018-05-11 13:45:12
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-08-16 17:57:42
 * @description 用户选择添加客户列表
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';
import cx from 'classnames';

import CommonModal from '../common/biz/CommonModal';
import DropdownSelect from '../common/dropdownSelect';
import Select from '../common/Select';
import Icon from '../common/Icon';
import Region from '../common/region';
import { custTableColumns } from './config';
import { createAddLayerCustTableDate } from './utils';

import styles from './addCustListLayer.less';

export default class AddCustListLayer extends Component {

  static propTypes = {
    devEmpListByQuery: PropTypes.array,
    custListByQuery: PropTypes.array,
    empListByQuery: PropTypes.array,
    data: PropTypes.object,
    visible: PropTypes.bool,
    onOK: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onFilterCust: PropTypes.func.isRequired,
    onQuery: PropTypes.func.isRequired,
  }

  static defaultProps = {
    visible: false,
    data: {},
    devEmpListByQuery: [],
    custListByQuery: [],
    empListByQuery: [],
  }

  static contextTypes = {
    dict: PropTypes.object,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // 如果用户选择了全选，那么需要将下一页的数据也禁用掉，并且 checked
    const custList = _.get(nextProps.data, 'custList') || [];
    const { disabledAll } = prevState;
    if (disabledAll) {
      return {
        selectedRowKeys: custList.map(item => item.brokerNumber),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // 用户选择的客户列表数据
      custList: [],
      // 用户选中的客户
      selectedRowKeys: [],
      // 筛选条件-客户
      cust: {},
      // 筛选条件-服务经理
      emp: {},
      // 筛选条件-开发经理
      devEmp: {},
      // 筛选的状态条件
      status: ['all'],
      // 筛选条件-净资产
      asset: [],
      // 筛选条件-年日均净资产
      dailyAsset: [],
      // 筛选条件-本年净佣金
      brokerage: [],
      // 筛选条件-上年净佣金
      lastBrokerage: [],
      // 控制筛选条件第二行显示与隐藏
      showSecondLineFilter: false,
      // 用来判断用户选择了全选后，禁用所有的checkbox
      disabledAll: false,
    };
  }

  componentDidMount() {
    // 初始化的时候需要查询一把无筛选条的所有客户
    this.props.onFilterCust({ pageNum: 1, pageSize: 10 });
  }

  // 获取所有的筛选条件
  @autobind
  getFilterQuery() {
    const filterQuery = _.pick(
      this.state,
      ['status', 'asset', 'dailyAsset', 'brokerage', 'lastBrokerage'],
    );
    // 客户|服务经理|开发经理的query
    const {
      cust: { custNumber = '' },
      emp: { empId = '' },
      devEmp: { empId: devEmpId = '' },
    } = this.state;
    const ids = { custId: custNumber, empId, devEmpId };
    return {
      ...ids,
      ...filterQuery,
    };
  }

  @autobind
  filterCustList(pageQuery = {}) {
    const filterQuery = this.getFilterQuery();
    this.props.onFilterCust({
      pageNum: 1,
      pageSize: 10,
      ...pageQuery,
      ...filterQuery,
    });
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
  handlePaginationChange(pageNum) {
    this.filterCustList({ pageNum });
  }

  @autobind
  handleExpandClick() {
    const { showSecondLineFilter } = this.state;
    this.setState({ showSecondLineFilter: !showSecondLineFilter });
  }

  @autobind
  handleSelectChange(selectedRowKeys = []) {
    // 可能需要进行数据转化，将选中的数据的完整信息给保存下来
    const { data } = this.props;
    const custListData = _.get(data, 'custList') || [];
    const custList = selectedRowKeys.map(item =>
      _.find(custListData, cust => cust.brokerNumber === item));
    this.setState({ selectedRowKeys, custList });
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleModalOK() {
    // 因为存在全选，以及用户自己手动勾选
    // 全选是将所有的条件传递过去获取所有的数据再传递过去
    // 用户手动勾选选择勾选的
    const { custList, disabledAll } = this.state;
    const filterQuery = this.getFilterQuery();
    // 全选需要将条件传递出去，让页面查询一把，然后添加进页面Table
    this.props.onOK(custList, disabledAll, filterQuery);
  }

  // 筛选条件中的客户搜索
  @autobind
  handleCustSearch(keywords) {
    this.props.onQuery({ api: 'cust', query: { keywords } });
  }

  // 筛选条件中的服务经理搜索
  @autobind
  handleEmpSearch(keywords) {
    this.props.onQuery({ api: 'emp', query: { keywords } });
  }

  // 筛选条件中的开发经理搜索
  @autobind
  handleDevEmpSearch(keywords) {
    this.props.onQuery({ api: 'devEmp', query: { keywords } });
  }

  @autobind
  handleSelectCustItem(cust) {
    this.setState({ cust }, this.filterCustList);
  }

  @autobind
  handleSelectEmpItem(emp) {
    this.setState({ emp }, this.filterCustList);
  }

  @autobind
  handleSelectDevEmpItem(devEmp) {
    this.setState({ devEmp }, this.filterCustList);
  }

  @autobind
  handleStatusChange(key, v) {
    // 此处默认值是 all : 不限，
    // 当用户选择了其他的状态值时，需要将 不限 剔除
    // 如果用户将所有其他的清除，那么需要将 不限 显示出来
    let status = [...v];
    if (_.isEmpty(v)) {
      status = ['all'];
    } else {
      // remove 方法会改变原有数组
      _.remove(status, code => code === 'all');
    }
    this.setState({ status }, this.filterCustList);
  }

  @autobind
  handleAssetRegionChange(asset) {
    this.setState({ asset }, this.filterCustList);
  }

  @autobind
  handleDailyAssetRegionChange(dailyAsset) {
    this.setState({ dailyAsset }, this.filterCustList);
  }

  @autobind
  handleBrokerageRegionChange(brokerage) {
    this.setState({ brokerage }, this.filterCustList);
  }

  @autobind
  handleLastBrokerageRegionChange(lastBrokerage) {
    this.setState({ lastBrokerage }, this.filterCustList);
  }

  render() {
    const { visible, data } = this.props;
    if (!visible) { return null; }

    const statusList = _.get(this.context, 'dict.accountStatusList') || [];
    // 因为Select组件的key值不能为空，所以必须将 不限的选项的key设置为'all'
    const decoratedStatusList = statusList.map(item =>
      ({ value: item.key || 'all', label: item.value, show: true }));

    const {
      selectedRowKeys,
      showSecondLineFilter,
      status,
      asset,
      dailyAsset,
      brokerage,
      lastBrokerage,
      cust,
      emp,
      devEmp,
      disabledAll,
    } = this.state;
    const {
      devEmpListByQuery,
      custListByQuery,
      empListByQuery,
    } = this.props;
    // 转换数据
    const newCustList = createAddLayerCustTableDate(_.get(data, 'custList'));
    const pageObject = _.get(data, 'page') || {};
    // 如果数据无空的情况下，不需要一下的rowSelection
    const selectedAllText = !disabledAll ? '全选' : '取消全选';
    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectChange,
      hideDefaultSelections: true,
      selections: [{
        key: 'all-data',
        text: selectedAllText,
        onSelect: () => {
          if (!disabledAll) {
            // 选中的个数不等于总数，此时显示的是全选，点击全部选中
            // 全选之后，按照目前的需求需要将所有的勾选禁用
            this.setState({
              disabledAll: true,
              selectedRowKeys: newCustList.map(item => item.key),
            });
          } else {
            // 若选中的个数等于总数，此时显示的是取消全选，点击则全不选
            this.setState({
              disabledAll: false,
              selectedRowKeys: [],
            });
          }
        },
      }],
      getCheckboxProps() {
        // 此属性用来设置 checkbox 的 disabled 属性
        return {
          disabled: disabledAll,
        };
      },
    };

    // 过滤条件的第二行的 class 类
    const filterSecondLineCls = cx({
      [styles.filterLine]: true,
      [styles.hideLine]: !showSecondLineFilter,
    });

    // 给搜索的客户列表添加所有
    const newCustListByQuery = [{ custName: '所有', custNumber: '' }, ...custListByQuery];
    const newEmpListByQuery = [{ empName: '所有', empId: '' }, ...empListByQuery];
    const newDevEmpListByQuery = [{ empName: '所有', empId: '' }, ...devEmpListByQuery];
    // 修饰下筛选选择的条件
    const selectedCust = _.isEmpty(cust) ? '所有' : `${cust.custName}(${cust.custNumber})`;
    const selectedEmp = _.isEmpty(emp) ? '所有' : `${emp.empName}(${emp.empId})`;
    const selectedDevEmp = _.isEmpty(devEmp) ? '所有' : `${emp.empName}(${emp.empId})`;

    return (
      <CommonModal
        title="添加客户"
        modalKey="addDistributeCustListModal"
        needBtn
        maskClosable={false}
        size="large"
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
                <span className={styles.filterLabel}>客户：</span>
                <DropdownSelect
                  value={selectedCust}
                  placeholder="经纪客户号/客户名称"
                  searchList={newCustListByQuery}
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
                <DropdownSelect
                  value={selectedEmp}
                  placeholder="服务经理工号/名称"
                  searchList={newEmpListByQuery}
                  showObjKey="empName"
                  objId="empId"
                  emitSelectItem={this.handleSelectEmpItem}
                  emitToSearch={this.handleEmpSearch}
                  name="addCustListLayer-emp"
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>开发经理：</span>
                <DropdownSelect
                  value={selectedDevEmp}
                  placeholder="开发经理工号/名称"
                  searchList={newDevEmpListByQuery}
                  showObjKey="empName"
                  objId="empId"
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
            <div className={filterSecondLineCls} >
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>净资产：</span>
                <Region
                  value={asset}
                  onChange={this.handleAssetRegionChange}
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>年日均净资产：</span>
                <Region
                  value={dailyAsset}
                  onChange={this.handleDailyAssetRegionChange}
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>上年净佣金：</span>
                <Region
                  value={lastBrokerage}
                  onChange={this.handleLastBrokerageRegionChange}
                />
              </div>
              <div className={styles.filterItem}>
                <span className={styles.filterLabel}>本年净佣金：</span>
                <Region
                  value={brokerage}
                  onChange={this.handleBrokerageRegionChange}
                />
              </div>
            </div>
          </div>
          <Table
            className={styles.addLayerTable}
            rowSelection={rowSelection}
            columns={custTableColumns}
            dataSource={newCustList}
            pagination={{
              total: pageObject.totalCount,
              showTotal: this.showTotal,
              onChange: this.handlePaginationChange,
            }}
          />
        </div>
      </CommonModal>
    );
  }
}
