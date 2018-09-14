/**
 * @Descripter: 客戶范围筛选
 * @Author: K0170179
 * @Date: 2018/5/14
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import TreeFilter from 'lego-tree-filter/src';
import mouseWheel from '../../../common/mouseWheel';
import { constants } from '../../../../config';
import styles from './custFilter.less';

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
export default class CustRange extends PureComponent {

  static propTypes = {
    collectData: PropTypes.func,
    updateQueryState: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    expandAll: PropTypes.bool,
    orgId: PropTypes.string,
    // 是否默认显示第一条数据
    defaultFirst: PropTypes.bool,
    // 组件宽度
    selectBoxStyle: PropTypes.object,
    // 下拉菜单的宽度
    dropdownWidth: PropTypes.number,
    isDown: PropTypes.bool,
    isHideFilterName: PropTypes.bool,
  }

  static defaultProps = {
    expandAll: false,
    orgId: null,
    defaultFirst: false,
    width: 200,
    dropdownWidth: 200,
    selectBoxStyle: {},
    isDown: false,
    collectData: _.noop,
    isHideFilterName: false,
  }

  constructor(props) {
    super(props);
    const { custRange, orgId, defaultFirst } = this.props;
    this.state = this.getDisplay(orgId, custRange, defaultFirst);
  }

  componentWillReceiveProps(nextProps) {
    const { custRange, orgId, defaultFirst } = nextProps;
    if (orgId !== this.props.orgId || custRange !== this.props.custRange) {
      this.setState({
        ...this.getDisplay(orgId, custRange, defaultFirst),
      });
    }
  }

  @autobind
  onChange(value) {
    if (!value) {
      return;
    }
    const { updateQueryState, custRange, collectData } = this.props;
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
    collectData({
      text: custRangeName,
      orgId,
      // 将当前层级传出来
      level: custRangeLevel,
    });
    updateQueryState({
      orgId,
      custRangeLevel,
      level: custRangeLevel,
      scope: Number(custRangeLevel) + 1,
    });
  }

  /**
   * 当前客户范围组件显示的内容
   * @param {*} orgId 当前需要回填的组织机构树对应的orgId
   * @param {*} custRange 下拉框中的下拉列表的数据
   * @param {*} defaultFirst 是否显示下拉列表数据的第一个
   */
  @autobind
  getDisplay(orgId, custRange, defaultFirst) {
    const formatCustRange = transformCustRangeData(custRange);
    walk(formatCustRange, findOrgNameByOrgId(orgId || custRange[0].id), '');
    let initValue = null;
    if (defaultFirst) {
      initValue = {
        label: custRangeNameDedault,
        value: custRange[0].id,
      };
    } else {
      initValue = {
        label: '不限',
        value: '',
      };
    }
    return {
      formatCustRange,
      value: initValue,
      open: false,
    };
  }

  render() {
    const { custRange, expandAll, dropdownWidth, isDown, isHideFilterName } = this.props;
    const { value } = this.state;
    const formatCustRange = transformCustRangeData(custRange);
    const widthDown = isDown ? 160 : dropdownWidth;
    const placeholder = isDown ? '机构范围' : '分公司/营业部名称';
    const filterName = isHideFilterName ? '' : "服务营业部";
    return (
      <TreeFilter
        dropdownClassName={styles.custFilterWrap}
        filterName={filterName}
        value={value}
        treeDefaultExpandAll={expandAll}
        treeData={formatCustRange}
        onChange={this.onChange}
        treeNodeFilterProp={'title'}
        treeCheckable={false}
        showSearch
        labelInValue
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: widthDown, maxHeight: 400, overflow: 'auto' }}
        getPopupContainer={() => document.querySelector(constants.container)}
        searchPlaceholder={placeholder}
      />
    );
  }
}
