/**
 * @Author: hongguangqing
 * @Date: 2017-11-22 15:32:140
 * @description 执行者视图列表每行渲染
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import moment from 'moment';

import Tag from '../common/tag';
import styles from './viewListRow.less';
import {
  STATE_PROCESSING_CODE,
  STATE_REJECT_CODE,
  STATE_CLOSE_CODE,
  STATE_EXECUTE_CODE,
  STATE_RESULTTRACK_CODE,
  STATE_WAITEXECUTE_CODE,
  STATE_FINISHED_CODE,
  STATE_COMPLETED_CODE,
} from '../../routes/taskList/config';

const EXECUTOR = 'executor'; // 执行者视图
const CONTROLLER = 'controller'; // 管理者视图

// 执行者视图和创建者视图左侧列表项需要显示进度条
const needProgress = [EXECUTOR, CONTROLLER];

// 1代表是自建任务类型,0代表非自建任务,MOT任务
const TASK_TYPE_SELF = '1';
const TASK_TYPE_NOT_SELF = '0';


export default function AppItem(props) {
  const {
    data,
    active,
    onClick,
    index,
    missionTypeDict,
  } = props;
  if (_.isEmpty(data)) return null;
  const appItemCls = cx({
    [styles.appItem]: true,
    [styles.active]: active,
  });
  const appIconCls = cx({
    [styles.appMissionIcon]: data.executionTypeCode === 'Mission',
    [styles.active]: active,
    [styles.common]: true,
  });
  const secondLineCls = cx({
    [styles.secondLine]: true,
    [styles.active]: active,
  });
  const tagStatusType = cx({
    pvProcessing: data.statusCode === STATE_PROCESSING_CODE && !active,
    pvReject: data.statusCode === STATE_REJECT_CODE && !active,
    pvClose: data.statusCode === STATE_CLOSE_CODE && !active,
    pvEnd: data.statusCode === STATE_FINISHED_CODE && !active,
    pvExecuting: data.statusCode === STATE_EXECUTE_CODE && !active,
    pvResult: data.statusCode === STATE_RESULTTRACK_CODE && !active,
    pvWaitExecute: data.statusCode === STATE_WAITEXECUTE_CODE && !active,
    pvCompleted: data.statusCode === STATE_COMPLETED_CODE && !active,
    activeStatus: active,
  });
  function handleClick() {
    onClick(data, index);
  }
  // 判断当前视图类型是不是执行者视图或者管理者视图
  function judgeMissionViewType(type) {
    return type === EXECUTOR || type === CONTROLLER;
  }
  // 根据当前视图类型判断展示创建时间还是结束时间
  function showCreateTimeOrProcessTime({ missionViewType: type, createTime, processTime }) {
    if (judgeMissionViewType(type)) {
      return processTime && moment(processTime).format('YYYY-MM-DD');
    }
    return createTime && moment(createTime).format('YYYY-MM-DD');
  }
  // 获取descText
  function getDescText(currentMissionTypeCode) {
    const currentMissionTypeObject = _.find(missionTypeDict, item =>
      item.key === currentMissionTypeCode) || {};
    return currentMissionTypeObject;
  }
  // 是否渲染出创建者和工号，只有是自建任务才需要展示
  function isRenderCreator(currentMissionTypeCode) {
    return getDescText(currentMissionTypeCode).descText === TASK_TYPE_SELF;
  }
  // 如果是自建任务，需要加自建：
  function renderMissionTypeName(currentMissionTypeCode) {
    let typeName = '无';
    const { descText, value } = getDescText(currentMissionTypeCode);
    // descText为1代表自建任务
    // descText为0代表MOT任务
    if (descText === TASK_TYPE_SELF) {
      typeName = `自建：${value}`;
    } else if (descText === TASK_TYPE_NOT_SELF) {
      typeName = `MOT：${value}`;
    }

    return typeName;
  }

  return (
    <div className={appItemCls} onClick={handleClick}>
      {/**
       * 第一行
       */}
      <div className={styles.itemHeader}>
        <div
          className={cx({
            [styles.leftArea]: true,
            [styles.active]: active,
          })}
        >
          <span className={appIconCls}>{`${data.executionTypeCode === 'Mission' ? '必' : ''}`}</span>
          <span
            className={cx({
              [styles.title]: true,
              [styles.active]: active,
            })}
            title={data.missionName || '无'}
          >{data.missionName || '无'}</span>
        </div>
        <div
          className={cx({
            [styles.rightArea]: true,
            [styles.active]: active,
          })}
        >
          <span className={styles.time}>{showCreateTimeOrProcessTime(data) || '无'}</span>
        </div>
      </div>

      {/* 第二行 */}
      <div className={secondLineCls}>
        <div
          className={cx({
            [styles.leftArea]: true,
            [styles.active]: active,
          })}
        >
          <div
            className={cx({
              [styles.typeName]: true,
              [styles.active]: active,
            })}
          >{renderMissionTypeName(data.typeCode)}</div>
          {
            isRenderCreator(data.typeCode) && data.creator ?
              <div
                className={cx({
                  [styles.creatorArea]: true,
                  [styles.active]: active,
                })}
              >
                <span className={styles.separator}>|</span>
                <span>{!_.isEmpty(data.creator) ? data.creator : ''}</span>
                <span>{!_.isEmpty(data.creatorId) ? `(${data.creatorId})` : ''}</span>
              </div> :
              null
          }
        </div>
        <div
          className={cx({
            [styles.rightArea]: true,
            [styles.active]: active,
          })}
        >
          {
            _.includes(needProgress, data.missionViewType) ?
              <div
                className={
                  cx({
                    [styles.progress]: true,
                    [styles.active]: active,
                  })
                }
              >
                <span>进度：</span>
                <span className={styles.done}>{data.doneFlowNum}</span>
                <span>/</span>
                <span>{data.flowNum}</span>
              </div> : null
          }
          <Tag type={tagStatusType} clsName={styles.tag} text={data.statusName} />
        </div>
      </div>
    </div>
  );
}

AppItem.propTypes = {
  data: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  missionTypeDict: PropTypes.array,
};

AppItem.defaultProps = {
  missionTypeDict: [],
};
