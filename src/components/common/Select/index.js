/**
 * @file Select.js
 * @author honggaunqging
 * @Last Modified by: baojiajia
 * @Last Modified:新增width属性 默认值为220px
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Select } from 'antd';
import styles from './index.less';

const Option = Select.Option;
export default class CommonSelect extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ]),
    width: PropTypes.string,
    disabled: PropTypes.bool,
    // 渲染Option时，是否根据数据总的show字段来判断该选项的显示与否
    needShowKey: PropTypes.bool,
    // 选项渲染使用的数据的 Key Map
    optionValueMapKey: PropTypes.string,
    optionLabelMapKey: PropTypes.string,
  }

  static defaultProps = {
    value: '全部',
    data: [],
    width: '',
    disabled: false,
    needShowKey: true,
    optionValueMapKey: 'value',
    optionLabelMapKey: 'label',
  }

  @autobind
  makeSelectOptions(data) {
    // 如果 needShowKey = true 时，需要通过 数据的 show 属性来判断该下拉选项是否显示
    // 如果 needShowKey = false 时，则直接显示所有数据选项
    const { needShowKey, optionValueMapKey, optionLabelMapKey } = this.props;
    const options = _.map(data, (item) => {
      const { show } = item;
      const value = item[optionValueMapKey];
      const label = item[optionLabelMapKey];
      if (needShowKey && !show) {
        return null;
      }
      return (<Option key={value} value={value}>{label}</Option>);
    });
    // 将数组中的 null 值删除
    return _.compact(options);
  }

  @autobind
  handSelectChange(key) {
    const { name, data } = this.props;
    const option = _.find(data, item => item.value === key);
    this.props.onChange(name, key, option);
  }

  render() {
    const {
      data, name, value, onChange, width, ...resetProps
    } = this.props;
    const options = this.makeSelectOptions(data);
    return (
      <div className={styles.commomSelect}>
        <Select
          placeholder="全部"
          value={value}
          onChange={this.handSelectChange}
          dropdownMatchSelectWidth={false}
          style={{ width }}
          dropdownStyle={{ width }}
          {...resetProps}
        >
          {options}
        </Select>
      </div>
    );
  }
}
