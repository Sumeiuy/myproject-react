/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人客户基本信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-09 09:31:31
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoItem from '../../common/infoItem';
import { DEFAULT_VALUE, DEFAULT_PRIVATE_VALUE } from '../config';
import styles from './basicInfo.less';

const INFO_ITEM_WITDH = '110px';
export default class BasicInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
  }

  // 获取需要隐私控制的数据，有权限则展示字段，有权限没有数据则展示--，无权限则展示***
  @autobind
  getPrivateValue(value) {
    const { hasDuty } = this.props;
    return hasDuty ? (value || DEFAULT_VALUE) : DEFAULT_PRIVATE_VALUE;
  }

  // 根据传入的值（bool || null）决定返回的显示值
  @autobind
  getViewTextByBool(bool) {
    if (_.isBoolean(bool)) {
      return bool ? '是' : '否';
    }
    return DEFAULT_VALUE;
  }

  // 获取子女数量显示数据，由于InfoItem value只接受string,所以转了一次字符串
  @autobind
  getChildNumText(value) {
    return _.isNumber(value) ? value.toString() : DEFAULT_VALUE;
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.basicInfoBox}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="出生日期"
              value={data.birthDate || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="职业"
              value={data.profession || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="学历"
              value={data.education || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="国籍"
              value={data.nationality || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="证件类型"
              value={this.getPrivateValue(data.certType)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="证件号码"
              value={this.getPrivateValue(data.certId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="证件有效期"
              value={this.getPrivateValue(data.certValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="是否企业高管"
              value={this.getViewTextByBool(data.isCompanyLeader)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="婚姻状况"
              value={data.maritalText || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="子女数量"
              value={this.getChildNumText(data.childNum)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="爱好"
              value={data.hobby || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
