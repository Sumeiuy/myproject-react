/**
 * @Author: sunweibin
 * @Date: 2018-04-12 17:00:35
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-12 22:38:11
 * @description 涨乐财富通服务方式先显示的客户反馈
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './zhanglecaifutongFeedback.less';

export default function ZLFeedback(props) {
  const { showListMode, feedbackList, feedback, feedbackTime } = props;
  const feedbackListText = _.isEmpty(feedbackList) ? '无' : feedbackList.join('，');
  const feedbackText = _.isEmpty(feedback) ? '暂无反馈' : feedback;
  return (
    <div className={styles.custFeedbackSection}>
      <div className={styles.feedbackType}>
        <div className={styles.title}>{ showListMode ? '客户可选反馈：' : '客户反馈：'}</div>
        <div className={styles.content}>{showListMode ? feedbackListText : feedbackText}</div>
      </div>
      {
        showListMode ? null
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
  // 判断是展示可选的列表，还是展示用户已经选择的反馈
  showListMode: PropTypes.bool,
  // 可选列表
  feedbackList: PropTypes.array,
  // 客户反馈时间
  feedbackTime: PropTypes.string,
  // 客户反馈
  feedback: PropTypes.string,
};

ZLFeedback.defaultProps = {
  showListMode: false,
  feedbackList: [],
  feedbackTime: '',
  feedback: '暂无反馈',
};
