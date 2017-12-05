/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 19:35:23
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-05 09:51:03
 * 客户明细数据
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import GroupTable from '../../customerPool/groupManage/GroupTable';
import styles from './custDetail.less';
import tableStyles from '../../customerPool/groupManage/groupTable.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const INITIAL_PAGE_NUM = 1;
const INITIAL_PAGE_SIZE = 5;

export default class CustDetail extends PureComponent {

  static propTypes = {
    // 表格数据
    data: PropTypes.array,
    // 获取下一页数据
    getCustDetailData: PropTypes.func,
  }

  static defaultProps = {
    data: EMPTY_LIST,
    getCustDetailData: () => { },
  }

  constructor(props) {
    super(props);
    const {
      data: { page = EMPTY_OBJECT, listData = EMPTY_LIST },
    } = props;
    const { totalRecordNum } = page;
    this.state = {
      curPageNum: INITIAL_PAGE_NUM,
      curPageSize: INITIAL_PAGE_SIZE,
      totalRecordNum: totalRecordNum || INITIAL_PAGE_NUM,
      dataSource: listData || EMPTY_LIST,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { data: { page: nextPage, listData } } = nextProps;
    const { data: { page } } = this.props;
    if (page !== nextPage) {
      const { curPageNum, curPageSize, totalRecordNum } = nextPage || EMPTY_OBJECT;
      this.setState({
        curPageNum,
        curPageSize,
        totalRecordNum,
        dataSource: listData,
      });
    }
  }

  /**
    * 页码改变事件，翻页事件
    * @param {*} nextPage 下一页码
    * @param {*} curPageSize 当前页条目
    */
  @autobind
  handlePageChange(nextPage, currentPageSize) {
    console.log(nextPage, currentPageSize);
    const { getCustDetailData } = this.props;
    this.setState({
      curPageNum: nextPage,
      curPageSize: currentPageSize,
    });
    getCustDetailData(nextPage, currentPageSize);
  }

  /**
   * 改变每一页的条目
   * @param {*} currentPageNum 当前页码
   * @param {*} changedPageSize 当前每页条目
   */
  @autobind
  handleShowSizeChange(currentPageNum, changedPageSize) {
    console.log(currentPageNum, changedPageSize);
    const { getCustDetailData } = this.props;
    this.setState({
      curPageNum: currentPageNum,
      curPageSize: changedPageSize,
    });
    getCustDetailData(currentPageNum, changedPageSize);
  }

  /**
   * 为数据源的每一项添加一个id属性
   * @param {*} listData 数据源
   */
  addIdToDataSource(listData) {
    if (!_.isEmpty(listData)) {
      return _.map(listData, item => _.merge(item, { id: item.custId }));
    }

    return [];
  }

  renderColumnTitle() {
    // "custName":"1-5TTJ-3900",
    // "custId":"118000119822",
    // "levelName":"钻石",
    // "riskLevelName":"稳定"
    return [{
      key: 'custName',
      value: '客户名称',
    },
    {
      key: 'custType',
      value: '客户类型',
    },
    {
      key: 'department',
      value: '所在营业部',
    },
    {
      key: 'serveManager',
      value: '服务经理',
    },
    {
      key: 'serveStatus',
      value: '服务状态',
    },
    {
      key: 'custFeedback',
      value: '客户反馈',
    },
    {
      key: 'feedbackDetail',
      value: '反馈详情',
    }];
  }

  render() {
    const {
      data: { listData = EMPTY_LIST },
    } = this.props;

    const {
      curPageNum,
      curPageSize,
      totalRecordNum,
    } = this.state;

    // 构造表格头部
    const titleColumn = this.renderColumnTitle();

    // 添加id到dataSource
    const newDataSource = this.addIdToDataSource(listData);

    return (
      <div className={styles.custDetailWrapper}>
        <div className={styles.title}>已反馈客户共{totalRecordNum || 0}人</div>
        <div className={styles.custDetailTableSection}>
          <GroupTable
            pageData={{
              curPageNum,
              curPageSize,
              totalRecordNum,
            }}
            listData={newDataSource}
            onSizeChange={this.handleShowSizeChange}
            onPageChange={this.handlePageChange}
            tableClass={
              classnames({
                [tableStyles.groupTable]: true,
                [styles.custDetailTable]: true,
              })
            }
            columnWidth={[100, 100, 130, 100, 100, 110, 130]}
            titleColumn={titleColumn}
            // 固定标题，内容滚动
            scrollY={330}
            isFixedTitle
          />
        </div>
      </div>
    );
  }
}
