/**
 * @Description: 精选组合弹窗
 * @Author: Liujianshu
 * @Date: 2018-04-24 15:40:21
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-14 15:20:11
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
import {
  timeRange,
  directionRange,
  titleList,
  formatStr,
  sourceType,
  typeList,
} from './config';
import logable from '../../decorators/logable';
import styles from './combinationModal.less';

const Search = Input.Search;
// 3个月的key
const THREE_MOUNTH_KEY = '3';
// 调入的key
const DIRECT_IN = '1';
// 持仓历史
const HISTORY_TYPE = typeList[0];
// 字符串常量，用于 table columns 对应列的 key 匹配来 render
// 时间字符串
const KEY_TIME = 'time';
// 理由字符串
const KEY_REASON = 'reason';
// 组合名称字符串
const KEY_COMBINATIONNAME = 'combinationName';
// 标题字符串
const KEY_TITLE = 'title';
// 查看持仓客户字符串
const KEY_VIEW = 'view';
// 证券名称
const KEY_SECURITYNAME = 'securityName';

export default class CombinationModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    title: PropTypes.string,
    treeData: PropTypes.array,
    getListData: PropTypes.func.isRequired,
    listData: PropTypes.object.isRequired,
    direction: PropTypes.string,
    closeModal: PropTypes.func.isRequired,
    openCustomerListPage: PropTypes.func,
    openReportDetailPage: PropTypes.func,
  }
  static contextTypes = {
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }
  static defaultProps = {
    title: '标题',
    treeData: [],
    direction: DIRECT_IN,
    openCustomerListPage: _.noop,
    openReportDetailPage: _.noop,
  }

  constructor(props) {
    super(props);
    const {
      treeData = [],
      location: { query: {
        modalType = HISTORY_TYPE,
        directionCode = 1,
        time = THREE_MOUNTH_KEY,
        combinationCode = treeData[0] ? treeData[0].value : '',
        keyword = '' } },
    } = this.props;
    const dateObj = this.calcDate(time);
    const titleArray = this.getTitleColumns(modalType);
    this.state = {
      // 弹窗类型
      modalType,
      // 时间默认值
      time,
      // 调仓方向默认值
      directionCode,
      // 开始日期
      startDate: dateObj.begin,
      // 结束日期
      endDate: dateObj.end,
      // 组合名称-树状值
      combinationCode,
      // 搜索关键字
      keyword,
      titleArray,
      // 是否第一次请求接口
      isFirst: true,
    };
  }

  componentDidMount() {
    // 请求历史报告或调仓历史
    const { location: { query: { pageSize, pageNum } } } = this.props;
    this.sendRequest(pageNum, pageSize);
  }

  // 根据类型配置不同的表格标题
  @autobind
  getTitleColumns(type) {
    const titleArray = titleList[type];
    const timeIndex = _.findIndex(titleArray, o => o.key === KEY_TIME);
    const reasonIndex = _.findIndex(titleArray, o => o.key === KEY_REASON);
    const nameIndex = _.findIndex(titleArray, o => o.key === KEY_COMBINATIONNAME);
    const viewIndex = _.findIndex(titleArray, o => o.key === KEY_VIEW);
    const titleIndex = _.findIndex(titleArray, o => o.key === KEY_TITLE);
    const securitynameIndex = _.findIndex(titleArray, o => o.key === KEY_SECURITYNAME);
    // 持仓历史
    if (type === HISTORY_TYPE) {
      // 时间
      titleArray[timeIndex].render = text => (<div>{timeHelper.format(text, formatStr)}</div>);
      // 证券名称
      titleArray[securitynameIndex].render = text => this.renderPopover(text);
      // 调仓理由
      titleArray[reasonIndex].render = text => this.renderPopover(text);
      // 所属组合
      titleArray[nameIndex].render = text => this.renderPopover(text);
      // 查看持仓客户
      titleArray[viewIndex].render = (text, record) => {
        const { securityName, securityCode, securityType } = record;
        const openPayload = {
          name: securityName,
          code: securityCode,
          type: securityType,
          source: sourceType.security,
        };
        return (<a
          className={styles.customerLink}
          onClick={() => this.handleOpenCustomerListPage(openPayload)}
        >
          <Icon type="kehuzu" />
        </a>);
      };
    } else {
      // 时间
      titleArray[timeIndex].render = text => (<div>{timeHelper.format(text, formatStr)}</div>);
      // 设置标题渲染
      titleArray[titleIndex].render = (text, record) => (
        <div title={text}><a onClick={() => this.handleTitleClick(record)}>{text}</a></div>
      );
    }
    return titleArray;
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '调仓历史',
      value: '$args[0].name',
    },
  })
  handleOpenCustomerListPage(openPayload) {
    const { openCustomerListPage } = this.props;
    openCustomerListPage(openPayload);
  }

  // 历史报告标题点击事件
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '历史报告',
      value: '$args[0].title',
    },
  })
  handleTitleClick(record) {
    const { openReportDetailPage } = this.props;
    const payload = {
      id: record.id,
      code: record.combinationCode,
    };
    openReportDetailPage(payload);
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '$args[2]',
      value: '$args[1]',
    },
  })
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
    }, this.sendRequest);
  }

  // 树状选择器change
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '组合名称',
      value: '$args[0]',
    },
  })
  handleTreeSelectChange(value) {
    // 禁用树状选择器的取消选中
    if (_.isEmpty(value)) {
      return;
    }
    this.setState({
      combinationCode: value,
    }, this.sendRequest);
  }

  // 发送请求
  @autobind
  sendRequest(pageNum = 1, pageSize = 10) {
    const { replace } = this.context;
    const { getListData, location: { query = { }, pathname } } = this.props;
    const {
      modalType,
      time,
      startDate,
      endDate,
      combinationCode,
      directionCode,
      keyword,
      isFirst,
    } = this.state;
    const payload = {
      startDate,
      endDate,
      combinationCode,
      directionCode,
      keyword,
      pageSize,
      pageNum,
    };
    if (!isFirst) {
      replace({
        pathname,
        query: {
          ...query,
          time,
          combinationCode,
          directionCode,
          keyword,
          pageNum,
          pageSize,
        },
      });
    }
    if (modalType === HISTORY_TYPE) {
      // 调仓历史
      payload.directionCode = directionCode;
    }
    this.setState({
      isFirst: false,
    }, () => getListData(payload));
  }

  // 根据关键字查询客户
  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '证券名称/证券代码/证券简称',
      value: '$args[0]',
    },
  })
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
    const { modalType, time, directionCode, combinationCode, keyword, titleArray } = this.state;
    const { title, treeData, listData = {}, closeModal } = this.props;
    const { list = [], page = {} } = listData;
    const PaginationOption = {
      current: page.pageNum || 1,
      total: page.totalCount || 0,
      pageSize: page.pageSize || 10,
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
                onChange={(key, value) => this.handleSelectChange(key, value, '时间范围')}
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
              modalType === HISTORY_TYPE
              ?
                <div className={styles.headerItem}>
                  <span>调仓方向</span>
                  <Select
                    name="directionCode"
                    data={directionRange}
                    value={directionCode}
                    onChange={(key, value) => this.handleSelectChange(key, value, '调仓方向')}
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
