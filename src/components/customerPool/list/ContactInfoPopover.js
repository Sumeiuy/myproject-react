import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Popover } from 'antd';
import { fspContainer } from '../../../config';
import Icon from '../../common/Icon';

import styles from './contactInfoPopover.less';

export default class ContactInfoPopover extends PureComponent {

  static propTypes = {
    custType: PropTypes.string.isRequired,
    personalContactInfo: PropTypes.object,
    orgCustomerContactInfoList: PropTypes.array,
  };

  static defaultProps = {
    personalContactInfo: {},
    orgCustomerContactInfoList: [],
  };

  constructor(props) {
    super(props);
    console.log('Props: ', props);
  }

  getPopupContainer() {
    return document.querySelector(fspContainer.container) || document.body;
  }

  generatePersonalContacts(telList, name) {
    const hasWorkTels = !_.isEmpty(telList);
    const newList = hasWorkTels ? [{}, ...telList] : [];
    return (
      <ul>
        {
          hasWorkTels &&
          _.map(newList, (item, index) => {
            if (index === 0) {
              return <li className={styles.title} key={name} >{name}</li>;
            }
            return (
              <li key={item.rowId} >
                <span className={styles.content}>{item.contactValue}</span>
                {item.mainFlag && <span className={styles.primary}>主</span>}
              </li>
            );
          })
        }
      </ul>
    );
  }

  generateOrgLinkmanList(linkmanList) {
    const hasWorkTels = !_.isEmpty(linkmanList);
    return (
      <div className={styles.popoverLayer}>
        {
          hasWorkTels &&
          _.map(linkmanList, item => (this.generateOrgLinkmanItems(item)))
        }
      </div>
    );
  }

  generateOrgLinkmanItems({
    name = '',
    custRela = '',
    workTels = [],
    homeTels = [],
    cellPhones = [],
    otherTels = [],
    rowId = '',
  }) {
    return (
      <div key={rowId}>
        {
          this.generateOrgContacts({ name, custRela, telList: workTels, label: '公司电话' })
        }
        {
          this.generateOrgContacts({ name, custRela, telList: homeTels, label: '家庭电话' })
        }
        {
          this.generateOrgContacts({ name, custRela, telList: cellPhones, label: '移动电话' })
        }
        {
          this.generateOrgContacts({ name, custRela, telList: otherTels, label: '其他电话' })
        }
      </div>
    );
  }

  generateOrgContacts({ name, custRela, telList, label }) {
    const hasWorkTels = !_.isEmpty(telList);
    const newList = hasWorkTels ? [{}, ...telList] : [];
    return (
      <ul>
        {
          hasWorkTels &&
          _.map(newList, (item, index) => {
            if (index === 0) {
              return <li className={styles.title} key={`${name}${custRela}`} >{name}({custRela})</li>;
            }
            return (
              <li key={item.rowId} >
                <span className={styles.label}>{label}</span>
                <span className={styles.content}>{item.contactValue}</span>
                {item.mainFlag && <span className={styles.primary}>主</span>}
              </li>
            );
          })
        }
      </ul>
    );
  }

  @autobind
  generateSuspensionContent() {
    const {
      custType,
      personalContactInfo,
      orgCustomerContactInfoList,
    } = this.props;
    if (custType === 'per') {
      return (
        <div className={styles.popoverLayer}>
          {
            this.generatePersonalContacts(personalContactInfo.workTels, '公司电话')
          }
          {
            this.generatePersonalContacts(personalContactInfo.homeTels, '家庭电话')
          }
          {
            this.generatePersonalContacts(personalContactInfo.cellPhones, '移动电话')
          }
          {
            this.generatePersonalContacts(personalContactInfo.otherTels, '其他电话')
          }
        </div>
      );
    }
    if (custType === 'org') {
      return this.generateOrgLinkmanList(orgCustomerContactInfoList);
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
