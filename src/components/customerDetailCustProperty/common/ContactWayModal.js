/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:36:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:43:09
 * @description 机构客户添加联系方式Modal
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Switch } from 'antd';
import _ from 'lodash';

import Table from '../common/InfoTable';
import IFNoData from '../common/IfNoData';
import logable from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import IfWrap from '../../common/biz/IfWrap';
import AddOrgContactWayModal from './AddOrgContactWayModal';
import {
  ORG_PHONE_COLUMNS,
  ORG_ADDRESS_COLUMNS,
} from './config';

import styles from './contactWayModal.less';

export default class ContactWayModal extends PureComponent {
  static propTypes = {
    // 机构客户的联系方式数据
    data: PropTypes.object.isRequired,
    // 关闭弹框
    onClose: PropTypes.func.isRequired,
  }

  static contextTypes = {
    custBasic: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = {
      prevProps: props,
      // 添加联系方式Modal
      addContactModal: false,
    };
    // 判断是否是主服务经理
    this.isMainEmp = _.get(context.custBasic, 'isMainEmp');
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleContactWayClose() {
    this.props.onClose();
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: {
      name: '添加联系方式'
    },
  })
  handleAddContactClick() {
    this.setState({ addContactModal: true  });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑机构客户电话信息'}
  })
  handlePhoneEditClick(record) {
    console.warn('EDIT', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除机构客户电话信息'}
  })
  handlePhoneDelClick(record) {
    console.warn('DEL', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑机构客户地址信息'}
  })
  handleAddressEditClick(record) {
    console.warn('EDIT', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除机构客户地址信息'}
  })
  handleAddressDelClick(record) {
    console.warn('DEL', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleAddContactModalClose() {
    this.setState({ addContactModal: false });
  }

  // 添加联系方式弹框点击确认按钮
  @autobind
  handleAddContactModalOK() {
    this.setState({ addContactModal: false });
  }

  render() {
    const { data } = this.props;
    const { addContactModal } = this.state;
    // 有无电话信息数据
    const hasNoPhoneInfo = _.isEmpty(data.tellphoneInfo);
    // 有无地址信息
    const hasNoAddreesInfo = _.isEmpty(data.addressInfo);

    return (
      <Modal
        visible
        maskClosable={false}
        modalKey="orgContactWayModal"
        size="large"
        title="联系方式"
        needBtn={false}
        closeModal={this.handleContactWayClose}
      >
        <div className={styles.contactWayWrap}>
          <div className={styles.addContactWay}>
            <Button
              type="primary"
              icon="plus"
              onClick={this.handleAddContactClick}
            >
              添加联系方式
            </Button>
          </div>
          <div className={styles.block}>
            <div className={styles.header}>电话信息</div>
            <div className={styles.tableInfo}>
              <IFNoData title="电话信息" isRender={hasNoPhoneInfo}>
                <Table
                  columns={ORG_PHONE_COLUMNS}
                  dataSource={data.tellphoneInfo}
                  isMainEmp={this.isMainEmp}
                  onEditClick={this.handlePhoneEditClick}
                  onDelClick={this.handlePhoneDelClick}
                />
              </IFNoData>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.header}>地址信息</div>
            <div className={styles.tableInfo}>
              <IFNoData title="地址信息" isRender={hasNoAddreesInfo}>
                <Table
                  columns={ORG_ADDRESS_COLUMNS}
                  dataSource={data.addressInfo}
                  isMainEmp={this.isMainEmp}
                  onEditClick={this.handleAddressEditClick}
                  onDelClick={this.handleAddressDelClick}
                />
              </IFNoData>
            </div>
          </div>
        </div>
        <IfWrap isRender={addContactModal}>
          <AddOrgContactWayModal
            onClose={this.handleAddContactModalClose}
            onOK={this.handleAddContactModalOK}
          />
        </IfWrap>
      </Modal>
    );
  }
}

