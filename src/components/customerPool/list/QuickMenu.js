/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';

import styles from './quickMenu.less';

const NO_EMAIL_HREF = 'javascript:void(0);'; // eslint-disable-line

let hrefUrl = '';
let isClickEmail = false;

export default class QuickMenu extends PureComponent {

  static propTypes = {
    isSms: PropTypes.bool.isRequired,
    listItem: PropTypes.object.isRequired,
    createModal: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    custContactData: PropTypes.object.isRequired,
    onSendEmail: PropTypes.func.isRequired,
    onAddFollow: PropTypes.func.isRequired,
    currentFollowCustId: PropTypes.string.isRequired,
    isFollows: PropTypes.object.isRequired,
    currentCustId: PropTypes.string.isRequired,
    isEmptyEmail: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      addressEmail: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { custContactData } = this.props;
    // _.isEqual
    if (custContactData !== nextProps.custContactData && _.size(nextProps.custContactData) > 0) {
      const change = {
        ...this.state.addressEmail,
        ...{ [nextProps.currentCustId]: this.getEmail(nextProps.custContactData) },
      };
      this.setState({
        addressEmail: change,
      });
    }
    if (nextProps.isEmptyEmail) {
      isClickEmail = false;
    }
  }
  componentDidUpdate() {
    const { currentCustId, listItem } = this.props;
    const { addressEmail } = this.state;
    const email = addressEmail[currentCustId];
    if (!_.isEmpty(email) &&
        currentCustId === listItem.custId && isClickEmail) {
      const evt = new MouseEvent('click', { bubbles: false, cancelable: false, view: window });
      this.sendEmail.dispatchEvent(evt);
      isClickEmail = false;
    }
  }
  @autobind
  getEmail(address) {
    let addresses = '';
    let finded = 0;// 邮件联系
    let email = null;
    if (!_.isEmpty(address.orgCustomerContactInfoList)
        && _.size(address.orgCustomerContactInfoList) > 0) {
      const index = _.findLastIndex(address.orgCustomerContactInfoList,
          val => val.mainFlag);
      finded = _.findLastIndex(address.orgCustomerContactInfoList[index].emailAddresses,
          val => val.mainFlag);
      addresses = address.orgCustomerContactInfoList[index];
    } else if (!_.isEmpty(address.perCustomerContactInfo)
        && _.size(address.perCustomerContactInfo) > 0) {
      finded = _.findLastIndex(address.perCustomerContactInfo.emailAddresses,
          val => val.mainFlag);
      addresses = address.perCustomerContactInfo;
    } else {
      finded = -1;
    }
    if (finded === -1) {
      email = null;
    } else {
      email = addresses.emailAddresses[finded].contactValue;
    }
    return email;
  }
  @autobind
  handleIsEmail(e) {
    const { listItem, onSendEmail } = this.props;
    isClickEmail = true;
    hrefUrl = e.target.getAttribute('href');
    if (hrefUrl === NO_EMAIL_HREF) {
      onSendEmail(listItem);
    }
  }

  render() {
    const {
      isSms,
      listItem,
      createModal,
      toggleServiceRecordModal,
      onAddFollow,
      currentFollowCustId,
      isFollows,
    } = this.props;
    const {
      addressEmail,
    } = this.state;
    if (!isSms) {
      return null;
    }
    const isFollow = (currentFollowCustId === listItem.custId && isFollows[currentFollowCustId])
      || isFollows[listItem.custId];
    return (
      <div className={`${styles.basicInfoD} showQuickMenu`}>
        <ul className={styles.operationIcon}>
          <li onClick={() => createModal(listItem)}>
            <Icon type="dianhua" />
            <span>电话联系</span>
          </li>
          <li onClick={this.handleIsEmail}>
            <Icon type="youjian" />
            <span>{addressEmail[listItem.custId]}<a ref={ref => this.sendEmail = ref} href={_.isEmpty(addressEmail[listItem.custId]) ? NO_EMAIL_HREF : `mailto:${addressEmail[listItem.custId]}`}> 邮件联系 </a></span>
          </li>
          <li
            onClick={() => toggleServiceRecordModal({ custId: listItem.custId, flag: true })}
          >
            <Icon type="jilu" />
            <span>添加服务记录</span>
          </li>
          <li
            onClick={() => onAddFollow(listItem)}
            className={isFollow ? styles.follows : ''}
          >
            <Icon type="guanzhu" />
            <span>{isFollow ? '已关注' : '关注'}</span>
          </li>
        </ul>
      </div>
    );
  }
}
