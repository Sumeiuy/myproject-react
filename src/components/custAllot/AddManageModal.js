/**
 * @Description: 添加服务经理弹窗
 * @Author: Liujianshu
 * @Date: 2018-05-24 10:13:17
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-05-25 13:52:17
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import { SingleFilter } from 'ht-react-filter';
import { TreeFilter as HTTreeFilter } from 'ht-tree-filter';
import 'ht-react-filter/lib/css/index.css';

import CommonModal from '../common/biz/CommonModal';
// import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
// import { emp } from '../../helper';
import config from './config';
import styles from './addManageModal.less';

// 表头
const { titleList: { manage }, positionTypeArray } = config;
// 登陆人的组织ID
const empOrgId = 'ZZ001041093';
// const orgId = emp.getOrgId();

const KEY_POSITIONTYPE = 'positionType';

export default class AddManageModal extends PureComponent {
  static propTypes = {
    custRangeList: PropTypes.array.isRequired,
    // 获取客户数据
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    modalKey: PropTypes.string.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    // 添加后发送请求
    sendRequest: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      positionType: positionTypeArray[0].key,
      orgId: 0,
      selectedRowKeys: '',
      selectedArray: [],
    };
  }

  componentDidMount() {
    // 获取客户
    this.props.queryList({});
  }

  // 选择服务经理
  @autobind
  onSelectChange(selectedRowKeys, selectedRows) {
    const { data: { list } } = this.props;
    console.warn('list', list);
    const selectedArray = selectedRows.map(item => ({
      smId: item.empId,
      smPositionId: item.empPositionId,
    }));
    this.setState({
      selectedRowKeys,
      selectedArray,
    });
  }

  @autobind
  handleFilterChange(obj) {
    const { value } = obj;
    this.setState({
      positionType: value,
    });
  }

  @autobind
  handleTreeSelectChange(value) {
    this.setState({
      orgId: value,
    });
  }

  // 搜索服务经理
  @autobind
  handleSearchManage(value) {
    console.warn('handleSearchManage value', value);
  }

  @autobind
  findContainer() {
    return this.modalContent;
  }

  @autobind
  sendRequest() {
    const { sendRequest, closeModal, modalKey } = this.props;
    const { selectedArray } = this.state;
    if (selectedArray.length <= 0) {
      message.error('请至少选择一位服务经理');
      return;
    }
    const payload = {
      manage: selectedArray,
      type: 'add',
    };
    // 是否需要确认关闭
    const noNeedConfirm = false;
    // 发送添加请求，关闭弹窗
    // TODO:发送请求服务经理接口
    sendRequest(payload).then(() => closeModal(modalKey, noNeedConfirm));
  }

  render() {
    const {
      data,
      visible,
      custRangeList,
      closeModal,
      modalKey,
    } = this.props;
    const { positionType, orgId, selectedRowKeys } = this.state;
    const { list } = data;
    // 客户列表分页
    const paginationOption = {
      current: 1,
      total: 10,
      pageSize: 10,
      // current: page.curPageNum || 1,
      // total: page.totalRecordNum || 10,
      // pageSize: page.pageSize || 10,
      onChange: this.handlePageChange,
    };

    const filterCustRange = _.filter(custRangeList, o => o.id === empOrgId);
    let treeCustRange = [];
    if (filterCustRange.length && filterCustRange[0].children.length) {
      treeCustRange = filterCustRange[0].children.map(item => ({
        label: item.name,
        value: item.id,
        key: item.value,
      }));
    }
    treeCustRange = [
      {
        label: '不限',
        value: 0,
        key: 0,
      },
      ...treeCustRange,
    ];


    const newTitleList = [...manage];
    const newEmpIndex = _.findIndex(newTitleList, o => o.key === KEY_POSITIONTYPE);
    newTitleList[newEmpIndex].render = text => (<div>{positionTypeArray[text].value}</div>);

    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      columnWidth: 40,
      onChange: this.onSelectChange,
    };

    return (
      <CommonModal
        title="添加服务经理"
        visible={visible}
        closeModal={() => closeModal(modalKey)}
        size="normal"
        modalKey={modalKey}
        afterClose={this.afterClose}
        wrapClassName={styles.addManageModal}
        onOk={this.sendRequest}
      >
        <div className={styles.modalContent} ref={modalContent => this.modalContent = modalContent}>
          <div className={styles.contentItem}>
            <div className={styles.operateDiv}>
              <HTTreeFilter
                value={''}
                treeData={[]}
                filterName={'服务经理'}
                showSearch
                searchPlaceholder={'请输入服务经理工号、姓名'}
                allowClear={false}
                onSearch={this.handleSearchManage}
                getPopupContainer={this.findContainer}
                dropdownClassName={styles.dropdownClassName}
              />
              <HTTreeFilter
                value={orgId}
                treeData={treeCustRange}
                filterName={'所属营业部'}
                treeDefaultExpandAll
                onChange={this.handleTreeSelectChange}
                getPopupContainer={this.findContainer}
                dropdownClassName={styles.dropdownClassName}
              />
              <SingleFilter
                filterName={'职位类型'}
                data={positionTypeArray}
                value={positionType}
                onChange={this.handleFilterChange}
              />
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                data={list}
                titleList={newTitleList}
                align={'left'}
                rowSelection={rowSelection}
              />
              <Pagination {...paginationOption} />
            </div>
          </div>
        </div>
      </CommonModal>
    );
  }
}
