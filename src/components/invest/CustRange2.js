/**
 * @file invest/CustRange2.js
 *  客户范围筛选组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect } from 'antd';
import { autobind } from 'core-decorators';

import styles from './custRange.less';

function transformCustRangeData(list, parent = '') {
  return list.map((item) => {
    const obj = {
      label: item.name,
      value: parent
            ?
            `${item.level}-${item.id}-${parent}-${item.name}`
            :
            `${item.level}-${item.id}-${item.name}`,
      key: item.id,
    };
    if (item.children && item.children.length) {
      obj.children = transformCustRangeData(item.children, item.name);
    }
    return obj;
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
    if (custRange && !custRange.length) {
      return;
    }
    this.setDefaultValue(custRange);
  }

  componentWillReceiveProps(nextProps) {
    const { custRange } = this.props;
    if (nextProps.custRange !== custRange) {
      this.setDefaultValue(custRange);
    }
  }

  @autobind
  onChange(value, label, extra) {
    const curValue = extra.triggerValue;
    console.log('curValue', curValue);
    this.setState({
      value: {
        label: curValue.split('-').slice(2).join('/'),
        value: curValue,
      },
    }, () => {
      console.log('state2', this.state);
      const { replace, location: { query } } = this.props;
      // const { value } = this.state;
      const tmpArr = value.value.split('-');
      const custRangeLevel = encodeURIComponent(tmpArr[0]);
      const orgId = encodeURIComponent(tmpArr[1]);
      const custRangeName = encodeURIComponent(tmpArr.slice(2).join('/'));
      replace({
        pathname: '',
        query: {
          ...query,
          orgId,
          custRangeLevel,
          custRangeName,
          level: custRangeLevel,
        },
      });
    });
  }

  setDefaultValue(custRange) {
    if (custRange && !custRange.length) {
      return;
    }
    const { location: { query: { orgId, custRangeName } } } = this.props;
    const initValue = {
      label: !custRangeName ? custRange[0].name : decodeURIComponent(custRangeName),
      value: orgId || custRange[0].id,
    };
    this.setState({
      value: initValue || {},
    });
  }

  render() {
    const { custRange } = this.props;
    const { value } = this.state;
    if (!custRange || !custRange.length) {
      return null;
    }
    const formatCustRange = transformCustRangeData(custRange);
    return (
      <TreeSelect
        notFoundContent="没有结果"
        className={styles.custRang}
        value={value}
        treeData={formatCustRange}
        onChange={this.onChange}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeNodeFilterProp={'title'}
        showSearch
        dropdownMatchSelectWidth
        labelInValue
        getPopupContainer={() => document.getElementById('app')}
      />
    );
  }
}
