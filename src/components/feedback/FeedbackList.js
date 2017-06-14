import React, { PropTypes, PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';
import styles from './feedbackList.less';
import Icon from '../common/Icon';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

export default class FeedbackList extends PureComponent {
  static propTypes = {
    list: PropTypes.object.isRequired,
    getFeedbackList: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
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
    };
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    const { list: nextList = EMPTY_OBJECT } = nextProps;
    const { list: preList = EMPTY_OBJECT } = this.props;
    const { resultData: nextResultData = EMPTY_LIST, page = EMPTY_OBJECT } = nextList;
    const { resultData: preResultData = EMPTY_LIST } = preList;
    const { curPageNum = 1, totalPageNum = 1, totalRecordNum = 1 } = page;
    if (preResultData !== nextResultData) {
      this.setState({
        dataSource: nextResultData,
        totalRecordNum,
        totalPageNum,
        curPageNum,
      });
    }
  }

  /**
   * 点击某一行记录
   * @param {*} record 当前行数据
   * @param {*} index 当前行index
   */
  @autobind
  handleRowClick(record, index) {
    console.log('record---->', record, 'index---->', index);
    const { curSelectedRow: prevSelectedRow } = this.state;
    /* eslint-disable */
    const prevRowElem =
      ReactDOM.findDOMNode(document.querySelector(`.feedbackTable table > tbody > tr:nth-child(${prevSelectedRow + 1})`));
    /* eslint-enable */
    if (prevRowElem) {
      // 偶数行
      if (prevSelectedRow % 2 === 0) {
        prevRowElem.style.backgroundColor = '#f9f9f9';
      } else {
        prevRowElem.style.backgroundColor = '#ffffff';
      }
    }
    this.setState({
      curSelectedRow: index,
    }, () => {
      /* eslint-disable */
      const currentRowElem =
        ReactDOM.findDOMNode(document.querySelector(`.feedbackTable table > tbody > tr:nth-child(${index + 1})`));
      /* eslint-enable */
      if (currentRowElem) {
        currentRowElem.style.backgroundColor = '#e4eef8';
      }
    });
  }

  /**
   * 页码改变事件
   * @param {*} nextPage 下一页码
   * @param {*} curPageSize 当前页
   */
  @autobind
  handlePageChange(nextPage, curPageSize) {
    console.log(nextPage, curPageSize);
    this.setState({
      curPageNum: nextPage,
    });
    const { getFeedbackList, location: { query } } = this.props;
    getFeedbackList({
      ...query,
      pageNum: nextPage,
      pageSize: curPageSize,
    });
  }

  //   {
  //   type: 'problem',
  //   code: '1232112',
  //   status: '解决中',
  //   description: '王企鹅无群二无群二无群二无群多无群无群无群若无群付群无群若付无群付无群若群无人',
  //   manager: '赵云龙',
  //   userName: '王强',
  //   userDepartment: '南京市长江路营业厅',
  //   date: '2017-02-23',
  // },

  /**
   * 构造表格的列数据
   */
  @autobind
  constructorTableColumns() {
    const columns = [{
      dataIndex: 'type.code.description.userName.userDepartment',
      width: '80%',
      className: 'tdLeft',
      render: (text, record) => {
        // 当前行记录
        console.log(text, record);
        return (
          <div className="leftSection">
            <div className="code">
              <Icon type="renyuan" className="" />
              <span className={styles.feedbackId}>{record.code}</span>
            </div>
            <div className="description">{record.description}</div>
            <div className="address">来自：{record.userName}，{record.userDepartment}</div>
          </div>
        );
      },
    }, {
      dataIndex: 'status.manager.date',
      width: '20%',
      className: 'tdLeft',
      render: (text, record) => {
        // 当前行记录
        console.log(text, record);
        const stateClass = classnames({
          'state-resolve': record.status === '解决中',
          'state-close': record.status === '关闭',
        });
        return (
          <div className="rightSection">
            <div className={stateClass}>{record.status}</div>
            <div className="name">{record.manager}</div>
            <div className="date">{record.date}</div>
          </div>
        );
      },
    }];

    return columns;
  }

  /**
   * 构造数据源
   */
  constructorTableDatas() {
    const { dataSource } = this.state;
    const newDataSource = [];
    if (dataSource.length > 0) {
      dataSource.forEach((currentValue, index) =>
        newDataSource.push(_.merge(currentValue, { key: index })),
      );
    }

    console.log('constructor dataSource', newDataSource);
    return newDataSource;
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    this.setState({
      curPageSize: changedPageSize,
    });
  }

  render() {
    const { dataSource, curPageNum, totalRecordNum } = this.state;
    if (!dataSource) {
      return null;
    }

    const columns = this.constructorTableColumns();

    const paginationOptions = {
      current: curPageNum,
      defaultCurrent: 1,
      total: totalRecordNum,
      defaultPageSize: 10,
      onChange: (nextPage, curPageSize) => this.handlePageChange(nextPage, curPageSize),
      showTotal: total => `总共${total}个`,
      showSizeChanger: true,
      onShowSizeChange: (currentPageNum, changedPageSize) =>
        this.handleShowSizeChange(currentPageNum, changedPageSize),
    };

    return (
      <div className="feedbackList">
        <Table
          className="feedbackTable"
          columns={columns}
          dataSource={this.constructorTableDatas()}
          onRowClick={this.handleRowClick}
          showHeader={false}
          pagination={paginationOptions}
          bordered={false}
        />
      </div >
    );
  }
}
