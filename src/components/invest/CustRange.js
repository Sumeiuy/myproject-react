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
const EMPTY_OBJECT = {};

function getNodes(arr, parent) {
  return arr.map((item) => {
    const props = {
      title: item.name,
      value: item.id,
      key: `${item.level}-${item.id}`,
      name: item.name === parent ? parent : `${parent}/${item.name}`,
      level: item.level,
    };
    let res;
    if (item.children && item.children.length) {
      res = (<TreeNode {...props}>{getNodes(item.children, props.name)}</TreeNode>);
    } else {
      res = (<TreeNode {...props} />);
    }
    return res;
  });
}

export default class CustRange extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
    };
  }

  componentDidMount() {
    const { custRange } = this.props;
    this.setDefaultValue(custRange);
  }

  componentDidUpdate(prevProps) {
    const { custRange } = this.props;
    if (prevProps.custRange !== custRange) {
      this.setDefaultValue(custRange);
    }
  }

  @autobind
  onChange(value, label, extra) {
    console.log('onChange', value, label, extra);
    const { location: { query }, replace } = this.props;
    this.setState({
      value: {
        ...value,
        key: value ? value.key : '',
        label: value ? extra.triggerNode.props.name : '',
      },
    }, () => {
      replace({
        pathname: '',
        query: {
          ...query,
          custRangeId: value ? encodeURIComponent(value.value) : '',
          custRangeLevel: value ? encodeURIComponent(extra.triggerNode.props.level) : '',
        },
      });
    });
  }

  setDefaultValue(custRange) {
    const initValue = {
      label: (custRange[0] || {}).name,
      key: (custRange[0] || {}).id,
    };
    this.setState({
      value: initValue || EMPTY_OBJECT,
    });
  }

  render() {
    const { custRange } = this.props;
    return (
      <TreeSelect
        notFoundContent="没有结果"
        className={styles.custRang}
        value={this.state.value}
        onChange={this.onChange}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeNodeFilterProp={'title'}
        showSearch
        allowClear
        dropdownMatchSelectWidth
        labelInValue
      >
        {getNodes(custRange, (custRange[0] || {}).name)}
      </TreeSelect>
    );
  }
}
