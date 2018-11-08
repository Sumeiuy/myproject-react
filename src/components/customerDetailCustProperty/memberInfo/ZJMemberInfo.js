/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-会员信息-紫金积分会员信息
 * @Date: 2018-11-08 18:59:50
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 20:01:24
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import Icon from '../../common/Icon';
import InfoItem from '../../common/infoItem';
import styles from './zjMemberInfo.less';

const INFO_ITEM_WITDH = '110px';
export default class ZJMemberInfo extends PureComponent {
  static propTypes = {
    // 会员信息
    data: PropTypes.object.isRequired,
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
              label='会员编号'
              value={data.memberNum}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='会员名称'
              value={data.memberName}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='会员类型'
              value={data.memberType}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='项目'
              value={data.projects}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='注册日期'
              value={data.registerDate}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='状态'
              value={data.states}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='紫金币可用积分'
              value={data.zjAvailablePoints}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='涨乐豆可用积分'
              value={data.zlAvailablePoints}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='资金积分'
              value={data.fundPoints}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='贡献度积分'
              value={data.devotePoints}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
