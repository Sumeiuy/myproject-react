/**
 * @Descripter: 客户列表排序
 * @Author: K0170179
 * @Date: 2018/6/7
 */
import React, { PureComponent } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import logable from '../../../../decorators/logable';
import config from './config';
import Icon from '../../../common/Icon';
import styles from './reorder.less';

export default class Reorder extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
    date: PropTypes.object,
  };

  static defaultProps = {
    date: {},
  }

  isActive(item, index) {
    const { value: { sortType, sortDirection } } = this.props;
    return sortType === item.sortType
      && sortDirection === item.sortDirections[index];
  }

  // 处理点击排序按钮
  @autobind
  @logable({ type: 'Click', payload: { name: '$args[0].name' } })
  handleSwitchSortClick(item) {
    const { onChange, value: { sortType, sortDirection: currentSortD } } = this.props;
    let sortDirection = item.defaultDirections;
    if (item.sortType === sortType) {
      const [ASC, DESC] = item.sortDirections;
      sortDirection = currentSortD === ASC ? DESC : ASC;
    }
    onChange({
      sortType: item.sortType,
      sortDirection,
    });
  }

  renderUpAndDown(item) {
    // icon 的type(包含向上，向下icon)
    const iconType = ['xiangshang', 'xiangxia'];
    return _.map(iconType, (type, index) => (
      <Icon key={type} type={type} className={classnames({ active: this.isActive(item, index) })} />
    ));
  }

  render() {
    const { value: { sortType }, date } = this.props;
    const totalConfig = {
      ...config,
      ...date,
    };
    return (
      <ul className={styles.reorder}>
        {
          _.map(totalConfig, item => (
            <li
              key={item.sortType}
              className={classnames({ active: sortType === item.sortType })}
              onClick={() => this.handleSwitchSortClick(item)}
            >
              {item.name}
              <div className={styles.btn}>
                {this.renderUpAndDown(item)}
              </div>
            </li>
          ))
        }
      </ul>
    );
  }
}
