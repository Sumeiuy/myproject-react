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
import classnames from 'classnames';
import ascPng from './img/asc.png';
import descPng from './img/desc.png';
import defaultSortDirections from './config';
import logable from '../../../decorators/logable';
import styles from './sort.less';

const Option = Select.Option;
const EMPTY_LIST = [];
const DIRECTION_IMG = [descPng, ascPng];

export default class Sort extends PureComponent {
  static propTypes = {
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    data: PropTypes.array,
    wrapClassName: PropTypes.string,
    showIntroId: PropTypes.string,
    name: PropTypes.string,
  };

  static defaultProps = {
    onChange: _.noop,
    data: EMPTY_LIST,
    wrapClassName: '',
    showIntroId: '',
    name: '其他排序',
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
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '其他排序',
      value: '$args[0].name'
    },
  })
  handleSortChange(a) {
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
    const { name: displayName, value: { sortType }, data, wrapClassName, showIntroId } = this.props;
    const { name } = this.getCurrentQuota();
    const selectProps = _.omit(this.props, _.keys(Sort.propTypes));
    // 用于上传神策
    const selectedItem = _.filter(data, item => item.sortType === sortType)[0];
    return (
      <div className={classnames(styles.commonSort, wrapClassName)}>
        <div
          className={styles.sortResult}
          onClick={() => this.handleSortChange(selectedItem)}
        >
          <span>{ name }</span>
          { this.renderUpAndDown() }
        </div>
        <div className={styles.switch}>
          <span id={showIntroId}>{displayName}</span>
          <Select
            value={sortType}
            style={{ width: 110 }}
            onChange={this.handleSelectChange}
            dropdownMatchSelectWidth={false}
            dropdownClassName={styles.selectDropDown}
            {...selectProps}
          >
            {
              _.map(data, item => (
                <Option key={item.sortType} value={item.sortType}>{item.name}</Option>
              ))
            }
          </Select>
        </div>
      </div>
    );
  }
}
