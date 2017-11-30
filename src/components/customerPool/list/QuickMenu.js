/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import { event } from '../../../helper';

import styles from './quickMenu.less';

const NO_EMAIL_HREF = 'javascript:void(0);'; // eslint-disable-line

let hrefUrl = '';

export default class QuickMenu extends PureComponent {

  static propTypes = {
    listItem: PropTypes.object.isRequired,
    createModal: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    custEmail: PropTypes.object.isRequired,
    onSendEmail: PropTypes.func.isRequired,
    onAddFollow: PropTypes.func.isRequired,
    currentFollowCustId: PropTypes.string.isRequired,
    isFollows: PropTypes.object.isRequired,
    emailCustId: PropTypes.string.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      addressEmail: {},
      isEmail: false, // 用于判断 isFollows更改
    };
  }

  componentWillReceiveProps(nextProps) {
    const { custEmail } = this.props;
    if (custEmail !== nextProps.custEmail) {
      const change = {
        ...this.state.addressEmail,
        ...{ [nextProps.emailCustId]: this.getEmail(nextProps.custEmail) },
      };
      this.setState({
        addressEmail: change,
      });
    }
  }
  componentDidUpdate() {
    const { emailCustId, listItem } = this.props;
    const { addressEmail, isEmail } = this.state;
    const email = addressEmail[emailCustId];
    // 在此以isEmail判断是否是isFollows更新渲染完成
    if (!_.isEmpty(email) && (emailCustId === listItem.custId) && isEmail) {
      // 模拟 fsp '#workspace-content>.wrapper' 上的鼠标mousedown事件
      event.triggerClick(this.sendEmail, false, false);
    }
  }
  @autobind
  getEmail(address) {
    let addresses = '';
    let finded = 0;// 邮件联系
    let email = null;
    if (!_.isEmpty(address.orgCustomerContactInfoList)) {
      const index = _.findLastIndex(address.orgCustomerContactInfoList,
        val => val.mainFlag);
      finded = _.findLastIndex(address.orgCustomerContactInfoList[index].emailAddresses,
        val => val.mainFlag);
      addresses = address.orgCustomerContactInfoList[index];
    } else if (!_.isEmpty(address.perCustomerContactInfo)) {
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
    hrefUrl = e.target.getAttribute('href');
    if (hrefUrl === NO_EMAIL_HREF) {
      onSendEmail(listItem);
    }
    this.setState({
      isEmail: true,
    });
  }
  @autobind
  handleAddFollow(listItem) {
    const { onAddFollow } = this.props;
    this.setState({
      isEmail: false,
    });
    onAddFollow(listItem);
  }

  @autobind
  handleAddServiceRecordClick(listItem) {
    const { toggleServiceRecordModal, queryCustUuid } = this.props;
    toggleServiceRecordModal({
      custId: listItem.custId,
      custName: listItem.name,
      flag: true,
    });
    // 上传附件之前需要先请求uuid
    queryCustUuid();
  }

  render() {
    const {
      listItem,
      createModal,
      currentFollowCustId,
      isFollows,
    } = this.props;
    // const {
    //   addressEmail,
    // } = this.state;
    const isFollow = (currentFollowCustId === listItem.custId && isFollows[currentFollowCustId])
      || isFollows[listItem.custId];
    return (
      <div className={styles.basicInfoD}>
        <ul className={styles.operationIcon}>
          <li onClick={() => createModal(listItem)}>
            <Icon type="dianhua" />
            <span>电话联系</span>
          </li>
          {/*
          <li onClick={this.handleIsEmail}>
            <Icon type="youjian" />
            <span>
              <a
                ref={ref => this.sendEmail = ref}
                href={
                  _.isEmpty(addressEmail[listItem.custId]) ?
                  NO_EMAIL_HREF :
                  `mailto:${addressEmail[listItem.custId]}
                }
              >
                &nbsp;邮件联系&nbsp;
              </a>
            </span>
          </li>
          */}
          <li
            onClick={() => this.handleAddFollow(listItem)}
            className={isFollow ? styles.follows : ''}
          >
            <Icon type="guanzhu" />
            <span>{isFollow ? '已关注' : '关注'}</span>
          </li>
          <li
            onClick={() => this.handleAddServiceRecordClick(listItem)}
          >
            <Icon type="jilu" />
            <span>添加服务记录</span>
          </li>
        </ul>
      </div>
    );
  }
}
