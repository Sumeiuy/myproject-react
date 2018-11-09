/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-个人属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-08 20:18:53
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from './BasicInfo';
import ContactWay from './ContactWay';

export default class PersonInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
  }

  render() {
    const { data, hasDuty } = this.props;
    const {
      phones,
      others,
      addresses,
      noMessage,
      noCall,
    } = data;
    return (
      <div>
        <BasicInfo
          data={data}
          hasDuty={hasDuty}
        />
        <ContactWay
          phoneList={phones}
          otherList={others}
          addressList={addresses}
          hasDuty={hasDuty}
          noMessage={noMessage}
          noCall={noCall}
        />
      </div>
    );
  }
}
