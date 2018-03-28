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
import ProgressBar from './ProgressBar';
import styles from './viewListRow.less';
import {
  PROCESSING_STATE,
  REJECT_STATE,
  CLOSE_STATE,
  EXECUTE_STATE,
  RESULT_TRACK_STATE,
  WAITEXECUTE_STATE,
  FINISHED_STATE,
  COMPLETED_STATE,
} from '../../routes/taskList/config';

// 执行者视图和创建者视图左侧列表项需要显示进度条
const needProgress = ['executor', 'controller'];

const EXECUTOR = 'executor'; // 执行者视图
const CONTROLLER = 'controller'; // 管理者视图

// 1代表是自建任务类型,0代表非自建任务
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
    [styles.appChanceIcon]: data.executionTypeCode === 'Chance',
    [styles.active]: active,
  });
  const typeCls = cx({
    [styles.type]: true,
    [styles.active]: active,
  });
  const secondLineCls = cx({
    [styles.secondLine]: true,
    [styles.active]: active,
  });
  const thirdLineCls = cx({
    [styles.thirdLine]: true,
    [styles.active]: active,
  });
  const tagStatusType = cx({
    pvProcessing: data.statusCode === PROCESSING_STATE && !active,
    pvReject: data.statusCode === REJECT_STATE && !active,
    pvClose: data.statusCode === CLOSE_STATE && !active,
    pvEnd: data.statusCode === FINISHED_STATE && !active,
    pvExecuting: data.statusCode === EXECUTE_STATE && !active,
    pvResult: data.statusCode === RESULT_TRACK_STATE && !active,
    pvWaitExecute: data.statusCode === WAITEXECUTE_STATE && !active,
    pvCompleted: data.statusCode === COMPLETED_STATE && !active,
    transparent: active,
  });
  const progressCls = cx({
    [styles.progress]: true,
    [styles.active]: active,
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
  // 如果是自建任务，需要加自建：
  function renderMissionTypeName(missionTypeDic, currentMissionTypeCode) {
    let typeName = '无';
    const currentMissionTypeObject = _.find(missionTypeDic, item =>
      item.key === currentMissionTypeCode) || {};
    const { descText } = currentMissionTypeObject;
    // descText为1代表自建任务
    if (descText === TASK_TYPE_SELF) {
      typeName = `自建：${currentMissionTypeObject.value}`;
    } else if (descText === TASK_TYPE_NOT_SELF) {
      typeName = currentMissionTypeObject.value;
    }

    return typeName;
  }
  return (
    <div className={appItemCls} onClick={handleClick}>
      {/* 第一行 */}
      <div className={styles.itemHeader}>
        <div className={styles.title}>
          <span className={appIconCls}>{`${data.executionTypeCode === 'Mission' ? '必' : '选'}`}</span>
          <span className={typeCls}>{renderMissionTypeName(missionTypeDict, data.typeCode)}</span>
        </div>
        <div className={styles.tagArea}>
          <Tag type={tagStatusType} clsName={styles.tag} text={data.statusName} />
        </div>
      </div>
      {/* 第二行 */}
      <div className={secondLineCls}>
        {
          _.includes(needProgress, data.missionViewType) ?
            <div className={progressCls}>
              <ProgressBar
                servicedCustomer={data.doneFlowNum}
                totalCustomer={data.flowNum}
                showInfo={false}
                size="small"
                active={active}
              />
            </div> : null
        }
        <div className={styles.taskName}>{data.missionName || '无'}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>
          <span>创建者：</span>
          <span>{!_.isEmpty(data.creator) ? data.creator : ''}</span>
          <span>{!_.isEmpty(data.creatorId) ? `(${data.creatorId})` : ''}</span>
        </div>
        <div className={styles.date}>{judgeMissionViewType(data.missionViewType) ? '结束时间' : '创建于'}：{showCreateTimeOrProcessTime(data) || '无'}</div>
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
