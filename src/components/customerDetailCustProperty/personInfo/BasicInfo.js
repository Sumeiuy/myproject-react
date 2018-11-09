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
import InfoItem from '../../common/infoItem';
import { DEFAULT_VALUE, DEFAULT_PRIVATE_VALUE } from '../config';
import styles from './basicInfo.less';

const INFO_ITEM_WITDH = '110px';
export default class BasicInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
  }

  @autobind
  getPrivateValue(value) {
    const { hasDuty } = this.props;
    return hasDuty ? (value || DEFAULT_VALUE) : DEFAULT_PRIVATE_VALUE;
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
              value={data.isCompanyLeader || DEFAULT_VALUE}
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
              value={data.childNum || DEFAULT_VALUE}
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
