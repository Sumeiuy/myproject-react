/*
 * @Description: 客户列表联系方式弹窗中更多联系方式的悬浮层内容
 * @Author: WangJunjun
 * @Date: 2018-05-03 14:35:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-03 14:40:11
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Popover } from 'antd';
import { fspContainer } from '../../../config';
import Icon from '../../common/Icon';
import Phone from '../../common/phone';

import styles from './contactInfoPopover.less';

// 联系方式分组对应的中文显示名称
const DISPLAY_NAME_TEL = {
  workTels: '公司电话',
  homeTels: '家庭电话',
  cellPhones: '移动电话',
  otherTels: '其他电话',
};

/**
 * 个人客户：将联系方式列表中的主要电话提至第一个显示
 * {cellphones: [{mainFlag: false}, {mainFlag: true}]}
 * 转成 [ key: 'cellphones', value: [{mainFlag: true}, {mainFlag: false}] ]
 */
function headMainContact(list) {
  const newList = [];
  Object.keys(list).forEach((item) => {
    const mainContact = _.filter(list[item], object => object.mainFlag);
    const notMainContact = _.filter(list[item], object => !object.mainFlag);
    if (_.isEmpty(mainContact)) {
      newList.push({ key: item, value: notMainContact });
    } else {
      newList.unshift({ key: item, value: [...mainContact, ...notMainContact] });
    }
  });
  return newList;
}

/**
 * 机构客户： 主联系人提至第一个
 * @param {*} list
 */
function headMainLinkman(list) {
  const mainLinkman = _.filter(list, object => object.mainFlag);
  const notMainLinkman = _.filter(list, object => !object.mainFlag);
  return [...mainLinkman, ...notMainLinkman];
}


export default class ContactInfoPopover extends PureComponent {

  static propTypes = {
    custType: PropTypes.string.isRequired,
    personalContactInfo: PropTypes.object,
    orgCustomerContactInfoList: PropTypes.array,
    onClick: PropTypes.func,
    handlePhoneConnected: PropTypes.func,
    handlePhoneEnd: PropTypes.func,
    disablePhone: PropTypes.bool,
  };

  static defaultProps = {
    personalContactInfo: {},
    orgCustomerContactInfoList: [],
    onClick: _.noop,
    handlePhoneEnd: _.noop,
    handlePhoneConnected: _.noop,
    disablePhone: true,
  };

  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  /**
   * 生成悬浮层的联系方式组
   * @param {*} groupTitle   组名称
   * @param {*} telList   组内的联系方式列表
   * @param {*} label   组内的联系方式对应的标签
   */
  @autobind
  generateContactsGroup({ groupTitle, telList, label = '' }) {
    if (_.isEmpty(telList)) {
      return null;
    }
    const { onClick, disablePhone, custType, handlePhoneConnected, handlePhoneEnd } = this.props;
    const newList = [{}, ...telList];
    return (
      <ul key={groupTitle}>
        {
          _.map(newList, (item, index) => {
            if (index === 0) {
              return <li className={styles.title} key={groupTitle} >{groupTitle}</li>;
            }
            return (
              <li key={item.rowId} >
                {label && <span className={styles.label}>{label}</span>}
                <span className={styles.content} onClick={onClick}>
                  <Phone
                    onConnected={handlePhoneConnected}
                    onEnd={handlePhoneEnd}
                    number={item.contactValue}
                    custType={custType}
                    disable={disablePhone}
                  />
                </span>
                {item.mainFlag && <span className={styles.primary}>主</span>}
              </li>
            );
          })
        }
      </ul>
    );
  }

  /**
   * 根据不同的联系人生成以联系人为组的联系号码列表
   * @param {*} linkmanList
   */
  generateOrgLinkmanList(linkmanList) {
    if (_.isEmpty(linkmanList)) {
      return null;
    }
    return (
      <div className={styles.popoverLayer}>
        {
          _.map(linkmanList, item => (this.generateOrgLinkmanItems(item)))
        }
      </div>
    );
  }

  /**
   * 根据联系人的信息生成联系人的联系号码
   * @param {*} name 联系人名称
   * @param {*} custRela 联系人职务
   * @param {*} workTels 联系人的公司电话
   * @param {*} homeTels 联系人的家庭电话
   * @param {*} cellPhones 联系人的移动电话
   * @param {*} otherTels 联系人的其他联系电话
   * @param {*} rowId 联系人rowId
   */
  generateOrgLinkmanItems({
    name = '',
    custRela = '',
    workTels = [],
    homeTels = [],
    cellPhones = [],
    otherTels = [],
    rowId = '',
  }) {
    const groupTitle = `${name}(${custRela})`;
    return (
      <div key={rowId}>
        {
          this.generateContactsGroup({
            groupTitle,
            telList: workTels,
            label: DISPLAY_NAME_TEL.workTels,
          })
        }
        {
          this.generateContactsGroup({
            groupTitle,
            telList: homeTels,
            label: DISPLAY_NAME_TEL.homeTels,
          })
        }
        {
          this.generateContactsGroup({
            groupTitle,
            telList: cellPhones,
            label: DISPLAY_NAME_TEL.cellPhones,
          })
        }
        {
          this.generateContactsGroup({
            groupTitle,
            telList: otherTels,
            label: DISPLAY_NAME_TEL.otherTels,
          })
        }
      </div>
    );
  }

  /**
   * 生成悬浮框中的电话列表
   */
  @autobind
  generateSuspensionContent() {
    const {
      custType,
      personalContactInfo = {},
      orgCustomerContactInfoList,
    } = this.props;
    // 个人
    if (custType === 'per') {
      const list = headMainContact(personalContactInfo);
      return (
        <div className={styles.popoverLayer}>
          {
            _.map(list, item =>
              this.generateContactsGroup({
                groupTitle: DISPLAY_NAME_TEL[item.key],
                telList: item.value,
              }),
            )
          }
        </div>
      );
    }
    // 机构
    if (custType === 'org') {
      const list = headMainLinkman(orgCustomerContactInfoList);
      return this.generateOrgLinkmanList(list);
    }
    return <div className={styles.popoverLayer} />;
  }

  render() {
    const content = this.generateSuspensionContent();
    return (
      <Popover
        overlayClassName={styles.popover}
        content={content}
        placement="bottomRight"
        getPopupContainer={this.getPopupContainer}
      >
        <div className={styles.moreLinkman}>
          <Icon type="lianxifangshi" className={styles.phoneIcon} />
          <span className={styles.phoneText}>更多联系人</span>
        </div>
      </Popover>
    );
  }
}
