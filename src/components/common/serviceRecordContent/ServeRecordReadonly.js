/**
 * @Author: sunweibin
 * @Date: 2018-04-14 18:32:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-08-08 14:40:51
 * @description 只读服务记录
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';

import ServeRecordAttachment from './ServeRecordAttachment';
import { flow } from '../../taskList/performerView/config';

import styles from './index.less';

export default function ServiceRecordReadOnly(props) {
  const {
    isMOTReturnVisitTask,
    motReturnResult,
    motReturnFailReason,
    isZL,
    attachmentList,
    serviceWay,
    serviceStatus,
    serviceStatusCode,
    serviceTime,
    serviceRecord,
    zlServiceRecord,
    feedbackDateTime,
    custFeedback,
    custFeedback2,
    ZLCustFeedback,
    ZLCustFeedbackList,
    ZLFeedbackStatus,
  } = props;

  const investAdviceTip = isZL ? '给客户发送了以下投资建议:' : '';
  // 判断当前的流水状态是否审批中
  const flowIsApproval = flow.isApproval(serviceStatusCode);
  // 此处需要针对涨乐财富通的情况下
  // 如果 客户未阅       显示 客户未阅
  // 如果 客户已阅未反馈 显示 已阅未反馈
  // 如果 客户已反馈     显示 反馈内容
  const feedbackMap = {
    UNREAD: '客户未阅',
    READED: '已阅未反馈',
    FEEDBACK: ZLCustFeedback,
    NULL: '',
  };
  const listText = _.isEmpty(ZLCustFeedbackList) ? '无' : ZLCustFeedbackList.map((item, index) => `${index + 1}、${item.label}`).join('，');
  const custFeedbackText = flowIsApproval ? listText : feedbackMap[ZLFeedbackStatus];

  // 判断在普通服务方式的反馈中，客户反馈显示文字
  // 如果一级反馈的文本和二级反馈的文本一样，只显示一级文本
  let normalWayCustFeedbackText = custFeedback;
  if (!isZL && custFeedback !== custFeedback2) {
    normalWayCustFeedbackText = `${custFeedback}    ${custFeedback2}`;
  }
  const wrapperCls = cx(
    styles.serviceRecordContent,
    styles.performerServiceRecord,
  );
  return (
    <div className={wrapperCls}>
      <div className={styles.gridWrapper}>
        <div className={styles.serveWay}>
          <div className={styles.title}>服务方式:</div>
          <div className={styles.readOnlyText}>{serviceWay}</div>
        </div>
        <div className={styles.serveStatus}>
          <div className={styles.title}>服务状态:</div>
          <div className={styles.readOnlyText}>{serviceStatus}</div>
        </div>
        {
          flowIsApproval ? null :
          (
            <div className={styles.serveTime}>
              <div className={styles.title}>服务时间:</div>
              <div className={styles.readOnlyText}>{serviceTime}</div>
            </div>
          )
        }
        {
          !isZL
          ? (
            <div className={styles.serveRecord}>
              <div className={styles.title}>服务记录:</div>
              <div className={styles.readOnlyText}>{serviceRecord}</div>
            </div>
          )
          : (
            <div className={styles.serveRecord}>
              <div className={styles.title}>服务内容:</div>
              <div className={styles.readOnlyText}>
                {
                  flowIsApproval ? null
                  : (<div className={styles.adviceTips}>{investAdviceTip}</div>)
                }
                {
                  _.isEmpty(zlServiceRecord.title) ? null
                  : (
                    <div>
                      <span className={styles.caption}>{zlServiceRecord.title}</span>
                      <span className={styles.type}>{zlServiceRecord.type}</span>
                    </div>
                  )
                }
                <div className={styles.rightCT}>{zlServiceRecord.content}</div>
              </div>
            </div>
          )
        }
        {
          !isMOTReturnVisitTask ? null
          : (
            <div className={styles.serveRecord}>
              <div className={styles.title}>回访结果:</div>
              <div className={styles.readOnlyText}>{motReturnResult === 'Success' ? '成功' : '失败'}</div>
            </div>
          )
        }
        {
          (isMOTReturnVisitTask && motReturnResult === 'Lost')
          ?
          (
            <div className={styles.serveRecord}>
              <div className={styles.title}>失败原因:</div>
              <div className={styles.readOnlyText}>{motReturnFailReason}</div>
            </div>
          )
          : null
        }
        <div className={styles.divider} />
        {
          isMOTReturnVisitTask ? null
          :
          (
            <div className={cx([styles.feedbackType, styles.readOnly])}>
              {
                (isZL && flowIsApproval)
                ? (<div className={cx([styles.title, styles.flowIsApproval])}>客户可选反馈:</div>)
                : (<div className={styles.title}>客户反馈:</div>)
              }
              {
                isZL
                ? (
                  <div className={styles.readOnlyText}>
                    <span className={styles.feedbackTypeL1}>{custFeedbackText}</span>
                  </div>
                )
                : (
                  <div className={styles.readOnlyText}>
                    <span className={styles.feedbackTypeL1}>{normalWayCustFeedbackText}</span>
                  </div>
                )
              }
            </div>
          )
        }
        {
          isMOTReturnVisitTask || (isZL && flowIsApproval) || (isZL && ZLFeedbackStatus !== 'FEEDBACK')
          ? null
          : (
            <div className={styles.feedbackTime}>
              <div className={styles.title}>反馈时间:</div>
              <div className={styles.readOnlyText}>{feedbackDateTime}</div>
            </div>
          )
        }
      </div>
      {
        (isZL && _.isEmpty(attachmentList))
        ? null
        : (<ServeRecordAttachment list={attachmentList} />)
      }
    </div>
  );
}

ServiceRecordReadOnly.propTypes = {
  isZL: PropTypes.bool,
  attachmentList: PropTypes.array,
  serviceWay: PropTypes.string,
  serviceStatus: PropTypes.string,
  serviceStatusCode: PropTypes.string,
  serviceTime: PropTypes.string,
  serviceRecord: PropTypes.string,
  zlServiceRecord: PropTypes.object,
  feedbackDateTime: PropTypes.string,
  custFeedback: PropTypes.string,
  custFeedback2: PropTypes.string,
  ZLServiceContentTime: PropTypes.string,
  ZLCustFeedback: PropTypes.string,
  ZLCustFeedbackList: PropTypes.array,
  ZLFeedbackStatus: PropTypes.string,
  isMOTReturnVisitTask: PropTypes.bool,
  motReturnResult: PropTypes.string,
  motReturnFailReason: PropTypes.string,
};
ServiceRecordReadOnly.defaultProps = {
  attachmentList: [],
  isZL: false,
  serviceWay: '',
  serviceStatus: '',
  serviceStatusCode: '',
  serviceTime: '',
  serviceFullTime: '',
  serviceRecord: '',
  zlServiceRecord: {},
  feedbackDateTime: '',
  custFeedback: '',
  custFeedback2: '',
  ZLServiceContentTime: '',
  ZLCustFeedback: '',
  ZLCustFeedbackList: [],
  ZLFeedbackStatus: 'NULL',
  isMOTReturnVisitTask: false,
  motReturnResult: '',
  motReturnFailReason: '',
};
