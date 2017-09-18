/**
 * @file CommonSelect.js
 * @author honggaunqging
 */

import React, { PureComponent, PropTypes } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import styles from './index.less';

export default class CommonSelect extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  @autobind
  handleSelectChange(value, key) {
    const { replace, location: { pathname, query } } = this.props;
    replace({
      pathname,
      query: {
        ...query,
        [value]: key,
        isResetPageNum: 'Y',
      },
    });
  }

  render() {
    const { data, name, location: { query } } = this.props;
    console.warn('name', name);
    return (
      <div className={styles.commomSelect} style={{ width: '16%' }}>
        <Select
          style={{ width: '80%' }}
          placeholder="全部"
          value={query[name]}
          onChange={key => this.handleSelectChange(name, key)}
        >
          {data}
        </Select>
      </div>
    );
  }
}
