/**
 * @Author: hongguangqing
 * @Date: 2017-11-22 15:32:140
 * @description 执行者视图列表每行渲染
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Tag from '../../common/tag';
import styles from './performerViewListRow.less';

const PROCESSING = '01'; // 执行者视图状态审批中
const END = '02'; // 执行者视图状态结束
const EXECUTING = '03'; // 执行者视图状态执行中
const RESULT = '04';  // 执行中视图状态结果跟踪
const REJECT = '05'; // 执行中视图状态驳回

// 后台返回的类型字段转化为对应的中文显示
const changeTypeDisplay = (st, options) => {
  if (st && !_.isEmpty(st) && st === options.pageType) {
    return options.pageName || '无';
  }
  return '无';
};

// 后台返回的子类型字段、状态字段转化为对应的中文显示
const changeDisplay = (st, options) => {
  if (st && !_.isEmpty(st)) {
    const nowStatus = _.find(options, o => o.value === st) || {};
    return nowStatus.label || '无';
  }
  return '无';
};

export default function AppItem(props) {
  const {
    data,
    pageData,
    active,
    onClick,
    index,
  } = props;
  if (_.isEmpty(data)) return null;
  const { subType, status } = pageData;
  const appItemCls = cx({
    [styles.appItem]: true,
    [styles.active]: active,
  });
  const appIconCls = cx({
    [styles.appMissionIcon]: data.business2 === 'Mission',
    [styles.appChanceIcon]: data.business2 === 'Chance',
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
    pv_processing: data.status === PROCESSING && !active,
    pv_end: data.status === END && !active,
    pv_executing: data.status === EXECUTING && !active,
    pv_result: data.status === RESULT && !active,
    pv_reject: data.status === REJECT && !active,
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
          <span className={appIconCls}>{`${data.business2 === 'Mission' ? '必' : '选'}`}</span>
          <span className={serialCls}>编号{data.id || '暂无'}</span>
          <span className={typeCls}>{changeTypeDisplay(data.type, pageData)}</span>
        </div>
        <div className={styles.tagArea}>
          <Tag type={tagStatusType} text={changeDisplay(data.status, status)} />
        </div>
      </div>
      {/* 第二行 */}
      <div className={secondLineCls}>
        <div className={styles.subType}>{changeDisplay(data.subType, subType)}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>拟稿人：<span>{data.empName}</span>{`-${data.orgName || ''}` || '无'}</div>
        <div className={styles.date}>{(data.createTime && data.createTime.slice(0, 10)) || '无'}</div>
      </div>
    </div>
  );
}

AppItem.propTypes = {
  data: PropTypes.object.isRequired,
  pageName: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
