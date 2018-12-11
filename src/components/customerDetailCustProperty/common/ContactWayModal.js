/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:36:22
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-11 11:36:46
 * @description 机构客户添加联系方式Modal
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import _ from 'lodash';

import confirm from '../../common/confirm_';
import Table from './InfoTable';
import IFNoData from './IfNoData';
import logable from '../../../decorators/logable';
import Modal from '../../common/biz/CommonModal';
import IfWrap from '../../common/biz/IfWrap';
import AddOrgContactWayModal from './AddOrgContactWayModal';
import EditContactWayModal from './EditContactWayModal';
import {
  ORG_PHONE_COLUMNS,
  ORG_ADDRESS_COLUMNS,
} from './config';

import styles from './contactWayModal.less';

export default class ContactWayModal extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 机构客户的联系方式数据
    data: PropTypes.object.isRequired,
    // 关闭弹框
    onClose: PropTypes.func.isRequired,
    // 删除个人|机构客户的非主要联系方式
    delContact: PropTypes.func.isRequired,
    // 新增|修改机构客户电话信息
    updateOrgPhone: PropTypes.func.isRequired,
    // 新增|修改机构客户地址信息
    updateOrgAddress: PropTypes.func.isRequired,
    // 刷新联系方式
    refreshContact: PropTypes.func.isRequired,
    // 是否进行了修改
    saveUpdateState: PropTypes.func.isRequired,
  }

  static contextTypes = {
    custBasic: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props);
    this.state = {
      // eslint-disable-next-line
      prevProps: props,
      // 添加联系方式Modal
      addContactModal: false,
      // 编辑联系方式Modal
      editContactModal: false,
      // 编辑何种信息电话信息为phone,地址信息为address
      contactType: 'phone',
    };
    // 判断是否是主服务经理
    this.isMainEmp = _.get(context.custBasic, 'isMainEmp');
  }

  // 修改机构客户的电话信息的Columns
  @autobind
  getOrgPhoneColumns(columns) {
    return _.map(columns, (column) => {
      // 机构客户的手机信息、固定电话、电子邮件传递过来的数据是一个对象，我们展示他的value
      const { dataIndex } = column;
      if (
        dataIndex === 'mobile'
        || dataIndex === 'landline'
        || dataIndex === 'email'
      ) {
        return {
          ...column,
          render(text) {
            if (!_.isEmpty(text) && _.hasIn(text, 'value')) {
              return text.value || '';
            }
            return '';
          },
        };
      }
      return column;
    });
  }

  // 刷新数据
  @autobind
  refresh(resultData) {
    if (resultData.result === 'success') {
      // 告诉父组件进行了修改
      this.props.saveUpdateState();
      this.props.refreshContact();
      this.setState({
        addContactModal: false,
        editContactModal: false,
      });
    }
  }

  @autobind
  delOrgContact(query) {
    const {
      location: {
        query: { custId },
      },
    } = this.props;
    this.props.delContact({
      custNature: 'org',
      custId,
      ...query,
    }).then(this.refresh);
  }

  // 删除联系方式的时候需要先弹框确认
  @autobind
  confirmBeforeDel(query) {
    confirm({
      content: '确定要删除该条联系方式吗？',
      onOk: () => this.delOrgContact(query),
    });
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
    payload: { name: '编辑机构客户电话信息' }
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
    payload: { name: '删除机构客户电话信息' }
  })
  handlePhoneDelClick(record) {
    this.confirmBeforeDel({
      id: record.id,
      contactType: 'phone',
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑机构客户地址信息' }
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
    payload: { name: '删除机构客户地址信息' }
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
    payload: { name: '关闭' }
  })
  handleAddContactModalClose() {
    this.setState({ addContactModal: false });
  }

  // 添加|编辑联系方式弹框点击确认按钮
  @autobind
  handleAddOrEditModalOK(type, data) {
    if (type === 'phone') {
      // 新增|修改机构客户电话信息
      this.props.updateOrgPhone(data).then(this.refresh);
    } else if (type === 'address') {
      // 新增|修改机构客户地址信息
      this.props.updateOrgAddress(data).then(this.refresh);
    }
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleEditContactModalClose() {
    this.setState({ editContactModal: false });
  }

  render() {
    const { data, location } = this.props;
    const {
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
    const orgPhoneColumns = this.getOrgPhoneColumns(ORG_PHONE_COLUMNS);

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
            <div className={styles.tableInfo}>
              <IFNoData title="电话信息" isRender={hasNoPhoneInfo}>
                <Table
                  columns={orgPhoneColumns}
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
            location={location}
            contactWayData={data}
            onClose={this.handleAddContactModalClose}
            onOK={this.handleAddOrEditModalOK}
          />
        </IfWrap>
        <IfWrap isRender={editContactModal}>
          <EditContactWayModal
            location={location}
            custNature="org"
            data={editData}
            contactType={contactType}
            onClose={this.handleEditContactModalClose}
            onOK={this.handleAddOrEditModalOK}
          />
        </IfWrap>
      </Modal>
    );
  }
}
