/**
 * @Description: 精选组合弹窗
 * @Author: Liujianshu
 * @Date: 2018-04-24 15:40:21
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-28 17:39:36
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
import Icon from '../common/Icon';
import { time as timeHelper } from '../../helper';
import config from './config';
import styles from './combinationModal.less';

const Search = Input.Search;
const { timeRange, directionRange, titleList, formatStr } = config;
// 3个月的key
const THREE_MOUNTH_KEY = '3';
// 调入的key
const DIRECT_IN = '1';
// 持仓历史
const HISTORY_TYPE = config.typeList[0];
export default class CombinationModal extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string,
    getTreeData: PropTypes.func.isRequired,
    treeData: PropTypes.array,
    getListData: PropTypes.func.isRequired,
    listData: PropTypes.object.isRequired,
    direction: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    openCustomerListPage: PropTypes.func,
  }

  static defaultProps = {
    title: '标题',
    treeData: [],
    direction: DIRECT_IN,
    openCustomerListPage: _.noop,
  }

  constructor(props) {
    super(props);
    const { direction } = this.props;
    this.state = {
      // 时间默认值
      time: THREE_MOUNTH_KEY,
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
      titleArray: [],
    };
  }

  componentWillMount() {
    const { getTreeData, type } = this.props;
    getTreeData();
    // 时间默认选中为最三个月
    const dateObj = this.calcDate(THREE_MOUNTH_KEY);
    const titleArray = this.getTitleColumns(type);
    this.setState({
      startDate: dateObj.begin,
      endDate: dateObj.end,
      titleArray,
    }, () => this.sendRequest());
  }

  // 根据类型配置不同的表格标题
  @autobind
  getTitleColumns(type) {
    const { openCustomerListPage } = this.props;
    const titleArray = titleList[type];
    // 持仓历史
    if (type === HISTORY_TYPE) {
      // 查看持仓客户
      const lastColumn = {
        dataIndex: 'view',
        key: 'view',
        title: '持仓客户',
        width: 80,
        render: (text, record) => {
          const openPayload = {
            name: record.securityName,
            code: record.securityCode,
            type: record.securityType,
          };
          return (<a
            className={styles.customerLink}
            onClick={() => openCustomerListPage(openPayload)}
          >
            <Icon type="kehuzu" />
          </a>);
        },
      };
      // 时间
      titleArray[0].render = text => (<div>{timeHelper.format(text, formatStr)}</div>);
      // 调仓理由
      titleArray[5].render = (text, record) => this.renderPopover(record.reason);
      // 所属组合
      titleArray[6].render = (text, record) => this.renderPopover(record.combinationName);
      // 查看持仓客户
      titleArray[7] = lastColumn;
    }
    return titleArray;
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
  handleSelectChange(key, value) {
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
  handleTreeSelectChange(value) {
    this.setState({
      combinationCode: value,
    }, this.sendRequest);
  }

  // 发送请求
  @autobind
  sendRequest(pageNum = 1, pageSize = 10) {
    const { getListData, type } = this.props;
    const { startDate, endDate, combinationCode, directionCode, keyword } = this.state;
    const payload = {
      startDate,
      endDate,
      combinationCode,
      keyword,
      pageSize,
      pageNum,
    };
    if (type === HISTORY_TYPE) {
      // 调仓历史
      payload.directionCode = directionCode;
    }
    getListData(payload);
  }

  // 根据关键字查询客户
  @autobind
  handleSearchList(v = '') {
    this.setState({
      keyword: v,
    }, this.sendRequest);
  }

    // 分页事件
  @autobind
  handlePaginationChange(page) {
    this.sendRequest(page);
  }

  // 设置单元格的 popover
  @autobind
  renderPopover(value) {
    let reactElement = null;
    if (value) {
      reactElement = (<Popover
        placement="topLeft"
        content={value}
        trigger="hover"
        overlayClassName={styles.popover}
      >
        <div className={styles.ellipsis}>
          {value}
        </div>
      </Popover>);
    } else {
      reactElement = '暂无';
    }
    return reactElement;
  }

  render() {
    const { time, directionCode, combinationCode, keyword, titleArray } = this.state;
    const { type, title, treeData, listData, closeModal } = this.props;
    const { list = [], page = {} } = listData;
    const PaginationOption = {
      current: page.pageNum,
      total: page.totalCount,
      pageSize: page.pageSize,
      onChange: this.handlePaginationChange,
    };
    const footerContent = (<Button
      key="close"
      onClick={closeModal}
    >
      关闭
    </Button>);
    return (
      <div className={styles.combinationModal}>
        <Modal
          title={title}
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
                onChange={this.handleSelectChange}
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
                onChange={this.handleTreeSelectChange}
                dropdownClassName={styles.dropdownClassName}
              />
            </div>
            {
              type === HISTORY_TYPE
              ?
                <div className={styles.headerItem}>
                  <span>调仓方向</span>
                  <Select
                    name="directionCode"
                    data={directionRange}
                    value={directionCode}
                    onChange={this.handleSelectChange}
                  />
                </div>
              :
                null
            }
            <div className={styles.headerItem}>
              <Search
                placeholder="证券名称/证券代码/证券简称"
                style={{
                  width: '235px',
                }}
                defaultValue={keyword}
                onSearch={this.handleSearchList}
                enterButton
              />
            </div>
          </div>
          <div className={styles.content}>
            <CommonTable
              data={list}
              titleList={titleArray}
              align="left"
            />
          </div>
          <Pagination {...PaginationOption} />
        </Modal>
      </div>
    );
  }
}
