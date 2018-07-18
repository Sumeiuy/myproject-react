/**
 * @Descripter: 排序组件
 * @Author: K0170179
 * @Date: 2018/7/17
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { Select } from 'antd';
import ascPng from './img/asc.png';
import descPng from './img/desc.png';
import defaultSortDirections from './config';
import styles from './sort.less';

const Option = Select.Option;
const EMPTY_LIST = [];
const DIRECTION_IMG = [descPng, ascPng];

export default class Sort extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    data: PropTypes.array,
  };

  static defaultProps = {
    onChange: _.loop,
    data: EMPTY_LIST,
  };

  @autobind
  getCurrentQuota() {
    const { value: { sortType }, data } = this.props;
    return _.find(data, item => item.sortType === sortType) || {};
  }

  @autobind
  handleSelectChange(value) {
    const { onChange, value: { sortType }, data } = this.props;
    if (sortType !== value) {
      const {
        defaultDirection,
        sortDirections = defaultSortDirections,
      } = _.find(data, item => item.sortType === value);
      onChange({
        sortType: value,
        sortDirection: defaultDirection || sortDirections[0],
      });
    }
  }

  @autobind
  handleSortChange() {
    const { value: { sortDirection, sortType }, onChange } = this.props;
    const { sortDirections = defaultSortDirections } = this.getCurrentQuota();
    const nextSortDirection = _.find(sortDirections,
        sortDireItem => sortDireItem !== sortDirection);
    onChange({
      sortType,
      sortDirection: nextSortDirection,
    });
  }

  @autobind
  renderUpAndDown() {
    const { value: { sortDirection } } = this.props;
    const { sortDirections = defaultSortDirections } = this.getCurrentQuota();
    const direImg = DIRECTION_IMG[_.indexOf(sortDirections, sortDirection)];
    return <img src={direImg} className={styles.sortImg} alt="排序方向" />;
  }

  render() {
    const { value: { sortType }, data } = this.props;
    const { name } = this.getCurrentQuota();
    return (
      <div className={styles.commonSort}>
        <div
          className={styles.sortResult}
          onClick={this.handleSortChange}
        >
          <span>{ name }</span>
          { this.renderUpAndDown() }
        </div>
        <div className={styles.switch}>
          <span>切换指标</span>
          <Select
            value={sortType}
            style={{ width: 110 }}
            onChange={this.handleSelectChange}
            dropdownMatchSelectWidth={false}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            {
              _.map(data, item => (
                <Option value={item.sortType}>{item.name}</Option>
              ))
            }
          </Select>
        </div>
      </div>
    );
  }
}
