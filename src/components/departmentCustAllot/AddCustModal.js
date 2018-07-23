/**
 * @Description: 添加客户弹窗
 * @Author: Liujianshu
 * @Date: 2018-05-24 10:13:17
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-07-20 15:01:30
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { SingleFilter, MultiFilter, RangeFilter } from 'lego-react-filter/src';
import _ from 'lodash';
import { message } from 'antd';

import CommonModal from '../common/biz/CommonModal';
import Pagination from '../../components/common/Pagination';
import CommonTable from '../../components/common/biz/CommonTable';
import Icon from '../common/Icon';
import { emp } from '../../helper';
import config from './config';
import styles from './addCustModal.less';

// 表头
const { titleList: { cust: custTitleList }, clearDataArray, allotType } = config;
// 登陆人的组织ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041051';
const NO_VALUE = '不限';
const INIT_PAGENUM = 1;
const INIT_PAGESIZE = 10;
// 所有条数限制为 2000
const LIMIT_ALL_COUNT = 2000;
// 勾选条数限制为 500
const LIMIT_COUNT = 500;
// 状态
const KEY_STATUS = 'status';
// 是否入岗投顾
const KEY_ISTOUGU = 'touGu';
// 添加客户报错信息
const ERROR_MESSAGE_ALL_COUNT = `添加失败，申请单客户列表客户数超过最大数量${LIMIT_ALL_COUNT}条。`;
const ERROR_MESSAGE_COUNT = `添加失败，一次勾选的客户数超过${LIMIT_COUNT}条，请分多次添加。`;
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
      totalAsset: [],
      // 年日均净资产
      annualDailyAsset: [],
      // 上年净佣金
      lastYearAsset: [],
      // 本年净佣金
      annualAsset: [],
      pageNum: INIT_PAGENUM,
      // 服务经理关键字
      smKeyword: '',
      // 介绍人关键字
      dmKeyword: '',
      // 选中的客户
      selectedRows: [],
    };
  }

  componentDidMount() {
    // 获取客户
    this.searchCustList();
  }

  // 生成客户头部列表
  @autobind
  getColumnsCustTitle() {
    const statusList = _.get(this.context, 'dict.accountStatusList') || [];
    const newTitleList = [...custTitleList];
    // 状态列
    const statusColumn = _.find(newTitleList, o => o.key === KEY_STATUS);
    statusColumn.render = (text) => {
      const statusItem = _.filter(statusList, o => o.key === text);
      const statusText = statusItem.length ? statusItem[0].value : '';
      return (<div title={statusText}>{statusText}</div>);
    };
    // 是否是投顾
    const isTouguColumn = _.find(newTitleList, o => o.key === KEY_ISTOUGU);
    isTouguColumn.render = (text, record) => {
      const isTouGu = text ? '是' : '否';
      return (<div>
        {
          record.oldEmpName ? isTouGu : null
        }
      </div>);
    };
    return newTitleList;
  }

  // 选择客户
  @autobind
  handleSelectChange(record, selected) {
    const { selectedRows } = this.state;
    // 选中的 row 数组
    let newSelectedRows = [...selectedRows];
    if (selected) {
      newSelectedRows.push(record);
      if (this.checkCountIsBigThanLimit(newSelectedRows.length)) {
        message.error(ERROR_MESSAGE_ALL_COUNT);
        return;
      }
      if (newSelectedRows.length > LIMIT_COUNT) {
        message.error(ERROR_MESSAGE_COUNT);
        return;
      }
    } else {
      newSelectedRows = _.filter(newSelectedRows, o => o.custId !== record.custId);
    }
    this.setState({
      selectedRows: newSelectedRows,
    });
  }

  // 查询客户列表
  @autobind
  searchCustList() {
    const { queryList } = this.props;
    const {
      status,
      orgIdKeyWord,
      smKeyword,
      dmKeyword,
      pageNum,
      // 净资产区间
      totalAsset: [totalAssetStart = '', totalAssetEnd = ''],
      // 年日均净资产区间
      annualDailyAsset: [annualDailyAssetStart = '', annualDailyAssetEnd = ''],
      // 本年净佣金区间
      annualAsset: [annualAssetStart = '', annualAssetEnd = ''],
      // 上年净佣金区间
      lastYearAsset: [lastYearAssetStart = '', lastYearAssetEnd = ''],
    } = this.state;
    // 如果状态数组有数据，且第一个数据为空，则置为空数组
    const newStatus = (status.length && _.isEmpty(status[0])) ? [] : [...status];
    const payload = {
      orgId: empOrgId,
      status: newStatus,
      orgIdKeyWord,
      smKeyword,
      dmKeyword,
      totalAssetStart,
      totalAssetEnd,
      annualDailyAssetStart,
      annualDailyAssetEnd,
      lastYearAssetStart,
      lastYearAssetEnd,
      annualAssetStart,
      annualAssetEnd,
      pageSize: INIT_PAGESIZE,
      pageNum,
      type: allotType,
    };
    queryList(payload);
  }

  @autobind
  findContainer() {
    return this.filterWrap;
  }

  // 状态选中
  @autobind
  handleMultiFilterChange(obj) {
    this.setState({
      status: obj.value,
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

  // 更改介绍人
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
    const { selectedRows } = this.state;
    const changeRowKeys = _.map(changeRows, 'custId');
    let newSelectedRows = [...selectedRows];
    if (selected) {
      newSelectedRows.push(...changeRows);
      if (this.checkCountIsBigThanLimit(newSelectedRows.length)) {
        message.error(ERROR_MESSAGE_ALL_COUNT);
        return;
      }
      if (newSelectedRows.length > LIMIT_COUNT) {
        message.error(ERROR_MESSAGE_COUNT);
        return;
      }
    } else {
      newSelectedRows = _.filter(newSelectedRows, o => !_.includes(changeRowKeys, o.custId));
    }
    this.setState({
      selectedRows: newSelectedRows,
    });
  }

  // 检查添加的客户条数是否超过限制的条数（本方法为两千条）
  @autobind
  checkCountIsBigThanLimit(length, limit = LIMIT_ALL_COUNT) {
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
      operateType: 'add',
      attachment: '',
      id: updateData.appId || '',
      type: allotType,
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
      data: { list = [], page = {} },
    } = this.props;

    const statusList = _.get(this.context, 'dict.accountStatusList') || [];
    const decoratedStatusList = statusList.map(item =>
      ({ key: item.key || '', value: item.value }));

    const {
      isExpand,
      status,
      totalAsset,
      annualDailyAsset,
      lastYearAsset,
      annualAsset,
      smKeyword,
      dmKeyword,
      selectedRows,
    } = this.state;

    // 总条数
    const totalCount = page.totalRecordNum || 0;
    // 总条数是否大于限制的条数
    const bigThanLimitAllCount = totalCount >= LIMIT_ALL_COUNT;
    // 总条数大于限制总条数则只显示限制的总条数，即 超过 2000 只取 2000
    const total = bigThanLimitAllCount ? LIMIT_ALL_COUNT : totalCount;
    // 当前页
    const current = page.curPageNum || 1;
    // 每页条数
    const pageSize = page.pageSize || INIT_PAGESIZE;
    // 总条数大于限制总条数并且当前页是最后一页
    const moreThanLimitClassNames = classnames({
      [styles.moreThanLimitCount]: bigThanLimitAllCount && (current === total / pageSize),
    });
    // 客户列表分页
    const paginationOption = {
      current,
      total,
      pageSize,
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
      selectedRowKeys: _.map(selectedRows, 'custId'),
      hideDefaultSelections: true,
      columnWidth: 40,
      onSelect: this.handleSelectChange,
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
              <MultiFilter
                className={styles.firstLineFilter}
                filterName="状态"
                data={decoratedStatusList}
                value={status}
                onChange={_.debounce(this.handleMultiFilterChange, 500)}
              />
              <SingleFilter
                className={styles.searchFilter}
                filterName="服务经理"
                showSearch
                placeholder="请输入服务经理工号、姓名"
                data={[]}
                defaultSelectLabel={smKeyword || NO_VALUE}
                value={smKeyword}
                onInputChange={_.debounce(this.handleSMChange, 500)}
              />
              <SingleFilter
                className={styles.searchFilter}
                filterName="介绍人"
                showSearch
                placeholder="请输入介绍人工号、姓名"
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
                      filterId="totalAsset"
                      filterName="净资产"
                      defaultLabel={NO_VALUE}
                      value={totalAsset}
                      unit="元"
                      onChange={this.handleRangeFilterChange}
                    />
                    <RangeFilter
                      filterId="annualDailyAsset"
                      filterName="年日均净资产"
                      defaultLabel={NO_VALUE}
                      value={annualDailyAsset}
                      unit="元"
                      onChange={this.handleRangeFilterChange}
                    />
                    <RangeFilter
                      filterId="lastYearAsset"
                      filterName="上年净佣金"
                      defaultLabel={NO_VALUE}
                      value={lastYearAsset}
                      unit="元"
                      onChange={this.handleRangeFilterChange}
                    />
                    <RangeFilter
                      filterId="annualAsset"
                      filterName="本年净佣金"
                      defaultLabel={NO_VALUE}
                      value={annualAsset}
                      unit="元"
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
                align="left"
                rowKey="custId"
                rowSelection={rowSelection}
              />
              <div className={moreThanLimitClassNames}>
                <Pagination {...paginationOption} />
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    );
  }
}
