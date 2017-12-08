/**
 * @file components/customerPool/Reorder.js
 *  客户池-客户列表排序
 * @author wangjunjun
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import Clickable from '../../../components/common/Clickable';

import styles from './reorder.less';

// 排序的字段配置，方便后面修改
const openTimeAsc = { sortType: 'OpenDt', sortDirection: 'asc' };
const openTimeDesc = { sortType: 'OpenDt', sortDirection: 'desc' };
const commissionAsc = { sortType: 'Fee', sortDirection: 'asc' };
const commissionDesc = { sortType: 'Fee', sortDirection: 'desc' };
const totalAssetsAsc = { sortType: 'Aset', sortDirection: 'asc' };
const totalAssetsDesc = { sortType: 'Aset', sortDirection: 'desc' };

export default class Order extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
  }

  // 判断点击的按钮，是否添加 class = active
  @autobind
  getCls(obj) {
    return _.isEqual(this.props.value, obj) ? 'active' : '';
  }

  // 处理点击排序按钮
  @autobind
  handleSort(obj) {
    const { onChange } = this.props;
    this.setState({
      obj,
    }, () => {
      onChange(obj);
    });
  }

  render() {
    return (
      <ul className={styles.reorder}>
        <li>
          总资产
          <div className={styles.btn}>
            <Clickable
              onClick={() => this.handleSort(totalAssetsAsc)}
              eventName="/click/custListOrder/assetsAscOrder"
            >
              <Icon
                type="xiangshang"
                className={this.getCls(totalAssetsAsc)}
              />
            </Clickable>
            <Clickable
              onClick={() => this.handleSort(totalAssetsDesc)}
              eventName="/click/custListOrder/assetsDescOrder"
            >
              <Icon
                type="xiangxia"
                className={this.getCls(totalAssetsDesc)}
              />
            </Clickable>
          </div>
        </li>
        <li>
          开户时间
          <div className={styles.btn}>
            <Clickable
              onClick={() => this.handleSort(openTimeAsc)}
              eventName="/click/custListOrder/timeAscOrder"
            >
              <Icon
                type="xiangshang"
                className={this.getCls(openTimeAsc)}
              />
            </Clickable>
            <Clickable
              onClick={() => this.handleSort(openTimeDesc)}
              eventName="/click/custListOrder/timeDescOrder"
            >
              <Icon
                type="xiangxia"
                className={this.getCls(openTimeDesc)}
              />
            </Clickable>
          </div>
        </li>
        <li>
          佣金率
          <div className={styles.btn}>
            <Clickable
              onClick={() => this.handleSort(commissionAsc)}
              eventName="/click/custListOrder/commissionAscOrder"
            >
              <Icon
                type="xiangshang"
                className={this.getCls(commissionAsc)}
              />
            </Clickable>
            <Clickable
              onClick={() => this.handleSort(commissionDesc)}
              eventName="/click/custListOrder/commissionAscOrder"
            >
              <Icon
                type="xiangxia"
                className={this.getCls(commissionDesc)}
              />
            </Clickable>
          </div>
        </li>
      </ul>
    );
  }
}
