/**
 * @file components/customerPool/Reorder.js
 *  客户池-客户列表排序
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../components/common/Icon';

import styles from './reorder.less';

// 排序的字段配置，方便后面修改
const openTimeAsc = { sortType: 'openTime', sortDirection: 'asc' };
const openTimeDesc = { sortType: 'openTime', sortDirection: 'desc' };
const commissionAsc = { sortType: 'commission', sortDirection: 'asc' };
const commissionDesc = { sortType: 'commission', sortDirection: 'desc' };
const totalAssetsAsc = { sortType: 'totalAssets', sortDirection: 'asc' };
const totalAssetsDesc = { sortType: 'totalAssets', sortDirection: 'desc' };

export default class Order extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      obj: totalAssetsDesc,
    };
  }

  // 判断点击的按钮，是否添加 class = active
  @autobind
  getCls(obj) {
    return _.isEqual(this.state.obj, obj) ? 'active' : '';
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
            <Icon
              type="xiangshang"
              className={this.getCls(totalAssetsAsc)}
              onClick={() => this.handleSort(totalAssetsAsc)}
            />
            <Icon
              type="xiangxia"
              className={this.getCls(totalAssetsDesc)}
              onClick={() => this.handleSort(totalAssetsDesc)}
            />
          </div>
        </li>
        <li>
          开户时间
          <div className={styles.btn}>
            <Icon
              type="xiangshang"
              className={this.getCls(openTimeAsc)}
              onClick={() => this.handleSort(openTimeAsc)}
            />
            <Icon
              type="xiangxia"
              className={this.getCls(openTimeDesc)}
              onClick={() => this.handleSort(openTimeDesc)}
            />
          </div>
        </li>
        <li>
          佣金率
          <div className={styles.btn}>
            <Icon
              type="xiangshang"
              className={this.getCls(commissionAsc)}
              onClick={() => this.handleSort(commissionAsc)}
            />
            <Icon
              type="xiangxia"
              className={this.getCls(commissionDesc)}
              onClick={() => this.handleSort(commissionDesc)}
            />
          </div>
        </li>
      </ul>
    );
  }
}
