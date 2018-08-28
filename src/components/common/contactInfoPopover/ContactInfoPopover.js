/*
 * @Description: 客户列表联系方式弹窗中更多联系方式的悬浮层内容
 * @Author: WangJunjun
 * @Date: 2018-05-03 14:35:21
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-28 15:22:36
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Popover } from 'antd';
import { fspContainer } from '../../../config';
import ContactGroup from './ContactGroup';
import styles from './contactInfoPopover.less';
import { headMainContact, headMainLinkman } from './config';

// 联系方式分组对应的中文显示名称
const DISPLAY_NAME_TEL = {
  workTels: '公司电话',
  homeTels: '家庭电话',
  cellPhones: '移动电话',
  otherTels: '其他电话',
};

// 个人对应的code码
const PER_CODE = 'per';
// 一般机构对应的code码
const ORG_CODE = 'org';

/**
 * 个人客户：将联系方式列表中的主要电话提至第一个显示
 * {cellphones: [{mainFlag: false}, {mainFlag: true}]}
 * 转成 [ key: 'cellphones', value: [{mainFlag: true}, {mainFlag: false}] ]
 */
// function headMainContact(object) {
//   // 定义两个临时的数组，分别用来存储mainFlag=true和mainFlag=false的元素
//   const list1 = [];
//   const list2 = [];
//   // 遍历传入的对象查找有mainFlag=true的属性，并排序属性值
//   Object.keys(object).forEach((key) => {
//     if (_.findIndex(object[key], { mainFlag: true }) > -1) {
//       const newList = _.sortBy(object[key], item => !item.mainFlag);
//       list1.push({ key, value: newList });
//     } else {
//       list2.push({ key, value: object[key] });
//     }
//   });
//   return list1.concat(list2);
// }

/**
 * 机构客户： 联系人列表中的主联系人提至最上方
 * @param {*} list
 */
// function headMainLinkman(list) {
//   return _.sortBy(list, item => !item.flag);
// }


export default class ContactInfoPopover extends PureComponent {

  static propTypes = {
    custType: PropTypes.string.isRequired,
    personalContactInfo: PropTypes.object,
    orgCustomerContactInfoList: PropTypes.array,
    handlePhoneConnected: PropTypes.func,
    handlePhoneEnd: PropTypes.func,
    disablePhone: PropTypes.bool,
    placement: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.string,
    ]),
    getPopupContainer: PropTypes.func,
  };

  static defaultProps = {
    personalContactInfo: {},
    orgCustomerContactInfoList: [],
    handlePhoneEnd: _.noop,
    handlePhoneConnected: _.noop,
    disablePhone: true,
    placement: 'bottomRight',
    children: '',
    getPopupContainer: () => document.querySelector(fspContainer.container) || document.body,
  };

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
    mainFlag = false,
  }) {
    const groupTitle = `${name}(${custRela})`;
    const newWorkTels = _.map(workTels, item => (
      { ...item, label: DISPLAY_NAME_TEL.workTels }
    ));
    const newHomeTels = _.map(homeTels, item => (
      { ...item, label: DISPLAY_NAME_TEL.homeTels }
    ));
    const newCellPhones = _.map(cellPhones, item => (
      { ...item, label: DISPLAY_NAME_TEL.cellPhones }
    ));
    const newOtherTels = _.map(otherTels, item => (
      { ...item, label: DISPLAY_NAME_TEL.otherTels }
    ));
    const telList = [...newWorkTels, ...newHomeTels, ...newCellPhones, ...newOtherTels];
    const props = {
      groupTitle,
      telList,
      mainFlag,
    };
    return (
      <div key={rowId}>
        <ul key={groupTitle}>
          <ContactGroup
            {...this.props}
            {...props}
          />
        </ul>
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
    if (custType === PER_CODE && !_.isEmpty(personalContactInfo)) {
      const list = headMainContact(personalContactInfo);
      return (
        <div className={styles.popoverLayer}>
          {
            _.map(list, item => (<ContactGroup
              key={DISPLAY_NAME_TEL[item.key]}
              {...this.props}
              groupTitle={DISPLAY_NAME_TEL[item.key]}
              telList={item.value}
            />),
            )
          }
        </div>
      );
    }
    // 机构
    if (custType === ORG_CODE && !_.isEmpty(orgCustomerContactInfoList)) {
      const list = headMainLinkman(orgCustomerContactInfoList);
      return this.generateOrgLinkmanList(list);
    }
    return <div className={styles.popoverLayer} />;
  }

  render() {
    const content = this.generateSuspensionContent();
    const { placement, children, getPopupContainer } = this.props;
    return (
      <Popover
        overlayClassName={styles.popover}
        content={content}
        placement={placement}
        getPopupContainer={getPopupContainer}
      >
        {children}
      </Popover>
    );
  }
}
