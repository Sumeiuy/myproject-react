/*
 * @Author: zhangjun
 * @Date: 2018-06-05 12:52:08
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-07 11:12:15
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';

import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import StockOptionApplyList from '../../components/common/appList';
import config from '../../components/stockOptionEvaluation/config';
import ViewListRow from '../../components/stockOptionEvaluation/ViewListRow';
import seibelHelper from '../../helper/page/seibel';

const { stockOptionApply, stockOptionApply: { statusOptions, pageType } } = config;

const effect = dva.generateEffect;
const effects = {
  // 左侧列表
  getList: 'app/getSeibleList',
  // 右侧详情
  getDetailInfo: 'stockOptionEvaluation/getDetailInfo',
};

const mapStateToProps = state => ({
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 左侧列表数据
  list: state.app.seibleList,
  // 右侧详情数据
  detailInfo: state.stockOptionEvaluation.detailInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getList: effect(effects.getList, { forceFull: true }),
  // 获取右侧详情信息
  getDetailInfo: effect(effects.getDetailInfo, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class StockOptionApplication extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 列表
    list: PropTypes.object.isRequired,
    getList: PropTypes.func.isRequired,
    // 右侧详情数据
    detailInfo: PropTypes.object.isRequired,
    getDetailInfo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 高亮项的下标索引
      activeRowIndex: 0,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      isShowCreateModal: false,
    };
  }

  componentDidMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
    } = this.props;
    this.queryAppList(query, pageNum, pageSize);
  }

  // 获取左侧列表
  @autobind
  queryAppList(query, pageNum = 1, pageSize = 10) {
    const { getList } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum, pageSize);
    // 默认筛选条件
    getList({ ...params, type: pageType }).then(this.getRightDetail);
  }

  // 获取右侧列表
  @autobind
  getRightDetail() {
  }

  // 点击列表每条的时候对应请求详情
  @autobind
  handleListRowClick() {
  }

  @autobind
  openCreateModalBoard() {}

  // 头部筛选后调用方法
  @autobind
  handleHeaderFilter(obj) {
    // 1.将值写入Url
    const { replace, location } = this.props;
    const { query, pathname } = location;
    // 清空掉消息提醒页面带过来的 id
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        ...obj,
      },
    });
    // 2.调用queryApplicationList接口
    this.queryAppList({ ...query, ...obj }, 1, query.pageSize);
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <ViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="stockOptionApply"
        type="kehu1"
        pageData={stockOptionApply}
      />
    );
  }

  // 切换页码
  @autobind
  handlePageNumberChange(nextPage, currentPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: nextPage,
        pageSize: currentPageSize,
      },
    });
    this.queryAppList(query, nextPage, currentPageSize);
  }

  // 切换每一页显示条数
  @autobind
  handlePageSizeChange(currentPageNum, changedPageSize) {
    const { replace, location } = this.props;
    const { query, pathname } = location;
    replace({
      pathname,
      query: {
        ...query,
        pageNum: 1,
        pageSize: changedPageSize,
      },
    });
    this.queryAppList(query, 1, changedPageSize);
  }

  render() {
    const {
      location,
      replace,
      empInfo,
      list,
    } = this.props;
    const isEmpty = _.isEmpty(list.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="stockOptionApplyPage"
        pageType={pageType}
        needSubType={false}
        stateOptions={statusOptions}
        empInfo={empInfo}
        creatSeibelModal={this.openCreateModalBoard}
        filterCallback={this.handleHeaderFilter}
        isUseOfCustomer
        needApplyTime
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      total: page.totalCount,
      pageSize: parseInt(pageSize, 10),
      onChange: this.handlePageNumberChange,
      onShowSizeChange: this.handlePageSizeChange,
    };

    const leftPanel = (
      <StockOptionApplyList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );
    return (
      <SplitPanel
        isEmpty={isEmpty}
        topPanel={topPanel}
        leftPanel={leftPanel}
      />
    );
  }
}
