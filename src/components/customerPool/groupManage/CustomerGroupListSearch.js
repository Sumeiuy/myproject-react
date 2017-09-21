/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 17:09:13
 * @Last Modified by:   xuxiaoqin
 * @Last Modified time: 2017-09-20 17:09:13
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
// import { Link } from 'dva/router';
// import classnames from 'classnames';
// import _ from 'lodash';
import styles from './customerGroupListSearch.less';

// const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};
const Search = Input.Search;

export default class CustomerGroupListSearch extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => { },
  };

  render() {
    const { onSearch } = this.props;
    return (
      <div className={styles.searchWrapper}>
        <span className={styles.name}>客户名称：</span>
        <Search
          placeholder="分组名"
          style={{ width: 200 }}
          onSearch={onSearch}
        />
      </div>
    );
  }
}
