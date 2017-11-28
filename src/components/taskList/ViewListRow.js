/**
 * @Author: hongguangqing
 * @Date: 2017-11-22 15:32:140
 * @description 执行者视图列表每行渲染
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Tag from '../common/tag';
import styles from './viewListRow.less';

const PROCESSING = '10'; // 执行者视图状态审批中
const REJECT = '20'; // 执行中视图状态驳回
const END = '30'; // 执行者视图状态结束
const EXECUTING = '40'; // 执行者视图状态执行中
const RESULT = '50';  // 执行中视图状态结果跟踪


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
    processing: data.statusCode === PROCESSING && !active,
    reject: data.statusCode === REJECT && !active,
    end: data.statusCode === END && !active,
    executing: data.statusCode === EXECUTING && !active,
    result: data.statusCode === RESULT && !active,
    transparent: active,
  });
  function handleClick() {
    onClick(data, index);
  }
  return (
    <div className={appItemCls} onClick={handleClick}>
      {/* 第一行 */}
      <div className={styles.itemHeader}>
        <div className={styles.title}>
          <span className={appIconCls}>{`${data.executionTypeCode === 'Mission' ? '必' : '选'}`}</span>
          <span className={serialCls}>编号{data.id || '暂无'}</span>
          <span className={typeCls}>{data.typeName}</span>
        </div>
        <div className={styles.tagArea}>
          <Tag type={tagStatusType} text={data.statusName} />
        </div>
      </div>
      {/* 第二行 */}
      <div className={secondLineCls}>
        <div className={styles.subType}>{data.missionName}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>拟稿人：<span>{data.creator}</span>{`-${data.orgName || ''}` || '无'}</div>
        <div className={styles.date}>{(data.createTime && data.createTime.slice(0, 10)) || '无'}</div>
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
