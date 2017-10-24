/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 08:57:00
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-23 14:04:34
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { autobind } from 'core-decorators';
// import { Link } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import Paganation from '../../common/Paganation';
import styles from './groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

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
    firstColumnHandler: () => { },
    isNeedRowSelection: false,
    onSingleRowSelectionChange: () => { },
    onRowSelectionChange: () => { },
    currentSelectRowKeys: [],
    isNeedPaganation: true,
    onPageChange: () => { },
    onSizeChange: () => { },
  };

  constructor(props) {
    super(props);
    const { curPageSize } = props.pageData;
    this.state = {
      curSelectedRow: -1,
      // 记住原始分页数，用于换算pageSizeOptions
      originPageSizeUnit: curPageSize,
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

  /**
   * 构造分页器
   * @param {*} curPageNum 当前页
   * @param {*} totalRecordNum 总条目
   * @param {*} curPageSize 当前分页条目
   */
  renderPaganation(curPageNum, totalRecordNum, curPageSize) {
    const { onSizeChange, onPageChange } = this.props;
    const paginationOptions = {
      current: parseInt(curPageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: totalRecordNum,
      pageSize: parseInt(curPageSize, 10),
      defaultPageSize: Number(curPageSize),
      onChange: onPageChange,
      showTotal: total =>
        <span className={styles.totalPageSection}>
          共 <span className={styles.totalPage}>
            {total}
          </span> 项
       </span>,
      showSizeChanger: true,
      onShowSizeChange: onSizeChange,
      pageSizeOptions: this.renderPageSizeOptions(totalRecordNum, Number(curPageSize)),
    };

    return paginationOptions;
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
    } = this.props;
    const len = titleColumn.length - 1;
    if (_.isEmpty(listData)) {
      return [];
    }

    if (!_.isEmpty(actionSource)) {
      // 存在操作列
      return _.map(titleColumn, (item, index) => {
        if (index === len) {
          // operation column
          return {
            dataIndex: item.key,
            width: _.isArray(columnWidth) ? columnWidth[index] : columnWidth,
            title: item.value,
            fixed: (isFixedColumn && _.includes(fixedColumn, index)) ? 'left' : false,
            render: (text, record) =>
              <div className={styles.operation}>
                {
                  _.map(actionSource, itemData =>
                    <span
                      className={styles.link}
                      key={itemData.type}
                      onClick={() => itemData.handler(record)}
                    >
                      {itemData.type}
                    </span>,
                  )
                }
              </div>,
          };
        } else if (index === 0 && isFirstColumnLink) {
          // 第一列可以Link，有handler
          return {
            dataIndex: item.key,
            width: _.isArray(columnWidth) ? columnWidth[index] : columnWidth,
            title: item.value,
            fixed: (isFixedColumn && _.includes(fixedColumn, index)) ? 'left' : false,
            render: (text, record) =>
              <div className={styles.operation}>
                <span
                  title={record[item.key]}
                  className={styles.link}
                  onClick={() => firstColumnHandler(record)}
                >
                  {(record[item.key] === 0 || record[item.key]) ? record[item.key] : '--'}
                </span>
              </div>,
          };
        }

        return {
          dataIndex: item.key,
          width: _.isArray(columnWidth) ? columnWidth[index] : columnWidth,
          title: item.value,
          fixed: (isFixedColumn && _.includes(fixedColumn, index)) ? 'left' : false,
          render: (text, record) => {
            if (index === 0 && isFirstColumnLink) {
              return (
                <div className={styles.operation}>
                  <span
                    title={record[item.key]}
                    className={styles.link}
                    onClick={() => firstColumnHandler(record)}
                  >
                    {(record[item.key] === 0 || record[item.key]) ? record[item.key] : '--'}
                  </span>
                </div>
              );
            }
            return (
              <div className={styles.column}>
                <span title={record[item.key]}>
                  {(record[item.key] === 0 || record[item.key]) ? record[item.key] : '--'}</span>
              </div>
            );
          },
        };
      });
    }

    return _.map(titleColumn, (item, index) => ({
      dataIndex: item.key,
      width: _.isArray(columnWidth) ? columnWidth[index] : columnWidth,
      title: item.value,
      fixed: (isFixedColumn && _.includes(fixedColumn, index)) ? 'left' : false,
      render: (text, record) =>
        <div className={styles.column}>
          <span title={record[item.key]}>
            {(record[item.key] === 0 || record[item.key]) ? record[item.key] : '--'}
          </span>
        </div>,
    }));
  }

  /**
   * 构造数据源
   */
  renderTableDatas(dataSource) {
    let newDataSource = [];
    newDataSource = _.map(dataSource,
      item => _.merge(item, { key: item.id })); // 在外部传入数据时，统一加入一个id

    return newDataSource;
  }

  @autobind
  renderRowSelection() {
    const { onRowSelectionChange, onSingleRowSelectionChange, currentSelectRowKeys } = this.props;
    return {
      type: 'radio',
      selectedRowKeys: currentSelectRowKeys,
      onChange: onRowSelectionChange,
      hideDefaultSelections: true,
      onSelect: onSingleRowSelectionChange,
    };
  }

  render() {
    const {
      listData = EMPTY_LIST,
      pageData: { curPageNum, curPageSize, totalRecordNum },
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
     } = this.props;
    const { curSelectedRow, originPageSizeUnit } = this.state;
    const paganationOption = {
      curPageNum,
      totalRecordNum,
      curPageSize,
      onPageChange,
      onSizeChange,
      originPageSizeUnit,
    };
    const columns = this.renderColumns();
    const scrollYArea = isFixedTitle ? { y: scrollY } : {};
    const scrollXArea = isFixedColumn ? { x: scrollX } : {};
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
            return null;
          }}
        />
        {
          isNeedPaganation ? <Paganation {...paganationOption} /> : null
        }
      </div>
    );
  }
}
