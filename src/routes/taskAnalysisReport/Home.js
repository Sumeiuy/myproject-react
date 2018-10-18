/*
 * @Descripter: 任务分析报表
 * @Author: zhangjun
 * @Date: 2018-10-05 11:24:10
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-18 18:44:21
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import { dva } from '../../helper';
import DepartmentFilter from '../../components/taskAnalysisReport/DepartmentFilter';
import TaskCustomerReport from '../../components/taskAnalysisReport/TaskCustomerReport';
import CompleteServiceCustReport from '../../components/taskAnalysisReport/serviceCust/CompleteServiceCustReport';
import ComplianceServiceCustReport from '../../components/taskAnalysisReport/serviceCust/ComplianceServiceCustReport';
import EventAnalysisReport from '../../components/taskAnalysisReport/eventAnalysis/EventAnalysisReport';
import ServiceChannelReport from '../../components/taskAnalysisReport/serviceChannel/ServiceChannelReport';
import { emp } from '../../helper';
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
  // 事件分析表
  getEventAnalysis: 'taskAnalysisReport/getEventAnalysis',
  // 事件查询
  getEventSearch: 'taskAnalysisReport/getEventSearch',
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
  // 事件分析表数据
  eventAnalysisList: state.taskAnalysisReport.eventAnalysisList,
  // 事件查询数据
  eventSearchList: state.taskAnalysisReport.eventSearchList,
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
  // 获取事件分析数据
  getEventAnalysis: effect(effects.getEventAnalysis, { forceFull: true }),
  // 获取事件查询数据
  getEventSearch: effect(effects.getEventSearch, { forceFull: true }),
};

@connect(mapStateToProps, mapDispatchToProps)
export default class TaskAnalysisReport extends PureComponent {
  static propTypes = {
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
    // 获取事件分析表
    getEventAnalysis: PropTypes.func.isRequired,
    // 事件分析表数据
    eventAnalysisList: PropTypes.object.isRequired,
    // 事件搜索
    getEventSearch: PropTypes.func.isRequired,
    // 事件搜索数据
    eventSearchList: PropTypes.object.isRequired,
    // 部门
    custRange: PropTypes.array,
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
    const orgId = emp.getOrgId();
    const createCustRange = this.handleCreateCustRange({
      custRange,
      posOrgId: orgId,
    });
    this.state = {
      orgId,
      // 部门tree数据
      createCustRange,
    };
  }

  // 创建部门范围组件的tree数据
  @autobind
  handleCreateCustRange({ custRange, posOrgId }) {
    // 用户职位是经总
    if (posOrgId === (custRange[0] || {}).id) {
      return custRange;
    }
    // posOrgId 在机构树中所处的分公司位置
    const groupInCustRange = _.find(custRange, item => item.id === posOrgId);
    if (groupInCustRange) {
      return [groupInCustRange];
    }
    // posOrgId 在机构树的营业部位置
    let department;
    _.forEach(custRange, (obj) => {
      if (obj.children && !_.isEmpty(obj.children)) {
        const targetValue = _.find(obj.children, o => o.id === posOrgId);
        if (targetValue) {
          department = [targetValue];
        }
      }
    });
    if (department) {
      return department;
    }
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
      getEventAnalysis,
      eventAnalysisList,
      getEventSearch,
      eventSearchList,
      serviceChannelData,
      getServiceChannel,
    } = this.props;
    const { orgId, createCustRange } = this.state;
    return (
      <div>
        <DepartmentFilter
          onDepartmentChange={this.handleDepartmentChange}
          custRange={createCustRange}
          orgId={orgId}
        />
        <EventAnalysisReport
          getEventAnalysis={getEventAnalysis}
          eventAnalysisList={eventAnalysisList}
          getEventSearch={getEventSearch}
          eventSearchList={eventSearchList}
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
