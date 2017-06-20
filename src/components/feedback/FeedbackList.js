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
// 筛选条件字典
const ENUM_DICTIONARY = [
  'appId',
  'userId',
  'userType',
  'issueType',
  'feedbackStatusEnum',
  'feedbackTagEnum',
  'functionName',
  'feedbackCreateTimeFrom',
  'feedbackCreateTimeTo',
  'processer',
];

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
    const { currentId: prevCurrentId } = prevQuery;
    if (prevResultData !== nextResultData) {
      this.setState({
        dataSource: nextResultData,
        totalRecordNum,
        totalPageNum,
        curPageNum,
        currentId: currentId || this.state.currentId
        || (nextResultData[0] && nextResultData[0].id),
      }, () => {
        this.setState({
          curSelectedRow: _.findIndex(this.state.dataSource,
            item => item.id === this.state.currentId),
        });
      });
    }
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      // 改变了选中的行
      if (currentId && prevCurrentId !== currentId) {
        this.setState({
          curSelectedRow: _.findIndex(this.state.dataSource, item => item.id === currentId),
          currentId,
        });
      }

      if (!this.checkObjectPropertyValue(ENUM_DICTIONARY, prevQuery, nextQuery)) {
        const { curPageNum: newPageNum, curPageSize: newPageSize } = this.state;

        // "appId": "MCRM", // FSP
        // "userId": "002332", //提问题的员工号
        // "userType": "EMP", //固定值
        // "issueType": "DEFECT", // 建议SUGGESTION
        // "feedbackStatusEnum": "CLOSED",
        // "feedbackTagEnum": "EXPERIENCE",
        // "functionName": "functionname",
        // "feedbackCreateTimeFrom": "2017-06-15",
        // "feedbackCreateTimeTo": "2017-06-15",
        // "processer": "011105",//处理问题的员工
        // "page": {
        // "curPageNum": 1,
        // "pageSize": 10
        // }

        console.log(
          constructPostBody(nextQuery, newPageNum, newPageSize),
        );

        // 只监测筛选条件是否变化
        getFeedbackList(constructPostBody(nextQuery, newPageNum, newPageSize));
      }
    }
  }

  componentDidUpdate() {
    const { curSelectedRow, curPageNum, currentId } = this.state;

    console.log('curSelectedRow------->', curSelectedRow);

    console.log('currentId------->', currentId);

    console.log('curPageNum------->', curPageNum);
  }

  /**
   * 检查两个对象部分属性是否完全相同
   * @param {*} dic 字典
   * @param {*} prevQuery 上一次query
   * @param {*} nextQuery 下一次query
   */
  checkObjectPropertyValue(dic, prevQuery, nextQuery) {
    const len = dic.length;
    for (let i = 0; i < len; i++) {
      const value = dic[i];
      if (prevQuery[value] && nextQuery[value] && prevQuery[value] !== nextQuery[value]) {
        return false;
      }
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
    console.log('record---->', record, 'index---->', index);

    const { location: { pathname, query }, replace } = this.props;
    const { dataSource = EMPTY_LIST } = this.state;
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
    console.log(nextPage, currentPageSize);
    this.setState({
      curPageNum: nextPage,
    });
    const { getFeedbackList, location: { query } } = this.props;
    constructPostBody(query, nextPage, currentPageSize);
    getFeedbackList(constructPostBody(query, nextPage, currentPageSize));
  }

  // {
  // "appId": "MCRM",
  // "createTime": "2017-06-15 12:23:10",
  // "description": null, //问题描述
  // "id": null, //问题数据库id
  // "issueType": "D", //问题类型 故障建议
  // "mediaUrls": null, //上传的图片列表
  // "pageName": null, //问题所在页面
  // "title": null, //问题标题
  // "userId": "002332", //提交问题员工
  // "userInfo": { //提交问题的员工信息
  // "name": "1-OH2N",
  // "rowId": "1-OH2N",
  // "gender": "女",
  // "eMailAddr": "example@htsc.com",
  // "cellPhone": "18969025699"
  // },
  // "userType": "emp",
  // "version": null,//版本
  // "functionName": "functionName",//功能模块
  // "goodRate": null,//是否好评
  // "status": "2",//问题状态
  // "processer": "011105",//处理问题的员工
  // "tag": "5",//问题标签
  // "processTime": null,//处理问题时间
  // "feedId": null,//问题逻辑id
  // "jiraId": null,//对应的jiraId
  // "attachmentJson": null,//
  // "attachModelList": null//上传的附件列表
  // }

  /**
   * 构造表格的列数据
   */
  @autobind
  constructTableColumns() {
    const columns = [{
      dataIndex: 'issueType.id.description.userInfo.userDepartment',
      width: '80%',
      render: (text, record, index) => {
        // 当前行记录
        console.log(text, record, index);
        const { userInfo = EMPTY_OBJECT, issueType } = record;
        const { name = '--' } = userInfo;
        const typeIcon = {
          type: issueType === 'D' ? 'wenti' : 'jianyi',
          className: issueType === 'D' ? 'wenti' : 'jianyi',
        };
        return (
          <div className="leftSection">
            <div className="id">
              <Icon {...typeIcon} />
              <span className={styles.feedbackId}>{record.id || '--'}</span>
            </div>
            <div className="description">{record.description || '问问群二23带我去二多群二群翁31带我去二无群二321第五期电位器21而我却二无群二'}</div>
            <div className="address">来自：{name}，{record.userDepartment || '南京市长江路营业厅'}</div>
          </div>
        );
      },
    }, {
      dataIndex: 'status.processer.processTime',
      width: '20%',
      render: (text, record, index) => {
        // 当前行记录
        console.log(text, record, index);
        let statusClass;
        let statusLabel;
        if (record.status) {
          statusLabel = STATUS_MAP[parseInt(record.status, 10) - 1].label;
          statusClass = classnames({
            'state-resolve': statusLabel === '解决中',
            'state-close': statusLabel === '关闭',
          });
        }
        return (
          <div className="rightSection">
            <div className={statusClass}>{statusLabel}</div>
            <div className="name">{record.processer || '--'}</div>
            <div className="date">{record.processTime || '--'}</div>
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
    }
  }

  constructPageSizeOptions() {
    const { totalRecordNum, curPageSize } = this.state;
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / curPageSize);
    for (let i = 1; i <= maxPage; i++) {
      pageSizeOption.push((10 * i).toString());
    }
    console.log('pageSizeOption', pageSizeOption);
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
            return '';
          }}
        />
      </div >
    );
  }
}
