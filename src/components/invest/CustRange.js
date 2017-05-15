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

  // componentWillReceiveProps(nextProps) {
  //   const { custRange, location: { query: { custRangeId } } } = this.props;
  //   if (custRangeId !== nextProps.location.query.custRangeId) {
  //     this.setDefaultValue(custRange);
  //   }
  // }

  componentDidUpdate(prevProps) {
    const { custRange } = this.props;
    if (prevProps.custRange !== custRange) {
      this.setDefaultValue(custRange);
    }
  }

  @autobind
  onChange(value, label, extra) {
    // console.log('onChange', value, label, extra);
    const { location: { query }, replace } = this.props;
    if (extra.triggerValue === extra.preValue[0].value) {
      return;
    }
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
          orgId: value ? encodeURIComponent(value.value) : '',
          custRangeLevel: value ? encodeURIComponent(extra.triggerNode.props.level) : '',
          level: parseInt(extra.triggerNode.props.level, 10),
        },
      });
    });
  }

  setDefaultValue(custRange) {
    const { location: { query: { custRangeId, custRangeName } } } = this.props;
    // console.log('locationChange', custRangeId, custRangeName);
    const initValue = {
      label: !custRangeName ? (custRange[0] || {}).name : decodeURIComponent(custRangeName),
      key: custRangeId || (custRange[0] || {}).id,
    };
    // console.log('initValue: ', initValue);
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
        dropdownMatchSelectWidth
        labelInValue
      >
        {getNodes(custRange, (custRange[0] || {}).name)}
      </TreeSelect>
    );
  }
}
