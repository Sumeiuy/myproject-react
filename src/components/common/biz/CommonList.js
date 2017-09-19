/**
 * @file seibelColumns.js
 *  公共列表
 * @author honggaunqging
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import '../../style/jiraLayout.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default class PermissionList extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    getListRowId: PropTypes.func.isRequired,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    this.state = {
      curSelectedRow: 0,
    };
  }

  /**
   * 点击某一行记录
   * @param {*} record 当前行数据
   * @param {*} index 当前行index
   */
  @autobind
  handleRowClick(record, index) {
    const {
      getListRowId,
      list: { resultData = EMPTY_LIST },
    } = this.props;

    // 设置当前选中行
    this.setState({
      curSelectedRow: index,
    });

    getListRowId(resultData[index].id);
  }

  /**
   * 页码改变事件
   * @param {*} nextPage 下一页码
   * @param {*} pageSize 当前页
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
        pageSize: currentPageSize,
      },
    });
  }


  /**
   * 构造数据源
   */
  constructTableDatas(dataSource) {
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }

    return newDataSource;
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    const { location: { query, pathname }, replace } = this.props;
    // 替换当前页码和分页条目
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
  }

  constructPageSizeOptions(totalCount) {
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalCount / 10);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
    }

    return pageSizeOption;
  }

  render() {
    const { columns, list: { resultData = EMPTY_LIST, page = EMPTY_OBJECT },
      location: { query: { pageNum, pageSize } } } = this.props;
    const { totalCount } = page;
    const { curSelectedRow } = this.state;

    if (!resultData) {
      return null;
    }

    const paginationOptions = {
      current: parseInt(pageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: totalCount,
      pageSize: parseInt(pageSize, 10),
      defaultPageSize: 10,
      onChange: this.handlePageChange,
      showTotal: total => `共${total}个`,
      showSizeChanger: true,
      onShowSizeChange: this.handleShowSizeChange,
      pageSizeOptions: this.constructPageSizeOptions(totalCount),
    };

    return (
      <div className="pageCommonList">
        <Table
          className="pageCommonTable"
          columns={columns}
          dataSource={this.constructTableDatas(resultData)}
          onRowClick={this.handleRowClick}
          showHeader={false}
          pagination={paginationOptions}
          bordered={false}
          rowClassName={(record, index) => {
            if (curSelectedRow === index) {
              return 'active';
            }
            return '';
          }}
        />
      </div >
    );
  }
}
