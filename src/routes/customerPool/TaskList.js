/**
 * @file customerPool/TaskList.js
 *  客户池-任务列表
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Columns from '../../components/customerPool/taskList_/Columns';
import RightPanel from '../../components/customerPool/taskList_/RightPanel';
import LeftList from '../../components/common/biz/CommonList';
import { seibelConfig, fspContainer } from '../../config';
import { fspGlobal } from '../../utils';

import styles from './tasklist.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};

const OMIT_ARRAY = ['isResetPageNum', 'currentId'];

const { tasklist, tasklist: { pageType, type, status } } = seibelConfig;

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
  list: state.app.seibleList,
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
  getTasklist: fetchDataFunction(true, 'app/getSeibleList'),
  previewCustFile: fetchDataFunction(true, 'tasklist/previewCustFile'),
  getTaskBasicInfo: fetchDataFunction(true, 'tasklist/getTaskBasicInfo'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskList extends PureComponent {

  static propTypes = {
    dict: PropTypes.object,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    empInfo: PropTypes.object.isRequired,
    getTasklist: PropTypes.func.isRequired,
    list: PropTypes.object.isRequired,
    priviewCustFileData: PropTypes.object,
    previewCustFile: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    seibelListLoading: PropTypes.bool,
  };

  static defaultProps = {
    dict: EMPTY_OBJECT,
    priviewCustFileData: EMPTY_OBJECT,
    seibelListLoading: false,
  };

  componentDidMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
      getTasklist,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getTasklist({
      ...params,
      type: pageType,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      location: { query: nextQuery = EMPTY_OBJECT },
      list,
    } = nextProps;
    const {
      location: { query: prevQuery = EMPTY_OBJECT },
      getTasklist,
     } = this.props;
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
        getTasklist({
          ...params,
          type: pageType,
        });
      }
    }
    const { seibelListLoading: prevSLL } = this.props;
    const { seibelListLoading: nextSLL } = nextProps;
    const applicationBaseInfoList = list.resultData;
    const { currentId } = nextQuery;
    const { currentId: prevCurrentId } = prevQuery;
    /* currentId变化重新请求 */
    if ((prevSLL && !nextSLL && !_.isEmpty(applicationBaseInfoList)) ||
      (currentId && (currentId !== prevCurrentId) && !_.isEmpty(applicationBaseInfoList))) {
      const { getTaskBasicInfo } = this.props;
      getTaskBasicInfo({
        flowId: currentId,
        systemCode: '102330',
      });
      this.setState({ detailMessage: {} });
    }
    // 当redux 中 detailMessage的数据放生变化的时候 重新setState赋值
    if (this.props.taskBasicInfo !== nextProps.taskBasicInfo) {
      this.setState({ detailMessage: nextProps.taskBasicInfo });
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

  // 头部新建按钮，跳转到新建表单
  @autobind
  handleCreateBtnClick() {
    const url = '/customerPool/taskFlow';
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

  // 生成左侧列表页面的数据列
  @autobind
  constructTableColumns() {
    return Columns({
      pageName: 'tasklist',
      type: 'tasklist',
      pageData: tasklist,
    });
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

  render() {
    const {
      location,
      replace,
      empInfo,
      list,
      taskBasicInfo,
      priviewCustFileData,
    } = this.props;
    const { resultData = EMPTY_LIST } = list;
    const isEmpty = !resultData.length;
    // 页面头部需要用到的控件
    const topPanelNeedWidgets = {
      needType: true,
      needStatus: true,
      needCreator: true,
      needCreationTime: true,
    };
    const topPanel = (
      <ConnectedSeibelHeader
        {...topPanelNeedWidgets}
        location={location}
        replace={replace}
        page="tasklist"
        pageType={pageType}
        subtypeOptions={type}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        empInfo={empInfo}
      />
    );
    const leftPanel = (
      <LeftList
        pageName="tasklist"
        list={list}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
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
      <div className={styles.tasklist}>
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
