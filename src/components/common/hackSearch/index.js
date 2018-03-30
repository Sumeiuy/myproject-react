/*
 * @Author: xuwenkang
 * @Date: 2017-09-21 13:39:44
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-03-30 14:32:33
 * 由于antd-Dropdown组件中直接放输入类组件，setState时会导致在ie下输入框失去焦点，所以单独提出来；
 */

import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { Input } from 'antd';
// import ReactDOM from 'react-dom';
import { autobind } from 'core-decorators';
import _ from 'lodash';
// import styles from './index.less';

const Search = Input.Search;

export default class Test extends PureComponent {
  static propTypes = {
    // 默认搜索框值
    defaultValue: PropTypes.string,
    handleChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    defaultValue: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 查询信息
      value: props.defaultValue,
    };
  }

  @autobind
  getValue() {
    return this.state.value;
  }

  @autobind
  handleChangeSearchValue(e) {
    this.setState({
      value: _.trim(e.target.value),
    });
    this.props.handleChange(e.target.value);
  }

  @autobind
  clearValue() {
    this.setState({
      value: '',
    });
  }

  render() {
    return (
      <div>
        <Search
          {...this.props}
          value={this.state.value}
          onChange={this.handleChangeSearchValue}
        />
      </div>
    );
  }
}
