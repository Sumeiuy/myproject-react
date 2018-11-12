/*
 * @Author: zhangjun
 * @Descripter: 完成服务客户统计
 * @Date: 2018-10-11 10:20:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-18 09:46:50
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import ReportTitle from '../ReportTitle';
import ReportFilter from '../ReportFilter';
import ServiceCustChart from './ServiceCustChart';
import { defaultStartTime, defaultEndTime, completeServiceCustOptions } from '../config';

import styles from './completeServiceCustReport.less';

const { serviceCustOptions, legendList } = completeServiceCustOptions;
export default class CompleteServiceCustReport extends PureComponent {
  static propTypes = {
    // 完成服务客户统计
    completeServiceCustList: PropTypes.array.isRequired,
    // 获取完成服务客户统计
    getCompleteServiceCust: PropTypes.func.isRequired,
    // 部门
    orgId: PropTypes.string.isRequired,
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
    // 获取完成服务客户统计
    this.getCompleteServiceCust({
      startTime,
      endTime,
    });
  }

  componentDidUpdate(prevProps) {
    const { orgId: prevOrgId } = prevProps;
    const { orgId } = this.props;
    if (prevOrgId !== orgId) {
      this.getCompleteServiceCust(this.state);
    }
  }

  // 获取完成服务客户统计
  @autobind
  getCompleteServiceCust(query) {
    const { orgId, getCompleteServiceCust } = this.props;
    getCompleteServiceCust({
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
      this.getCompleteServiceCust(this.state);
    });
  }

  render() {
    const {
      completeServiceCustList,
    } = this.props;
    const {
      startTime,
      endTime,
      executeType,
      eventSource,
    } = this.state;
    return (
      <div className={styles.completeServiceCustReport}>
        <ReportTitle title='完成服务客户统计' />
        <ReportFilter
          dateFilterName='任务截止时间'
          startTime={startTime}
          endTime={endTime}
          executeType={executeType}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
        />
        <ServiceCustChart
          reportList={completeServiceCustList}
          serviceCustOptions={serviceCustOptions}
          legendList={legendList}
        />
      </div>
    );
  }
}
