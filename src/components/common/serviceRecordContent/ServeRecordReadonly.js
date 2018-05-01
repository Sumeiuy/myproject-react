/**
 * @Author: sunweibin
 * @Date: 2018-04-14 18:32:04
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-04-28 14:27:55
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
  } = props;

  const investAdviceTip = isZL ? '给客户发送了以下投资建议:' : '';
  // 判断当前的流水状态是否审批中
  const flowIsApproval = flow.isApproval(serviceStatusCode);
  // 暂时客户可选反馈选项
  const listText = _.isEmpty(ZLCustFeedbackList) ? '无' : ZLCustFeedbackList.map((item, index) => `${index + 1}、${item.label}`).join('，');
  const custFeedbackText = flowIsApproval ? listText : ZLCustFeedback;

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
        <div className={styles.divider} />
        <div className={styles.custFeedbackSection}>
          <div className={styles.feedbackType}>
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
          {
            (isZL && flowIsApproval) || (isZL && custFeedbackText === '暂无反馈')
            ? null
            : (
              <div className={styles.feedbackTime}>
                <div className={styles.title}>反馈时间:</div>
                <div className={styles.readOnlyText}>{feedbackDateTime}</div>
              </div>
            )
          }
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
};
