/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-产品机构客户属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 19:56:45
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import BasicInfo from './BasicInfo';
import ContactWay from '../common/ContactWay';
import IfWrap from '../../common/biz/IfWrap';
import styles from './productInfo.less';

export default class ProductInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
    // 查询机构客户联系方式
    queryOrgContactWay: PropTypes.func.isRequired,
    // 机构客户联系方式数据
    orgContactWay: PropTypes.object.isRequired,
    // 删除个人|机构客户的非主要联系方式
    delContact: PropTypes.func.isRequired,
    // 新增|修改机构客户电话信息
    updateOrgPhone: PropTypes.func.isRequired,
    // 新增|修改机构客户地址信息
    updateOrgAddress: PropTypes.func.isRequired,
    // 用于修改后刷新客户属性中的数据
    queryCustomerProperty: PropTypes.func.isRequired,
  }

  render() {
    const {
      data,
      hasDuty,
      location,
      orgContactWay,
      queryOrgContactWay,
      delContact,
      updateOrgAddress,
      updateOrgPhone,
      queryCustomerProperty,
    } = this.props;
    const {
      phones = [],
      others = [],
      addresses,
    } = data;
    return (
      <div className={styles.productInfoBox}>
        <BasicInfo
          data={data}
          hasDuty={hasDuty}
        />
        <IfWrap isRender={hasDuty}>
          <ContactWay
            location={location}
            phoneList={phones}
            otherList={others}
            addressList={addresses}
            hasDuty={hasDuty}
            orgContactWay={orgContactWay}
            queryOrgContactWay={queryOrgContactWay}
            delContact={delContact}
            updateOrgAddress={updateOrgAddress}
            updateOrgPhone={updateOrgPhone}
            queryCustomerProperty={queryCustomerProperty}
          />
        </IfWrap>
      </div>
    );
  }
}
