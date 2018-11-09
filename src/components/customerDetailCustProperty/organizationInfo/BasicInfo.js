/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-普通机构客户基本信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-09 09:30:40
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoItem from '../../common/infoItem';
import { DEFAULT_VALUE, DEFAULT_PRIVATE_VALUE } from '../config';
import styles from './basicInfo.less';

const INFO_ITEM_WITDH110 = '110px';
const INFO_ITEM_WITDH = '126px';
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
        <div className={styles.title}>工商信息</div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="机构简称"
              value={data.orgShortName || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="机构类型"
              value={data.orgType || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="机构类别性质"
              value={data.orgNature || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="所属行业"
              value={data.industry || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="经营范围"
              value={data.businessScope || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册资金（万元）"
              value={data.registeredFund || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册地点"
              value={data.registeredAddress || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="成立时间"
              value={data.createTime || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="国有属性"
              value={data.stateOwnedAttribute || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="资本属性"
              value={data.capitalAttribute || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="营业执照号码"
              value={this.getPrivateValue(data.businessLicenseId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="营业执照到期日"
              value={this.getPrivateValue(data.businessLicenseValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="组织机构代码"
              value={this.getPrivateValue(data.orgInstitutionCode)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="组织机构到期日"
              value={this.getPrivateValue(data.orgInstitutionValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="国税税务登记号"
              value={this.getPrivateValue(data.nationalTaxId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="国税务登记到期日"
              value={this.getPrivateValue(data.nationalTaxValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label="地税税务登记号"
              value={this.getPrivateValue(data.landTaxId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="地税务登记到期日"
              value={(this.getPrivateValuedata.landTaxValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="是否上市公司"
              value={data.isListed ? '是' : '否'}
              className={styles.infoItem}
            />
          </div>
          {/* 是上市公司时才显示证券代码 */}
          {
            data.isListed
              ? (
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH}
                  label="证券代码"
                  value={data.stockCode || DEFAULT_VALUE}
                  className={styles.infoItem}
                />
              </div>
              ) : null
          }
        </div>
      </div>
    );
  }
}
