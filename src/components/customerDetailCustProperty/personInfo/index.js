/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 16:08:26
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import BasicInfo from './BasicInfo';
import ContactWay from './ContactWay';
import IfWrap from '../../common/biz/IfWrap';

export default class PersonInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 用于刷新客户基本信息
    queryCustomerProperty: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
    updateCustBasicInfo: PropTypes.func.isRequired,
  }

  render() {
    const {
      data,
      hasDuty,
      location,
      updateCustBasicInfo,
      queryCustomerProperty,
    } = this.props;
    const {
      phones = [],
      others = [],
      addresses = [],
      noMessage,
      noCall,
    } = data;
    return (
      <div>
        <BasicInfo
          location={location}
          data={data}
          hasDuty={hasDuty}
          updateCustBasicInfo={updateCustBasicInfo}
          queryCustomerProperty={queryCustomerProperty}
        />
        <IfWrap isRender={hasDuty}>
          <ContactWay
            phoneList={phones}
            otherList={others}
            addressList={addresses}
            hasDuty={hasDuty}
            noMessage={noMessage}
            noCall={noCall}
          />
        </IfWrap>
      </div>
    );
  }
}
