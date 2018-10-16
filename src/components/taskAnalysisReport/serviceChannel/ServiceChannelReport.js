/*
 * @Author: zhangjun
 * @Descripter: 服务渠道统计
 * @Date: 2018-10-11 17:38:35
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-12 15:39:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import ReportTitle from '../ReportTitle';
import ReportFilter from '../ReportFilter';
import ServiceChannelPieChart from './ServiceChannelPieChart';
import ServiceChannelLineChart from './ServiceChannelLineChart';
import { defaultStartTime, defaultEndTime } from '../config';
import { emp } from '../../../helper';

import styles from './serviceChannelReport.less';

export default class ServiceChannelReport extends PureComponent {
  static propTypes = {
    // 服务渠道统计
    serviceChannelData: PropTypes.object.isRequired,
    // 获取服务渠道统计
    getServiceChannel: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 任务截止开始时间
      startTime: defaultStartTime,
      // 任务截止结束时间
      endTime: defaultEndTime,
      // 执行类型
      executeType: '',
      // 事件来源
      eventSource: '',
    };
  }

  componentDidMount() {
    const { startTime, endTime } = this.state;
    // 获取达标服务客户统计
    this.getServiceChannel({
      startTime,
      endTime,
    });
  }

  // 获取达标服务客户统计
  @autobind
  getServiceChannel(query) {
    this.props.getServiceChannel({
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
      this.getServiceChannel(this.state);
    });
  }

  render() {
    const {
      serviceChannelData: {
        // 服务渠道占比统计数据
        proportionList = [],
        // 服务渠道变化趋势数据
        trendData = {},
      },
    } = this.props;
    const {
      startTime,
      endTime,
      executeType,
      eventSource,
    } = this.state;
    return (
      <div className={styles.serviceChannelReport}>
        <ReportTitle title='服务渠道统计' />
        <ReportFilter
          dateFilterName='任务截止时间'
          startTime={startTime}
          endTime={endTime}
          executeType={executeType}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
        />
        <div className={styles.serviceChannelChart}>
          <ServiceChannelPieChart
            proportionList={proportionList}
          />
          <ServiceChannelLineChart
            trendData={trendData}
          />
        </div>
      </div>
    );
  }
}
