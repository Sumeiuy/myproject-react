/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-16 11:09:39
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-10 15:45:15
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import styles from './index.less';

export default class Paganation extends PureComponent {
  static propTypes = {
    curPageNum: PropTypes.number,
    totalRecordNum: PropTypes.number,
    curPageSize: PropTypes.number,
    onPageChange: PropTypes.func,
    onSizeChange: PropTypes.func,
    originPageSizeUnit: PropTypes.number,
  };

  static defaultProps = {
    curPageNum: 1,
    totalRecordNum: 10,
    curPageSize: 1,
    onPageChange: () => { },
    onSizeChange: () => { },
    originPageSizeUnit: 10,
  };

  componentDidMount() {
    const { totalRecordNum, curPageSize } = this.props;
    const totalPage = Math.ceil(totalRecordNum / curPageSize);
    if (totalPage > 10) {
      const lastPage = document.querySelector(`li[title="${`${totalPage}`}"]`);
      lastPage.classList.add(classnames({
        hideLastPage: true,
      }));
    }
  }

  /**
   * 构造page size
   * @param {*} totalRecordNum 总条目
   * @param {*} curPageSize 当前分页数
   */
  @autobind
  renderPageSizeOptions(totalRecordNum, originPageSizeUnit) {
    const pageSizeOption = [];
    const maxPage = Math.ceil(totalRecordNum / originPageSizeUnit);

    for (let i = 1; i <= maxPage; i++) {
      if (originPageSizeUnit * i <= 40) {
        pageSizeOption.push((originPageSizeUnit * i).toString());
      } else {
        break;
      }
    }

    return pageSizeOption;
  }

  /**
   * 构造分页器
   * @param {*} curPageNum 当前页
   * @param {*} totalRecordNum 总条目
   * @param {*} curPageSize 当前分页条目
   */
  @autobind
  renderPaganation({
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
      pageSizeOptions: this.renderPageSizeOptions(totalRecordNum, originPageSizeUnit),
    };

    return paginationOptions;
  }

  render() {
    const paginationOptionsProps = this.renderPaganation({ ...this.props });

    return (
      <Pagination {...paginationOptionsProps} className={styles.commonPage} />
    );
  }
}
