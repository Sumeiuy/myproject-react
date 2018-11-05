/*
 * @Author: zuoguangzu
 * @Date: 2018-10-14 09:48:58
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-05 17:49:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Table } from 'antd';
import _ from 'lodash';

import ReportTitle from '../ReportTitle';
import ReportFilter from '../ReportFilter';
import EventAnalysisChart from './EventAnalysisChart';
import { env } from '../../../helper';
import { defaultStartTime,
  defaultEndTime,
  taskOption,
  customerOption,
  serviceChannelChangeOption,
  eventSourceTypes,
  tableOption } from '../config';
import { filterData } from '../utils';
import { dom } from '../../../helper';

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
    // 部门
    orgId: PropTypes.string.isRequired,
  }

  constructor(props,context) {
    super(props);
    this.eventAnalysisChartRef = React.createRef();
    this.eventAnalysisReportRef = React.createRef();
    const { dict: {
      missionType = [],
    } } = context;
    this.state = {
      // 任务开始时间
      startTime: defaultStartTime,
      // 任务结束时间
      endTime: defaultEndTime,
      // 事件类型数据
      eventTypeOptions: missionType,
      // 事件来源
      eventSource: '',
      // 事件名称
      eventName: '',
      // 事件类型
      eventType: '',
      // 表格数据
      option: {
        eventReportList: {},
        configData: {},
        eventDataName: '',
        firstData: [],
        secondData: [],
        thirdData: [],
        fourData: [],
        deadlineTimeData: [],
        type: '',
      },
    };
  }

  componentDidMount() {
    const { startTime, endTime } = this.state;
    // 获取事件数据
    this.getEventAnalysis({
      startTime,
      endTime,
    });
  }

  componentDidUpdate(prevProps) {
    const { orgId: prevOrgId } = prevProps;
    const { startTime, endTime } = this.state;
    // 获取事件数据
    if (prevOrgId !== this.props.orgId) {
      this.getEventAnalysis({
        startTime,
        endTime,
      });
    }
  }

  // 获取事件分析数据
  @autobind
  getEventAnalysis(query) {
    const { orgId, getEventAnalysis } = this.props;
    getEventAnalysis({
      ...query,
      orgId,
    });
  }

  // 头部筛选回调函数
  @autobind
  handlefilterCallback(obj) {
    this.setState({
      ...obj,
    }, () => {
      const query = _.omit(this.state, ['eventTypeOptions', 'option']);
      this.getEventAnalysis(query);
    });
  }

  // 事件来源更改
  @autobind
  handleEventSource(obj) {
    const { eventSource } = obj;
    const { MOT, SELFBUILD } = eventSourceTypes;
    const { dict: {
      missionType = [],
    } } = this.context;
    let eventTypeOptions = missionType;
    // descText为0时候是MOT类型，为1时候是自建类型
    const motDict = _.filter(missionType, {'descText': '0'});
    const zjDict = _.filter(missionType, {'descText': '1'});
    // 此处eventSource为1指的事件来源是MOT推送，为2指事件来源是自建，为''指的不限，通过事件来源控制事件类型
    switch(eventSource) {
      case MOT:
        eventTypeOptions = motDict;
        break;
      case SELFBUILD:
        eventTypeOptions = zjDict;
        break;
      default:
        break;
    }

    this.setState({
       eventTypeOptions,
       eventType: '',
      });
  }

  // 事件搜索
  @autobind
  getEventSearch(query) {
    const { getEventSearch, orgId } = this.props;
    getEventSearch({
      ...query,
      orgId,
    });
  }

  // 图表位置定位
  @autobind
  getChartPosition(e) {
    const scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    const scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    let pageX = e.pageX || e.clientX + scrollX;
    let pageY = e.pageY || e.clientY + scrollY;
    if (env.isInFsp()) {
      const scrollbar = document.querySelector('.ps-scrollbar-y-rail');
      const scrollbarTop = dom.getRect(scrollbar, 'top');
      pageY = pageY + scrollbarTop;
    }
    // 获取表格图表的dom节点
    const eventAnalysisChartDom = this.eventAnalysisChartRef.current;
    const eventAnalysisReportDom = this.eventAnalysisReportRef.current;
    // 获取事件分析报表的top
    const reportTop = eventAnalysisReportDom.offsetTop;
    // 获取事件分析报表的宽高
    const { width: reportWidth} = dom.getRect(eventAnalysisReportDom);
    // 让图表位置显示在鼠标位置上方50px处，当鼠标位置+图表位置一半的时候图表位置为报表的最右方
    let eventAnalysisChartTop =  `${pageY - reportTop - 374 - 50}px`;
    let eventAnalysisChartLeft =  `${pageX - 312}px`;
    // 图表宽度624px，高度374px
    if (pageX + 312 > reportWidth) {
      eventAnalysisChartLeft = `${reportWidth - 624}px`;
    }
    dom.setStyle(eventAnalysisChartDom, 'top', eventAnalysisChartTop);
    dom.setStyle(eventAnalysisChartDom, 'left', eventAnalysisChartLeft);
    dom.setStyle(eventAnalysisChartDom, 'display', 'block');
  }

  // 表格中图表渲染
  @autobind
  handleTableOnCell(record, type) {
    // 表格数据中有三种表格，判断type
    if(_.isEmpty(type)){
      return;
    }
    // 取出增加在接口数据中的eventReportList
    const { eventReportList } = record;
    return {
      onMouseOver: (e) => {
        const { eventName } = record;
        let firstData = [];
        let secondData = [];
        let thirdData = [];
        let fourData = [];
        // 事件轴
        let deadlineTimeData = [];
        // 配置项数据
        let configData = {};
        // 根据不同type获取相应数据
        switch(type) {
          case 'task':
            const {
              triggerTaskList = [],
              completedTaskList = [],
            } = eventReportList;
            // 触发任务数数据
            const triggerTaskData = filterData(triggerTaskList, 'triggerTaskNumber');
            // 完成任务数数据
            const completedTaskData = filterData(completedTaskList, 'completedTaskNumber');
            // xAxis轴截止时间数据
            deadlineTimeData = filterData(triggerTaskList, 'deadlineTime');
            firstData = triggerTaskData;
            secondData = completedTaskData;
            configData = taskOption;
            break;
          case 'customer':
            const {
              coveredCustomersList = [],
              completedCustomersList = [],
            } = eventReportList;
            // 覆盖客户数数据
            const coveredCustomersData = filterData(coveredCustomersList, 'coveredCustomersNumber');
            // 完成客户数数据
            const completedCustomersData = filterData(completedCustomersList, 'completedCustomersNumber');
            // xAxis轴截止时间数据
            deadlineTimeData = filterData(coveredCustomersList, 'deadlineTime');
            firstData = coveredCustomersData;
            secondData = completedCustomersData;
            configData = customerOption;
            break;
          case 'serviceChannels':
            const {
              zhangLeList = [],
              phoneList = [],
              interviewList = [],
              // 短信改成其它
              shortMessageList = [],
            } = eventReportList;
            // 涨乐数据
            const zhangleData = filterData(zhangLeList, 'percentage');
            // 电话数据
            const phoneData = filterData(phoneList, 'percentage');
            // 面谈数据
            const interviewData = filterData(interviewList, 'percentage');
            // 其他数据
            const otherData = filterData(shortMessageList, 'percentage');
            // xAxis轴截止时间数据
            deadlineTimeData = filterData(zhangLeList, 'deadlineTime');
            firstData = zhangleData;
            secondData = phoneData;
            thirdData = interviewData;
            fourData = otherData;
            configData = serviceChannelChangeOption;
            break;
          default:
            break;
        }
        this.setState({
          option: {
            eventReportList,
            configData,
            eventDataName: eventName,
            firstData,
            secondData,
            thirdData,
            fourData,
            deadlineTimeData,
            type,
          },
        });
        this.getChartPosition(e);
      },
      onMouseOut: () => {
        const eventAnalysisChartDom = this.eventAnalysisChartRef.current;
        dom.setStyle(eventAnalysisChartDom,'display','none');
      },
    };
  }

  render() {
    const {
      eventAnalysisList: {
        eventData
      },
      eventSearchList,
    } = this.props;
    const {
      startTime,
      endTime,
      eventSource,
      eventName,
      eventType,
      // 事件类型选项
      eventTypeOptions,
    } = this.state;

    // 展示表格头部
    const columnsItem = tableOption.columnsItem;
    const columns = _.map(columnsItem, (col) => {
      const { eventType } = col;
      return {
        ...col,
        onCell: (record) => this.handleTableOnCell(record, eventType),
      };
    });

    const {
      option: {
        eventReportList = {},
        configData = {},
        eventDataName = '',
        firstData = [],
        secondData = [],
        thirdData = [],
        fourData = [],
        deadlineTimeData = [],
        type = '',
      }
    } = this.state;
    return (
      <div ref = {this.eventAnalysisReportRef} className={styles.eventAnalysisReport}>
        <ReportTitle title="事件分析报表" />
        <ReportFilter
          dateFilterName="任务截止时间"
          startTime={startTime}
          endTime={endTime}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
          isEventAnalysis
          eventType={eventType}
          eventTypeOptions={eventTypeOptions}
          eventSelectChange={this.handleEventSource}
          eventSearch={this.getEventSearch}
          eventSearchList={eventSearchList}
          eventName={eventName}
        />
        <Table
          className={styles.eventAnalysisTable}
          columns={columns}
          dataSource={eventData}
        />
        <div ref={this.eventAnalysisChartRef} className={styles.eventAnalysisChart}>
          <EventAnalysisChart
            eventReportList={eventReportList}
            config={configData}
            eventName={eventDataName}
            firstData={firstData}
            secondData={secondData}
            thirdData={thirdData}
            fourData={fourData}
            deadlineTimeData={deadlineTimeData}
            reportType={type}
          />
        </div>
      </div>
    );
  }
}
