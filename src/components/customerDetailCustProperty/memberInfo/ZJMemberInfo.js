/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-紫金积分会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-09 09:29:11
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import Icon from '../../common/Icon';
import InfoItem from '../../common/infoItem';
import { DEFAULT_VALUE } from '../config';
import { number } from '../../../helper';
import styles from './zjMemberInfo.less';

const INFO_ITEM_WITDH = '110px';
export default class ZJMemberInfo extends PureComponent {
  static propTypes = {
    // 会员信息
    data: PropTypes.object.isRequired,
  }

  @autobind
  getViewValue(value) {
    return _.isEmpty(value) ? DEFAULT_VALUE : value;
  }

  // 获取数值显示数据
  @autobind
  getViewTextByNum(value) {
    return _.isNumber(value) ? number.thousandFormat(value) : DEFAULT_VALUE;
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.zjMemberInfoBox}>
        <div className={`${styles.title} clearfix`}>
          <span className={styles.colorBlock}></span>
          <span className={styles.titleText}>紫金积分会员</span>
          <span className={styles.iconButton}>
            <Icon type='jifenduihuanliushui' />
            <span>积分兑换流水</span>
          </span>
        </div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员编号"
              value={this.getViewValue(data.memberNum)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员名称"
              value={this.getViewValue(data.memberName)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="会员类型"
              value={this.getViewValue(data.memberType)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="项目"
              value={this.getViewValue(data.projects)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册日期"
              value={this.getViewValue(data.registerDate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="状态"
              value={this.getViewValue(data.states)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="紫金币可用积分"
              value={this.getViewTextByNum(data.zjAvailablePoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="涨乐豆可用积分"
              value={this.getViewTextByNum(data.zlAvailablePoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="资金积分"
              value={this.getViewTextByNum(data.fundPoints)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="贡献度积分"
              value={this.getViewTextByNum(data.devotePoints)}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
