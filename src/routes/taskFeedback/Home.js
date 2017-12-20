/*
 * @Description: 任务反馈
 * @Author: Wangjunjun
 * @path: src/routes/taskFeedback/Home
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './home.less';

export default class TaskFeedback extends PureComponent {

  static propsTypes = {}

  static defaultProps = {}


  render() {
    return (
      <div className={styles.taskFeedback}>
        TaskFeedback
      </div>
    );
  }
}

