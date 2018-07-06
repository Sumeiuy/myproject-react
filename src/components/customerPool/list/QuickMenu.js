/**
 * @file components/customerPool/list/QuickMenu.js
 *  客户列表项中的快捷菜单
 * @author wangjunjun
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Icon from '../../common/Icon';
import logable from '../../../decorators/logable';

import styles from './quickMenu.less';

export default class QuickMenu extends PureComponent {

  static propTypes = {
    listItem: PropTypes.object.isRequired,
    createModal: PropTypes.func.isRequired,
    toggleServiceRecordModal: PropTypes.func.isRequired,
    condition: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    entertype: PropTypes.string.isRequired,
    goGroupOrTask: PropTypes.func.isRequired,
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '添加服务记录' } })
  handleAddServiceRecordClick(listItem) {
    const { toggleServiceRecordModal } = this.props;
    toggleServiceRecordModal({
      id: listItem.custId,
      name: listItem.name,
      flag: true,
    });
  }

  @autobind
  @logable({ type: 'Click', payload: { name: '添加到分组' } })
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
      editPane: {
        name: '新建分组',
      },
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '电话联系',
      value: '$args[0]',
    },
  })
  handleTelephoneClick(listItem) {
    this.props.createModal(listItem);
  }

  render() {
    const {
      listItem,
    } = this.props;

    return (
      <div className={styles.basicInfoD}>
        <ul className={styles.operationIcon}>
          <li onClick={() => this.handleTelephoneClick(listItem)}>
            <Icon type="dianhua" />
            <span>联系客户</span>
          </li>
          <li onClick={() => this.addToGroup(listItem)}>
            <Icon type="fenzu" />
            <span>加到分组</span>
          </li>
          <li onClick={() => this.handleAddServiceRecordClick(listItem)}>
            <Icon type="jilu" />
            <span>服务记录</span>
          </li>
          <li>
            <Icon type="jilu" />
            <span>客户标签</span>
          </li>
        </ul>
      </div>
    );
  }
}
