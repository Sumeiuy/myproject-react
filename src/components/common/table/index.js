/*
 * @Author: zhufeiyang
 * @Date: 2018-08-20 08:57:00
 */

 // 这个table只是简单的将antd的table使用的分页器换为我们自己实现的分页器，完全兼容antd原来的table
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import styles from './index.less';
import Icon from '../../common/Icon';
import { autobind } from 'core-decorators';
import _ from 'lodash';
export default class CommonTable extends PureComponent {
  static propTypes = {
    // 分页器class
    paginationClass: PropTypes.string,
    isNeedEmptyRow: PropTypes.bool,
  };

  static defaultProps = {
    paginationClass: '',
    isNeedEmptyRow: false,
  };

 //数据为空时，默认显示空行
 @autobind
 padEmptyRow() {
  const { dataSource } = this.props;
   const len = _.size(dataSource);
   let newData = _.cloneDeep(dataSource);
   if (len < 2) {
     const padLen = 2 - len;
     for (let i = 0; i < padLen; i++) {
       newData = _.concat(newData, [{
         key: `empty_row_${i}`,
         flag: true,
       }]);
     }
   }
   return newData;
 }

  render() {
    const {
      paginationClass,
      isNeedEmptyRow,
      dataSource,
      isNeedNoData,
      components,
      ...restProps
    } = this.props;
    let newDataSource = isNeedEmptyRow ? this.padEmptyRow() : dataSource;
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
