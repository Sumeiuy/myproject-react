/*
 * @Author: zhangjun
 * @Descripter: 达标服务客户统计
 * @Date: 2018-10-11 10:20:03
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-18 09:46:56
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import ReportTitle from '../ReportTitle';
import ReportFilter from '../ReportFilter';
import ServiceCustChart from './ServiceCustChart';
import { defaultStartTime, defaultEndTime, complianceServiceCustOptions } from '../config';

import styles from './complianceServiceCustReport.less';

const { serviceCustOptions, legendList } = complianceServiceCustOptions;

export default class ComplianceServiceCustReport extends PureComponent {
  static propTypes = {
    // 达标服务客户统计
    complianceServiceCustList: PropTypes.array.isRequired,
    // 获取达标服务客户统计
    getComplianceServiceCust: PropTypes.func.isRequired,
    // 部门
    orgId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 跟踪截止开始时间
      startTime: defaultStartTime,
      // 跟踪截止结束时间
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

  componentDidUpdate(prevProps) {
    const { orgId: prevOrgId } = prevProps;
    const { orgId } = this.props;
    if (prevOrgId !== orgId) {
      this.getComplianceServiceCust(this.state);
    }
  }

  // 获取达标服务客户统计
  @autobind
  getComplianceServiceCust(query) {
    const { orgId, getComplianceServiceCust } = this.props;
    getComplianceServiceCust({
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
        <ReportTitle title="达标服务客户统计" />
        <ReportFilter
          dateFilterName="跟踪截止时间"
          startTime={startTime}
          endTime={endTime}
          executeType={executeType}
          eventSource={eventSource}
          filterCallback={this.handlefilterCallback}
        />
        <ServiceCustChart
          reportList={complianceServiceCustList}
          serviceCustOptions={serviceCustOptions}
          legendList={legendList}
        />
      </div>
    );
  }
}
