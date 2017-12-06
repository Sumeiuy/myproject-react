/**
 * @file components/customerPool/Reorder.js
 *  客户池-客户列表排序
 * @author wangjunjun
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import Clickable from '../../../components/common/Clickable';

import styles from './reorder.less';

// 激活的样式class
const ACTIVE = 'active';

// 升序降序的方向值
const DESC = 'desc';
const ASC = 'asc';

// 排序的字段
const OPENDT = 'OpenDt';
const FEE = 'Fee';
const ASET = 'Aset';

// 排序的字段配置，方便后面修改
const openTimeAsc = { sortType: OPENDT, sortDirection: ASC };
const openTimeDesc = { sortType: OPENDT, sortDirection: DESC };
const commissionAsc = { sortType: FEE, sortDirection: ASC };
const commissionDesc = { sortType: FEE, sortDirection: DESC };
const totalAssetsAsc = { sortType: ASET, sortDirection: ASC };
const totalAssetsDesc = { sortType: ASET, sortDirection: DESC };

export default class Order extends PureComponent {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired,
  }

  // 判断点击的按钮，是否添加 class = active
  @autobind
  getIconCls(obj) {
    return _.isEqual(this.props.value, obj) ? ACTIVE : '';
  }

  // 设置li的class
  @autobind
  getItemCls(value) {
    const { value: { sortType } } = this.props;
    return sortType === value ? ACTIVE : '';
  }

  // 处理点击排序按钮
  @autobind
  toggleOrder(st) {
    const { onChange, value: { sortType, sortDirection } } = this.props;
    let sd = DESC;
    if (sortType === st) {
      sd = sortDirection === DESC ? ASC : DESC;
    }
    onChange({
      sortType: st,
      sortDirection: sd,
    });
  }

  render() {
    return (
      <ul className={styles.reorder}>
        <Clickable
          onClick={() => this.toggleOrder(ASET)}
          eventName="/click/custListOrder/toggleAssetsOrder"
        >
          <li className={this.getItemCls(ASET)}>
            总资产
            <div className={styles.btn}>
              <Icon
                type="xiangshang"
                className={this.getIconCls(totalAssetsAsc)}
              />
              <Icon
                type="xiangxia"
                className={this.getIconCls(totalAssetsDesc)}
              />
            </div>
          </li>
        </Clickable>
        <Clickable
          onClick={() => this.toggleOrder(OPENDT)}
          eventName="/click/custListOrder/toggleOpentimeOrder"
        >
          <li className={this.getItemCls(OPENDT)}>
            开户时间
            <div className={styles.btn}>
              <Icon
                type="xiangshang"
                className={this.getIconCls(openTimeAsc)}
              />
              <Icon
                type="xiangxia"
                className={this.getIconCls(openTimeDesc)}
              />
            </div>
          </li>
        </Clickable>
        <Clickable
          onClick={() => this.toggleOrder(FEE)}
          eventName="/click/custListOrder/toggleFeeOrder"
        >
          <li className={this.getItemCls(FEE)}>
            佣金率
            <div className={styles.btn}>
              <Icon
                type="xiangshang"
                className={this.getIconCls(commissionAsc)}
              />
              <Icon
                type="xiangxia"
                className={this.getIconCls(commissionDesc)}
              />
            </div>
          </li>
        </Clickable>
      </ul>
    );
  }
}
