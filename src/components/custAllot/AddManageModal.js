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
import 'ht-tree-filter/lib/css/index.css';

import CommonModal from '../common/biz/CommonModal';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import { emp } from '../../helper';
import config from './config';
import styles from './addManageModal.less';

// 表头
const { titleList: { manage }, positionTypeArray } = config;
// 登陆人的组织ID
const empOrgId = emp.getOrgId();
// 服务经理
const KEY_EMPNAME = 'empName';
const NO_VALUE = '不限';

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
    updateData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      smKeyword: '',
      positionType: positionTypeArray[0].key,
      orgId: '',
      selectedRowKeys: '',
      allSelected: {
        page1: {
          row: [],
          rowKeys: [],
        },
      },
      pageNum: 1,
    };
  }

  componentDidMount() {
    // 查询服务经理
    this.searchManageList({});
  }

  // 选择服务经理
  @autobind
  onSelectChange(selectedRowKeys, selectedRows) {
    const selectedArrayRow = selectedRows.map(item => ({
      empId: item.empId,
      positionId: item.positionId,
    }));
    const { allSelected, pageNum } = this.state;
    const page = `page${pageNum}`;
    const newAllSelected = { ...allSelected };
    newAllSelected[page] = {};
    newAllSelected[page].rowKeys = selectedRowKeys;
    newAllSelected[page].row = selectedArrayRow;
    this.setState({
      allSelected: newAllSelected,
      selectedRowKeys,
    });
  }

  // 生成服务经理头部列表
  @autobind
  getColumnsManageTitle() {
    const newTitleList = [...manage];
    const empNameIndex = _.findIndex(newTitleList, o => o.key === KEY_EMPNAME);
    newTitleList[empNameIndex].render = (text, record) => (
      <div>{text} ({record.empId})</div>
    );
    return newTitleList;
  }

  // 输入服务经理事件
  @autobind
  handleEmpChange(value) {
    this.setState({
      smKeyword: value,
    }, this.searchManageList);
  }

  // 切换职位类型
  @autobind
  handleFilterChange(obj) {
    const { value } = obj;
    this.setState({
      positionType: value,
    }, this.searchManageList);
  }

  // 变更所属营业部
  @autobind
  handleTreeSelectChange(value) {
    this.setState({
      orgId: value,
    }, this.searchManageList);
  }

  // 翻页
  @autobind
  handlePageChange(pageNum) {
    this.setState({
      pageNum,
    }, this.searchManageList);
  }

  @autobind
  findContainer() {
    return this.modalContent;
  }

  // 查询服务经理列表
  @autobind
  searchManageList(obj = {}) {
    const { queryList } = this.props;
    const { smKeyword, orgId, positionType, pageNum } = this.state;
    const payload = {
      smKeyword,
      orgId: empOrgId,
      orgIdKeyWord: orgId,
      positionType,
      pageNum,
      pageSize: 10,
      ...obj,
    };
    queryList(payload);
  }

  // 发送添加服务经理请求
  @autobind
  sendRequest() {
    const { sendRequest, modalKey, updateData } = this.props;
    const { allSelected } = this.state;
    const selectedArray = [];
    _.forIn(allSelected, (value) => {
      selectedArray.push(...value.row);
    });

    if (selectedArray.length <= 0) {
      message.error('请至少选择一位服务经理');
      return;
    }
    const payload = {
      customer: [],
      manage: selectedArray,
      type: 'add',
      attachment: '',
      id: updateData.appId || '',
    };
    // 是否需要确认关闭
    const isNeedConfirm = false;
    const pageData = {
      modalKey,
      type: 'manage',
      isNeedConfirm,
    };
    // 发送添加请求，关闭弹窗
    sendRequest(payload, pageData);
  }

  render() {
    const {
      data: { list = [], page = {} },
      visible,
      custRangeList,
      closeModal,
      modalKey,
    } = this.props;
    const { smKeyword, positionType, orgId, allSelected, pageNum } = this.state;
    // 客户列表分页
    const paginationOption = {
      current: page.curPageNum || 1,
      total: page.totalRecordNum || 10,
      pageSize: page.pageSize || 10,
      onChange: this.handlePageChange,
    };

    const filterCustRange = _.filter(custRangeList, o => o.id === empOrgId);
    let treeCustRange = [];
    if (filterCustRange.length && filterCustRange[0].children.length) {
      treeCustRange = filterCustRange[0].children.map(item => ({
        label: item.name,
        value: item.id,
        key: item.id,
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

    const manageTitleList = this.getColumnsManageTitle();


    const pageNumSelect = allSelected[`page${pageNum}`];
    const rowSelection = {
      selectedRowKeys: _.isEmpty(pageNumSelect) ? [] : pageNumSelect.rowKeys,
      hideDefaultSelections: true,
      columnWidth: 40,
      onChange: this.onSelectChange,
    };

    // 关闭弹窗
    const closePayload = {
      modalKey,
      isNeedConfirm: true,
      clearDataType: 'clearSearchData',
    };

    return (
      <CommonModal
        title="添加服务经理"
        visible={visible}
        closeModal={() => closeModal(closePayload)}
        size="normal"
        modalKey={modalKey}
        afterClose={this.afterClose}
        wrapClassName={styles.addManageModal}
        onOk={this.sendRequest}
      >
        <div className={styles.modalContent} ref={modalContent => this.modalContent = modalContent}>
          <div className={styles.contentItem}>
            <div className={styles.operateDiv}>
              <SingleFilter
                className={styles.firstFilter}
                filterName={'服务经理'}
                showSearch
                placeholder={'请输入服务经理工号、姓名'}
                isCloseable={false}
                data={[]}
                defaultSelectLabel={_.isEmpty(smKeyword) ? NO_VALUE : smKeyword}
                value={smKeyword}
                onInputChange={_.debounce(this.handleEmpChange, 500)}
              />
              <HTTreeFilter
                value={_.isEmpty(orgId) ? 0 : orgId}
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
                data={list || []}
                titleList={manageTitleList}
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
