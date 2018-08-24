/*
 * @Author: zhufeiyang
 * @Date: 2018-08-20 08:57:00
 */

 // 这个table只是简单的将antd的table使用的分页器换为我们自己实现的分页器，完全兼容antd原来的table
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';
import styles from './index.less';

export default class CommonTable extends PureComponent {
  static propTypes = {
    // 分页器class
    paginationClass: PropTypes.string,
  };

  static defaultProps = {
    paginationClass: '',
  };

  render() {
    const { paginationClass, ...restProps } = this.props;
    return (
      <div className={styles.groupTable}>
        <Table
          {...restProps}
          paginationClass={`${styles.pagination} ${paginationClass}`}
        />
      </div>
    );
  }
}
