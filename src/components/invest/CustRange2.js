/**
 * @file invest/CustRange2.js
 *  客户范围筛选组件
 * @author wangjunjun
 */

import React, { PureComponent, PropTypes } from 'react';
import { TreeSelect } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

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
      open: false,
    };
  }

  componentWillMount() {
    const { custRange } = this.props;
    this.setDefaultValue(custRange);
  }

  componentDidMount() {
    const app = document.querySelector('#app');
    app.addEventListener('mousewheel', this.handleMousewheel, false);
    app.addEventListener('DOMMouseScroll', this.handleMousewheel, false);
  }

  componentWillReceiveProps(nextProps) {
    const { custRange, location: { query: { orgId, custRangeName, custRangeLevel } } } = nextProps;
    // console.log('componentWillReceiveProps>>>', nextProps);
    if (!_.isEqual(this.props.location.query.orgId, orgId)) {
      this.setState({
        value: {
          label: custRangeName ? decodeURIComponent(custRangeName) : custRange[0].name,
          value: custRangeName
                  ?
                  `${custRangeLevel}-${orgId}-${decodeURIComponent(custRangeName)}`
                  : custRange[0].id,
        },
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { location: { query: { orgId } } } = this.props;
    return nextProps.location.query.orgId !== orgId;
  }

  @autobind
  onChange(value) {
    const { replace, location: { query } } = this.props;
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
        scope: Number(custRangeLevel) + 1,
        orderIndicatorId: '',
        orderType: '',
        page: 1,
      },
    });
  }

  setDefaultValue(custRange) {
    const { location: { query: { orgId, custRangeName } } } = this.props;
    const initValue = {
      label: !custRangeName ? custRange[0].name : decodeURIComponent(custRangeName),
      value: orgId || custRange[0].id,
    };
    this.setState({
      value: initValue || {},
    });
  }

  @autobind
  handleMousewheel() {
    const dropDown = document.querySelector('.ant-select-dropdown');
    if (!dropDown) {
      return;
    }
    this.addDropDownMouseWheel();
    const evt = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
    document.querySelector('#app').dispatchEvent(evt);
  }

  handleDropDownMousewheel(e = window.event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  addDropDownMouseWheel() {
    const elem = document.querySelector('.ant-select-tree-dropdown');
    elem.addEventListener('mousewheel', this.handleDropDownMousewheel, false);
    elem.addEventListener('DOMMouseScroll', this.handleDropDownMousewheel, false);
  }

  render() {
    const { custRange } = this.props;
    const { value } = this.state;
    const formatCustRange = transformCustRangeData(custRange);
    console.log('TreeSelct>>>', TreeSelect);
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
