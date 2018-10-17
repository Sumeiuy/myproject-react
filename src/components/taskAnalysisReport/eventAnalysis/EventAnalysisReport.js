/*
 * @Author: zuoguangzu
 * @Date: 2018-10-14 09:48:58
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-17 13:21:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import ReportTitle from '../ReportTitle';
import ReportFilter from '../ReportFilter';
import { emp } from '../../../helper';

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
      startTime: '',
      // 任务结束时间
      endTime: '',
      // 事件类型
      eventTypeOptions: [...custServerTypeFeedBackDict,...missionType],
      // 事件来源
      eventSource: '',
    };
  }

  componentDidMount() {
    const { startTime,endTime } = this.state;
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
      this.getEventAnalysis(this.state);
    });
  }

  // 事件来源更改
  @autobind
  handleEventSource(obj) {
    const { eventSource } = obj;
    const { dict: {
      custServerTypeFeedBackDict = [],
      missionType = [],
    } } = this.context;
    const eventTypeOptions = eventSource === '1' ? custServerTypeFeedBackDict :
    eventSource === '2' ? missionType : [ ...custServerTypeFeedBackDict,...missionType ];
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
      eventAnalysisList,
      eventSearchList,
    } = this.props;
    console.warn('eventSearchList',eventSearchList);
    const {
      eventData,
      eventReportList,
    } = eventAnalysisList;
    const {
      startTime,
      endTime,
      eventType,
      eventSource,
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
    },{
      title: '完成任务数',
      dataIndex: 'completedTaskNum',
      key: 'completedTaskNum',
    },{
      title: '任务完成率',
      dataIndex: 'taskCompletionRate',
      key: 'taskCompletionRate',
    },{
      title: '覆盖客户数',
      dataIndex: 'coveredCustomerNum',
      key: 'coveredCustomerNum',
    },{
      title: '已服务客户数',
      dataIndex: 'servedCustomerNum',
      key: 'servedCustomerNum',
    },{
      title: '各渠道服务占比',
      dataIndex: 'servicesAccounted',
      key: 'servicesAccounted',
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
        />
        <Table columns={columns} dataSource={dataSource}/>
      </div>
    );
  }
}
