/*
 * @Author: sunweibin
 * @Date: 2018-11-26 13:58:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 13:56:19
 * @description 联系方式弹框-个人客户联系方式修改
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Switch } from 'antd';
import _ from 'lodash';

import Table from '../common/InfoTable';
import IFNoData from '../common/IfNoData';
import logable from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import IfWrap from '../../common/biz/IfWrap';
import AddContactWayModal from './AddContactModal';
import {
  PHONE_COLUMNS,
  ADDRESS_COLUMNS,
  OTHER_COLUMNS,
} from './config';

import styles from './contactWayModal.less';

export default class ContactWayModal extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭弹窗
    onClose: PropTypes.func.isRequired,
    // 个人客户联系方式数据
    data: PropTypes.object.isRequired,
    // 查询个人客户联系方式数据的接口
    queryPersonalContactWay: PropTypes.func.isRequired,
    // 改变个人客户联系方式中的请勿发短信、请勿打电话
    changePhoneInfo: PropTypes.func.isRequired,
  }

  static contextTypes = {
    custBasic: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data } = nextProps;
    const { prevProps } = prevState;
    if (data !== prevProps) {
      return {
        prevProps: data,
        noMessage: _.get(data, 'noMessage'),
        noCall: _.get(data, 'noCall'),
      };
    }
    return null;
  }

  constructor(props, context) {
    super(props);
    this.state = {
      prevProps: props,
      // 请勿发短信
      noMessage: false,
      // 请勿打电话
      noCall: false,
      // 添加联系方式Modal
      addContactModal: false,
    };
    // 判断是否是主服务经理
    this.isMainEmp = _.get(context.custBasic, 'isMainEmp');
  }

  @autobind
  changeSwitch() {
    const {
      location: {
        query: { custId },
      }
    } = this.props;
    const { noMessage, noCall } = this.state;
    this.props.changePhoneInfo({
      noMessage,
      noCall,
      custId,
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '请勿发短信',
      value: '$args[0]'
    },
  })
  handleNoMessageSwitchChange(noMessage) {
    this.setState({ noMessage }, this.changeSwitch);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '请勿打电话',
      value: '$args[0]'
    },
  })
  handleNocallSwitchChange(noCall) {
    this.setState({ noCall }, this.changeSwitch);
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
    type: 'Click',
    payload: {
      name: '添加联系方式'
    },
  })
  handleAddContactClick() {

  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑个人客户电话信息'}
  })
  handlePhoneEditClick(record) {
    console.warn('EDIT', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除个人客户电话信息'}
  })
  handlePhoneDelClick(record) {
    console.warn('DEL', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑个人客户地址信息'}
  })
  handleAddressEditClick(record) {
    console.warn('EDIT', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除个人客户地址信息'}
  })
  handleAddressDelClick(record) {
    console.warn('DEL', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑个人客户其他信息'}
  })
  handleOtherEditClick(record) {
    console.warn('EDIT', record);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除个人客户其他信息'}
  })
  handleOtherDelClick(record) {
    console.warn('DEL', record);
  }

  render() {
    const { data } = this.props;
    const { noMessage, noCall, addContactModal } = this.state;
    // 有无电话信息数据
    const hasNoPhoneInfo = _.isEmpty(data.tellphoneInfo);
    // 有无地址信息
    const hasNoAddreesInfo = _.isEmpty(data.addressInfo);
    // 有无其他信息
    const hasNoOtherInfo = _.isEmpty(data.otherInfo);

    return (
      <Modal
        visible
        modalKey="personalContactWayModal"
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
            <div className={styles.switchArea}>
              <span className={styles.switchBox}>
                请勿发短信
                <Switch
                  className={styles.switch}
                  checked={noMessage}
                  size="small"
                  onChange={this.handleNoMessageSwitchChange}
                />
              </span>
              <span className={styles.switchBox}>
                请勿打电话
                <Switch
                  className={styles.switch}
                  checked={noCall}
                  size="small"
                  onChange={this.handleNocallSwitchChange}
                />
              </span>
            </div>
            <div className={styles.tableInfo}>
              <IFNoData title="电话信息" isRender={hasNoPhoneInfo}>
                <Table
                  columns={PHONE_COLUMNS}
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
                  columns={ADDRESS_COLUMNS}
                  dataSource={data.addressInfo}
                  isMainEmp={this.isMainEmp}
                  onEditClick={this.handleAddressEditClick}
                  onDelClick={this.handleAddressDelClick}
                />
              </IFNoData>
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.header}>其他信息</div>
            <div className={styles.tableInfo}>
              <IFNoData title="其他信息" isRender={hasNoOtherInfo}>
                <Table
                  columns={OTHER_COLUMNS}
                  dataSource={data.otherInfo}
                  isMainEmp={this.isMainEmp}
                  onEditClick={this.handleOtherEditClick}
                  onDelClick={this.handleOtherDelClick}
                />
              </IFNoData>
            </div>
          </div>
        </div>
        <IfWrap isRender={addContactModal}>
          <AddContactWayModal />
        </IfWrap>
      </Modal>
    );
  }
}
