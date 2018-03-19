import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Select, Icon } from 'antd';
import classnames from 'classnames';
import styles from './newSingleFilter.less';

const Option = Select.Option;

export default class SingleFilter extends PureComponent {
  static propTypes = {
    // 过滤器英文代号
    filter: PropTypes.string.isRequired,
    // 过滤器名称
    filterLabel: PropTypes.string.isRequired,
    // 过滤器可选字段
    filterField: PropTypes.array,
    // 选中条件时的回调
    onChange: PropTypes.func.isRequired,
    // 处理关闭icon的回调
    onCloseIconClick: PropTypes.func,
    // 过滤器当前条件编码值
    value: PropTypes.string.isRequired,

    hideCloseIcon: PropTypes.bool,

    status: PropTypes.bool,
  }
  static defaultProps = {
    filterField: [],
    hideCloseIcon: true,
    onCloseIconClick: _.noop,
    status: false,
  }
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
    };
  }
  @autobind
  handleClick({ key, value }) {
    const { filter, filterLabel, onChange } = this.props;
    this.setState({
      value: key, // 这里并不清楚为什么要异步的这么做
    }, () => {
      onChange({
        name: filter,
        filterLabel,
        key,
        valueArray: [value],
      });
    });
  }

  @autobind
  handleSelectChange(value) {
    this.handleClick({
      key: value.key,
      value: value.label,
    });
  }

  @autobind
  handleSelectClose() {
    const { filter, filterLabel, onChange, onCloseIconClick } = this.props;
    const key = '';
    const value = '不限';
    this.setState({
      value: key, // 这里并不清楚为什么要异步的这么做
    }, () => {
      onChange({
        name: filter,
        filterLabel,
        key,
        valueArray: [value],
      });
      onCloseIconClick({
        name: filter,
        status: true,
      });
    });
  }

  render() {
    const { filterLabel, filterField, value } = this.props;
   /*  debugger; */
    const selectFilter = _.find(filterField, filter => filter.key === value);
    const selectValue = {
      key: selectFilter.key,
      label: selectFilter.value,
    };
    const cls = classnames({
      [styles.closeIcon]: true,
      [styles.hideCloseIcon]: this.props.hideCloseIcon,
    });
    const filterCls = classnames({
      [styles.filter]: true,
      [styles.hidden]: this.props.status,
    });
    return (
      <div className={filterCls}>
        <span className={styles.filterLabel} title={filterLabel}>{filterLabel}</span>
        <span className={styles.filterSeperator}>：</span>
        <Select
          value={selectValue}
          style={{ minWidth: '73px', fontSize: '14px' }}
          dropdownClassName={styles.dropdownfilterLabel}
          onChange={this.handleSelectChange}
          dropdownMatchSelectWidth={false}
          labelInValue
        >
          {
            filterField.map(item => (
              <Option
                className={styles.overflowAction}
                key={item.key}
                value={item.key}
                title={item.value}
              >
                {item.value}
              </Option>
            ))
          }
        </Select>
        <Icon type="close-circle" className={cls} onClick={this.handleSelectClose} />
      </div>
    );
  }
}

