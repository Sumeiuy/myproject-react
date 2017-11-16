/**
 * @description 任务列表
 * @author
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva/router';
// import _ from 'lodash';
// import { message } from 'antd';

// import confirm from '../../components/common/confirm_';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import TaskListDetail from '../../components/customerPool/taskList/TaskListDetail';
// import CommissionList from '../../components/common/biz/CommonList';
// import seibelColumns from '../../components/common/biz/seibelColumns';
// import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
// import { seibelConfig } from '../../config';
// import { permission } from '../../utils';
// import Barable from '../../decorators/selfBar';
import './home.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
// const { comsubs, commission, commission: { pageType, subType, status } } = seibelConfig;

const effects = {
  // 客户预览
  previewCustFile: 'customerPool/previewCustFile',
  getTaskBasicInfo: 'customerPool/getTaskBasicInfo',
};

const mapStateToProps = state => ({
  // 字典信息
  dict: state.app.dict,
  // 客户细分导入数据
  priviewCustFileData: state.customerPool.priviewCustFileData,
  taskBasicInfo: state.customerPool.taskBasicInfo,
});

const getDataFunction = (loading, type, forceFull) => query => ({
  type,
  payload: query || {},
  loading,
  forceFull,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  previewCustFile: getDataFunction(true, effects.previewCustFile),
  getTaskBasicInfo: getDataFunction(true, effects.getTaskBasicInfo),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
// @Barable
export default class TaskList extends PureComponent {

  static propTypes = {
    dict: PropTypes.object,
    priviewCustFileData: PropTypes.object.isRequired,
    previewCustFile: PropTypes.func.isRequired,
    getTaskBasicInfo: PropTypes.func.isRequired,
    taskBasicInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dict: {},
    // priviewCustFileData: {},
    // taskBasicInfo: {},
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    // this.handleTaskBasicInfo();
    console.warn('taskBasicInfo-->', this.props.taskBasicInfo);
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.taskBasicInfo);
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
    const topPanel = null;
    const leftPanel = (
      <div>
        <a onClick={this.handleTaskBasicInfo}>点击</a>
      </div>
    );
    const { priviewCustFileData, taskBasicInfo } = this.props;
    // TODO 此处需要根据不同的子类型使用不同的Detail组件
    const rightPanel = (
      <TaskListDetail
        onPreview={this.handlePreview}
        priviewCustFileData={priviewCustFileData}
        taskBasicInfo={taskBasicInfo}
      />
    );
    return (
      <div className="feedbackbox" >
        <SplitPanel
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          isEmpty={false}
          leftListClassName="feedbackList"
        />
      </div>
    );
  }
}
