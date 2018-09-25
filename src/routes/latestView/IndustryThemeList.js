/**
 * @Author: XuWenKang
 * @Description: 行业主题调整列表页面
 * @Date: 2018-06-19 13:27:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-28 17:42:39
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
import ViewpointDetailModal from '../../components/latestView/ziJinClockView/ViewpointDetailModal';
import styles from './industryThemeList.less';
import config from '../../components/latestView/config';
import { logPV } from '../../decorators/logable';

const titleList = config.industryTitleList;
const { generateEffect } = dva;
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

function formatString(str) {
  return _.isEmpty(str) ? '--' : str;
}

const DETAIL_MODAL_VISIBLE = 'detailModalVisible';
const effects = {
  // 获取首席观点列表数据
  queryIndustryThemeList: 'latestView/queryIndustryThemeList',
};

const mapStateToProps = state => ({
  // 首席观点列表数据
  industryThemeData: state.latestView.industryThemeData,
});
const mapDispatchToProps = {
  queryIndustryThemeList: generateEffect(effects.queryIndustryThemeList,
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

  constructor(props) {
    super(props);
    this.state = {
      [DETAIL_MODAL_VISIBLE]: false,
      modalData: {},
    };
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
    return newTitleList.map((item) => {
      if (item.key === 'title') {
        return {
          ...item,
          render: (text, record) => (
            <div
              className={classnames(styles.td, styles.headLine)}
              title={formatString(record.title || record.industry)}
              onClick={() => { this.openModal(record); }}
            >
              <a>{formatString(record.title || record.industry)}</a>
            </div>
          ),
        };
      }
      if (item.key === 'direction') {
        return {
          ...item,
          render: text => (
            <div className={classnames(styles.td, styles.category)} title={formatString(text)}>
              {formatString(text)}
            </div>
          ),
        };
      }
      if (item.key === 'reason') {
        return {
          ...item,
          render: text => (
            <div className={classnames(styles.td, styles.stock)} title={formatString(text)}>
              {formatString(text)}
            </div>
          ),
        };
      }
      if (item.key === 'time') {
        return {
          ...item,
          render: (text) => {
            const date = time.format(text, config.dateFormatStr);
            return (
              <div
                className={classnames(styles.td, styles.induname)}
                title={formatString(date)}
              >
                {formatString(date)}
              </div>
            );
          },
        };
      }
      return item;
    });
  }

  // 由于后端返回的列表数据没有唯一的key值，所以拼一个不会重复的rowKey用作渲染时的key
  @autobind
  getTransformList(list) {
    return list.map((item, index) => (
      {
        ...item,
        rowKey: index,
      }
    ));
  }

  // 打开弹窗
  @autobind
  @logPV({ pathname: '/modal/industryThemeListData', title: '调整信息' })
  openModal(data) {
    this.setState({
      modalData: data,
      [DETAIL_MODAL_VISIBLE]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
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
    const { modalData } = this.state;
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
            rowKey={'rowKey'}
            columns={this.getColumns()}
            dataSource={this.getTransformList(list)}
            pagination={false}
          />
          <Pagination {...paganationOption} />
        </div>
        <ViewpointDetailModal
          modalKey={DETAIL_MODAL_VISIBLE}
          visible={this.state[DETAIL_MODAL_VISIBLE]}
          closeModal={this.closeModal}
          data={modalData}
        />
      </div>
    );
  }
}
