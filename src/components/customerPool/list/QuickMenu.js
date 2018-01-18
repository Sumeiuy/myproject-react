/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../common/Icon';
import { event } from '../../../helper';
import Clickable from '../../../components/common/Clickable';

import styles from './quickMenu.less';

export default class QuickMenu extends PureComponent {

  static propTypes = {
    listItem: PropTypes.object.isRequired,
    createModal: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    custEmail: PropTypes.object.isRequired,
    onSendEmail: PropTypes.func.isRequired,
    emailCustId: PropTypes.string.isRequired,
    queryCustUuid: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    entertype: PropTypes.string.isRequired,
    goGroupOrTask: PropTypes.func.isRequired,
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
  // @autobind
  // handleIsEmail(e) {
  //   const { listItem, onSendEmail } = this.props;
  //   hrefUrl = e.target.getAttribute('href');
  //   if (hrefUrl === NO_EMAIL_HREF) {
  //     onSendEmail(listItem);
  //   }
  //   this.setState({
  //     isEmail: true,
  //   });
  // }

  @autobind
  handleAddServiceRecordClick(listItem) {
    const { toggleServiceRecordModal } = this.props;
    toggleServiceRecordModal({
      custId: listItem.custId,
      custName: listItem.name,
      flag: true,
    });
  }

  @autobind
  addToGroup({ custId, name }) {
    const {
      condition,
      location: {
        pathname,
        search,
        query: {
          source,
        },
      },
      entertype,
      goGroupOrTask,
    } = this.props;
    const fr = encodeURIComponent(`${pathname}${search}`);
    const condt = encodeURIComponent(JSON.stringify(condition));
    const obj = {
      ids: custId,
      count: 1,
      entertype,
      source,
      name,
      condition: condt,
      fr,
    };
    const url = '/customerPool/customerGroup';
    goGroupOrTask({
      id: 'RCT_FSP_CUSTOMER_LIST',
      title: '新建分组',
      url,
      obj,
      shouldStay: true,
      addPanes: [{
        id: 'FSP_CUSTOMER_LIST',
        name: '新建分组',
      }],
    });
  }

  render() {
    const {
      listItem,
      createModal,
    } = this.props;

    return (
      <div className={styles.basicInfoD}>
        <ul className={styles.operationIcon}>
          <Clickable
            onClick={() => createModal(listItem)}
            eventName="/click/quickMenu/telcontact"
          >
            <li>
              <Icon type="dianhua" />
              <span>电话联系</span>
            </li>
          </Clickable>
          <Clickable
            onClick={() => this.addToGroup(listItem)}
            eventName="/click/quickMenu/addToGroup"
          >
            <li>
              <Icon type="fenzu" />
              <span>添加到分组</span>
            </li>
          </Clickable>
          <Clickable
            onClick={() => this.handleAddServiceRecordClick(listItem)}
            eventName="/click/quickMenu/addRecord"
          >
            <li>
              <Icon type="jilu" />
              <span>添加服务记录</span>
            </li>
          </Clickable>
        </ul>
      </div>
    );
  }
}
