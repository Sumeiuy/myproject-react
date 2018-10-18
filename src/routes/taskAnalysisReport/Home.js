/*
 * @Descripter: 任务分析报表
 * @Author: zhangjun
 * @Date: 2018-10-05 11:24:10
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-18 09:54:43
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { autobind } from 'core-decorators';

import { dva } from '../../helper';
import withRouter from '../../decorators/withRouter';
import DepartmentFilter from '../../components/taskAnalysisReport/DepartmentFilter';
import TaskCustomerReport from '../../components/taskAnalysisReport/TaskCustomerReport';
import CompleteServiceCustReport from '../../components/taskAnalysisReport/serviceCust/CompleteServiceCustReport';
import ComplianceServiceCustReport from '../../components/taskAnalysisReport/serviceCust/ComplianceServiceCustReport';
import ServiceChannelReport from '../../components/taskAnalysisReport/serviceChannel/ServiceChannelReport';
import logable from '../../decorators/logable';

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
  // 部门
  getCustRange: 'customerPool/getCustomerScope',
};

const mapStateToProps = state => ({
  // 任务-客户报表数据
  taskCustomerList: state.taskAnalysisReport.taskCustomerList,
  // 完成服务客户统计数据
  completeServiceCustList: state.taskAnalysisReport.completeServiceCustList,
  // 达标服务客户统计数据
  complianceServiceCustList: state.taskAnalysisReport.complianceServiceCustList,
  // 服务渠道统计数据
  serviceChannelData: state.taskAnalysisReport.serviceChannelData,
  // 部门
  custRange: state.customerPool.custRange,
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
  // 获取部门
  getCustRange: effect(effects.getCustRange, { loading: false }),
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
    serviceChannelData: PropTypes.object.isRequired,
    // 获取服务渠道统计
    getServiceChannel: PropTypes.func.isRequired,
    // 部门
    custRange: PropTypes.array,
    // 获取部门列表
    getCustRange: PropTypes.func.isRequired,
  }

  static contextTypes = {
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {
    // 部门
    custRange: [],
  }

  constructor(props) {
    super(props);
    const { custRange } = props;
    this.state = {
      orgId: custRange && custRange[0] && custRange[0].id,
    };
  }

  // 获取部门
  @autobind
  getCustRange() {
    this.props.getCustRange();
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '部门',
      value: '$args[0].orgId',
    },
  })
  handleDepartmentChange(obj) {
    this.setState(obj);
  }

  render() {
    const {
      taskCustomerList,
      getTaskCustomer,
      completeServiceCustList,
      getCompleteServiceCust,
      complianceServiceCustList,
      getComplianceServiceCust,
      serviceChannelData,
      getServiceChannel,
      custRange,
    } = this.props;
    const { orgId } = this.state;
    return (
      <div>
        <DepartmentFilter
          onDepartmentChange={this.handleDepartmentChange}
          custRange={custRange}
        />
        <div className={styles.taskAnalysisReport}>
          <TaskCustomerReport
            taskCustomerList={taskCustomerList}
            getTaskCustomer={getTaskCustomer}
            orgId={orgId}
          />
          <CompleteServiceCustReport
            completeServiceCustList={completeServiceCustList}
            getCompleteServiceCust={getCompleteServiceCust}
            orgId={orgId}
          />
          <ComplianceServiceCustReport
            complianceServiceCustList={complianceServiceCustList}
            getComplianceServiceCust={getComplianceServiceCust}
            orgId={orgId}
          />
          <ServiceChannelReport
            serviceChannelData={serviceChannelData}
            getServiceChannel={getServiceChannel}
            orgId={orgId}
          />
        </div>
      </div>
    );
  }
}
