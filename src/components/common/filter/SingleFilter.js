/**
 * @file components/common/filter/SingleFilter.js
 *  单项筛选
 * @author wangjunjun
 *
 * filterLabel string类型 筛选的对象 eg: '客户类型'
 * filterField array类型 筛选项
 * filter string类型 onChange回调方法中返回的对象的name值
 * value string类型 回填到组件的值，也是onChange回调方法中返回的对象的value值
 * onChange function类型 组件的回调方法，获取已选中的值
 *             返回一个对象 { name: 'name', value: 'value' }
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

import styles from './filter.less';

export default class SingleFilter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  static defaultProps = {
    filterField: [],
  }

  @autobind
  handleClick(value) {
    const { filter, onChange } = this.props;
    this.setState({
      key: value,
    }, () => {
      onChange({
        name: filter,
        value,
      });
    });
  }

  render() {
    const { filterLabel, filterField, value } = this.props;
    return (
      <div className={styles.filter}>
        <span>{filterLabel}:</span>
        <ul>
          {
            filterField.map(item => (
              <li
                key={item.key}
                className={value === item.key ? 'current' : ''}
                onClick={() => this.handleClick(item.key)}
              >
                {item.value}
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
