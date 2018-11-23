/*
 * @Author: zhufeiyang
 * @Date: 2018-08-20 08:57:00
 */

 // 这个table只是简单的将antd的table使用的分页器换为我们自己实现的分页器，完全兼容antd原来的table
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import styles from './index.less';
import { autobind } from 'core-decorators';
import _ from 'lodash';
export default class CommonTable extends PureComponent {
  static propTypes = {
    // 分页器class
    paginationClass: PropTypes.string,
    // 是否需要在传入数据条数不足时用空行填充
    isNeedEmptyRow: PropTypes.bool,
    // table数据一页显示的行数，配合 isNeedEmptyRow 实现数据不满该设定行数时用空行填充
    rowNumber: PropTypes.number,
  };

  static defaultProps = {
    paginationClass: '',
    isNeedEmptyRow: false,
    rowNumber: 5,
  };

 // 获取填充过的数据，判断当前传进来的dataSource是否能在table里显示满（包括前端分页的情况下）
 // 如果无法显示满则用空数据填充至能显示满
 @autobind
 getFilledData() {
   const {
    dataSource,
    rowNumber,
   } = this.props;
   // 需要往原始数据里面填充空数据的条数
   const fillNum = rowNumber - (_.size(dataSource) % rowNumber);
   if (fillNum > 0) {
     let emptyItemArr = [];
     for (let i = 0; i < fillNum; i++) {
      emptyItemArr.push({
        key: `empty_row_${i}`,
        flag: true,
      });
     };
     return _.concat(dataSource, emptyItemArr);
   }
   return dataSource;
 }

  render() {
    const {
      paginationClass,
      isNeedEmptyRow,
      dataSource,
      ...restProps
    } = this.props;
    let newDataSource = isNeedEmptyRow ? this.getFilledData() : dataSource;
    return (
      <div className={styles.groupTable}>
        <Table
          {...restProps}
          dataSource={newDataSource}
          paginationClass={`${styles.pagination} ${paginationClass}`}
        />
      </div>
    );
  }
}
