/*
 * 生成悬浮层的联系方式组
 * @Author: WangJunjun
 * @Date: 2018-05-10 21:34:00
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-02 13:13:36
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Phone from '../phone';

import styles from './contactInfoPopover.less';

// 个人对应的code码
const PER_CODE = 'per';

function ContactGroup({
  groupTitle = '',
  telList = [],
  mainFlag = false,
  disablePhone,
  custType,
  handlePhoneConnected,
  handlePhoneEnd,
  name,
  userData,
}) {
  if (_.isEmpty(telList)) {
    return null;
  }
  const newList = [{}, ...telList];
  return (
    <ul key={groupTitle}>
      {
        _.map(newList, (item, index) => {
          if (index === 0) {
            return (<li className={styles.title} key={groupTitle} >
              {groupTitle}
              {mainFlag && <span className={styles.primary}>主</span>}
            </li>);
          }
          return (
            <li key={item.rowId} >
              {item.label && <span className={styles.label}>{item.label}</span>}
              <span className={styles.content}>
                <Phone
                  onConnected={handlePhoneConnected}
                  onEnd={handlePhoneEnd}
                  number={item.contactValue}
                  custType={custType}
                  disable={disablePhone}
                  name={name}
                  userData={userData}
                />
              </span>
              {
                custType === PER_CODE &&
                item.mainFlag &&
                <span className={styles.primary}>主</span>
              }
            </li>
          );
        })
      }
    </ul>
  );
}

ContactGroup.propTypes = {
  // 组名称
  groupTitle: PropTypes.string,
  // 组内的联系方式列表
  telList: PropTypes.array,
  // 组织机构时，主联系人标志，true表示是主联系人
  mainFlag: PropTypes.bool,
  // 客户类型
  custType: PropTypes.string.isRequired,
  handlePhoneConnected: PropTypes.func,
  handlePhoneEnd: PropTypes.func,
  disablePhone: PropTypes.bool,
  name: PropTypes.string,
  userData: PropTypes.object,
};

ContactGroup.defaultProps = {
  groupTitle: '',
  telList: [],
  mainFlag: false,
  handlePhoneEnd: _.noop,
  handlePhoneConnected: _.noop,
  disablePhone: true,
  name: '',
  userData: {},
};

export default ContactGroup;

export const {
  propTypes,
  defaultProps,
} = ContactGroup;
