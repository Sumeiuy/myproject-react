/*
 * @Descripter: 任务分析报表
 * @Author: zhangjun
 * @Date: 2018-10-05 11:24:10
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-10 10:07:27
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import TaskCustomerReport from '../../components/taskAnalysisReport/TaskCustomerReport';

import styles from './home.less';

const effect = dva.generateEffect;

const effects = {
  // 任务-客户报表
  getTaskCustomer: 'taskAnalysisReport/getTaskCustomer',
  // 完成服务客户统计
  getCompleteServiceCust: 'taskAnalysisReport/getCompleteServiceCust',
  // 达标服务客户统计
  getComplianceServiceCust: 'taskAnalysisReport/getComplianceServiceCust',
  // 服务渠道统计
  getServiceChannel: 'taskAnalysisReport/getServiceChannel',
};

const mapStateToProps = state => ({
  // 任务-客户报表数据
  taskCustomerList: state.taskAnalysisReport.taskCustomerList,
  // 完成服务客户统计数据
  completeServiceCustList: state.taskAnalysisReport.completeServiceCustList,
  // 达标服务客户统计数据
  complianceServiceCustList: state.taskAnalysisReport.complianceServiceCustList,
  // 服务渠道统计数据
  serviceChannelList: state.taskAnalysisReport.serviceChannelList,
});

const mapDispatchToProps = {
  // 获取任务-客户报表数据
  getTaskCustomer: effect(effects.getTaskCustomer, { forceFull: true }),
  // 获取完成服务客户统计数据
  getCompleteServiceCust: effect(effects.getCompleteServiceCust, { forceFull: true }),
  // 获取达标服务客户统计数据
  getComplianceServiceCust: effect(effects.getComplianceServiceCust, { forceFull: true }),
  // 获取服务渠道统计数据
  getServiceChannel: effect(effects.getServiceChannel, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class TaskAnalysisReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 任务-客户报表
    taskCustomerList: PropTypes.array.isRequired,
    // 获取任务-客户报表
    getTaskCustomer: PropTypes.func.isRequired,
    // 完成服务客户统计
    completeServiceCustList: PropTypes.array.isRequired,
    // 获取完成服务客户统计
    getCompleteServiceCust: PropTypes.func.isRequired,
    // 达标服务客户统计
    complianceServiceCustList: PropTypes.array.isRequired,
    // 获取达标服务客户统计
    getComplianceServiceCust: PropTypes.func.isRequired,
    // 服务渠道统计
    serviceChannelList: PropTypes.array.isRequired,
    // 获取服务渠道统计
    getServiceChannel: PropTypes.func.isRequired,
  }
  render() {
    const {
      location,
      taskCustomerList,
      getTaskCustomer,
    } = this.props;
    return (
      <div className={styles.taskAnalysisReport}>
        <TaskCustomerReport
          location={location}
          taskCustomerList={taskCustomerList}
          getTaskCustomer={getTaskCustomer}
        />
      </div>
    );
  }
}
