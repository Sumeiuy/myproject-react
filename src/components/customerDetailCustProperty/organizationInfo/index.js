/**
 * @Author: XuWenKang
 * @Description: 客户360-客户属性-普通机构属性
 * @Date: 2018-11-07 14:39:15
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-11-07 15:02:48
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from './BasicInfo';
import ContactWay from './ContactWay';
import styles from './organizationInfo.less';

export default class OrganizationInfo extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  render() {
    const { data } = this.props;
    const {
      phones,
      others,
      addresses,
    } = data;
    return (
      <div className={styles.personInfoBox}>
        <BasicInfo data={data} />
        <ContactWay
          phoneList={phones}
          otherList={others}
          addressList={addresses}
        />
      </div>
    );
  }
}
