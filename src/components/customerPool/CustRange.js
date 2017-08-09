/**
 * @file invest/CustRange.js
 *  客户范围筛选组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect } from 'antd';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import mouseWheel from '../common/mouseWheel';
import { constants } from '../../config';
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

let custRangeNameDedault = '';

function walk(orgArr, func, parent) {
  func(orgArr, parent);
  if (Array.isArray(orgArr)) {
    const childrenLen = orgArr.length;
    let i = 0;
    while (i < childrenLen) {
      const children = orgArr[i].children;
      walk(children, func, orgArr[i].label);
      i++;
    }
  }
}

function findOrgNameByOrgId(orgId) {
  return (orgArr, parent) => {
    if (Array.isArray(orgArr)) {
      for (let i = 0; i < orgArr.length; i++) {
        if (orgArr[i].key === orgId) {
          custRangeNameDedault = parent !== '' ?
          `${parent}/${orgArr[i].label}`
          :
          `${orgArr[i].label}`;
        }
      }
    }
  };
}

@mouseWheel({ eventDom: '.ant-select-dropdown' })
export default class CustRange extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    updateQueryState: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    expandAll: PropTypes.bool,
  }

  static defaultProps = {
    expandAll: false,
  }

  constructor(props) {
    super(props);
    const { custRange } = this.props;
    const formatCustRange = transformCustRangeData(custRange);
    walk(formatCustRange, findOrgNameByOrgId(custRange[0].id), '');
    const initValue = {
      label: custRangeNameDedault,
      value: custRange[0].id,
    };
    this.state = {
      formatCustRange,
      value: initValue,
      open: false,
    };
  }

  componentDidMount() {
  }

  @autobind
  onChange(value) {
    if (!value) {
      return;
    }
    const { updateQueryState, custRange, collectData } = this.props;
    const tmpArr = value.value.split('-');
    const custRangeLevel = tmpArr[0];
    const orgId = tmpArr[1];
    const custRangeName = tmpArr.slice(2).join('/');
    const changedValue = {
      label: custRangeName,
      value: custRangeName
                ?
                `${custRangeLevel}-${orgId}-${custRangeName}`
                : custRange[0].id,
    };
    this.setState({
      value: changedValue,
    });
    collectData({
      text: custRangeName,
    });
    updateQueryState({
      orgId,
      custRangeLevel,
      level: custRangeLevel,
      scope: Number(custRangeLevel) + 1,
    });
  }

  render() {
    const { custRange, expandAll } = this.props;
    const { value } = this.state;
    const formatCustRange = transformCustRangeData(custRange);
    return (
      <TreeSelect
        notFoundContent="没有结果"
        className={styles.custRang}
        value={value}
        treeDefaultExpandAll={expandAll}
        treeData={formatCustRange}
        onChange={this.onChange}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeNodeFilterProp={'title'}
        showSearch
        dropdownMatchSelectWidth
        labelInValue
        getPopupContainer={() => document.querySelector(constants.container)}
      />
    );
  }
}
