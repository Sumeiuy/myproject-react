/*
 * @Author: sunweibin
 * @Date: 2018-11-26 13:58:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-12 21:18:16
 * @description 联系方式弹框-个人客户联系方式修改
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button, Switch, message } from 'antd';
import _ from 'lodash';

import { data as dataHelper } from '../../../helper';
import ToolTip from '../../common/Tooltip';
import confirm from '../../common/confirm_';
import Table from '../common/InfoTable';
import IFNoData from '../common/IfNoData';
import logable from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import IfWrap from '../../common/biz/IfWrap';
import AddContactWayModal from './AddContactModal';
import EditContactWayModal from '../common/EditContactWayModal';
import {
  PHONE_COLUMNS,
  ADDRESS_COLUMNS,
  OTHER_COLUMNS,
} from './config';

import styles from '../common/contactWayModal.less';

export default class ContactWayModal extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 关闭弹窗
    onClose: PropTypes.func.isRequired,
    // 个人客户联系方式数据
    data: PropTypes.object.isRequired,
    // 改变个人客户联系方式中的请勿发短信、请勿打电话
    changePhoneInfo: PropTypes.func.isRequired,
    // 新增|修改个人客户电话信息
    updatePerPhone: PropTypes.func.isRequired,
    // 新增|修改个人客户地址信息
    updatePerAddress: PropTypes.func.isRequired,
    // 新增|修改个人客户其他信息
    updatePerOther: PropTypes.func.isRequired,
    // 删除个人|机构客户的非主要联系方式
    delContact: PropTypes.func.isRequired,
    // 新增|删除|修改后刷新联系方式列表
    refreshContact: PropTypes.func.isRequired,
    // 是否修改
    saveUpdatedStatus: PropTypes.func.isRequired,
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
      // 编辑联系方式的Modal
      editContactModal: false,
      // 编辑的数据
      editData: {},
      // 编辑何种信息电话信息为phone,地址信息为address,其他信息为other
      contactType: 'phone',
    };
    // 判断是否是主服务经理
    this.isMainEmp = _.get(context.custBasic, 'isMainEmp');
  }

  // 刷新数据
  @autobind
  refresh(resultData) {
    if (resultData.result === 'success') {
      this.props.refreshContact();
      // 告知父组件进行过修改了
      this.props.saveUpdatedStatus();
    } else if (resultData.result === 'fail') {
      message.error('删除联系方式失败！');
    }
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
    // 告知父组件进行过修改了
    this.props.saveUpdatedStatus();
  }

  // 修改请勿发短信
  @autobind
  changeNoMessage() {
    this.changeSwitch();
  }

  // 修改请勿打电话
  @autobind
  changeNoCall() {
    this.changeSwitch();
  }

  // 删除前的确认框
  @autobind
  confirmBeforeDel(query) {
    confirm({
      content: '确定要删除该条联系方式吗？',
      onOk: () => this.delPerContact(query),
    });
  }

  // 删除个人客户的联系方式
  @autobind
  delPerContact(query) {
    const {
      location: {
        query: { custId },
      },
    } = this.props;
    this.props.delContact({
      custId,
      custNature: 'per',
      ...query,
    }).then(this.refresh);
  }

  // 修改个人地址Columns
  @autobind
  updatePerAddressColumns(columns) {
    return _.map(columns, (column) => {
      const { dataIndex } = column;
      if (dataIndex === 'address') {
        // 修改个人地址信息
        return this.updateWordColumn(column, 16);
      }
      if (dataIndex === 'city' || dataIndex === 'province') {
        return this.updateWordColumn(column, 6);
      }
      return column;
    });
  }

  // 修改个人地址信息Column
  @autobind
  updateWordColumn(column, length) {
    return {
      ...column,
      render(text) {
        if (!_.isEmpty(text)) {
          const { isSubstr, value, origin } = dataHelper.dotdotdot(text || '', length);
          if (isSubstr) {
            return (
              <ToolTip title={origin}>
                <div className={styles.textEllipse}>{value}</div>
              </ToolTip>
            );
          }
          return (<div className={styles.textEllipse}>{origin}</div>);
        }
        return '';
      },
    };
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
    this.setState({ noMessage }, this.changeNoMessage);
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
    this.setState({ noCall }, this.changeNoCall);
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
    this.setState({ addContactModal: true });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑个人客户电话信息' }
  })
  handlePhoneEditClick(record) {
    this.setState({
      editContactModal: true,
      editData: record,
      contactType: 'phone',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除个人客户电话信息' }
  })
  handlePhoneDelClick(record) {
    this.confirmBeforeDel({
      id: record.id,
      number: record.phoneNumber,
      contactWayCode: record.contactWayCode,
      contactType: 'phone',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑个人客户地址信息' }
  })
  handleAddressEditClick(record) {
    this.setState({
      editContactModal: true,
      editData: record,
      contactType: 'address',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除个人客户地址信息' }
  })
  handleAddressDelClick(record) {
    this.confirmBeforeDel({
      id: record.id,
      contactType: 'address',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑个人客户其他信息' }
  })
  handleOtherEditClick(record) {
    this.setState({
      editContactModal: true,
      editData: record,
      contactType: 'other',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '删除个人客户其他信息' }
  })
  handleOtherDelClick(record) {
    this.confirmBeforeDel({
      id: record.id,
      number: record.contactText,
      contactWayCode: record.contactWayCode,
      contactType: 'other',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleAddContactModalClose() {
    this.setState({ addContactModal: false });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleEditContactModalClose() {
    this.setState({ editContactModal: false });
  }

  // 编辑联系方式弹框、新增联系方式弹框点击确认
  @autobind
  handleAddOrEditMoalOK(type, data) {
    if (type === 'phone') {
      // 新增|修改电话信息
      this.props.updatePerPhone(data).then(this.refresh);
    } else if (type === 'address') {
      // 新增|修改地址信息
      this.props.updatePerAddress(data).then(this.refresh);
    } else if (type === 'other') {
      // 新增|修改其他信息
      this.props.updatePerOther(data).then(this.refresh);
    }
    this.setState({
      addContactModal: false,
      editContactModal: false,
    });
  }

  render() {
    const {
      data,
      location,
    } = this.props;
    const {
      noMessage,
      noCall,
      addContactModal,
      editContactModal,
      editData,
      contactType,
    } = this.state;
    const { custBasic: { isMainEmp } } = this.context;
    // 有无电话信息数据
    const hasNoPhoneInfo = _.isEmpty(data.tellphoneInfo);
    // 有无地址信息
    const hasNoAddreesInfo = _.isEmpty(data.addressInfo);
    // 有无其他信息
    const hasNoOtherInfo = _.isEmpty(data.otherInfo);
    // 修改个人客户地址的Column
    const perAddressColumns = this.updatePerAddressColumns(ADDRESS_COLUMNS);

    return (
      <Modal
        visible
        maskClosable={false}
        modalKey="personalContactWayModal"
        size="large"
        title="联系方式"
        needBtn={false}
        closeModal={this.handleContactWayClose}
      >
        <div className={styles.contactWayWrap}>
          <IfWrap isRender={isMainEmp}>
            <div className={styles.addContactWay}>
              <Button
                type="primary"
                icon="plus"
                onClick={this.handleAddContactClick}
              >
                添加联系方式
              </Button>
            </div>
          </IfWrap>
          <div className={styles.block}>
            <div className={styles.header}>电话信息</div>
            <div className={styles.switchArea}>
              <span className={styles.switchBox}>
                请勿发短信
                <Switch
                  disabled={!isMainEmp}
                  className={styles.switch}
                  checked={noMessage}
                  size="small"
                  onChange={this.handleNoMessageSwitchChange}
                />
              </span>
              <span className={styles.switchBox}>
                请勿打电话
                <Switch
                  disabled={!isMainEmp}
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
                  className={styles.perAddressTable}
                  columns={perAddressColumns}
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
          <AddContactWayModal
            location={location}
            contactWayData={data}
            onClose={this.handleAddContactModalClose}
            onOK={this.handleAddOrEditMoalOK}
          />
        </IfWrap>
        <IfWrap isRender={editContactModal}>
          <EditContactWayModal
            location={location}
            custNature="per"
            data={editData}
            contactType={contactType}
            onClose={this.handleEditContactModalClose}
            onOK={this.handleAddOrEditMoalOK}
          />
        </IfWrap>
      </Modal>
    );
  }
}
