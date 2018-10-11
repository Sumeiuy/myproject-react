/*
 * @Author: zhangjun
 * @Descripter: 达标服务客户统计
 * @Date: 2018-10-11 10:20:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-11 17:07:35
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import ReportTitle from './ReportTitle';
import ReportFilter from './ReportFilter';
import ServiceCustChart from './ServiceCustChart';
import { defaultStartTime, defaultEndTime, complianceServiceCustOptions } from './config';
import { emp } from '../../helper';

import styles from './complianceServiceCustReport.less';

const { serviceCustOptions } = complianceServiceCustOptions;

export default class ComplianceServiceCustReport extends PureComponent {
  static propTypes = {
    // 达标服务客户统计
    complianceServiceCustList: PropTypes.array.isRequired,
    // 获取达标服务客户统计
    getComplianceServiceCust: PropTypes.func.isRequired,
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
    this.getComplianceServiceCust({
      startTime,
      endTime,
    });
  }

  // 获取达标服务客户统计
  @autobind
  getComplianceServiceCust(query) {
    this.props.getComplianceServiceCust({
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
      this.getComplianceServiceCust(this.state);
    });
  }

  render() {
    const {
      complianceServiceCustList,
    } = this.props;
    const {
      startTime,
      endTime,
      executeType,
      eventSource,
    } = this.state;
    return (
      <div className={styles.complianceServiceCustReport}>
        <ReportTitle title='达标服务客户统计' />
        <ReportFilter
          dateFilterName='跟踪截止时间'
          startTime={startTime}
          endTime={endTime}
          executeType={executeType}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
        />
        <ServiceCustChart
          reportList={complianceServiceCustList}
          serviceCustOptions={serviceCustOptions}
        />
      </div>
    );
  }
}
