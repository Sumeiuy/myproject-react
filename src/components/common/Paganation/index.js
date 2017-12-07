/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-16 11:09:39
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-11-10 17:44:03
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pagination } from 'antd';
import styles from './index.less';

export default class Paganation extends PureComponent {
  static propTypes = {
    curPageNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    totalRecordNum: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    curPageSize: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    onPageChange: PropTypes.func,
    onSizeChange: PropTypes.func,
    originPageSizeUnit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    showSizeChanger: PropTypes.bool,
  };

  static defaultProps = {
    curPageNum: 1,
    totalRecordNum: 10,
    curPageSize: 10,
    onPageChange: () => { },
    onSizeChange: () => { },
    originPageSizeUnit: 10,
    showSizeChanger: true,
  };

  componentDidMount() {
    const { totalRecordNum, curPageSize } = this.props;
    const totalPage = Math.ceil(totalRecordNum / curPageSize);
    if (totalPage > 10) {
      const paganationNode = this.wrappedInstance.children[0];
      const lastPage = _.head(_.filter(paganationNode.childNodes,
        item => item.title === String(totalPage)));

      // TODO
      // 后面改一下，不要用style
      lastPage.style.display = 'none';
    }
  }

  /**
   * 获得组件
   */
  @autobind
  getWrappedInstance() {
    return this.wrappedInstance;
  }

  @autobind
  setWrappedInstance(ref) {
    this.wrappedInstance = ref;
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
    showSizeChanger,
  }) {
    const paginationOptions = {
      current: parseInt(curPageNum, 10),
      defaultCurrent: 1,
      size: 'small', // 迷你版
      total: Number(totalRecordNum),
      pageSize: parseInt(curPageSize, 10),
      defaultPageSize: Number(curPageSize),
      onChange: onPageChange,
      showTotal: total =>
        <span className={styles.totalPageSection}>
          共 <span className={styles.totalPage}>
            {total}
          </span> 项
        </span>,
      showSizeChanger,
      onShowSizeChange: onSizeChange,
      pageSizeOptions: this.renderPageSizeOptions(totalRecordNum, originPageSizeUnit),
    };

    return paginationOptions;
  }

  render() {
    const paginationOptionsProps = this.renderPaganation({ ...this.props });

    return (
      <div ref={this.setWrappedInstance}>
        <Pagination
          {...paginationOptionsProps}
          className={styles.commonPage}
        />
      </div>
    );
  }
}
