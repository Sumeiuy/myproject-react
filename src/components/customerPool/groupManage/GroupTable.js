/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 08:57:00
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-03-14 15:33:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { autobind } from 'core-decorators';
// import { Link } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import Pagination from '../../common/Pagination';
import Clickable from '../../../components/common/Clickable';
import styles from './groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const NOOP = _.noop;

export default class GroupTable extends PureComponent {
  static propTypes = {
    pageData: PropTypes.object,
    listData: PropTypes.array,
    // 页目change的时候
    onSizeChange: PropTypes.func,
    // 页码change的时候
    onPageChange: PropTypes.func,
    // 表格的className
    tableClass: PropTypes.string.isRequired,
    // 表格标题
    titleColumn: PropTypes.array.isRequired,
    // 表格操作列action
    actionSource: PropTypes.array,
    // 表格第一列是否可以点击
    isFirstColumnLink: PropTypes.bool,
    // 表格第一列点击的回调
    firstColumnHandler: PropTypes.func,
    // 是否展示表格边框
    bordered: PropTypes.bool,
    // 是否固定列
    isFixedColumn: PropTypes.bool,
    // 是否固定标题
    isFixedTitle: PropTypes.bool,
    // 固定列的区间
    fixedColumn: PropTypes.array,
    // 滚动的x范围
    scrollX: PropTypes.number,
    // 滚动Y范围
    scrollY: PropTypes.number,
    // row selection
    isNeedRowSelection: PropTypes.bool,
    // 选择单列的回调
    onSingleRowSelectionChange: PropTypes.func,
    // 选择列回调
    onRowSelectionChange: PropTypes.func,
    // 当前选中项的key数组
    currentSelectRowKeys: PropTypes.array,
    // 列的宽度
    columnWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.array,
    ]),
    // 是否需要分页
    isNeedPaganation: PropTypes.bool,
    // 选择框类型
    selectionType: PropTypes.string,
    // 全选，取消全选回调
    onSelectAllChange: PropTypes.func,
    // tableStyle
    tableStyle: PropTypes.object,
    // 第一列class
    operationColumnClass: PropTypes.string,
    // 是否展示表头
    showHeader: PropTypes.bool,
    // 分页器是否在表格内部
    paginationInTable: PropTypes.bool,
    // 是否需要展示空白数据行
    needShowEmptyRow: PropTypes.bool,
    // 分页器class
    paginationClass: PropTypes.string,
  };

  static defaultProps = {
    pageData: EMPTY_OBJECT,
    listData: EMPTY_LIST,
    actionSource: [],
    isFirstColumnLink: false,
    bordered: false,
    isFixedColumn: false,
    fixedColumn: [],
    scrollX: 0,
    scrollY: 0,
    isFixedTitle: false,
    columnWidth: ['20%', '20%', '20%', '20%', '20%'],
    firstColumnHandler: NOOP,
    isNeedRowSelection: false,
    onSingleRowSelectionChange: NOOP,
    onRowSelectionChange: NOOP,
    currentSelectRowKeys: [],
    isNeedPaganation: true,
    onPageChange: NOOP,
    onSizeChange: NOOP,
    selectionType: 'radio',
    onSelectAllChange: NOOP,
    tableStyle: null,
    operationColumnClass: '',
    showHeader: true,
    paginationInTable: false,
    needShowEmptyRow: false,
    paginationClass: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      curSelectedRow: -1,
    };
  }

  @autobind
  handleRowClick(record, index, event) {
    console.log(record, index, event);
    this.setState({
      curSelectedRow: index,
    });
  }

  /**
   * 构造page size
   * @param {*} totalRecordNum 总条目
   * @param {*} curPageSize 当前分页数
   */
  renderPageSizeOptions(totalRecordNum) {
    const { originPageSizeUnit } = this.state;
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / originPageSizeUnit);

    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((originPageSizeUnit * i).toString());
    }

    return pageSizeOption;
  }

  @autobind
  renderColumnValue(record, item) {
    // 如果存在空白行标记，则不展示--,直接展示空
    if (!_.isEmpty(record.flag)) {
      return '';
    }
    if ((!_.isInteger(record[item.key]) && _.isEmpty(record[item.key]))) {
      return '--';
    }
    if (item.render) {
      return item.render(record[item.key]);
    }
    return record[item.key];
  }

  /**
   * 构造每一列
   */
  renderColumns() {
    const {
      listData,
      titleColumn,
      actionSource,
      isFirstColumnLink,
      firstColumnHandler,
      isFixedColumn,
      fixedColumn,
      columnWidth,
      operationColumnClass,
    } = this.props;
    const len = titleColumn.length - 1;
    if (_.isEmpty(listData)) {
      return [];
    }

    return _.map(titleColumn, (item, index) => ({
      dataIndex: item.key,
      width: _.isArray(columnWidth) ? columnWidth[index] : columnWidth,
      title: item.value,
      fixed: (isFixedColumn && _.includes(fixedColumn, index)) ? 'left' : false,
      render: (text, record) => {
        if (index === 0 && isFirstColumnLink) {
          // 第一列可以Link，有handler
          return (
            <div
              className={
                classnames({
                  [styles.operation]: true,
                  [operationColumnClass]: true,
                })}
            >
              <Clickable
                onClick={() => firstColumnHandler(record)}
                eventName="/click/groupTabel/operationFirstColumn"
              >
                <span title={record[item.key]} className={styles.link}>
                  {this.renderColumnValue(record, item)}
                </span>
              </Clickable>
            </div>
          );
        }
        if (index === len && !_.isEmpty(actionSource)) {
          return (<div
            className={
              classnames({
                [styles.operation]: true,
              })}
          >
            {
              _.map(actionSource, (itemData, key) => (
                <Clickable
                  key={key}
                  onClick={() => itemData.handler(record)}
                  eventName="/click/groupTabel/operationLastColumn"
                >
                  <span className={styles.link} key={itemData.type}>
                    {itemData.type}
                  </span>
                </Clickable>
              ),
              )
            }
          </div>);
        }

        return (
          <span title={record[item.key]} className={styles.column}>
            {this.renderColumnValue(record, item)}
          </span>
        );
      },
    }));
  }

  /**
   * 构造数据源
   */
  renderTableDatas(dataSource) {
    if (_.isEmpty(dataSource)) {
      return [];
    }

    const { needShowEmptyRow, pageData: { curPageSize } } = this.props;
    let newDataSource = [];
    newDataSource = _.map(dataSource,
      item => _.merge(item, { key: item.id })); // 在外部传入数据时，统一加入一个id

    const dataSize = _.size(newDataSource);
    const distanceSize = curPageSize - dataSize;
    if (distanceSize > 0 && needShowEmptyRow) {
      // 填充空白行
      for (let i = 1; i <= distanceSize; i++) {
        newDataSource = _.concat(newDataSource, [{
          key: `empty_row_${i}`,
          id: `empty_row_${i}`,
          // 空白行标记
          flag: `empty_row_${i}`,
        }]);
      }
    }
    return newDataSource;
  }

  @autobind
  renderRowSelection() {
    const {
      onRowSelectionChange,
      onSingleRowSelectionChange,
      currentSelectRowKeys,
      selectionType,
      onSelectAllChange,
    } = this.props;

    return {
      type: selectionType || 'radio',
      selectedRowKeys: currentSelectRowKeys,
      onChange: onRowSelectionChange,
      hideDefaultSelections: true,
      onSelect: onSingleRowSelectionChange,
      onSelectAll: onSelectAllChange,
    };
  }

  render() {
    const {
      listData = EMPTY_LIST,
      pageData: {
        curPageNum,
        curPageSize,
        totalRecordNum,
        isHideLastButton,
        isShortPageList,
        showSizeChanger,
        },
      tableClass,
      bordered,
      isFixedColumn,
      scrollX,
      scrollY,
      isFixedTitle,
      onPageChange,
      onSizeChange,
      isNeedRowSelection,
      isNeedPaganation,
      tableStyle,
      showHeader,
      paginationClass,
     } = this.props;
    const { curSelectedRow } = this.state;
    const paganationOption = {
      current: Number(curPageNum),
      total: Number(totalRecordNum),
      pageSize: Number(curPageSize),
      isHideLastButton,
      isShortPageList,
      showSizeChanger,
      onChange: onPageChange,
      onShowSizeChange: onSizeChange,
    };
    const columns = this.renderColumns();
    const scrollYArea = isFixedTitle ? { y: scrollY } : {};
    const scrollXArea = isFixedColumn ? { x: scrollX } : {};
    const tableStyleProp = !_.isEmpty(tableStyle) ? { style: tableStyle } : {};
    return (
      <div>
        <Table
          className={tableClass}
          columns={columns}
          dataSource={this.renderTableDatas(listData)}
          bordered={bordered}
          pagination={false}
          scroll={_.merge(scrollXArea, scrollYArea)}
          onRowClick={this.handleRowClick}
          rowSelection={isNeedRowSelection ? this.renderRowSelection() : null}
          rowClassName={(record, index) => {
            if (curSelectedRow === index) {
              return classnames({
                [styles.rowSelected]: true,
              });
            }
            // 如果存在flag标记，说明是空白行
            if (!_.isEmpty(record.flag)) {
              return 'emptyRow';
            }
            return '';
          }}
          showHeader={showHeader}
          {...tableStyleProp}
        />
        {
          (isNeedPaganation && totalRecordNum > 0) ?
            <div className={`${styles.pagination} ${paginationClass}`}><Pagination {...paganationOption} /></div> : null
        }
      </div>
    );
  }
}
