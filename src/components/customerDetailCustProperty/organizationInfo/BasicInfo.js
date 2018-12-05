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
import _ from 'lodash';
import InfoItem from '../../common/infoItem';
import { number } from '../../../helper';
import {
  DEFAULT_VALUE,
  DEFAULT_PRIVATE_VALUE,
  getViewTextByBool,
  checkIsNeedTitle,
} from '../config';
import styles from './basicInfo.less';

const INFO_ITEM_WITDH_110 = '110px';
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

  // 获取数值显示数据
  @autobind
  getViewTextByNum(value) {
    return _.isNumber(value)
      ? number.formatToUnit({
        num: value,
        floatLength: 2,
        unit: '元',
      })
      : DEFAULT_VALUE;
  }

  // 获取title
  @autobind
  getViewTitleByNum(value) {
    return _.isNumber(value) ? `${number.thousandFormat(value)}元` : DEFAULT_VALUE;
  }

  render() {
    const { data } = this.props;
    return (
      <div className={styles.basicInfoBox}>
        <div className={styles.title}>工商信息</div>
        <div className={styles.container}>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="机构简称"
              value={data.orgShortName || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.orgShortName || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="机构类型"
              value={data.orgType || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.orgType || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="机构类别性质"
              value={data.orgNature || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.orgNature || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="所属行业"
              value={data.industry || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.industry || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="经营范围"
              value={data.businessScope || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.businessScope || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册资金"
              value={this.getViewTextByNum(data.registeredFund)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getViewTextByNum(data.registeredFund))}
              title={this.getViewTitleByNum(data.registeredFund)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="注册地点"
              value={data.registeredAddress || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.registeredAddress || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="成立时间"
              value={data.createTime || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.createTime || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="国有属性"
              value={data.stateOwnedAttribute || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.stateOwnedAttribute || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="资本属性"
              value={data.capitalAttribute || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.capitalAttribute || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="营业执照号码"
              value={this.getPrivateValue(data.businessLicenseId)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.businessLicenseId))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="营业执照到期日"
              value={this.getPrivateValue(data.businessLicenseValdate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.businessLicenseValdate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="组织机构代码"
              value={this.getPrivateValue(data.orgInstitutionCode)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.orgInstitutionCode))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="组织机构到期日"
              value={this.getPrivateValue(data.orgInstitutionValdate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.orgInstitutionValdate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="国税税务登记号"
              value={this.getPrivateValue(data.nationalTaxId)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.nationalTaxId))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="国税登记到期日"
              value={this.getPrivateValue(data.nationalTaxValdate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.nationalTaxValdate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH_110}
              label="地税税务登记号"
              value={this.getPrivateValue(data.landTaxId)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.landTaxId))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="地税登记到期日"
              value={this.getPrivateValue(data.landTaxValdate)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(this.getPrivateValue(data.landTaxValdate))}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="企业类型"
              value={data.companyType || DEFAULT_VALUE}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(data.companyType || DEFAULT_VALUE)}
              isNeedOverFlowEllipsis
            />
          </div>
          <div className={styles.infoItemBox}>
            <InfoItem
              width={INFO_ITEM_WITDH}
              label="是否上市公司"
              value={getViewTextByBool(data.isListed)}
              className={styles.infoItem}
              isNeedValueTitle={checkIsNeedTitle(getViewTextByBool(data.isListed))}
              isNeedOverFlowEllipsis
            />
          </div>
          {/* 是上市公司时才显示证券代码 */}
          {
            data.isListed
              ? (
              <div className={styles.infoItemBox}>
                <InfoItem
                  width={INFO_ITEM_WITDH_110}
                  label="证券代码"
                  value={data.stockCode || DEFAULT_VALUE}
                  className={styles.infoItem}
                  isNeedValueTitle={checkIsNeedTitle(data.stockCode || DEFAULT_VALUE)}
                  isNeedOverFlowEllipsis
                />
              </div>
              ) : null
          }
        </div>
      </div>
    );
  }
}
