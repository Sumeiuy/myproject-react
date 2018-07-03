/**
 * @Author: XuWenKang
 * @Description: 行业主题调整列表页面
 * @Date: 2018-06-19 13:27:04
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-06-29 13:50:06
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Table } from 'antd';
import _ from 'lodash';
import { dva, time } from '../../helper';
import withRouter from '../../decorators/withRouter';
import Pagination from '../../components/common/Pagination';
import Fiter from '../../components/latestView/chiefViewpoint/Filter';
import styles from './industryThemeList.less';
// import logable from '../../decorators/logable';
import config from '../../components/latestView/config';

const titleList = config.industryTitleList;
const dispatch = dva.generateEffect;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

const effects = {
  // 获取首席观点列表数据
  queryIndustryThemeList: 'latestView/queryIndustryThemeList',
};

const mapStateToProps = state => ({
  // 首席观点列表数据
  industryThemeData: state.latestView.industryThemeData,
});
const mapDispatchToProps = {
  queryIndustryThemeList: dispatch(effects.queryIndustryThemeList,
    { loading: true, forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class IndustryThemeList extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 行业主题调整列表数据
    queryIndustryThemeList: PropTypes.func.isRequired,
    industryThemeData: PropTypes.object.isRequired,
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
      queryIndustryThemeList,
    } = this.props;
    queryIndustryThemeList({
      pageSize,
      pageNum,
      type,
      keyword,
      startDate,
      endDate,
    });
  }

  @autobind
  getColumns() {
    const newTitleList = [...titleList];
    newTitleList[0].render = (item, record) => (
      <div
        className={classnames(styles.td, styles.headLine)}
        title={formatString(record.title || record.industry)}
        onClick={() => { this.showDetailModal(record); }}
      >
        <a>{formatString(record.title || record.industry)}</a>
      </div>
    );
    newTitleList[1].render = item => (
      <div className={classnames(styles.td, styles.category)}>{formatString(item)}</div>
    );
    newTitleList[2].render = item => (
      <div className={classnames(styles.td, styles.stock)}>{formatString(item)}</div>
    );
    newTitleList[3].render = (item) => {
      const date = time.format(item, config.dateFormatStr);
      return <div className={classnames(styles.td, styles.induname)}>{formatString(date)}</div>;
    };
    return newTitleList;
  }

  // 打开详情弹窗
  @autobind
  showDetailModal(data) {
    console.log('detail', data);
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
      queryIndustryThemeList,
    } = this.props;
    queryIndustryThemeList({
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
      queryIndustryThemeList,
    } = this.props;
    const newQuery = {
      ...query,
      ...param,
      pageNum: 1,
    };
    queryIndustryThemeList({
      pageNum: 1,
      pageSize: 20,
      type: newQuery.type,
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
      industryThemeData,
    } = this.props;
    const {
      list = EMPTY_ARRAY,
      page = EMPTY_OBJECT,
    } = industryThemeData;
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
            filterType={config.industryThemeFilterType}
          />
          <Table
            rowKey={'id'}
            columns={this.getColumns()}
            dataSource={list}
            pagination={false}
          />
          <Pagination {...paganationOption} />
        </div>
      </div>
    );
  }
}
