/*
 * @Author: zhangjun
 * @Date: 2018-06-06 14:23:44
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-28 11:16:07
 */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Icon from '../common/Icon';
import styles from './viewListRow.less';

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

function showCustomer(data) {
  return `客户：${data.custName || '无'}(${data.custNumber || '无'})`;
}

export default function AppItem(props) {
  const {
    data,
    type,
    pageData,
    active,
    onClick,
    index,
  } = props;
  if (_.isEmpty(data)) return null;
  const { statusOptions } = pageData;
  const appItemCls = cx({
    [styles.appItem]: true,
    [styles.active]: active,
  });
  const appIconCls = cx({
    [styles.appIcon]: true,
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
  const tagBlueType = cx({
    [styles.tagType]: true,
    [styles.active]: active,
  });
  function handleClick() {
    onClick(data, index);
  }
  return (
    <div className={appItemCls} onClick={handleClick}>
      {/* 第一行 */}
      <div className={styles.itemHeader}>
        <div className={styles.title}>
          <Icon type={type} className={appIconCls} />
          <span className={serialCls}>
编号
            {data.id || '暂无'}
          </span>
        </div>
        <div className={styles.tagArea}>
          <div className={tagBlueType}>
            {changeDisplay(data.status, statusOptions)}
          </div>
        </div>
      </div>
      {/* 第二行 */}
      <div className={secondLineCls}>
        <div className={typeCls}>{changeTypeDisplay(data.type, pageData)}</div>
        <div className={styles.date}>{(data.createTime && data.createTime.slice(0, 10)) || '无'}</div>
      </div>
      {/* 第三行 */}
      <div className={thirdLineCls}>
        <div className={styles.drafter}>
拟稿人：
          <span className={styles.drafterName}>
            {data.empName}
(
            {data.empId}
)
          </span>
          {`${data.orgName || ''}` || '无'}
        </div>
        <div className={styles.customer} title={showCustomer(data)}>
          {showCustomer(data)}
        </div>
      </div>
    </div>
  );
}

AppItem.propTypes = {
  data: PropTypes.object.isRequired,
  pageName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
