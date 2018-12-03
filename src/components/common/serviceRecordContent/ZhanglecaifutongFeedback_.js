/**
 * @Author: sunweibin
 * @Date: 2018-04-12 17:00:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-20 10:22:40
 * @description 涨乐财富通服务方式先显示的客户反馈
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { flow } from '../../taskList/performerView/config';

import styles from './zhanglecaifutongFeedback.less';

export default function ZLFeedback(props) {
  const {
    flowStatusCode, feedbackList, feedback, feedbackTime
  } = props;

  const isCompleted = flow.isComplete(flowStatusCode);

  const feedbackListText = _.isEmpty(feedbackList) ? '无'
    : feedbackList.map((item, index) => ` ${index + 1}、${item.label}`).join('，');

  const feedbackText = _.isEmpty(feedback) ? '暂无反馈' : feedback;
  return (
    <div className={styles.custFeedbackSection}>
      <div className={styles.feedbackType}>
        <div className={styles.title}>{isCompleted ? '客户反馈：' : '客户可选反馈：'}</div>
        <div className={styles.content}>{isCompleted ? feedbackText : feedbackListText}</div>
      </div>
      {
        !isCompleted ? null
          : (
            <div className={styles.feedbackTime}>
              <div className={styles.title}>反馈时间:</div>
              <div className={styles.content}>{feedbackTime}</div>
            </div>
          )
      }
    </div>
  );
}

ZLFeedback.propTypes = {
  // 流程状态Code
  flowStatusCode: PropTypes.string,
  // 可选列表
  feedbackList: PropTypes.array,
  // 客户反馈时间
  feedbackTime: PropTypes.string,
  // 客户反馈
  feedback: PropTypes.string,
};

ZLFeedback.defaultProps = {
  flowStatusCode: '',
  feedbackList: [],
  feedbackTime: '',
  feedback: '暂无反馈',
};
