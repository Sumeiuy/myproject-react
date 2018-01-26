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

const PROCESSING = '10'; // 执行者视图状态审批中
const REJECT = '20'; // 执行中视图状态驳回
const CLOSE = '30'; // 执行中视图状态终止
const WAITEXECUTE = '40'; // 等待执行
const END = '70'; // 执行者视图状态结束
const EXECUTING = '50'; // 执行者视图状态执行中
const RESULT = '60';  // 执行中视图状态结果跟踪

// 执行者视图和创建者视图左侧列表项需要显示进度条
const needProgress = ['executor', 'initiator'];

const EXECUTOR = 'executor'; // 执行者视图
const CONTROLLER = 'controller'; // 管理者视图


export default function AppItem(props) {
  const {
    data,
    active,
    onClick,
    index,
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
  const serialCls = cx({
    [styles.serialNumber]: true,
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
    pvProcessing: data.statusCode === PROCESSING && !active,
    pvReject: data.statusCode === REJECT && !active,
    pvClose: data.statusCode === CLOSE && !active,
    pvEnd: data.statusCode === END && !active,
    pvExecuting: data.statusCode === EXECUTING && !active,
    pvResult: data.statusCode === RESULT && !active,
    pvWaitExecute: data.statusCode === WAITEXECUTE && !active,
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
  return (
    <div className={appItemCls} onClick={handleClick}>
      {/* 第一行 */}
      <div className={styles.itemHeader}>
        <div className={styles.title}>
          <span className={appIconCls}>{`${data.executionTypeCode === 'Mission' ? '必' : '选'}`}</span>
          <span className={serialCls}>编号{data.id || '无'}</span>
          <span className={typeCls}>{data.typeName || '无'}</span>
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
              />
            </div> : null
        }
        <div className={styles.taskName}>{data.missionName || '无'}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>创建者：<span>{data.creator}</span>{!_.isEmpty(data.orgName) ? `-${data.orgName}` : ''}</div>
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
};
