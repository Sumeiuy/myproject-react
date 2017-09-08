/**
 * @file components/customerPool/SingleFilter.js
 *  客户池-客户列表单项筛选
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import styles from './filter.less';

const generateCls = (v, k) => {
  if (v === '' && v === k) {
    return 'current';
  } else if (v.split(',').indexOf(k) > -1) {
    return 'current';
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
  }

  static defaultProps = {
    filterField: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      keyArr: props.value ? props.value.split(',') : [],
    };
  }

  @autobind
  handleClick(value) {
    const { keyArr } = this.state;
    const { filter, onChange } = this.props;
    if (value) {
      this.setState({
        keyArr: _.includes(keyArr, value) ? keyArr.filter(v => v !== value) : [...keyArr, value],
      }, () => {
        onChange({
          name: filter,
          value: this.state.keyArr.join(','),
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
    const { filterField, value } = this.props;
    return filterField.map(item => (
      <li
        key={item.key}
        className={generateCls(value, item.key)}
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
