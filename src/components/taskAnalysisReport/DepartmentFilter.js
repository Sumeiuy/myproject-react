/*
 * @Author: zhangjun
 * @Descripter: 部门筛选项
 * @Date: 2018-10-16 17:34:52
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-10-18 17:19:10
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import mouseWheel from '../common/mouseWheel';
import { TreeFilter } from 'lego-tree-filter/src';

import styles from './departmentFilter.less';

function transformCustRangeData(list, parent = '') {
  return list.map((item) => {
    const obj = {
      label: item.name,
      value: parent
        ?
        `${item.level}#${item.id}#${parent}#${item.name}`
        :
        `${item.level}#${item.id}#${item.name}`,
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
export default class DepartmentFilter extends PureComponent {
  static propTypes = {
    // 部门数据
    custRange: PropTypes.array.isRequired,
    // 选择部门
    onDepartmentChange: PropTypes.func.isRequired,
    // 部门Id
    orgId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { custRange, orgId } = props;
    this.state = this.getDisplay(orgId, custRange);
  }

  // 选择部门
  @autobind
  handleDepartmentChange(value) {
    if (!value) {
      return;
    }
    const { onDepartmentChange, custRange } = this.props;
    const tmpArr = value.value.split('#');
    const custRangeLevel = tmpArr[0];
    const orgId = tmpArr[1];
    const custRangeName = tmpArr.slice(2).join('/');
    const changedValue = {
      label: custRangeName,
      value: custRangeName
        ?
        `${custRangeLevel}#${orgId}#${custRangeName}`
        : custRange[0].id,
    };
    this.setState({
      value: changedValue,
    });
    onDepartmentChange({ orgId });
  }

  /**
   * 当前客户范围组件显示的内容
   * @param {*} orgId 当前需要回填的组织机构树对应的orgId
   * @param {*} custRange 下拉框中的下拉列表的数据
   */
  @autobind
  getDisplay(orgId, custRange) {
    const formatCustRange = transformCustRangeData(custRange);
    walk(formatCustRange, findOrgNameByOrgId(orgId
      || (custRange
      && custRange[0]
      && custRange[0].id)), '');
    const initValue = {
        label: custRangeNameDedault,
        value: custRange && custRange[0] && custRange[0].id,
      };
    return {
      formatCustRange,
      value: initValue,
    };
  }

  render() {
    const { value, formatCustRange } = this.state;
    return (
      <div className={styles.departmentFilter}>
        <div className={styles.breadcrumbHeader}>
          <span className={styles.reportTitle}>任务分析报表</span>
          <span className={styles.separator}>/</span>
        </div>
        <div className={styles.department}>
          <TreeFilter
            value={value}
            treeData={formatCustRange}
            onChange={this.handleDepartmentChange}
            key='orgId'
            className={styles.departmentTreeFilter}
            treeNodeFilterProp='title'
            searchPlaceholder='搜索'
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 250,
maxHeight: 300,
overflow: 'auto' }}
            labelInValue
            showSearch
            treeDefaultExpandAll
          />
        </div>
      </div>
    );
  }
}
