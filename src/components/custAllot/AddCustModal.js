/**
 * @Description: 添加客户弹窗
 * @Author: Liujianshu
 * @Date: 2018-05-24 10:13:17
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-06-08 21:30:53
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { SingleFilter, MultiFilter, RangeFilter } from 'lego-react-filter/src';
import { TreeFilter as HTTreeFilter } from 'lego-tree-filter/src';
import _ from 'lodash';
import { message } from 'antd';


import CommonModal from '../common/biz/CommonModal';
// import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import commonConfirm from '../common/confirm_';
import Icon from '../common/Icon';
import logable from '../../decorators/logable';
import { emp } from '../../helper';
import config from './config';
import styles from './addCustModal.less';

// 表头
const { titleList: { cust: custTitleList }, clearDataArray } = config;
// 登陆人的组织ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041093';
const NO_VALUE = '不限';
const INIT_PAGENUM = 1;
const INIT_PAGESIZE = 10;
// 所有条数限制为 2000
const LIMIT_ALLCOUNT = 2000;
// 勾选条数限制为 500
const LIMIT_COUNT = 500;
// 状态
const KEY_STATUS = 'status';
// 是否入岗投顾
const KEY_ISTOUGU = 'touGu';
// 添加客户报错信息
const errorMsg = {
  count: '一次勾选的客户数超过500条，请分多次添加。',
  allCount: '申请单客户列表客户数超过最大数量2000条。',
};
export default class AddCustModal extends PureComponent {
  static propTypes = {
    // 已添加的客户数据
    addedCustData: PropTypes.object.isRequired,
    // 获取客户数据
    data: PropTypes.object.isRequired,
    queryList: PropTypes.func.isRequired,
    // 关闭弹窗
    closeModal: PropTypes.func.isRequired,
    // 弹窗状态
    visible: PropTypes.bool.isRequired,
    // 弹窗 KEY
    modalKey: PropTypes.string.isRequired,
    // 机构树
    custRangeList: PropTypes.array.isRequired,
    updateData: PropTypes.object.isRequired,
    sendRequest: PropTypes.func.isRequired,
  }

  static contextTypes = {
    dict: PropTypes.object,
  }

  constructor(props) {
    super(props);
    const { addedCustData: { page = {} } } = this.props;
    this.state = {
      // 已有条数
      alreadyCount: page.totalRecordNum || 0,
      // 展开状态
      isExpand: false,
      // 状态
      status: [],
      // 营业部
      orgIdKeyWord: '',
      // 净资产
      naRange: [],
      // 年日均净资产
      naaRange: [],
      // 上年净佣金
      nclyRange: [],
      // 本年净佣金
      ncRange: [],
      pageNum: INIT_PAGENUM,
      // 客户关键字
      custKeyword: '',
      // 服务经理关键字
      smKeyword: '',
      // 开发经理关键字
      dmKeyword: '',
      // 选中的客户
      selectedRowKeys: [],
      selectedRows: [],
    };
  }


  componentDidMount() {
    // 获取客户
    this.searchCustList();
  }

  // 选择客户
  @autobind
  onSelectChange(record, selected) {
    const { selectedRowKeys, selectedRows } = this.state;
    // 选中的 key 值数组
    let newSelectedRowKeys = [...selectedRowKeys];
    // 选中的 row 数组
    let newSelectedRows = [...selectedRows];
    if (selected) {
      newSelectedRowKeys.push(record.custId);
      newSelectedRows.push(record);
      if (this.checkCountIsBigThanLimit(newSelectedRows.length)) {
        message.error(errorMsg.allCount);
        return;
      }
      if (newSelectedRows.length > LIMIT_COUNT) {
        message.error(errorMsg.count);
        return;
      }
    } else {
      newSelectedRowKeys = _.filter(newSelectedRowKeys, o => o !== record.custId);
      newSelectedRows = _.filter(newSelectedRows, o => o.custId !== record.custId);
    }
    this.setState({
      selectedRows: newSelectedRows,
      selectedRowKeys: newSelectedRowKeys,
    });
  }

  // 生成客户头部列表
  @autobind
  getColumnsCustTitle() {
    const statusList = _.get(this.context, 'dict.accountStatusList') || [];
    const newTitleList = [...custTitleList];
    const statusIndex = _.findIndex(newTitleList, o => o.key === KEY_STATUS);
    // 是否是投顾
    const isTouguIndex = _.findIndex(newTitleList, o => o.key === KEY_ISTOUGU);
    newTitleList[statusIndex].render = (text) => {
      const statusItem = _.filter(statusList, o => o.key === text);
      const statusText = statusItem.length ? statusItem[0].value : '';
      return (<div title={statusText}>{statusText}</div>);
    };
    newTitleList[isTouguIndex].render = (text, record) => {
      const isTouGu = text ? '是' : '否';
      return (<div>
        {
          record.oldEmpName ?
            isTouGu
          :
            null
        }
      </div>);
    };
    return newTitleList;
  }

  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭分公司客户划转添加客户弹框' } })
  closeModal() {
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 查询客户列表
  @autobind
  searchCustList() {
    const { queryList } = this.props;
    const {
      custKeyword,
      status,
      orgIdKeyWord,
      smKeyword,
      dmKeyword,
      pageNum,
      naRange: [nARangeStart = '', nARangeEnd = ''],
      naaRange: [nAARangeStart = '', nAARangeEnd = ''],
      ncRange: [nCRangeStart = '', nCRangeEnd = ''],
      nclyRange: [nCLYRangeStart = '', nCLYRangeEnd = ''],
    } = this.state;
    // 如果状态数组有数据，且第一个数据为空，则置为空数组
    const newStatus = (status.length && _.isEmpty(status[0])) ? [] : [...status];
    const payload = {
      orgId: empOrgId,
      custKeyword,
      status: newStatus,
      orgIdKeyWord,
      smKeyword,
      dmKeyword,
      nARangeStart,
      nARangeEnd,
      nAARangeStart,
      nAARangeEnd,
      nCLYRangeStart,
      nCLYRangeEnd,
      nCRangeStart,
      nCRangeEnd,
      pageSize: INIT_PAGESIZE,
      pageNum,
    };
    queryList(payload);
  }

  @autobind
  findContainer() {
    return this.filterWrap;
  }

  // 更改客户
  @autobind
  handleCustChange(value) {
    this.setState({
      custKeyword: value,
      pageNum: INIT_PAGENUM,
    }, this.searchCustList);
  }

  // 状态选中
  @autobind
  handleMultiFilterChange(obj) {
    this.setState({
      status: obj.value,
      pageNum: INIT_PAGENUM,
    }, this.searchCustList);
  }

  // 变更所属营业部
  @autobind
  handleTreeSelectChange(value) {
    this.setState({
      orgIdKeyWord: value,
      pageNum: INIT_PAGENUM,
    }, this.searchCustList);
  }

  // 更改服务经理
  @autobind
  handleSMChange(value) {
    this.setState({
      smKeyword: value,
      pageNum: INIT_PAGENUM,
    }, this.searchCustList);
  }

  // 更改开发经理
  @autobind
  handleDMChange(value) {
    this.setState({
      dmKeyword: value,
    }, this.searchCustList);
  }

  // 净资产区间
  @autobind
  handleRangeFilterChange(obj) {
    this.setState({
      [obj.id]: obj.value,
      pageNum: INIT_PAGENUM,
    }, this.searchCustList);
  }

  // 切换展开状态
  @autobind
  handleToggleExpand() {
    const { isExpand } = this.state;
    this.setState({
      isExpand: !isExpand,
    });
  }

  // 翻页
  @autobind
  handlePageChange(pageNum) {
    this.setState({
      pageNum,
    }, this.searchCustList);
  }


  // 全选事件
  @autobind
  handleSelectAll(selected, selectedAllRows, changeRows) {
    const { selectedRowKeys, selectedRows } = this.state;
    const changeRowKeys = _.map(changeRows, 'custId');
    let newSelectedRows = [...selectedRows];
    let newSelectedRowKeys = [...selectedRowKeys];
    if (selected) {
      newSelectedRows.push(...changeRows);
      newSelectedRowKeys.push(...changeRowKeys);
      if (this.checkCountIsBigThanLimit(newSelectedRows.length)) {
        message.error(errorMsg.allCount);
        return;
      }
      if (newSelectedRows.length > LIMIT_COUNT) {
        message.error(errorMsg.count);
        return;
      }
    } else {
      // TODO: 测试
      newSelectedRows = _.filter(newSelectedRows, (o) => {
        if (!_.includes(changeRowKeys, o.custId)) {
          return o;
        }
        return null;
      });
      newSelectedRowKeys = _.without(newSelectedRowKeys, ...changeRowKeys);
    }
    this.setState({
      selectedRows: newSelectedRows,
      selectedRowKeys: newSelectedRowKeys,
    });
  }

  // 检查添加的客户条数是否超过限制的条数（本方法为两千条）
  @autobind
  checkCountIsBigThanLimit(length, limit = LIMIT_ALLCOUNT) {
    let flag = false;
    const { alreadyCount } = this.state;
    if (alreadyCount + length > limit) {
      flag = true;
    }
    return flag;
  }


  // 发送添加客户请求
  @autobind
  sendRequest() {
    const { sendRequest, modalKey, updateData } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length <= 0) {
      message.error('请至少选择一位客户');
      return;
    }
    const custList = selectedRows.map(item => ({
      brokerNumber: item.custId,
    }));
    const payload = {
      customer: custList,
      manage: [],
      type: 'add',
      attachment: '',
      id: updateData.appId || '',
    };
    // 是否需要确认关闭
    const isNeedConfirm = false;
    const pageData = {
      modalKey,
      isNeedConfirm,
    };
    // 发送添加请求，关闭弹窗
    sendRequest(payload, pageData);
  }

  render() {
    const {
      visible,
      closeModal,
      modalKey,
      custRangeList,
      data: { list = [], page = {} },
    } = this.props;

    const filterCustRange = _.filter(custRangeList, o => o.id === empOrgId);
    let treeCustRange = [];
    if (filterCustRange && filterCustRange.length && filterCustRange[0].children.length) {
      treeCustRange = filterCustRange[0].children.map(item => ({
        label: item.name,
        value: item.id,
        key: item.id,
      }));
    }
    treeCustRange = [
      {
        label: '不限',
        value: '',
        key: 0,
      },
      ...treeCustRange,
    ];


    const statusList = _.get(this.context, 'dict.accountStatusList') || [];
    const decoratedStatusList = statusList.map(item =>
      ({ key: item.key || '', value: item.value }));

    const {
      isExpand,
      status,
      orgIdKeyWord,
      naRange,
      naaRange,
      nclyRange,
      ncRange,
      custKeyword,
      smKeyword,
      dmKeyword,
      selectedRowKeys,
    } = this.state;

    // 客户列表分页
    const paginationOption = {
      current: page.curPageNum || 1,
      total: page.totalRecordNum || 0,
      pageSize: page.pageSize || INIT_PAGESIZE,
      onChange: this.handlePageChange,
      isHideLastButton: true,
    };

    // 关闭弹窗
    const closePayload = {
      modalKey,
      isNeedConfirm: true,
      clearDataType: clearDataArray[0],
    };
    const rowSelection = {
      selectedRowKeys,
      hideDefaultSelections: true,
      columnWidth: 40,
      onSelect: this.onSelectChange,
      onSelectAll: this.handleSelectAll,
      onSelectInvert: this.handleSelectAll,
    };
    const newTitleList = this.getColumnsCustTitle();

    return (
      <CommonModal
        title="添加客户"
        visible={visible}
        closeModal={() => closeModal(closePayload)}
        size="large"
        modalKey="addCustModal"
        afterClose={this.afterClose}
        wrapClassName={styles.addCustModal}
        onOk={this.sendRequest}
      >
        <div className={styles.modalContent}>
          <div className={styles.contentItem}>
            <div className={styles.operateDiv} ref={filterWrap => this.filterWrap = filterWrap}>
              <SingleFilter
                className={styles.searchFilter}
                filterName={'客户'}
                showSearch
                placeholder={'请输入经纪客户号、姓名'}
                data={[]}
                defaultSelectLabel={custKeyword || NO_VALUE}
                value={custKeyword}
                onInputChange={_.debounce(this.handleCustChange, 500)}
              />
              <MultiFilter
                className={styles.firstLineFilter}
                filterName={'状态'}
                data={decoratedStatusList}
                value={status}
                onChange={_.debounce(this.handleMultiFilterChange, 500)}
              />
              <HTTreeFilter
                className={styles.firstLineFilter}
                value={orgIdKeyWord}
                treeData={treeCustRange}
                filterName={'原服务营业部'}
                treeDefaultExpandAll
                onChange={this.handleTreeSelectChange}
                getPopupContainer={this.findContainer}
                dropdownClassName={styles.dropdownClassName}
              />
              <SingleFilter
                className={styles.searchFilter}
                filterName={'服务经理'}
                showSearch
                placeholder={'请输入服务经理工号、姓名'}
                data={[]}
                defaultSelectLabel={smKeyword || NO_VALUE}
                value={smKeyword}
                onInputChange={_.debounce(this.handleSMChange, 500)}
              />
              <SingleFilter
                className={styles.searchFilter}
                filterName={'开发经理'}
                showSearch
                placeholder={'请输入开发经理工号、姓名'}
                data={[]}
                defaultSelectLabel={dmKeyword || NO_VALUE}
                value={dmKeyword}
                onInputChange={_.debounce(this.handleDMChange, 500)}
              />
              <div className={styles.expandDiv}>
                {
                  isExpand
                  ?
                    <a onClick={this.handleToggleExpand}>
                      <span>收起</span>
                      <Icon type="xiangshang" />
                    </a>
                  :
                    <a onClick={this.handleToggleExpand}>
                      <span>更多</span>
                      <Icon type="xiangxia" />
                    </a>
                }
              </div>
              {
                isExpand
                ?
                  <div className={styles.rangeDiv}>
                    <RangeFilter
                      filterId={'naRange'}
                      filterName={'净资产区间'}
                      defaultLabel={'不限'}
                      value={naRange}
                      unit={'元'}
                      onChange={this.handleRangeFilterChange}
                    />
                    <RangeFilter
                      filterId={'naaRange'}
                      filterName={'年日均净资产区间'}
                      defaultLabel={'不限'}
                      value={naaRange}
                      unit={'元'}
                      onChange={this.handleRangeFilterChange}
                    />
                    <RangeFilter
                      filterId={'nclyRange'}
                      filterName={'上年净佣金区间'}
                      defaultLabel={'不限'}
                      value={nclyRange}
                      unit={'元'}
                      onChange={this.handleRangeFilterChange}
                    />
                    <RangeFilter
                      filterId={'ncRange'}
                      filterName={'本年净佣金区间'}
                      defaultLabel={'不限'}
                      value={ncRange}
                      unit={'元'}
                      onChange={this.handleRangeFilterChange}
                    />
                  </div>
                :
                  null
              }
            </div>
            <div className={styles.tableDiv}>
              <CommonTable
                data={list}
                titleList={newTitleList}
                align={'left'}
                rowKey={'custId'}
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
