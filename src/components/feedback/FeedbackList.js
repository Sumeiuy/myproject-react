import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import styles from './feedbackList.less';
import Icon from '../common/Icon';
import { constructPostBody } from '../../utils/helper';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

// 状态字典
const STATUS_MAP = [
  { value: 'PROCESSING', label: '解决中' },
  { value: 'CLOSED', label: '关闭' },
];

export default class FeedbackList extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getFeedbackList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  };

  static defaultProps = {

  };

  constructor(props) {
    super(props);
    const { page = EMPTY_OBJECT, resultData = EMPTY_LIST,
    } = props.list || EMPTY_OBJECT;
    const { curPageNum = 1, totalPageNum = 1, totalRecordNum = 1 } = page;
    this.state = {
      curPageNum,
      dataSource: resultData || EMPTY_LIST,
      totalRecordNum,
      totalPageNum,
      curPageSize: 10,
      curSelectedRow: 0,
      currentId: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { list: nextList = EMPTY_OBJECT,
      location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { list: prevList = EMPTY_OBJECT, location: { query: prevQuery = EMPTY_OBJECT },
      getFeedbackList } = this.props;
    const { resultData: nextResultData = EMPTY_LIST, page = EMPTY_OBJECT } = nextList;
    const { resultData: prevResultData = EMPTY_LIST } = prevList;
    const { curPageNum = 1, totalPageNum = 1, totalRecordNum = 1 } = page;
    const { currentId } = nextQuery;

    if (prevResultData !== nextResultData) {
      this.setState({
        dataSource: nextResultData,
        totalRecordNum,
        totalPageNum,
        curPageNum,
        currentId,
      }, () => {
        this.setState({
          curSelectedRow: _.findIndex(this.state.dataSource,
            item => item.id.toString() === this.state.currentId),
        });
      });
    }
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        const { curPageNum: newPageNum, curPageSize: newPageSize } = this.state;
        // 只监测筛选条件是否变化
        getFeedbackList(constructPostBody(nextQuery, newPageNum, newPageSize));
      }
    }
  }

  componentDidUpdate() {
    // 第一次替换query
    // 添加currentId
    const { location: { query, pathname, query: { currentId } }, replace } = this.props;
    const { dataSource = EMPTY_LIST } = this.state;
    if (!currentId) {
      replace({
        pathname,
        query: {
          ...query,
          currentId: dataSource[0] && dataSource[0].id,
        },
      });
    }
  }


  /**
   * 检查两个对象部分属性是否完全相同
   * @param {*} dic 字典
   * @param {*} prevQuery 上一次query
   * @param {*} nextQuery 下一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, ['currentId']);
    const nextQueryData = _.omit(nextQuery, ['currentId']);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  /**
   * 点击某一行记录
   * @param {*} record 当前行数据
   * @param {*} index 当前行index
   */
  @autobind
  handleRowClick(record, index) {
    const { location: { pathname, query }, replace } = this.props;
    const { dataSource = EMPTY_LIST } = this.state;

    // 设置当前选中行
    this.setState({
      curSelectedRow: index,
    });

    // 替换currentId
    replace({
      pathname,
      query: {
        ...query,
        currentId: dataSource[index].id,
      },
    });
  }

  /**
   * 页码改变事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页
   */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    this.setState({
      curPageNum: nextPage,
    });
    const { getFeedbackList, location: { query } } = this.props;
    getFeedbackList(constructPostBody(query, nextPage, currentPageSize));
  }

  /**
   * 构造表格的列数据
   */
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'issueType.feedId.description.feedEmpInfo',
      width: '80%',
      render: (text, record) => {
        // 当前行记录
        const { feedEmpInfo = EMPTY_OBJECT, issueType } = record;
        const { name = '无', l1 = '', l2 = '', l3 = '' } = feedEmpInfo;
        const typeIcon = {
          type: issueType === 'DEFECT' ? 'wenti' : 'jianyi',
          className: issueType === 'DEFECT' ? 'wenti' : 'jianyi',
        };
        return (
          <div className="leftSection">
            <div className="id">
              <Icon {...typeIcon} />
              <span className={styles.feedbackId}>{record.feedId || '无'}</span>
            </div>
            <div className="description">{record.description || '无'}</div>
            <div className="address">来自：{name}，{`${l1 || ''}${l2 || ''}${l3 || ''}` || '无'}</div>
          </div>
        );
      },
    }, {
      dataIndex: 'status.processer.processTime',
      width: '20%',
      render: (text, record) => {
        // 当前行记录
        let statusClass;
        let statusLabel;
        if (record.status) {
          statusClass = classnames({
            'state-resolve': record.status === STATUS_MAP[0].value,
            'state-close': record.status === STATUS_MAP[1].value,
          });
          statusLabel = STATUS_MAP.filter(item => item.value === record.status);
        }
        return (
          <div className="rightSection">
            <div className={statusClass}>{(statusLabel && statusLabel[0].label) || '无无'}</div>
            <div className="name">{record.processer || '无'}</div>
            <div className="date">{record.processTime || '无'}</div>
          </div>
        );
      },
    }];

    return columns;
  }

  /**
   * 构造数据源
   */
  constructTableDatas() {
    const { dataSource } = this.state;
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
    const { totalRecordNum, curPageSize, curPageNum } = this.state;
    if (changedPageSize / totalRecordNum > 1) {
      // 当前选择分页条目大于两倍的记录数
      // 则不生效，恢复当前分页条目
      this.setState({
        curPageSize,
        curPageNum,
      });
    } else {
      this.setState({
        curPageSize: changedPageSize,
        curPageNum: currentPageNum,
      });
      // 每页条目变化
      // 重新请求数据
      const { getFeedbackList, location: { query } } = this.props;
      getFeedbackList(constructPostBody(query, currentPageNum, changedPageSize));
    }
  }

  constructPageSizeOptions() {
    const { totalRecordNum, curPageSize } = this.state;
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / curPageSize);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
    }

    return pageSizeOption;
  }

  render() {
    const { dataSource, curPageNum, totalRecordNum, curPageSize, curSelectedRow } = this.state;
    if (!dataSource) {
      return null;
    }

    const columns = this.constructTableColumns();

    const paginationOptions = {
      current: curPageNum,
      defaultCurrent: 1,
      total: totalRecordNum,
      pageSize: curPageSize,
      defaultPageSize: 10,
      onChange: (nextPage, currentPageSize) => this.handlePageChange(nextPage, currentPageSize),
      showTotal: total => `总共${total}个`,
      showSizeChanger: true,
      onShowSizeChange: (currentPageNum, changedPageSize) =>
        this.handleShowSizeChange(currentPageNum, changedPageSize),
      pageSizeOptions: this.constructPageSizeOptions(),
    };

    return (
      <div className="feedbackList">
        <Table
          className="feedbackTable"
          columns={columns}
          dataSource={this.constructTableDatas()}
          onRowClick={this.handleRowClick}
          showHeader={false}
          pagination={paginationOptions}
          bordered={false}
          rowClassName={(record, index) => {
            if (curSelectedRow === index) {
              return 'active';
            }
            return 'inactive';
          }}
        />
      </div >
    );
  }
}
