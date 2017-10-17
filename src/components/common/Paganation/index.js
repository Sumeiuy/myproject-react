/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-16 11:09:39
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-16 11:12:48
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import styles from './index.less';

/**
 * 构造page size
 * @param {*} totalRecordNum 总条目
 * @param {*} curPageSize 当前分页数
 */
function renderPageSizeOptions(totalRecordNum, originPageSizeUnit) {
  const pageSizeOption = [];
  const maxPage = Math.ceil(totalRecordNum / originPageSizeUnit);

  for (let i = 1; i <= maxPage; i++) {
    pageSizeOption.push((originPageSizeUnit * i).toString());
  }

  return pageSizeOption;
}

/**
 * 构造分页器
 * @param {*} curPageNum 当前页
 * @param {*} totalRecordNum 总条目
 * @param {*} curPageSize 当前分页条目
 */
function renderPaganation({
  curPageNum,
  totalRecordNum,
  curPageSize,
  onPageChange,
  onSizeChange,
  originPageSizeUnit,
}) {
  const paginationOptions = {
    current: parseInt(curPageNum, 10),
    defaultCurrent: 1,
    size: 'small', // 迷你版
    total: totalRecordNum,
    pageSize: parseInt(curPageSize, 10),
    defaultPageSize: Number(curPageSize),
    onChange: onPageChange,
    showTotal: total =>
      <span className={styles.totalPageSection}>
        共 <span className={styles.totalPage}>
          {total}
        </span> 项
       </span>,
    showSizeChanger: true,
    onShowSizeChange: onSizeChange,
    pageSizeOptions: renderPageSizeOptions(totalRecordNum, originPageSizeUnit),
  };

  return paginationOptions;
}

export default function Paganation(props) {
  const paginationOptions = renderPaganation(props);

  return (
    <Pagination {...paginationOptions} className={styles.commonPage} />
  );
}

Paganation.propTypes = {
  curPageNum: PropTypes.number,
  totalRecordNum: PropTypes.number,
  curPageSize: PropTypes.number,
  onPageChange: PropTypes.func,
  onSizeChange: PropTypes.func,
  originPageSizeUnit: PropTypes.number,
};

Paganation.defaultProps = {
  curPageNum: 1,
  totalRecordNum: 10,
  curPageSize: 1,
  onPageChange: () => { },
  onSizeChange: () => { },
  originPageSizeUnit: 10,
};
