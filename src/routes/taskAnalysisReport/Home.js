/*
 * @Descripter: 任务分析报表
 * @Author: zhangjun
 * @Date: 2018-10-05 11:24:10
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-09 10:40:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import withRouter from '../../decorators/withRouter';
import TaskCustomerReport from '../../components/taskAnalysisReport/TaskCustomerReport';

import styles from './home.less';

@withRouter
export default class TaskAnalysisReport extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }
  render() {
    const { location } = this.props;
    return (
      <div className={styles.taskAnalysisReport}>
        <TaskCustomerReport
          location={location}
        />
      </div>
    );
  }
}
