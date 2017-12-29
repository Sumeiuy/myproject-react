/*
 * @Description: 任务绑定客户反馈
 * @Author: XuWenKang
 * @Date: 2017-12-21 14:49:16
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2017-12-28 16:39:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input } from 'antd';
// import _ from 'lodash';

import CommonTable from '../../../components/common/biz/CommonTable';
import { seibelConfig } from '../../../config';

import styles from './feedbackAdd.less';

const Search = Input.Search;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const { customerFeedback: { parentTitleList, childTitleList } } = seibelConfig;

export default class MissionBind extends PureComponent {
  static propTypes = {
    // 获取客户反馈列表
    queryFeedbackList: PropTypes.func.isRequired,
    // 客户反馈列表
    feedbackData: PropTypes.object.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      currentFeedback: EMPTY_OBJECT,
      keyword: '',
    };
  }

  componentDidMount() {
    const { queryFeedbackList } = this.props;
    queryFeedbackList();
  }

  // 向父组件提供数据
  @autobind
  getData() {
    const { currentFeedback } = this.state;
    return currentFeedback;
  }

  // 查询客户反馈
  @autobind
  handleSearchFeedback(keyword) {
    console.log(keyword);
    const { queryFeedbackList } = this.props;
    queryFeedbackList(keyword);
  }

  @autobind
  handleChangeKeyword(e) {
    this.setState({
      keyword: e.target.value,
    });
  }

  // 选中一级客户反馈
  @autobind
  handleSelectRow(currentFeedback) {
    console.log(currentFeedback);
    this.setState({
      currentFeedback,
    });
  }

  @autobind
  handlePageChange(value) {
    console.log(value);
    const { keyword } = this.state;
    const { queryFeedbackList } = this.props;
    queryFeedbackList(keyword, value);
  }

  render() {
    const {
      currentFeedback,
      keyword,
    } = this.state;
    const {
      feedbackData,
    } = this.props;
    const feedbackDataPage = feedbackData.page || EMPTY_OBJECT;
    const feedbackList = feedbackData.feedbackList || EMPTY_LIST;
    const childList = currentFeedback.childList || EMPTY_LIST;

    const pagination = {
      onChange: this.handlePageChange,
      pageSize: Number(feedbackDataPage.pageSize),
      current: Number(feedbackDataPage.pageNum),
      total: Number(feedbackDataPage.totalCount),
    };

    return (
      <div className={styles.feedbackAddWapper}>
        <div className={styles.searchBox}>
          <Search
            onSearch={this.handleSearchFeedback}
            onChange={this.handleChangeKeyword}
            style={{ width: 320 }}
            value={keyword}
          />
        </div>
        <div className={styles.tableBox}>
          <div className={styles.leftTable}>
            <CommonTable
              titleList={parentTitleList}
              data={feedbackList}
              pagination={pagination}
              scroll={{ y: 240 }}
              onRowClick={this.handleSelectRow}
              rowClassName={record => (record.id === currentFeedback.id ? 'current' : '')}
            />
          </div>
          <div className={styles.rightTable}>
            <CommonTable
              titleList={childTitleList}
              data={childList}
              scroll={{ y: 240 }}
            />
          </div>
        </div>
      </div>
    );
  }
}
