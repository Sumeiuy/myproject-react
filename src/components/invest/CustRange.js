/**
 * @file invest/CustRange.js
 *  客户范围筛选组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './custRange.less';

const TreeNode = TreeSelect.TreeNode;
const EMPTY_OBJECT = {};
const TOP_LEVEL_NAME = '经纪业务总部';

function getNodes(arr, parent) {
  return arr.map((item) => {
    let tempName;
    let name;
    if (item.name === parent) {
      tempName = parent;
    } else {
      tempName = `${parent}/${item.name}`;
    }
    const tempArr = tempName.split('/');
    if (tempArr.length > 1) {
      name = _.difference(tempArr, [TOP_LEVEL_NAME]).join('/');
    } else {
      name = TOP_LEVEL_NAME;
    }
    const props = {
      title: item.name,
      value: item.id,
      key: item.id,
      name,
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
    if (extra.triggerValue === extra.preValue[0].value) {
      return;
    }
    this.setState({
      value: {
        ...value,
        key: value ? extra.triggerValue : '',
        label: value ? extra.triggerNode.props.name : '',
      },
    }, () => {
      replace({
        pathname: '',
        query: {
          ...query,
          orgId: value ? encodeURIComponent(value.value) : '',
          custRangeLevel: value ? encodeURIComponent(extra.triggerNode.props.level) : '',
          custRangeName: value ? encodeURIComponent(extra.triggerNode.props.name) : '',
          level: extra.triggerNode.props.level,
        },
      });
    });
  }

  setDefaultValue(custRange) {
    const { location: { query: { orgId, custRangeName } } } = this.props;
    console.log('locationChange', orgId, custRangeName, (custRange[0] || {}).id);
    const initValue = {
      label: !custRangeName ? (custRange[0] || {}).name : decodeURIComponent(custRangeName),
      key: orgId || (custRange[0] || {}).id,
      value: orgId || (custRange[0] || {}).id,
    };
    this.setState({
      value: initValue || EMPTY_OBJECT,
    });
  }

  render() {
    const { custRange } = this.props;
    console.log('this.state.value>>>', this.state.value);
    if (_.isEmpty(this.state.value) || !this.state.value.value) {
      return null;
    }
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
