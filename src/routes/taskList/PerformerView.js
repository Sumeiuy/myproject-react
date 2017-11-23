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
import PerformerViewDetail from '../../components/taskList/performerView/PerformerViewDetail';
import PerformerViewListRow from '../../components/taskList/performerView/PerformerViewListRow';
import { seibelConfig } from '../../config';
import appListTool from '../../components/common/appList/tool';

const EMPTY_OBJECT = {};
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
const { performerView, performerView: { pageType, subType, status } } = seibelConfig;

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const effects = {
  getSeibleList: 'app/getSeibleList',
  addServeRecord: 'customerPool/addServeRecord',
};

const mapStateToProps = state => ({
  // 左侧列表数据
  taskDetailBasicInfo: state.performerView.taskDetailBasicInfo,
  list: state.app.seibleList,
  dict: state.app.dict,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getPerformerViewList: fetchDataFunction(true, effects.getSeibleList),
  // 添加服务记录
  addServeRecord: fetchDataFunction(true, effects.addServeRecord),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class PerformerView extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    getPerformerViewList: PropTypes.func.isRequired,
    addServeRecord: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
    taskDetailBasicInfo: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      currentSubtype: '',
      isEmpty: true,
      activeRowIndex: 0,
    };
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
    }).then(this.getRightDetail);
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { location: { query: prevQuery = EMPTY_OBJECT }, getPerformerViewList } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = constructSeibelPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getPerformerViewList({
          ...params,
          type: pageType,
        }).then(this.getRightDetail);
      }
    }
  }

  componentDidUpdate() {
    const {
      location: {
        pathname,
        query,
        query: { isResetPageNum },
      },
      replace,
    } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
          pageNum: 1,
        },
      });
    }
  }

  // 获取列表后再获取某个Detail
  @autobind
  getRightDetail() {
    const {
      replace,
      list,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (!_.isEmpty(list.resultData)) {
      // 表示左侧列表获取完毕
      // 因此此时获取Detail
      const { pageNum, pageSize } = list.page;
      let item = list.resultData[0];
      let itemIndex = _.findIndex(list.resultData, o => o.id.toString() === currentId);
      if (!_.isEmpty(currentId) && itemIndex > -1) {
        // 此时url中存在currentId
        item = _.filter(list.resultData, o => String(o.id) === String(currentId))[0];
      } else {
        // 不存在currentId
        replace({
          pathname,
          query: {
            ...query,
            currentId: item.id,
            pageNum,
            pageSize,
          },
        });
        itemIndex = 0;
      }
      const { subType: st } = item;
      this.setState({
        currentSubtype: st,
        activeRowIndex: itemIndex,
      });
      this.getDetail(item);
    }
  }

  // 头部新建页面
  @autobind
  creatPermossionModal() {

  }

  // 点击列表每条的时候对应请求详情
  @autobind
  handleListRowClick(record, index) {
    const { id, subType: st } = record;
    const {
      replace,
      location: { pathname, query, query: { currentId } },
    } = this.props;
    if (currentId === id) return;
    replace({
      pathname,
      query: {
        ...query,
        currentId: id,
      },
    });
    this.setState({ currentSubtype: st, activeRowIndex: index });
    // this.getDetail4Subtye(record);
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
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // 渲染列表项里面的每一项
  @autobind
  renderListRow(record, index) {
    const { activeRowIndex } = this.state;
    return (
      <PerformerViewListRow
        key={record.id}
        data={record}
        active={index === activeRowIndex}
        onClick={this.handleListRowClick}
        index={index}
        pageName="performerView"
        pageData={performerView}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      list,
      dict,
      addServeRecord,
      taskDetailBasicInfo,
    } = this.props;

    const isEmpty = _.isEmpty(list.resultData);
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

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const paginationOptions = {
      current: parseInt(pageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: page.totalCount || 0,
      pageSize: parseInt(pageSize, 10),
      defaultPageSize: 10,
      onChange: this.handlePageNumberChange,
      showTotal: appListTool.showTotal,
      showSizeChanger: true,
      onShowSizeChange: this.handlePageSizeChange,
      pageSizeOptions: appListTool.constructPageSizeOptions(page.totalCount || 0),
    };

    const leftPanel = (
      <PerformerViewList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );

    const rightPanel = (
      <PerformerViewDetail
        dict={dict}
        isReadOnly={false}
        addServeRecord={addServeRecord}
        basicInfo={taskDetailBasicInfo}
      />
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
