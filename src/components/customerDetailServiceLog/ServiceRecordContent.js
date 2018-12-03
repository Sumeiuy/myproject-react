/*
 * @Author: zhufeiyang
 * @Date: 2018-11-19 11:11:19
 * @Last Modified by: zhufeiyang
 * @Last Modified time: 2018-11-22 16:14:50
 * @description 新版360服务记录-服务内容
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ServiceRecordItem from './ServiceRecordItem';
import IfWrap from '../common/biz/IfWrap';
import { isMOTReturnTypeTask, MOT_RETURN_VISIT_WORK_RESULT_SUCCESS } from '../../config/taskList/performView';

import styles from './serviceRecordContent.less';

export default function ServiceRecordContent(props) {
  const { item, executeTypes, filesList } = props;
  const { subtypeCd = '', eventId = '', workResult = '' } = item;
  // 判断是否是MOT 回访类型任务
  const isMOTReturnVisitTask = isMOTReturnTypeTask(eventId);
  // 判断回访结果是否成功
  const isSuccessForMotReturnVisit = workResult === MOT_RETURN_VISIT_WORK_RESULT_SUCCESS;

  // 包含MOT服务记录则为MOT任务服务记录
  if (!_.isEmpty(subtypeCd)) {
    if (subtypeCd.indexOf('MOT服务记录') !== -1) {
      return (
        <div className={styles.serviceContainer}>
          <ServiceRecordItem
            content={item.actor}
            title="实施者"
          />
          <ServiceRecordItem
            isNeedTooltip
            content={item.taskDesc}
            title="任务提示"
          />
          <ServiceRecordItem
            content={`${item.taskType}`}
            title="任务类型"
          />
          {/* 此处针对涨乐财富通的服务记录做特殊处理 */}
          {/* 此处需要针对如果是 MOT 回访类型任务的话 展示回访结果和失败原因 */}
          <IfWrap isRender={!isMOTReturnVisitTask}>
            <ServiceRecordItem
              feedbackStatus={item.zlcftMsgStatus}
              content={item.custFeedback}
              title="客户反馈"
            />
          </IfWrap>
          <IfWrap isRender={!isMOTReturnVisitTask}>
            <ServiceRecordItem
              content={item.feedbackTime}
              title="反馈时间"
            />
          </IfWrap>
          <ServiceRecordItem
            content={item.handlerType}
            title="执行类型"
            executeTypes={executeTypes}
          />
          <ServiceRecordItem
            content={item.handlerTimeLimit}
            title="处理期限"
          />
          <IfWrap isRender={isMOTReturnVisitTask}>
            <ServiceRecordItem
              content={workResult}
              title="回访结果"
            />
          </IfWrap>
          <IfWrap isRender={!(isMOTReturnVisitTask && isSuccessForMotReturnVisit)}>
            <ServiceRecordItem
              content={item.custFeedback}
              title="失败原因"
            />
          </IfWrap>
          <IfWrap isRender={!_.isEmpty(item.uuid)}>
            <ServiceRecordItem
              content={item.uuid}
              title="附件"
              filesList={filesList}
              isHaveFileList
            />
          </IfWrap>
        </div>
      );
    }
  }


  return (
    <div className={styles.serviceContainer} id="serviceContainer">
      <ServiceRecordItem
        content={item.actor}
        title="实施者"
      />
      <IfWrap isRender={!_.isEmpty(subtypeCd)}>
        <ServiceRecordItem
          content={item.taskType}
          title="任务类型"
        />
      </IfWrap>
      <ServiceRecordItem
        feedbackStatus={item.zlcftMsgStatus}
        content={item.custFeedback}
        title="客户反馈"
      />
      <ServiceRecordItem
        content={item.feedbackTime}
        title="反馈时间"
      />
      {
        /*
        <ServiceRecordItem
          content={item.serveStatus}
          title={'服务状态'}
        />
        */
      }
      <IfWrap isRender={!_.isEmpty(item.uuid)}>
        <ServiceRecordItem
          content={item.uuid}
          title="附件"
          filesList={filesList}
          isHaveFileList
        />
      </IfWrap>
    </div>
  );
}

ServiceRecordContent.propTypes = {
  item: PropTypes.object,
  executeTypes: PropTypes.array,
  filesList: PropTypes.array,
};

ServiceRecordContent.defaultProps = {
  item: {},
  executeTypes: [],
  filesList: [],
};
