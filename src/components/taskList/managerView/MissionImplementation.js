/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-04 17:12:08
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-04 19:28:54
 * 任务实施简报
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
import LabelInfo from '../common/LabelInfo';
import styles from './missionImplementation.less';

const EMPTY_LIST = [];

export default class MissionImplementation extends PureComponent {

  static propTypes = {
    // 任务实施进度
    missionImplementationSteps: PropTypes.array,
    // 客户反馈结果
    custFeedback: PropTypes.array,
  }

  static defaultProps = {
    missionImplementationSteps: EMPTY_LIST,
    custFeedback: EMPTY_LIST,
  }

  render() {
    // const {
    // missionImplementationSteps,
    // } = this.props;

    // const colSpanValue = isFold ? 12 : 24;
    return (
      <div className={styles.missionImplementationSection}>
        <div className={styles.title}>
          <div className={styles.leftSection}>
            <LabelInfo value={'任务实施简报'} />
          </div>
          <div className={styles.rightSection}>
            下拉框
          </div>
        </div>
        {/* <div className={styles.content}>

        </div> */}
      </div>
    );
  }
}
