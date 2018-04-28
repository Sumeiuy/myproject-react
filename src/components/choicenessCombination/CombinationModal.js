/**
 * @Description: 精选组合弹窗
 * @Author: Liujianshu
 * @Date: 2018-04-24 15:40:21
 * @Last Modified by: Liujianshu
 * @Last Modified time: 2018-04-25 21:28:52
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Modal, TreeSelect, Popover } from 'antd';
import moment from 'moment';
import _ from 'lodash';

import CommonTable from '../common/biz/CommonTable';
import Pagination from '../common/Pagination';
import Select from '../common/Select';
import Button from '../common/Button';
import config from './config';
import styles from './combinationModal.less';

const Search = Input.Search;
const { timeRange, directionRange, titleList } = config;
const { transfer } = titleList;
export default class CombinationModal extends PureComponent {
  static propTypes = {
    getTreeData: PropTypes.func.isRequired,
    treeData: PropTypes.array,
    getListData: PropTypes.func.isRequired,
    listData: PropTypes.object.isRequired,
    direction: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
  }

  static defaultProps = {
    treeData: [],
    direction: '1',
  }

  constructor(props) {
    super(props);
    const { direction } = this.props;
    this.state = {
      // 时间默认值
      time: '3',
      // 调仓方向默认值
      directionCode: direction,
      // 开始日期
      startDate: '',
      // 结束日期
      endDate: '',
      // 组合名称-树状值
      combinationCode: '',
      // 搜索关键字
      keyword: '',
    };
  }

  componentWillMount() {
    const { getTreeData, getListData } = this.props;
    // TODO:通过类型判断来调用不同的接口
    getTreeData();
    getListData();
    const dateObj = this.calcDate('3');
    this.setState({
      startDate: dateObj.begin,
      endDate: dateObj.end,
    });
  }


  // 计算事件函数，返回格式化后的开始、结束日期
  @autobind
  calcDate(value) {
    // 开始日期
    let begin = '';
    // 结束日期
    let end = '';
    // 取出现在的时间
    const now = new Date();
    // 结束日期对象
    const endMoment = moment(now);
    // 开始日期对象
    if (!_.isEmpty(value)) {
      const beginMoment = moment(endMoment).subtract(value, 'month');
      // 开始日期格式化
      begin = beginMoment.format('YYYYMMDD');
      // 结束日期格式化
      end = endMoment.format('YYYYMMDD');
    }
    return {
      begin,
      end,
    };
  }

  // 下拉框 change
  @autobind
  selectChangeHandle(key, value) {
    const obj = {
      [key]: value,
    };
    if (key === 'time') {
      const dateObj = this.calcDate(value);
      obj.startDate = dateObj.begin;
      obj.endDate = dateObj.end;
    }
    this.setState({
      ...obj,
    }, () => {
      this.sendRequest();
    });
  }

  // 树状选择器change
  @autobind
  treeSelectChangeHandle(value) {
    this.setState({
      combinationCode: value,
    }, () => {
      this.sendRequest();
    });
  }

  // 发送请求
  @autobind
  sendRequest(pageNum = 1, pageSize = 10) {
    const { getListData } = this.props;
    const { startDate, endDate, combinationCode, directionCode, keyword } = this.state;
    const payload = {
      startDate,
      endDate,
      combinationCode,
      directionCode,
      keyword,
      pageSize,
      pageNum,
    };
    console.warn('payload', payload);
    getListData(payload);
  }

  // 根据关键字查询客户
  @autobind
  searchListHandle(v = '') {
    this.setState({
      keyword: v,
    }, () => {
      this.sendRequest();
    });
  }

    // 分页事件
  @autobind
  handlePaginationChange(page) {
    this.sendRequest(page);
  }

  render() {
    const { time, directionCode, combinationCode, keyword } = this.state;
    const { treeData, listData, closeModal } = this.props;
    const { list = [], page = {} } = listData;
    const PaginationOption = {
      current: Number(page.pageNum) || 1,
      total: Number(page.totalCount) || 1,
      pageSize: Number(page.pageSize),
      onChange: this.handlePaginationChange,
    };
    const newTransfer = [...transfer];
    newTransfer[5].render = (text, record) => (
      <Popover
        placement="top"
        content={record.reason}
        trigger="hover"
        overlayClassName={styles.popover}
      >
        {record.reason}
      </Popover>
    );
    const footerContent = (<Button
      key="close"
      onClick={closeModal}
    >
      关闭
    </Button>);
    return (
      <div className={styles.combinationModal}>
        <Modal
          title="标题"
          visible
          footer={footerContent}
          wrapClassName={styles.modal}
          onCancel={closeModal}
        >
          <div className={styles.header}>
            <div className={styles.headerItem}>
              <span>时间范围</span>
              <Select
                name="time"
                data={timeRange}
                value={time}
                onChange={this.selectChangeHandle}
              />
            </div>
            <div className={styles.headerItem}>
              <span>组合名称</span>
              <TreeSelect
                value={combinationCode}
                dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
                treeData={treeData}
                placeholder="Please select"
                treeDefaultExpandAll
                onChange={this.treeSelectChangeHandle}
              />
            </div>
            <div className={styles.headerItem}>
              <span>调仓方向</span>
              <Select
                name="directionCode"
                data={directionRange}
                value={directionCode}
                onChange={this.selectChangeHandle}
              />
            </div>
            <div className={styles.headerItem}>
              <Search
                placeholder="证券名称/证券代码/证券简称"
                style={{
                  width: '235px',
                }}
                defaultValue={keyword}
                onSearch={this.searchListHandle}
                enterButton
              />
            </div>
          </div>
          <div className={styles.content}>
            <CommonTable
              data={list}
              titleList={newTransfer}
              align="left"
            />
          </div>
          <Pagination {...PaginationOption} />
        </Modal>
      </div>
    );
  }
}
