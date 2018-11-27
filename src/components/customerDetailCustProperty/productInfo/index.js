/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-产品机构客户属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:14:01
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from './BasicInfo';
import ContactWay from '../common/ContactWay';

export default class ProductInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
    // 查询机构客户联系方式
    queryOrgContactWay: PropTypes.func.isRequired,
    // 机构客户联系方式数据
    orgContactWay: PropTypes.object.isRequired,
  }

  render() {
    const {
      data,
      hasDuty,
      location,
      orgContactWay,
      queryOrgContactWay,
    } = this.props;
    const {
      phones = [],
      others = [],
      addresses,
    } = data;
    return (
      <div>
        <BasicInfo
          data={data}
          hasDuty={hasDuty}
        />
        <ContactWay
          location={location}
          phoneList={phones}
          otherList={others}
          addressList={addresses}
          hasDuty={hasDuty}
          orgContactWay={orgContactWay}
          queryOrgContactWay={queryOrgContactWay}
        />
      </div>
    );
  }
}
