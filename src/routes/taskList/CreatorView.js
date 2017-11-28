/**
 * @file customerPool/TaskList.js
 *  客户池-任务列表
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import seibelHelper from '../../helper/page/seibel';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedPageHeader from '../../components/taskList/ConnectedPageHeader';
import RightPanel from '../../components/taskList/creatorView/RightPanel';
import ViewList from '../../components/common/appList';
import ViewListRow from '../../components/taskList/ViewListRow';
import appListTool from '../../components/common/appList/tool';
import { fspContainer } from '../../config';
import pageConfig from '../../components/taskList/pageConfig';
import { fspGlobal } from '../../utils';

const EMPTY_OBJECT = {};

const OMIT_ARRAY = ['isResetPageNum', 'currentId'];

const {
  taskList,
  taskList: { pageType, viewType, status, chooseMissionView },
} = pageConfig;

const fetchDataFunction = (globalLoading, value) => query => ({
  type: value,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // 登录人信息
  empInfo: state.app.empInfo,
  // 左侧列表
  list: state.performerView.taskList,
  // 客户细分导入数据
  priviewCustFileData: state.tasklist.priviewCustFileData,
  taskBasicInfo: state.tasklist.taskBasicInfo,
  // 列表请求状态
  seibelListLoading: state.loading.effects['app/getSeibleList'],
});

const mapDispatchToProps = {
  push: routerRedux.push,
  replace: routerRedux.replace,
  // 获取左侧列表
  getCreatorViewlist: fetchDataFunction(true, 'performerView/getTaskList'),
  previewCustFile: fetchDataFunction(true, 'tasklist/previewCustFile'),
  getTaskBasicInfo: fetchDataFunction(true, 'tasklist/getTaskBasicInfo'),
  // 清除数据
  clearTaskFlowData: query => ({
    type: 'customerPool/clearTaskFlowData',
    payload: query || {},
  }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class CreatorView extends PureComponent {

  static propTypes = {
    dict: PropTypes.object,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
    getCreatorViewlist: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    priviewCustFileData: PropTypes.object,
    previewCustFile: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    seibelListLoading: PropTypes.bool,
    clearTaskFlowData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    dict: EMPTY_OBJECT,
    priviewCustFileData: EMPTY_OBJECT,
    seibelListLoading: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeRowIndex: 0,
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
      getCreatorViewlist,
    } = this.props;
    const params = seibelHelper.constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getCreatorViewlist({
      ...params,
      type: pageType,
    }).then(this.getRightDetail);
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: { query: nextQuery = EMPTY_OBJECT },
    } = nextProps;
    const {
      location: { query: prevQuery = EMPTY_OBJECT },
      getCreatorViewlist,
     } = this.props;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = seibelHelper.constructSeibelPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getCreatorViewlist({
          ...params,
          type: pageType,
        }).then(this.getRightDetail);
      }
    }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace } = this.props;
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
      this.props.getTaskBasicInfo({
        flowId: currentId,
        systemCode: '102330',
      });
    }
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

  @autobind
  handlePreview({ filename, pageNum, pageSize }) {
    const { previewCustFile } = this.props;
    // 预览数据
    previewCustFile({
      filename,
      pageNum,
      pageSize,
    });
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
    this.props.getTaskBasicInfo({
      flowId: currentId,
      systemCode: '102330',
    });
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

  // 头部新建按钮，跳转到新建表单
  @autobind
  handleCreateBtnClick() {
    const url = '/customerPool/taskFlow';
    const { clearTaskFlowData } = this.props;
    clearTaskFlowData();
    if (document.querySelector(fspContainer.container)) {
      fspGlobal.openRctTab({
        url,
        param: {
          id: 'FSP_ST_TAB_MOT_SELFBUILD_ADD',
          title: '新建自建任务',
          closable: true,
          isSpecialTab: true,
        },
      });
    } else {
      this.props.push(url);
    }
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
        pageName="creatorView"
        pageData={taskList}
      />
    );
  }

  render() {
    const {
      location,
      replace,
      empInfo,
      list,
      taskBasicInfo,
      priviewCustFileData,
    } = this.props;
    const topPanel = (
      <ConnectedPageHeader
        location={location}
        replace={replace}
        page="creatorView"
        pageType={pageType}
        typeOptions={viewType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        chooseMissionViewOptions={chooseMissionView}
        empInfo={empInfo}
      />
    );

    // 生成页码器，此页码器配置项与Antd的一致
    const { location: { query: { pageNum = 1, pageSize = 10 } } } = this.props;
    const { resultData = [], page = {} } = list;
    const isEmpty = _.isEmpty(list.resultData);
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
      <ViewList
        list={resultData}
        renderRow={this.renderListRow}
        pagination={paginationOptions}
      />
    );
    const rightPanel = (
      <RightPanel
        onPreview={this.handlePreview}
        priviewCustFileData={priviewCustFileData}
        taskBasicInfo={taskBasicInfo}
      />
    );
    return (
      <div>
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
        />
      </div>
    );
  }
}
