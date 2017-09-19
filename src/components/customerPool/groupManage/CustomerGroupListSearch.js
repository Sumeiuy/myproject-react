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
        <Search
          placeholder="分组名"
          style={{ width: 200 }}
          onSearch={onSearch}
        />
      </div>
    );
  }
}
