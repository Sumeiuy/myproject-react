/*
 * @Author: xuxiaoqin
 * @Date: 2017-09-20 17:09:13
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-10-20 14:52:33
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon, Button } from 'antd';
import { autobind } from 'core-decorators';
import styles from './customerGroupListSearch.less';

const Search = Input.Search;

export default class CustomerGroupListSearch extends PureComponent {
  static propTypes = {
    onSearch: PropTypes.func,
    isNeedBtn: PropTypes.bool,
  };

  static defaultProps = {
    onSearch: () => { },
    isNeedBtn: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      curSearchValue: '',
    };
  }

  @autobind
  handleSearch(value) {
    const { onSearch } = this.props;
    // 清空搜索值
    // this.setState({
    //   curSearchValue: '',
    // });
    onSearch(value);
  }

  @autobind
  handleInputChange(e) {
    this.setState({
      curSearchValue: e.target.value,
    });
  }

  render() {
    const { isNeedBtn } = this.props;
    const { curSearchValue } = this.state;
    return (
      <div className={styles.searchWrapper}>
        <span className={styles.name}>分组名称：</span>
        <Search
          placeholder="分组名称"
          value={curSearchValue}
          onChange={this.handleInputChange}
          onSearch={this.handleSearch}
          style={{
            height: '30px',
            width: '250px',
          }}
          suffix={
            isNeedBtn ? (
              <Button className="search-btn" size="large" type="primary">
                <Icon type="search" />
              </Button>
            ) : null}
        />
      </div>
    );
  }
}
