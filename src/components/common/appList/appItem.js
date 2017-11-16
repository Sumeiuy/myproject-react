/**
 * @Author: sunweibin
 * @Date: 2017-11-16 14:44:10
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-16 17:22:13
 * @description 合作合约、服务订购、私密申请的每一项
 */

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';

import Tag from '../tag';
import Icon from '../Icon';
import styles from './appItem.less';

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

function showCustomerBySubtype(data) {
  if (data.subType === '0202') {
    return `共${data.business2 || 0}人,已完成${data.business3 || 0}人`;
  }
  return `客户：${data.custName || '无'}(${data.custNumber || '无'})`;
}

export default function AppItem(props) {
  const {
    data,
    pageName,
    type,
    pageData,
    active,
    onClick,
    index,
  } = props;
  if (_.isEmpty(data)) return null;
  const { subType, status, operationList } = pageData;
  const operateType = _.filter(operationList, v => v.label !== '全部');
  const appItemCls = cx({
    [styles.appItem]: true,
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
          <Icon type={type} className={styles.appIcon} />
          <span className={styles.serialNumber}>编号{data.id || '暂无'}</span>
          {
            (pageName === 'channelsTypeProtocol' && data.business2) ?
              <span className={styles.type}>{changeDisplay(data.business2, operateType)}</span>
            :
              <span className={styles.type}>{changeTypeDisplay(data.type, pageData)}</span>
          }
        </div>
        <div className={styles.tagArea}>
          {(pageName === 'contract' && data.business2) ? <Tag type="yellow" text={changeDisplay(data.business2, operateType)} /> : null}
          <Tag type="blue" text={changeDisplay(data.status, status)} />
        </div>
      </div>
      {/* 第二行 */}
      <div className={styles.secondLine}>
        <div className={styles.subType}>{changeDisplay(data.subType, subType)}</div>
        <div className={styles.date}>{(data.createTime && data.createTime.slice(0, 10)) || '无'}</div>
      </div>
      {/* 第三行 */}
      <div className={styles.thirdLine}>
        <div className={styles.drafter}>拟稿人：<span className={styles.drafterName}>{data.empName}({data.empId})</span>{`${data.orgName || ''}` || '无'}</div>
        <div className={styles.customer} title={showCustomerBySubtype(data)}>
          {showCustomerBySubtype(data)}
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
