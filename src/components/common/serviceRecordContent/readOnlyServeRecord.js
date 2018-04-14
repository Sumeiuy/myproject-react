/**
 * @Author: sunweibin
 * @Date: 2018-04-12 22:49:05
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-13 19:43:25
 * @description 展示只读信息的组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './index.less';

export default function ReadOnlyServeRecord(props) {
  const { data = {}, isCompleted } = props;
  if (_.isEmpty(data)) {
    return null;
  }
  const {
    serviceWay,
    serviceStatusText,
    serviceDateTime,
    feedbackDateTime,
    feedbackText,
    hasFeedback,
    serviceContent,
  } = data;
  const completedText = isCompleted ? `${serviceDateTime} 给客户发送了以下投资建议` : '';
  return (
    <div className={styles.serviceRecordContent}>
      <div className={styles.gridWrapper}>
        <div className={styles.serveWay}>
          <div className={styles.title}>服务方式:</div>
          <div className={styles.readOnlyText}>{serviceWay}</div>
        </div>
        <div className={styles.serveStatus}>
          <div className={styles.title}>服务状态:</div>
          <div className={styles.readOnlyText}>{serviceStatusText}</div>
        </div>
        <div className={styles.serveTime}>
          <div className={styles.title}>服务时间:</div>
          <div className={styles.readOnlyText}>{serviceDateTime}</div>
        </div>
        <div className={styles.serveRecord}>
          <div className={styles.title}>服务内容:</div>
          {
            isCompleted ? (<div className={styles.readOnlyText}>{completedText}</div>) : null
          }
          <div className={styles.readOnlyText}>
            <span className={styles.zhangleTitle}>{serviceContent.title}</span>
            <span className={styles.zhangleType}>{serviceContent.type}</span>
          </div>
          <div className={styles.readOnlyText}>{serviceContent.desc}</div>
        </div>
        <div className={styles.divider} />

        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
            <div className={styles.title}>客户反馈:</div>
            <div className={styles.readOnlyText}>
              <span className={styles.feedbackTypeL1}>{hasFeedback ? feedbackText : '暂无反馈'}</span>
            </div>
          </div>
          <div className={styles.feedbackTime}>
            <div className={styles.title}>反馈时间:</div>
            <div className={styles.readOnlyText}>{feedbackDateTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReadOnlyServeRecord.propTypes = {
  data: PropTypes.object.isRequired,
  isCompleted: PropTypes.bool.isRequired,
};
