/*
 * @Author: xuxiaoqin
 * @Date: 2017-10-16 11:09:39
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-01-28 11:50:03
 * 定制化分页组件，供项目所有需要用到分页的组件调用
 * 调用方式
 * const paginationOption = {
      curPageNum,
      totalRecordNum,
      curPageSize,
      onPageChange,
      onSizeChange,
    };
    <Pagination {...paginationOption}>
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Pagination } from 'antd';
import styles from './index.less';

export default class PaginationComponent extends PureComponent {
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
    isShowSizeChanger: PropTypes.bool,
  };

  static defaultProps = {
    curPageNum: 1,
    totalRecordNum: 20,
    curPageSize: 20,
    onPageChange: () => { },
    onSizeChange: () => { },
    isShowSizeChanger: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      originPageSizeUnit: props.curPageSize || 20,
    };
  }

  componentDidMount() {
    const { totalRecordNum, curPageSize } = this.props;
    const totalPage = Math.ceil(totalRecordNum / curPageSize);
    if (totalPage > 10) {
      const paganationNode = this.wrappedInstance.children[0];
      const lastPage = _.head(_.filter(paganationNode.childNodes,
        item => item.title === String(totalPage)));

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

  @autobind
  renderTotal(total, range) {
    console.log(total);
    console.log(range);
    return `${range[0]}-${range[1]} of ${total} items`;
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
    isShowSizeChanger,
  }) {
    const paginationOptions = {
      current: parseInt(curPageNum, 10),
      defaultCurrent: 1,
      total: Number(totalRecordNum),
      pageSize: parseInt(curPageSize, 10),
      defaultPageSize: Number(curPageSize),
      onChange: onPageChange,
      showTotal: this.renderTotal,
      showSizeChanger: isShowSizeChanger,
      onShowSizeChange: onSizeChange,
      pageSizeOptions: this.renderPageSizeOptions(totalRecordNum, originPageSizeUnit),
    };

    return paginationOptions;
  }

  render() {
    const paginationOptionsProps = this.renderPaganation({ ...this.props, ...this.state });

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
