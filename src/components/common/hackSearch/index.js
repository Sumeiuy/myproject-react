/*
 * @Author: xuwenkang
 * @Date: 2017-09-21 13:39:44
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-05-10 16:56:46
 * 由于antd-Dropdown组件中直接放输入类组件，setState时会导致在ie下输入框失去焦点，所以单独提出来；
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import styles from './index.less';

const Search = Input.Search;

export default class Test extends PureComponent {
  static propTypes = {
    // 默认搜索框值
    searchValue: PropTypes.string,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    searchValue: '',
    onChange: () => { },
  }

  // 取代componentWillReceiveProps
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchValue !== prevState.searchValue) {
      return {
        searchValue: nextProps.searchValue,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // 查询信息
      searchValue: props.searchValue,
    };
  }

  @autobind
  getValue() {
    return this.state.searchValue;
  }

  @autobind
  handleChangeSearchValue(e) {
    this.setState({
      searchValue: _.trim(e.target.value),
    });
    this.props.onChange(e.target.value);
  }

  @autobind
  clearValue() {
    this.setState({
      searchValue: '',
    });
  }

  render() {
    const props = _.omit(this.props, ['handleChange', 'searchValue']);
    return (
      <div>
        <Search
          {...props}
          value={this.state.searchValue}
          onChange={this.handleChangeSearchValue}
        />
      </div>
    );
  }
}
