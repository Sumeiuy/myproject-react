/*
 * @Author: zuoguangzu
 * @Date: 2018-10-14 09:48:58
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-22 16:16:09
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import ReportTitle from '../ReportTitle';
import ReportFilter from '../ReportFilter';
import { emp } from '../../../helper';
import { eventSourceTypes } from '../config';
import TaskStatisticsChart from './TaskStatisticsChart';
import CustomerStatisticsChart from './CustomerStatisticsChart';
import ServiceChannelsChangeChart from './ServiceChannelsChangeChart';

import styles from './eventAnalysisReport.less';

export default class EventAnalysisReport extends PureComponent {
  static contextTypes = {
    dict: PropTypes.object.isRequired,
  }

  static propTypes = {
    // 获取事件分析表
    getEventAnalysis: PropTypes.func.isRequired,
    // 事件分析表数据
    eventAnalysisList: PropTypes.object.isRequired,
    // 事件搜索
    getEventSearch: PropTypes.func.isRequired,
    // 事件搜索数据
    eventSearchList: PropTypes.object.isRequired,
  }

  constructor(props,context) {
    super(props);
    const { dict: {
      custServerTypeFeedBackDict = [],
      missionType = [],
    } } = context;
    this.state = {
      // 任务开始时间
      startTime: '2018-10-12',
      // 任务结束时间
      endTime: '2018-10-18',
      // 事件类型
      eventTypeOptions: [...custServerTypeFeedBackDict,...missionType],
      // 事件来源
      eventSource: '',
      // 事件名称
      eventName: '',
    };
  }

  componentDidMount() {
    const {startTime,endTime} = this.state;
    // 获取事件数据
    this.getEventAnalysis({
      startTime,
      endTime,
    });
  }

  // 获取事件分析数据
  @autobind
  getEventAnalysis(query) {
    this.props.getEventAnalysis({
      ...query,
      orgId: emp.getOrgId(),
    });
  }

  // 头部筛选回调函数
  @autobind
  handlefilterCallback(obj) {
    this.setState({
      ...obj,
    }, () => {
      const query = _.omit(this.state, 'eventTypeOptions');
      this.getEventAnalysis(query);
    });
  }

  // 事件来源更改
  @autobind
  handleEventSource(obj) {
    const { eventSource } = obj;
    const { MOT, SELFBUILD } = eventSourceTypes;
    const { dict: {
      custServerTypeFeedBackDict = [],
      missionType = [],
    } } = this.context;
    let eventTypeOptions = [ ...custServerTypeFeedBackDict,...missionType ];
    // 此处eventSource为1指的事件来源是MOT推送，为2指事件来源是自建，为''指的不限，通过事件来源控制事件类型
    switch(eventSource) {
      case MOT:
        eventTypeOptions = custServerTypeFeedBackDict;
        break;
      case SELFBUILD:
        eventTypeOptions = missionType;
        break;
      default:
        break;
    }
    this.setState({ eventTypeOptions });
  }

  // 事件搜索
  @autobind
  getEventSearch(query) {
    this.props.getEventSearch({
      ...query,
      orgId: emp.getOrgId(),
    });
  }

  render() {
    const {
      eventAnalysisList: {
        eventData,
        eventReportList = [],
      },
      eventSearchList,
    } = this.props;
    const {
      startTime,
      endTime,
      eventType,
      eventSource,
      eventName,
    } = this.state;
    // 事件类型选项
    const { eventTypeOptions } = this.state;
    // 展示表格头部
    const columns = [{
      title: '事件名称',
      dataIndex: 'eventName',
      key: 'eventName',
    },{
      title: '任务数',
      dataIndex: 'taskNum',
      key: 'taskNum',
      render: (text,record,index) => {
        const { eventName } = record;
        return (
          <div className={styles.taskStatisticsChart}>
              <span>{text}</span>
              <div className={styles.taskStatisticsChartReport}>
                <TaskStatisticsChart
                 eventReportList={eventReportList[index]}
                 eventName={eventName}
                />
              </div>
          </div>
        );
      }
    },{
      title: '完成任务数',
      dataIndex: 'completedTaskNum',
      key: 'completedTaskNum',
      render: (text,record,index) => {
        const { eventName } = record;
        return (
          <div className={styles.taskStatisticsChart}>
              <span>{text}</span>
              <div className={styles.taskStatisticsChartReport}>
                <TaskStatisticsChart
                 eventReportList={eventReportList[index]}
                 eventName={eventName}
                />
              </div>
          </div>
        );
      }
    },{
      title: '任务完成率',
      dataIndex: 'taskCompletionRate',
      key: 'taskCompletionRate',
      render: (text,record,index) => {
        const { eventName } = record;
        return (
          <div className={styles.taskStatisticsChart}>
              <span>{text}</span>
              <div className={styles.taskStatisticsChartReport}>
                <TaskStatisticsChart
                 eventReportList={eventReportList[index]}
                 eventName={eventName}
                />
              </div>
          </div>
        );
      }
    },{
      title: '覆盖客户数',
      dataIndex: 'coveredCustomerNum',
      key: 'coveredCustomerNum',
      render: (text,record,index) => {
        const { eventName } = record;
        return (
          <div className={styles.taskStatisticsChart}>
              <span>{text}</span>
              <div className={styles.taskStatisticsChartReport}>
                <CustomerStatisticsChart
                 eventReportList={eventReportList[index]}
                 eventName={eventName}
                />
              </div>
          </div>
        );
      }
    },{
      title: '已服务客户数',
      dataIndex: 'servedCustomerNum',
      key: 'servedCustomerNum',
      render: (text,record,index) => {
        const { eventName } = record;
        return (
          <div className={styles.taskStatisticsChart}>
              <span>{text}</span>
              <div className={styles.taskStatisticsChartReport}>
                <CustomerStatisticsChart
                 eventReportList={eventReportList[index]}
                 eventName={eventName}
                />
              </div>
          </div>
        );
      }
    },{
      title: '各渠道服务占比',
      dataIndex: 'servicesAccounted',
      key: 'servicesAccounted',
      render: (text,record,index) => {
        const { eventName } = record;
        return (
          <div className={styles.taskStatisticsChart}>
              <span>{text}</span>
              <div className={styles.taskStatisticsChartReport}>
                <ServiceChannelsChangeChart
                 eventReportList={eventReportList[index]}
                 eventName={eventName}
                />
              </div>
          </div>
        );
      }
    }];
    // 表格数据
    const dataSource = eventData;

    return (
      <div className={styles.eventAnalysisReport}>
        <ReportTitle title='每日触发任务及覆盖客户数' />
        <ReportFilter
          dateFilterName='任务触发时间'
          startTime={startTime}
          endTime={endTime}
          eventType={eventType}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
          isEventAnalysis
          eventTypeOptions={eventTypeOptions}
          eventSelectChange={this.handleEventSource}
          eventSearch={this.getEventSearch}
          eventSearchList={eventSearchList}
          eventName={eventName}
        />
        <Table className={styles.eventAnalysisTable} columns={columns} dataSource={dataSource}/>
      </div>
    );
  }
}
