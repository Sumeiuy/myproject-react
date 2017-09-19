import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
// import { Link } from 'dva/router';
// import classnames from 'classnames';
import _ from 'lodash';
import styles from './groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

export default class GroupTable extends PureComponent {
  static propTypes = {
    pageData: PropTypes.object,
    listData: PropTypes.array,
    onSizeChange: PropTypes.func.isRequired, // 页目change的时候
    onPageChange: PropTypes.func.isRequired, // 页码change的时候
    tableClass: PropTypes.string.isRequired, // 表格的className
    titleColumn: PropTypes.array.isRequired, // 表格标题
    actionSource: PropTypes.array, // 表格操作列action
  };

  static defaultProps = {
    pageData: EMPTY_OBJECT,
    listData: EMPTY_LIST,
    actionSource: [],
  };

  /**
   * 构造page size
   * @param {*} totalRecordNum 总条目
   */
  renderPageSizeOptions(totalRecordNum) {
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
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
      defaultPageSize: 10,
      onChange: onPageChange,
      showTotal: total => `共${total}个`,
      showSizeChanger: true,
      onShowSizeChange: onSizeChange,
      pageSizeOptions: this.renderPageSizeOptions(totalRecordNum),
    };

    return paginationOptions;
  }

  /**
   * 构造每一列
   */
  renderColumns() {
    const { listData, titleColumn, actionSource } = this.props;
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
        }

        return {
          dataIndex: item.key,
          width: '20%',
          title: item.value,
          render: (text, record) =>
            <div>
              <span>{record.feedEmpInfo.l3}</span>
            </div>,
        };
      });
    }

    return _.map(titleColumn, item => ({
      dataIndex: item.key,
      width: '20%',
      title: item.value,
      render: (text, record) =>
        <div>
          <span>{record.feedEmpInfo.l3}</span>
        </div>,
    }));
  }

  /**
   * 构造数据源
   */
  renderTableDatas(dataSource) {
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }

    return newDataSource;
  }

  render() {
    const {
      listData,
      pageData: { curPageNum, curPageSize, totalRecordNum },
      tableClass,
     } = this.props;
    const paginationOptions = this.renderPaganation(curPageNum, totalRecordNum, curPageSize);
    const columns = this.renderColumns();

    return (
      <Table
        className={tableClass}
        columns={columns}
        dataSource={this.renderTableDatas(listData)}
        pagination={paginationOptions}
        bordered={false}
      />
    );
  }
}
