/**
 * @file invest/CustRange.js
 *  客户范围筛选组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect } from 'antd';
import { autobind } from 'core-decorators';

import styles from './custRange.less';

const TreeNode = TreeSelect.TreeNode;

function getNodes(arr) {
  return arr.map(item => (
    <TreeNode value={item.value} title={item.label} key={Math.random()} >
      {
        item.children && getNodes(item.children)
      }
    </TreeNode>
    ),
  );
}

export default class CustRange extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
  }

  static defaultProps = {
    custRange: [],
    location: {},
    replace: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  @autobind
  onChange(value, label, extra) {
    console.log(value, label, extra);
    const { location: { query }, replace } = this.props;
    this.setState({
      value,
    }, () => {
      replace({
        pathname: '',
        query: {
          ...query,
          custRange: encodeURIComponent(value),
        },
      });
    });
  }

  render() {
    return (
      <TreeSelect
        placeholder="客户范围"
        notFoundContent="没有结果"
        className={styles.custRang}
        value={this.state.value}
        onChange={this.onChange}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        showSearch
        allowClear
        dropdownMatchSelectWidth
      >
        {getNodes(this.props.custRange)}
      </TreeSelect>
    );
  }
}
