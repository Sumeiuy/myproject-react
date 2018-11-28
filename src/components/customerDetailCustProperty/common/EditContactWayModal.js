/*
 * @Author: sunweibin
 * @Date: 2018-11-28 10:55:01
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 19:30:04
 * @description 客户属性中个人客户|机构客户的电话信息、地址信息、其他信息的编辑弹框
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Button } from 'antd';
import _ from 'lodash';

import Modal from '../../common/biz/CommonModal';
import logable from '../../../decorators/logable';
import PerPhoneContactForm from '../personInfo/PerPhoneContactForm';
import PerAddressContactForm from '../personInfo/PerAddressContactForm';
import PerOtherContactForm from '../personInfo/PerOtherContactForm';
import OrgPhoneContactForm from './OrgPhoneContactForm';
import OrgAddressContactForm from './OrgAddressContactForm';
import {
  MODAL_STYLE,
  MODAL_TITLES,
} from './config';
import styles from './contactWayModal.less';

export default class EditContactWayModal extends PureComponent {
  static propTypes = {
    // 客户类型
    custNature: PropTypes.oneOf(['per', 'org']).isRequired,
    // 编辑何种信息
    contactType: PropTypes.oneOf(['phone', 'address', 'other']),
    // 信息数据
    data: PropTypes.object,
    // 关闭回调
    onClose: PropTypes.func.isRequired,
    // 确认回调
    onOK: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: {},
    contactType: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      // 修改之后的数据
      formData: {},
    };
  }

  // 获取编辑Modal的title
  @autobind
  getModalTitle() {
    const { contactType } = this.props;
    return MODAL_TITLES[contactType] || '';
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '关闭' }
  })
  handleEditModalClose() {
    this.props.onClose();
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '取消' }
  })
  handleCloseModal() {
    this.props.onClose();
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '确认' }
  })
  handleModalOK() {
    this.props.onOK();
  }

  @autobind
  handleFormChange(formData) {
    this.setState({ formData });
  }

  // 个人客户的电话信息
  @autobind
  renderPerPhoneForm() {
    const { data } = this.props;
    return (
      <PerPhoneContactForm
        action="UPDATE"
        data={data}
        onChange={this.handleFormChange}
      />
    );
  }

  // 个人客户的地址信息
  @autobind
  renderPerAddressForm() {
    const { data } = this.props;
    return (
      <PerAddressContactForm
        action="UPDATE"
        data={data}
        onChange={this.handleFormChange}
      />
    );
  }

  // 个人客户的其他信息
  @autobind
  renderPerOtherForm() {
    const { data } = this.props;
    return (
      <PerOtherContactForm
        action="UPDATE"
        data={data}
        onChange={this.handleFormChange}
      />
    );
  }

  // 机构客户的电话信息
  @autobind
  renderOrgPhoneForm() {
    const { data } = this.props;
    return (
      <OrgPhoneContactForm
        action="UPDATE"
        data={data}
        onChange={this.handleFormChange}
      />
    );
  }

  // 机构客户的电话信息
  @autobind
  renderOrgAddressForm() {
    const { data } = this.props;
    return (
      <OrgAddressContactForm
        action="UPDATE"
        data={data}
        onChange={this.handleFormChange}
      />
    );
  }

  // 根据不同客户类型、表单类型渲染不同的Form组件
  @autobind
  renderEditForm() {
    const { custNature, contactType } = this.props;
    // 将客户类型，表单类型拼接起来，方便进行比对
    const formType = `${custNature}_${contactType}`;
    if (formType === 'per_phone') {
      // 编辑修改个人客户的电话信息
      return this.renderPerPhoneForm();
    } else if (formType === 'per_address') {
      // 编辑修改个人客户的地址信息
      return this.renderPerAddressForm();
    } else if (formType === 'per_other') {
      // 编辑个人客户的其他信息
      return this.renderPerOtherForm();
    } else if (formType === 'org_phone') {
      // 编辑机构客户的电话信息
      return this.renderOrgPhoneForm();
    } else if (formType === 'org_address') {
      return this.renderOrgAddressForm();
    }
    return null;
  }

  render() {
    const { contactType } = this.props;
    if (_.isEmpty(contactType)) {
      // 如果没有传递contactType则展示内容
      return null;
    }
    // 获取Modal的Title
    const title = this.getModalTitle();

    // Modal的底部按钮
    const footBtns = [
      <Button onClick={this.handleCloseModal}>取消</Button>,
      <Button type="primary" onClick={this.handleModalOK}>确认</Button>,
    ];
    const editForm = this.renderEditForm();

    return (
      <Modal
        visible
        title={title}
        size="middle"
        maskClosable={false}
        modalKey="editCustContactWayModal"
        style={MODAL_STYLE}
        closeModal={this.handleEditModalClose}
        selfBtnGroup={footBtns}
      >
        <div className={styles.editContactModalWrap}> {editForm} </div>
      </Modal>
    );
  }
}

