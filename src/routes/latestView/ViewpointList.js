/**
 * @Author: XuWenKang
 * @Description: 首席观点列表页面
 * @Date: 2018-06-19 13:27:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-28 16:34:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';
import { linkTo } from '../../utils';
import { url as urlHelper, dva, time } from '../../helper';
import withRouter from '../../decorators/withRouter';
import Pagination from '../../components/common/Pagination';
import Fiter from '../../components/latestView/chiefViewpoint/Filter';
import styles from './viewpointList.less';
import logable from '../../decorators/logable';
import config from '../../components/latestView/config';

const titleList = config.viewpointTitleList;
const { generateEffect } = dva;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

const effects = {
  // 获取首席观点列表数据
  queryChiefViewpointList: 'latestView/queryChiefViewpointList',
};

const mapStateToProps = state => ({
  // 首席观点列表数据
  viewpointData: state.latestView.viewpointData,
});
const mapDispatchToProps = {
  queryChiefViewpointList: generateEffect(effects.queryChiefViewpointList,
    { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class ViewpointList extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 首席观点列表数据
    queryChiefViewpointList: PropTypes.func.isRequired,
    viewpointData: PropTypes.object.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const {
      location: {
        query: {
          pageSize = 20,
          pageNum = 1,
          type,
          keyword,
          startDate,
          endDate,
        },
      },
      queryChiefViewpointList,
    } = this.props;
    queryChiefViewpointList({
      pageSize,
      pageNum,
      type: type.split(','),
      keyword,
      startDate,
      endDate,
    });
  }

  @autobind
  getColumns() {
    const newTitleList = [...titleList];
    _.find(newTitleList, item => item.key === 'title').render = (item, record) => (
      <div
        className={classnames(styles.td, styles.headLine)}
        title={formatString(item)}
        onClick={() => { this.toDetailPage(record); }}
      >
        <a>{formatString(item)}</a>
      </div>
    );
    _.find(newTitleList, item => item.key === 'typeName').render = item => (
      <div className={classnames(styles.td, styles.category)} title={formatString(item)}>
        {formatString(item)}
      </div>
    );
    _.find(newTitleList, item => item.key === 'stockName').render = item => (
      <div className={classnames(styles.td, styles.stock)} title={formatString(item)}>
        {formatString(item)}
      </div>
    );
    _.find(newTitleList, item => item.key === 'industryName').render = item => (
      <div className={classnames(styles.td, styles.induname)} title={formatString(item)}>
        {formatString(item)}
      </div>
    );
    _.find(newTitleList, item => item.key === 'time').render = (item) => {
      const date = time.format(item, config.dateFormatStr);
      return (
        <div className={classnames(styles.td, styles.pubdatelist)} title={formatString(date)}>
          {formatString(date)}
        </div>
      );
    };
    _.find(newTitleList, item => item.key === 'author').render = item => (
      <div
        className={classnames(styles.td, styles.authors)}
        title={formatString(item)}
      >
        {formatString(item)}
      </div>
    );
    return newTitleList;
  }

  // 当前页跳转到详情页
  @autobind
  @logable({
    type: 'ViewItem',
    payload: {
      name: '咨询详情',
      type: '$args[0].typeName',
      subType: '$args[0].title',
    },
  })
  toDetailPage(data) {
    const { location: { query } } = this.props;
    const { id } = data;
    const { push } = this.context;
    const param = { id: 'RTC_TAB_VIEWPOINT', title: '资讯' };
    const url = '/latestView/viewpointDetail';
    const newQuery = { ...query, id, sourceUrl: '/latestView/viewpointList' };
    linkTo({
      routerAction: push,
      url: `${url}?${urlHelper.stringify(newQuery)}`,
      param,
      pathname: url,
      query: newQuery,
      name: '资讯详情',
    });
  }

  @autobind
  handlePageChange(pageNum) {
    const { replace } = this.context;
    const {
      location: {
        pathname,
        query,
        query: {
          type,
          keyword,
          startDate,
          endDate,
        },
      },
      queryChiefViewpointList,
    } = this.props;
    queryChiefViewpointList({
      pageNum,
      pageSize: 20,
      type,
      keyword,
      startDate,
      endDate,
    }).then(() => {
      replace({ pathname, query: { ...query, pageNum } });
    });
  }

  @autobind
  handleQueryList(param) {
    const { replace } = this.context;
    const {
      location: {
        pathname,
        query,
      },
      queryChiefViewpointList,
    } = this.props;
    const newQuery = {
      ...query,
      ...param,
      type: param.type.join(','),
      pageNum: 1,
    };
    queryChiefViewpointList({
      pageNum: 1,
      pageSize: 20,
      type: param.type,
      keyword: newQuery.keyword,
      startDate: newQuery.startDate,
      endDate: newQuery.endDate,
    }).then(() => {
      replace({ pathname, query: { ...newQuery } });
    });
  }

  render() {
    const {
      location: {
        query: {
          type,
          keyword,
          startDate,
          endDate,
        },
      },
      viewpointData,
    } = this.props;
    const {
      list = EMPTY_ARRAY,
      page = EMPTY_OBJECT,
    } = viewpointData;
    const paganationOption = {
      current: page.curPageNum,
      pageSize: page.pageSize,
      total: page.totalRecordNum,
      onChange: this.handlePageChange,
    };
    return (
      <div className={styles.listContainer}>
        <div
          className={styles.inner}
        >
          <Fiter
            type={type}
            keyword={keyword}
            startDate={startDate}
            endDate={endDate}
            onFilter={this.handleQueryList}
          />
          <Table
            rowKey={'id'}
            columns={this.getColumns()}
            dataSource={list}
            pagination={false}
            scroll={{ x: 1100 }}
          />
          <Pagination {...paganationOption} />
        </div>
      </div>
    );
  }
}
