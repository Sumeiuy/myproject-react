/**
 * @description 任务列表
 * @author
 */

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { autobind } from 'core-decorators';
import { withRouter } from 'dva/router';
import _ from 'lodash';
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
const OMIT_ARRAY = ['currentId', 'isResetPageNum'];
// const { comsubs, commission, commission: { pageType, subType, status } } = seibelConfig;

// const effects = {
// };

// const mapStateToProps = state => ({
// });

// const getDataFunction = (loading, type, forceFull) => query => ({
//   type,
//   payload: query || {},
//   loading,
//   forceFull,
// });

// const mapDispatchToProps = {
//   replace: routerRedux.replace,
// };

// @connect(mapStateToProps, mapDispatchToProps)
@withRouter
// @Barable
export default class TaskList extends PureComponent {

  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }


  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentDidUpdate() {

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


  render() {
    const topPanel = null;
    const leftPanel = null;
    // TODO 此处需要根据不同的子类型使用不同的Detail组件
    const rightPanel = (
      <TaskListDetail />
    );

    return (
      <div className="feedbackbox">
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
