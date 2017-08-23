/**
 * @file components/customerPool/SingleFilter.js
 *  客户池-客户列表单项筛选
 * @author wangjunjun
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
