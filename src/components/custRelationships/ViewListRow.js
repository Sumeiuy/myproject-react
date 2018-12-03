/**
 * @Author: hongguangqing
 * @Descripter: 客户关联关系信息申请的ViewListRow
 * @Date: 2018-06-08 13:54:33
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2018-06-11 16:46:02
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

export default function ViewListRow(props) {
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
    [styles.custRelationshipsListRow]: true,
    [styles.active]: active,
  });
  function handleClick() {
    onClick(data, index);
  }
  return (
    <div className={appItemCls} onClick={handleClick}>
      {/* 第一行 */}
      <div className={styles.oneLineCls}>
        <div className={styles.title}>
          <Icon type={type} className={styles.appIcon} />
          <span className={styles.serialNumber}>
编号
            {data.id || '暂无'}
          </span>
        </div>
        <div className={styles.tagArea}>
          <div className={styles.tag}>{changeDisplay(data.status, statusOptions)}</div>
        </div>
      </div>
      {/* 第二行 */}
      <div className={styles.secondLine}>
        <span className={styles.type}>{changeTypeDisplay(data.type, pageData)}</span>
        <div className={styles.date}>{(data.createTime && data.createTime.slice(0, 10)) || '无'}</div>
      </div>
      {/* 第三行 */}
      <div className={styles.thirdLine}>
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
        <div className={styles.customer}>
          客户：
          <span>
            {data.custName || '无'}
(
            {data.custNumber || '无'}
)
          </span>
        </div>
      </div>
    </div>
  );
}

ViewListRow.propTypes = {
  data: PropTypes.object.isRequired,
  pageName: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  pageData: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
