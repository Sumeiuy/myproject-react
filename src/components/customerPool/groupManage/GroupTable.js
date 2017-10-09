/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 08:57:00
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-09 13:59:19
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { autobind } from 'core-decorators';
// import { Link } from 'dva/router';
import classnames from 'classnames';
import _ from 'lodash';
import styles from './groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class GroupTable extends PureComponent {
  static propTypes = {
    pageData: PropTypes.object,
    listData: PropTypes.array,
    // 页目change的时候
    onSizeChange: PropTypes.func.isRequired,
    // 页码change的时候
    onPageChange: PropTypes.func.isRequired,
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
  };

  static defaultProps = {
    pageData: EMPTY_OBJECT,
    listData: EMPTY_LIST,
    actionSource: [],
    isFirstColumnLink: false,
    firstColumnHandler: () => { },
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

  // /**
  //  * 构造page size
  //  * @param {*} totalRecordNum 总条目
  //  * @param {*} curPageSize 当前分页数
  //  */
  // renderPageSizeOptions(totalRecordNum, curPageSize) {
  //   const pageSizeOption = [];
  //   const maxPage = Math.ceil(totalRecordNum / Number(curPageSize));
  //   for (let i = 1; i <= maxPage; i++) {
  //     pageSizeOption.push((curPageSize * i).toString());
  //   }

  //   return pageSizeOption;
  // }

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
            width: '20%',
            title: item.value,
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
            width: '20%',
            title: item.value,
            render: (text, record) =>
              <div className={styles.operation}>
                <span
                  title={record[item.key]}
                  className={styles.link}
                  onClick={() => firstColumnHandler(record)}
                >
                  {record[item.key] || '--'}
                </span>
              </div>,
          };
        }

        return {
          dataIndex: item.key,
          width: '20%',
          title: item.value,
          render: (text, record) => {
            if (index === 0 && isFirstColumnLink) {
              return (
                <div className={styles.operation}>
                  <span
                    title={record[item.key]}
                    className={styles.link}
                    onClick={() => firstColumnHandler(record)}
                  >
                    {record[item.key] || '--'}
                  </span>
                </div>
              );
            }
            return (
              <div className={styles.column}>
                <span title={record[item.key]}>{record[item.key] || '--'}</span>
              </div>
            );
          },
        };
      });
    }

    return _.map(titleColumn, item => ({
      dataIndex: item.key,
      width: '20%',
      title: item.value,
      render: (text, record) =>
        <div className={styles.column}>
          <span title={record[item.key]}>{record[item.key] || '--'}</span>
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

  render() {
    const {
      listData = EMPTY_LIST,
      pageData: { curPageNum, curPageSize, totalRecordNum },
      tableClass,
     } = this.props;
    const { curSelectedRow } = this.state;
    const paginationOptions = this.renderPaganation(
      curPageNum,
      totalRecordNum,
      curPageSize,
    );
    const columns = this.renderColumns();

    return (
      <Table
        className={tableClass}
        columns={columns}
        dataSource={this.renderTableDatas(listData)}
        pagination={paginationOptions}
        bordered={false}
        onRowClick={this.handleRowClick}
        rowClassName={(record, index) => {
          if (curSelectedRow === index) {
            return classnames({
              [styles.rowSelected]: true,
            });
          }
          return null;
        }}
      />
    );
  }
}
