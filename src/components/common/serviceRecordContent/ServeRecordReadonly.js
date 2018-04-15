/**
 * @Author: sunweibin
 * @Date: 2018-04-14 18:32:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-15 15:00:07
 * @description 只读服务记录
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ServeRecordAttachment from './ServeRecordAttachment';

import styles from './index.less';

export default function ServiceRecordReadOnly(props) {
  const {
    isZL,
    attachmentList,
    serviceWay,
    serviceStatus,
    serviceTime,
    serviceFullTime,
    serviceRecord,
    zlServiceRecord,
    feedbackDateTime,
    custFeedback,
    custFeedback2,
    ZLCustFeedback,
    ZLCustFeedbackTime,
  } = props;

  const investAdviceTip = isZL ? `${serviceFullTime} 给客户发送了以下投资建议` : '';

  return (
    <div className={styles.serviceRecordContent}>
      <div className={styles.gridWrapper}>
        <div className={styles.serveWay}>
          <div className={styles.title}>服务方式:</div>
          <div className={styles.readOnlyText}>{serviceWay}</div>
        </div>
        <div className={styles.serveStatus}>
          <div className={styles.title}>服务状态:</div>
          <div className={styles.readOnlyText}>{serviceStatus}</div>
        </div>
        <div className={styles.serveTime}>
          <div className={styles.title}>服务时间:</div>
          <div className={styles.readOnlyText}>{serviceTime}</div>
        </div>
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
                <div>{investAdviceTip}</div>
                <div><span>{zlServiceRecord.title}</span><span>{zlServiceRecord.type}</span></div>
                <div>{zlServiceRecord.content}</div>
              </div>
            </div>
          )
        }
        <div className={styles.divider} />
        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
            <div className={styles.title}>客户反馈:</div>
            {
              isZL
              ? (
                <div className={styles.readOnlyText}>
                  <span className={styles.feedbackTypeL1}>{ZLCustFeedback}</span>
                </div>
              )
              : (
                <div className={styles.readOnlyText}>
                  <span className={styles.feedbackTypeL1}>{custFeedback}</span>
                  {/** * 二级和一级一样，不展示二级 */}
                  {
                    custFeedback === custFeedback2 ? null :
                      (<span className={styles.feedbackTypeL2}>{custFeedback2}</span>)
                  }
                </div>
              )
            }
          </div>
          <div className={styles.feedbackTime}>
            <div className={styles.title}>反馈时间:</div>
            <div className={styles.readOnlyText}>
              {isZL ? ZLCustFeedbackTime : feedbackDateTime}
            </div>
          </div>
        </div>
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
  serviceTime: PropTypes.string,
  serviceFullTime: PropTypes.string,
  serviceRecord: PropTypes.string,
  zlServiceRecord: PropTypes.object,
  feedbackDateTime: PropTypes.string,
  custFeedback: PropTypes.string,
  custFeedback2: PropTypes.string,
  ZLCustFeedback: PropTypes.string,
  ZLCustFeedbackTime: PropTypes.string,
};
ServiceRecordReadOnly.defaultProps = {
  attachmentList: [],
  isZL: false,
  serviceWay: '',
  serviceStatus: '',
  serviceTime: '',
  serviceFullTime: '',
  serviceRecord: '',
  zlServiceRecord: {},
  feedbackDateTime: '',
  custFeedback: '',
  custFeedback2: '',
  ZLCustFeedback: '',
  ZLCustFeedbackTime: '',
};
