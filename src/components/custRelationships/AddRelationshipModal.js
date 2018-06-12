/**
 * @Author: sunweibin
 * @Date: 2018-06-11 19:59:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-12 14:32:21
 * @description 添加关联关系的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input, Icon } from 'antd';

import Modal from '../common/biz/CommonModal';
import FormItem from './FormItem';
import Select from '../common/Select';

import styles from './addRelationshipModal.less';

// 默认的空对象
const DEFAULT_EMPTY_OPTION = { value: '', label: '--请选择--' };

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
      IDType: '',
      // 证件号
      IDNo: '',
    };
  }

  // 根据用户选择的Select，得到其级联的下一个Select的可选项
  // 选择了type 则根据type 得到 name Select的data
  // 选择了name 则根据name 得到 subType Select的data
  // 如果Value值为空，则返回默认空数据
  @autobind
  getNextSelectData(value, tree, key = 'children') {
    if (_.isEmpty(value)) return [];
    const data = _.find(tree, item => item.value === value);
    return (data && data[key]) || [];
  }

  @autobind
  addEmptyOption(list) {
    return [DEFAULT_EMPTY_OPTION, ...list];
  }

  @autobind
  checkData() {
    return true;
  }

  @autobind
  handleModalClose() {
    this.props.onClose();
  }

  @autobind
  handleModalConfirm() {
    // 此处在传递数据之前需要先进行一把非空和格式校验
    if (this.checkData()) {
      this.props.onOK();
    }
  }

  @autobind
  handleRelationTypeSelectChange(select, type) {
    this.setState({ type });
  }

  @autobind
  handleRelationNameSelectChange(select, name) {
    this.setState({ name });
  }

  @autobind
  handleRelationSubTypeSelectChange(select, subType) {
    this.setState({ subType });
  }

  @autobind
  handleRelationPersonChange(e) {
    this.setState({ person: e.target.value });
  }

  @autobind
  handleRelationIDTypeSelectChange(select, IDType) {
    this.setState({ IDType });
  }

  @autobind
  handleRelationIDNoChange(e) {
    this.setState({ IDNo: e.target.value });
  }

  render() {
    const { visible, ralationTree } = this.props;
    const { type, name, subType, person, IDType, IDNo } = this.state;
    // 获取关联关系 Select 树
    const typeSelectData = this.addEmptyOption(ralationTree);
    // 根据 type 值获取 name Select的选项数据
    const nameSelectTree = this.getNextSelectData(type, ralationTree);
    const nameSelectData = this.addEmptyOption(nameSelectTree);
    // 根据 name 值获取 subType Select的选项数据
    const subTypeSelectTree = this.getNextSelectData(name, nameSelectTree);
    const subTypeSelectData = this.addEmptyOption(subTypeSelectTree);
    // 根据 name 值获取 证件类型 Select的选项数据
    const IDTypeSelectTree = this.getNextSelectData(name, nameSelectTree, 'certiValue');
    const IDTypeSelectData = this.addEmptyOption(IDTypeSelectTree);

    return (
      <Modal
        title="添加客户关联关系"
        size="normal"
        modalKey="addCustRelationships"
        maskClosable={false}
        visible={visible}
        closeModal={this.handleModalClose}
        onCancel={this.handleAddRelationshipModalClose}
        onOk={this.handleModalConfirm}
      >
        <div className={styles.addRelationContainer}>
          <div className={styles.relationItem}>
            <FormItem label="关联关系类型" labelWidth={130}>
              <Select
                name="type"
                width="130px"
                needShowKey={false}
                value={type}
                data={typeSelectData}
                onChange={this.handleRelationTypeSelectChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关联关系名称" labelWidth={130}>
              <Select
                name="name"
                width="130px"
                needShowKey={false}
                value={name}
                data={nameSelectData}
                onChange={this.handleRelationNameSelectChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关联关系子类型" labelWidth={130}>
              <Select
                name="subType"
                width="130px"
                needShowKey={false}
                value={subType}
                data={subTypeSelectData}
                onChange={this.handleRelationSubTypeSelectChange}
              />
              <Icon type="info-circle-o" className={styles.tipsIcon} />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关系人名称" labelWidth={130}>
              <Input
                className={styles.relationInput}
                value={person}
                onChange={this.handleRelationPersonChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关系人证件类型" labelWidth={130}>
              <Select
                name="IDType"
                width="130px"
                needShowKey={false}
                value={IDType}
                data={IDTypeSelectData}
                onChange={this.handleRelationIDTypeSelectChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关系人证件号码" labelWidth={130}>
              <Input
                className={styles.relationInput}
                value={IDNo}
                onChange={this.handleRelationIDNoChange}
              />
            </FormItem>
          </div>
        </div>
      </Modal>
    );
  }
}

