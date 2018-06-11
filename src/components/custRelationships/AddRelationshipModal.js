/**
 * @Author: sunweibin
 * @Date: 2018-06-11 19:59:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-11 20:30:26
 * @description 添加关联关系的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import Modal from '../common/biz/CommonModal';

export default class AddRelationshipModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    action: PropTypes.oneOf(['CREATE', 'UPDATE']),
    // 如果是修改状态，则data有值
    data: PropTypes.object,
    // 下拉框选择的数据
    ralationTree: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    onOK: PropTypes.func.isRequired,
  }

  static defaultProps = {
    action: 'CREATE',
    data: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 关联关系类型
      type: '',
      // 关联关系名称
      name: '',
      // 关联关系子类型
      subType: '',
      // 关联人名称
      person: '',
      // 证件类型
      certType: '',
      // 证件号
      certNo: '',
    };
  }

  @autobind
  handleModalClose() {
    console.warn('关闭添加窗口');
    this.props.onClose();
  }

  @autobind
  handleModalConfirm() {
    console.warn('点击确认');
    this.props.onOK();
  }

  render() {
    const { visible } = this.props;

    return (
      <Modal
        title="添加客户关联关系"
        size="normal"
        modalKey="addCustRelationships"
        visible={visible}
        closeModal={this.handleModalClose}
        onCancel={this.handleAddRelationshipModalClose}
        onOk={this.handleModalConfirm}
      >
        123
      </Modal>
    );
  }
}

