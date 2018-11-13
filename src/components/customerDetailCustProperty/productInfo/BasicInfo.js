/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-产品机构客户基本信息
 * @Date: 2018-11-07 14:33:00
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 19:55:48
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoItem from '../../common/infoItem';
import {
  DEFAULT_VALUE,
  DEFAULT_PRIVATE_VALUE,
  getViewTextByNum,
} from '../config';
import styles from './basicInfo.less';

const INFO_ITEM_WITDH110 = '110px';
const INFO_ITEM_WITDH = '126px';
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

  render() {
    const { data } = this.props;
    return (
      <div className={styles.basicInfoBox}>
        <div className={styles.title}>工商信息</div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='产品简称'
              value={data.productShortName || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='产品类别'
              value={data.productType || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='产品结构'
              value={data.productConstruct || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='收益特征'
              value={data.earningsFeature || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='持有人类别'
              value={data.holdersType || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='管理人名称'
              value={data.adminName || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='产品到期日'
              value={data.productExpireDate || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='企业类型'
              value={data.companyType || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='机构类别'
              value={data.orgType || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='机构类别性质'
              value={data.orgNature || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='所属行业'
              value={data.industry || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='上市属性'
              value={data.listedProperty || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='国有属性'
              value={data.stateOwnedAttribute || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='资本属性'
              value={data.capitalAttribute || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='注册资金（万元）'
              value={getViewTextByNum(data.registeredFund)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='注册地点'
              value={data.registeredAddress || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='营业执照'
              value={this.getPrivateValue(data.businessLicenseId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='营业执照到期日'
              value={this.getPrivateValue(data.businessLicenseValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='组织机构代码'
              value={this.getPrivateValue(data.orgInstitutionCode)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='组织机构到期日'
              value={this.getPrivateValue(data.orgInstitutionValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='国税税务登记号'
              value={this.getPrivateValue(data.nationalTaxId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='国税务登记到期日'
              value={this.getPrivateValue(data.nationalTaxValdate)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='地税税务登记号'
              value={this.getPrivateValue(data.landTaxId)}
              className={styles.infoItem}
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label='地税务登记到期日'
              value={this.getPrivateValue(data.landTaxValdate)}
              className={styles.infoItem}
            />
          </div>
          <div>
            <InfoItem
              width={INFO_ITEM_WITDH110}
              label='经营范围'
              value={data.businessScope || DEFAULT_VALUE}
              className={styles.infoItem}
            />
          </div>
        </div>
      </div>
    );
  }
}
