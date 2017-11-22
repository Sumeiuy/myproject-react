/*
 * @Description: 执行者视图 home 页面
 * @Author: 洪光情
 * @Date: 2017-11-20 15:38:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { constructSeibelPostBody } from '../../utils/helper';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import PerformerViewList from '../../components/common/appList';
import PerformerViewDetail from '../../components/customerPool/performerView/PerformerViewDetail';
import { seibelConfig } from '../../config';

const { performerView, performerView: { pageType, subType, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});
const mapStateToProps = state => ({
  // 左侧列表数据
  performerViewList: state.app.seibleList,
});
const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getPerformerViewList: fetchDataFunction(true, 'app/getSeibleList'),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    performerViewList: PropTypes.object.isRequired,
    getPerformerViewList: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
      getPerformerViewList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getPerformerViewList({
      ...params,
      type: pageType,
    });
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {

  }

  render() {
    const {
      location,
      replace,
      performerViewList,
    } = this.props;

    const isEmpty = _.isEmpty(performerViewList.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="performerViewPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.creatPermossionModal}
        filterControl="performerView"
      />
    );

    const leftPanel = (
      <PerformerViewList
        list={performerViewList}
        replace={replace}
        location={location}
        pageName="performerView"
        type="kehu1"
        pageData={performerView}
      />
    );

    const rightPanel = (
      <PerformerViewDetail />
    );
    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="premissionList"
        />
      </div>
    );
  }
}
