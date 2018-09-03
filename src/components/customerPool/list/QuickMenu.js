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
    goGroupOrTask: PropTypes.func.isRequired,
    queryCustSignLabel: PropTypes.func.isRequired,
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
      listItem: { custId },
      queryCustSignLabel,
    } = this.props;

    return (
      <div className={styles.basicInfoD}>
        <ul className={styles.operationIcon}>
          <li onClick={() => this.handleTelephoneClick(listItem)}>
            <Icon type="lianxikehu" />
            <span>联系客户</span>
          </li>
          <li onClick={() => this.handleAddServiceRecordClick(listItem)}>
            <Icon type="fuwujilu" />
            <span>服务记录</span>
          </li>
          <li>
            <div onClick={() => { queryCustSignLabel(custId); }}>
              <Icon type="kehubiaoqian" />
              <span>设置标签</span>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
