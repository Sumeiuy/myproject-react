/**
 * @file components/common/filter/SingleFilter.js
 *  多项筛选
 * @author wangjunjun
 *
 * filterLabel string类型 筛选的对象 eg: '客户类型'
 * filterField array类型 筛选项
 * filter string类型 onChange回调方法中返回的对象的name值
 * value string类型 回填到组件的值，也是onChange回调方法中返回的对象的value值
 * separator string类型 多选的分割符号，可选, 默认逗号分割
 * onChange function类型 组件的回调方法，获取已选中的值
 *             返回一个对象 { name: 'name', value: 'value' }
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './filter.less';

const currentClass = 'current';

const generateCls = (v, k) => {
  if (_.isEmpty(v) && k === '') {
    return currentClass;
  } else if (v.indexOf(k) > -1) {
    return currentClass;
  }
  return '';
};

export default class MultiFilter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    separator: PropTypes.string,
  }

  static defaultProps = {
    filterField: [],
    separator: ',',
  }

  constructor(props) {
    super(props);
    const { value, separator } = props;
    this.state = {
      keyArr: value ? value.split(separator) : [],
    };
  }

  @autobind
  handleClick(value) {
    const { keyArr } = this.state;
    const { separator, filter, onChange } = this.props;
    if (value) {
      this.setState({
        keyArr: _.includes(keyArr, value) ? keyArr.filter(v => v !== value) : [...keyArr, value],
      }, () => {
        onChange({
          name: filter,
          value: this.state.keyArr.join(separator),
        });
      });
    } else {
      this.setState({
        keyArr: [],
      }, () => {
        onChange({
          name: filter,
          value: '',
        });
      });
    }
  }

  @autobind
  renderList() {
    const { filterField } = this.props;
    const { keyArr } = this.state;
    return filterField.map(item => (
      <li
        key={item.key}
        className={generateCls(keyArr, item.key)}
        onClick={() => this.handleClick(item.key)}
      >
        {item.value}
      </li>
    ));
  }

  render() {
    const { filterLabel, filterField } = this.props;
    if (_.isEmpty(filterField)) {
      return null;
    }
    return (
      <div className={styles.filter}>
        <span>{filterLabel}:</span>
        <ul>
          {
            this.renderList()
          }
        </ul>
      </div>
    );
  }
}
