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
    clickRow: PropTypes.func,
    backKeys: PropTypes.array,
  };

  static defaultProps = {
    clickRow: () => {},
    backKeys: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      curSelectedRow: 0,
    };
  }


  componentWillReceiveProps(nextProps) {
    // 第一次替换query
    // 添加currentId
    const { list: { resultData: prevResultData = EMPTY_LIST } } = this.props;
    const {
       location: { query, pathname, query: { currentId } },
       replace,
       list: { resultData = EMPTY_LIST, page = EMPTY_OBJECT } } = nextProps;
    const { pageNum, pageSize } = page;

    // 只有当有数据，
    // 当前没有选中项currentId
    // 或者query上存在currentId，但是数据没有匹配时
    // 默认设置第一条初始值
    if (prevResultData !== resultData) {
      if (!_.isEmpty(resultData)) {
        if ((!currentId || (
           currentId &&
           _.isEmpty(_.find(resultData, item => item.id.toString() === currentId))
        ))) {
          replace({
            pathname,
            query: {
              ...query,
              currentId: resultData[0] && resultData[0].id,
              pageNum,
              pageSize,
            },
          });
          // 选中第一行
          this.setState({ // eslint-disable-line
            curSelectedRow: 0,
          });
        } else {
          // query上存在正确的currentId
          // 设置当前选中行
          this.setState({ // eslint-disable-line
            curSelectedRow: _.findIndex(resultData,
              item => item.id.toString() === currentId),
          });

          replace({
            pathname,
            query: {
              ...query,
              // pageNum,
              // pageSize: pageSize,
            },
          });
        }
      }
    }
  }

  /**
   * 点击某一行记录
   * @param {*} record 当前行数据
   * @param {*} index 当前行index
   */
  @autobind
  handleRowClick(record, index) {
    const {
      location: { pathname, query },
      replace,
      list: { resultData = EMPTY_LIST },
      clickRow,
    } = this.props;

    // 设置当前选中行
    this.setState({
      curSelectedRow: index,
    });

   // 替换currentId
    replace({
      pathname,
      query: {
        ...query,
        currentId: resultData[index].id,
      },
    });
    clickRow(record);
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
