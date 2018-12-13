/*
 * @Author: sunweibin
 * @Date: 2018-11-28 10:55:01
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 16:42:26
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
    location: PropTypes.object.isRequired,
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

    this.perPhoneFormRef = React.createRef();
    this.perAddressFormRef = React.createRef();
    this.perOtherFormRef = React.createRef();
    this.orgPhoneFormRef = React.createRef();
    this.orgAddressFormRef = React.createRef();
  }

  // 获取编辑Modal的title
  @autobind
  getModalTitle() {
    const { contactType } = this.props;
    return MODAL_TITLES[contactType] || '';
  }

  @autobind
  getPerPhoneForm() {
    return this.perPhoneFormRef.current;
  }

  @autobind
  getPerAddressForm() {
    return this.perAddressFormRef.current;
  }

  @autobind
  getPerOtherForm() {
    return this.perOtherFormRef.current;
  }

  @autobind
  getOrgPhoneForm() {
    return this.orgPhoneFormRef.current;
  }

  @autobind
  getOrgAddressForm() {
    return this.orgAddressFormRef.current;
  }

  // 编辑通过校验后提交机构客户联系方式
  @autobind
  handleContactSubmit(type, query) {
    const {
      location: {
        query: { custId },
      },
      data,
    } = this.props;
    // 编辑的时候需要传递id
    this.props.onOK(type, {
      data: query,
      id: data.id,
      custId,
    });
  }

  // 编辑时校验个人客户电话信息
  @autobind
  checkPerPhoneForSubmit() {
    const phoneForm = this.getPerPhoneForm();
    // 校验完成后调用提交回调
    phoneForm.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.handleContactSubmit('phone', values);
      }
    });
  }

  // 编辑时校验个人客户地址信息
  @autobind
  checkPerAddressForSubmit() {
    const addressForm = this.getPerAddressForm();
    // 校验完成后调用提交回调
    addressForm.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.handleContactSubmit('address', values);
      }
    });
  }

  // 编辑时校验个人客户其他信息
  @autobind
  checkPerOtherForSubmit() {
    const otherForm = this.getPerOtherForm();
    // 校验完成后调用提交回调
    otherForm.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.handleContactSubmit('other', values);
      }
    });
  }

  // 编辑校验机构客户的电话信息
  @autobind
  checkOrgPhoneForSubmit() {
    const { data: { mobile, email, landline } } = this.props;
    const phoneForm = this.getOrgPhoneForm();
    // 校验完成后调用提交回调
    phoneForm.validateFields({ force: true }, (err, values) => {
      if (!err) {
        // 此处需要针对手机信息，固定电话、邮箱做特殊处理
        const {
          emailValue,
          landlineValue,
          mobileValue,
          ...restValue
        } = values;
        // 新增的时候需要将这三个值转换成对象,因为后端的接口需要这样弄,
        // 因为机构客户的联系人信息有多个手机信息、固定电话、邮箱
        // 因为老的数据中有可能手机、固定、邮箱会给与null，因此如果为null,
        // 则id、contactWayCode传空字符串，相当于新增这条数据
        this.handleContactSubmit('phone', {
          ...restValue,
          email: {
            id: '',
            contactWayCode: '',
            ...email,
            value: emailValue,
          },
          mobile: {
            id: '',
            contactWayCode: '',
            ...mobile,
            value: mobileValue,
          },
          landline: {
            id: '',
            contactWayCode: '',
            ...landline,
            value: landlineValue,
          },
        });
      }
    });
  }

  // 校验地址信息
  @autobind
  checkOrgAddressForSubmit() {
    const addressForm = this.getOrgAddressForm();
    // 校验完成后调用提交回调
    addressForm.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.handleContactSubmit('address', values);
      }
    });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: { name: '编辑联系方式-关闭' }
  })
  handleEditModalClose() {
    this.props.onClose();
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '编辑联系方式-取消' }
  })
  handleModalCancelButton() {
    this.props.onClose();
  }

  @autobind
  @logable({
    type: 'ButtonClick',
    payload: { name: '编辑联系方式-确认' }
  })
  handleModalOK() {
    const { custNature, contactType } = this.props;
    // 将客户类型，表单类型拼接起来，方便进行比对
    const formType = `${custNature}_${contactType}`;
    if (formType === 'per_phone') {
      // 编辑个人客户的电话信息
      this.checkPerPhoneForSubmit();
    } else if (formType === 'per_address') {
      // 编辑个人客户的地址信息
      this.checkPerAddressForSubmit();
    } else if (formType === 'per_other') {
      // 编辑个人客户的其他信息
      this.checkPerOtherForSubmit();
    } else if (formType === 'org_phone') {
      // 编辑机构客户的电话信息
      this.checkOrgPhoneForSubmit();
    } else if (formType === 'org_address') {
      // 编辑机构客户的地址信息
      this.checkOrgAddressForSubmit();
    }
  }

  // 个人客户的电话信息
  @autobind
  renderPerPhoneForm() {
    const { data } = this.props;
    return (
      <PerPhoneContactForm
        ref={this.perPhoneFormRef}
        action="UPDATE"
        data={data}
      />
    );
  }

  // 个人客户的地址信息
  @autobind
  renderPerAddressForm() {
    const { data } = this.props;
    return (
      <PerAddressContactForm
        ref={this.perAddressFormRef}
        action="UPDATE"
        data={data}
      />
    );
  }

  // 个人客户的其他信息
  @autobind
  renderPerOtherForm() {
    const { data } = this.props;
    return (
      <PerOtherContactForm
        ref={this.perOtherFormRef}
        action="UPDATE"
        data={data}
      />
    );
  }

  // 机构客户的电话信息
  @autobind
  renderOrgPhoneForm() {
    const { data } = this.props;
    return (
      <OrgPhoneContactForm
        ref={this.orgPhoneFormRef}
        action="UPDATE"
        data={data}
      />
    );
  }

  // 机构客户的电话信息
  @autobind
  renderOrgAddressForm() {
    const { data } = this.props;
    return (
      <OrgAddressContactForm
        ref={this.orgAddressFormRef}
        action="UPDATE"
        data={data}
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
    } if (formType === 'per_address') {
      // 编辑修改个人客户的地址信息
      return this.renderPerAddressForm();
    } if (formType === 'per_other') {
      // 编辑个人客户的其他信息
      return this.renderPerOtherForm();
    } if (formType === 'org_phone') {
      // 编辑机构客户的电话信息
      return this.renderOrgPhoneForm();
    } if (formType === 'org_address') {
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
      <Button onClick={this.handleModalCancelButton}>取消</Button>,
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
        <div className={styles.editContactModalWrap}>{editForm}</div>
      </Modal>
    );
  }
}
