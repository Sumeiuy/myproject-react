/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-普通机构属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 16:08:00
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import BasicInfo from './BasicInfo';
import ContactWay from '../common/ContactWay';
import IfWrap from '../../common/biz/IfWrap';

export default class OrganizationInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    hasDuty: PropTypes.bool.isRequired,
  }

  render() {
    const { data, hasDuty } = this.props;
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
        <IfWrap isRender={hasDuty}>
          <ContactWay
            phoneList={phones}
            otherList={others}
            addressList={addresses}
            hasDuty={hasDuty}
          />
        </IfWrap>
      </div>
    );
  }
}
