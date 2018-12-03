import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ServiceRecordItem from './ServiceRecordItem';
import { isMOTReturnTypeTask, MOT_RETURN_VISIT_WORK_RESULT_SUCCESS } from '../../../config/taskList/performView';

import styles from './createCollapse.less';

export default function ServiceRecordContent(props) {
  const { item, executeTypes, filesList } = props;
  const { subtypeCd = '', eventId = '', workResult = '' } = item;
  const isShowChild = _.isEmpty(item.uuid); // 默认有文件名这个字段
  const attacthment = !isShowChild
    ? (
      <ServiceRecordItem
        content={item.uuid}
        title="附件"
        filesList={filesList}
        isShowChild={!isShowChild}
      />
    )
    : null;

  // 判断是否是MOT 回访类型任务
  const isMOTReturnVisitTask = isMOTReturnTypeTask(eventId);
  // 判断回访结果是否成功
  const isSuccessForMotReturnVisit = workResult === MOT_RETURN_VISIT_WORK_RESULT_SUCCESS;

  // 包含MOT服务记录则为MOT任务服务记录
  if (!_.isEmpty(subtypeCd)) {
    if (subtypeCd.indexOf('MOT服务记录') !== -1) {
      return (
        <div className={styles.serviceContainer} id="serviceContainer" key={item.id}>
          <div className={styles.leftSection}>
            <ServiceRecordItem
              content={item.actor}
              title="实施者"
            />
            {/* 此处针对涨乐财富通的服务记录做特殊处理 */}
            {/* 此处需要针对如果是 MOT 回访类型任务的话 展示回访结果和失败原因 */}
            {
              isMOTReturnVisitTask ? null
                : (
                  <ServiceRecordItem
                    feedbackStatus={item.zlcftMsgStatus}
                    content={item.custFeedback}
                    title="客户反馈"
                  />
                )
            }
            {
              isMOTReturnVisitTask ? null
                : (
                  <ServiceRecordItem
                    content={item.feedbackTime}
                    title="反馈时间"
                  />
                )
            }
            {
              !isMOTReturnVisitTask ? null
                : (
                  <ServiceRecordItem
                    content={workResult}
                    title="回访结果"
                  />
                )
            }
            {
              (isMOTReturnVisitTask && isSuccessForMotReturnVisit) ? null
                : (
                  <ServiceRecordItem
                    content={item.custFeedback}
                    title="失败原因"
                  />
                )
            }
            <ServiceRecordItem
              content={item.handlerTimeLimit}
              title="处理期限"
            />
            {attacthment}
          </div>
          <div className={styles.rightSection}>
            <ServiceRecordItem
              panelContent
              content={item.taskDesc}
              title="任务提示"
              type="right"
            />
            <ServiceRecordItem
              content={`${item.taskType}`}
              title="任务类型"
              type="right"
            />
            <ServiceRecordItem
              content={item.handlerType}
              title="执行类型"
              executeTypes={executeTypes}
              type="right"
            />
          </div>
        </div>
      );
    }
  }


  return (
    <div className={styles.serviceContainer} id="serviceContainer">
      <div className={styles.leftSection}>
        <ServiceRecordItem
          content={item.actor}
          title="实施者"
        />
        <ServiceRecordItem
          feedbackStatus={item.zlcftMsgStatus}
          content={item.custFeedback}
          title="客户反馈"
        />
        <ServiceRecordItem
          content={item.feedbackTime}
          title="反馈时间"
        />
        {/* 占时不展示服务状态 */}
        {/* <ServiceRecordItem
          content={item.serveStatus}
          title={'服务状态'}
        /> */}
        {attacthment}
      </div>
      {
        !_.isEmpty(subtypeCd)
          // 不是MOT任务，但是是从OCRM来的
          ? (
            <div className={styles.rightSection}>
              <ServiceRecordItem
                content={item.taskType}
                title="任务类型"
                type="right"
              />
            </div>
          )
          // MOT系统来的，短信、呼叫中心
          : null
      }
    </div>
  );
}

ServiceRecordContent.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
  executeTypes: PropTypes.array,
  filesList: PropTypes.array,
};

ServiceRecordContent.defaultProps = {
  item: {},
  type: '',
  executeTypes: [],
  filesList: [],
};
