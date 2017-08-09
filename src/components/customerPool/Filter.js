/**
 * @file components/customerPool/Filter.js
 *  客户池-客户列表筛选
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

import styles from './filter.less';

export default class Filter extends PureComponent {
  static propTypes = {
    filter: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    filterField: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    defaultValue: PropTypes.string.isRequired,
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
    const { filterLabel, filterField, defaultValue } = this.props;
    return (
      <div className={styles.filter}>
        <span>{filterLabel}:</span>
        <ul>
          {
            filterField.map(item => (
              <li
                key={item.key}
                className={defaultValue === item.key ? 'current' : ''}
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
