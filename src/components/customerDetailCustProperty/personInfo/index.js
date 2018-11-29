/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 16:15:21
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
    // 个人客户联系方式数据
    personalContactWay: PropTypes.object.isRequired,
    // 查询个人客户联系方式数据
    queryPersonalContactWay: PropTypes.func.isRequired,
    // 改变个人客户联系方式中的请勿发短信、请勿打电话
    changePhoneInfo: PropTypes.func.isRequired,
  }

  render() {
    const {
      data,
      hasDuty,
      location,
      updateCustBasicInfo,
      queryCustomerProperty,
      personalContactWay,
      queryPersonalContactWay,
      changePhoneInfo,
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
            location={location}
            phoneList={phones}
            otherList={others}
            addressList={addresses}
            hasDuty={hasDuty}
            noMessage={noMessage}
            noCall={noCall}
            personalContactWay={personalContactWay}
            queryPersonalContactWay={queryPersonalContactWay}
            changePhoneInfo={changePhoneInfo}
          />
        </IfWrap>
      </div>
    );
  }
}
