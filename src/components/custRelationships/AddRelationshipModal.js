/**
 * @Author: sunweibin
 * @Date: 2018-06-11 19:59:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-06-15 10:23:47
 * @description 添加关联关系的Modal
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Input, Icon, Popover } from 'antd';

import Modal from '../common/biz/CommonModal';
import FormItem from './FormItem';
import Select from '../common/Select';
import confirm from '../common/confirm_';

import { check } from '../../helper';

import { IDCARD_TYPE_CODE, UNIFIED_SOCIALCARD_TYPE_CODE } from './config';

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
    const { action, data } = props;
    const isCreate = action === 'CREATE';
    // 默认的state值
    const DEFAULT_STATE = {
      // 关联关系类型
      relationTypeValue: '',
      relationTypeLabel: '',
      // 关联关系名称
      relationNameValue: '',
      relationNameLabel: '',
      // 关联关系子类型
      relationSubTypeValue: '',
      relationSubTypeLabel: '',
      // 关联人名称
      partyName: '',
      // 证件类型
      partyIDTypeValue: '',
      partyIDTypeLabel: '',
      // 证件号
      partyIDNum: '',
    };
    const realState = isCreate ? DEFAULT_STATE : _.omit(data, ['ecifId']);
    this.state = realState;
  }

  // 根据用户选择的Select，得到其级联的下一个Select的可选项
  // 选择了type 则根据type 得到 name Select的data
  // 选择了name 则根据name 得到 subType Select的data
  // 如果Value值为空，则返回默认空数据
  @autobind
  getNextSelectData(value, tree, key = 'children') {
    if (_.isEmpty(value)) {
      return [];
    }
    const data = _.find(tree, item => item.value === value);
    return (data && data[key]) || [];
  }

  @autobind
  getPopoverContent(name = '', tree) {
    if (_.isEmpty(name)) {
      return (<div className={styles.notip}>暂无提示</div>);
    }
    const { remark = '' } = _.find(tree, item => item.value === name);
    if (_.isEmpty(remark)) {
      return (<div className={styles.notip}>暂无提示</div>);
    }
    const tips = _.split(remark, /：|\|/g);
    return (
      <div className={styles.tipsWrap}>
        <div className={styles.tipTitle}>{`${tips[0]}：`}</div>
        <div className={styles.tipContent}>{tips[1]}</div>
        <div className={styles.tipTitle}>{`${tips[2]}：`}</div>
        <div className={styles.tipContent}>{tips[3]}</div>
      </div>
    );
  }

  @autobind
  addEmptyOption(list) {
    return [DEFAULT_EMPTY_OPTION, ...list];
  }

  @autobind
  hasSetAllData() {
    const {
      relationTypeValue,
      relationNameValue,
      relationSubTypeValue,
      partyName,
      partyIDTypeValue,
      partyIDNum,
    } = this.state;
    const valueWaitForCheck = [
      {
        value: relationTypeValue,
        checkTip: '请选择关联关系类型',
      },
      {
        value: relationNameValue,
        checkTip: '请选择关联关系名称',
      },
      {
        value: relationSubTypeValue,
        checkTip: '请选择关联关系子类型',
      },
      {
        value: partyName,
        checkTip: '请填写关系人名称',
      },
      {
        value: partyIDTypeValue,
        checkTip: '请选择关联关系证件类型',
      },
      {
        value: partyIDNum,
        checkTip: '请填写关系人证件号码',
      },
    ];
    const checkResult = _.find(valueWaitForCheck, item => _.isEmpty(item.value));
    if (!_.isEmpty(checkResult)) {
      confirm({ content: checkResult.checkTip });
      return false;
    }
    return true;
  }

  @autobind
  checkIDNumFormat() {
    const { partyIDNum, partyIDTypeValue } = this.state;
    let result = true;
    if (partyIDTypeValue === IDCARD_TYPE_CODE) {
      // 身份证
      result = check.is18gitiIDCardCode(partyIDNum) || check.is15gitiIDCardCode(partyIDNum);
    } else if (partyIDTypeValue === UNIFIED_SOCIALCARD_TYPE_CODE) {
      // 统一社会信用证
      result = check.isUnifiedSocialCreditCode(partyIDNum);
    } else {
      // 其余的号码，暂时之校验数字和字母
      result = check.isOnlyAlphabetAndNumber(partyIDNum);
    }
    if (!result) {
      confirm({ content: '证件号码格式错误！' });
    }
    // 其余均通过校验
    return result;
  }

  @autobind
  checkData() {
    // 1. 判断所有的值是否为空
    if (!this.hasSetAllData()) {
      return false;
    }
    // 2. 校验证件号码格式是否正确， 目前前端帮助校验 三种: 社会统一信用证、18位身份证、15位身份证
    if (!this.checkIDNumFormat()) {
      return false;
    }
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
      const { action } = this.props;
      this.props.onOK({ ...this.state, action });
    }
  }

  @autobind
  handleRelationTypeSelectChange(select, relationTypeValue, option) {
    // 切换关联关系，需要将关联关系名称，关联关系子类型，身份证件类型全部置空
    this.setState({
      relationTypeValue,
      relationTypeLabel: option.label,
      // 关联关系名称
      relationNameValue: '',
      relationNameLabel: '',
      // 关联关系子类型
      relationSubTypeValue: '',
      relationSubTypeLabel: '',
      // 证件类型
      partyIDTypeValue: '',
      partyIDTypeLabel: '',
      // 证件号
      partyIDNum: '',
      partyName: '',
    });
  }

  @autobind
  handleRelationNameSelectChange(select, relationNameValue, option) {
    // 切换名称，则需要将子类型，身份证类型相关数据置空
    this.setState({
      relationNameValue,
      relationNameLabel: option.label,
      // 关联关系子类型
      relationSubTypeValue: '',
      relationSubTypeLabel: '',
      // 证件类型
      partyIDTypeValue: '',
      partyIDTypeLabel: '',
      // 证件号
      partyIDNum: '',
    });
  }

  @autobind
  handleRelationSubTypeSelectChange(select, relationSubTypeValue, option) {
    this.setState({
      relationSubTypeValue,
      relationSubTypeLabel: option.label,
    });
  }

  @autobind
  handleRelationPersonChange(e) {
    this.setState({ partyName: e.target.value });
  }

  @autobind
  handleRelationIDTypeSelectChange(select, partyIDTypeValue, option) {
    this.setState({
      partyIDTypeValue,
      partyIDTypeLabel: option.label,
      partyIDNum: '',
    });
  }

  @autobind
  handleRelationIDNoChange(e) {
    this.setState({ partyIDNum: e.target.value });
  }

  render() {
    const { visible, ralationTree, action } = this.props;
    const {
      relationTypeValue,
      relationNameValue,
      relationSubTypeValue,
      partyName,
      partyIDTypeValue,
      partyIDNum,
    } = this.state;
    // 获取关联关系 Select 树
    const typeSelectData = this.addEmptyOption(ralationTree);
    // 根据 type 值获取 name Select的选项数据
    const nameSelectTree = this.getNextSelectData(relationTypeValue, ralationTree);
    const nameSelectData = this.addEmptyOption(nameSelectTree);
    // 根据 name 值获取 subType Select的选项数据
    const subTypeSelectTree = this.getNextSelectData(relationNameValue, nameSelectTree);
    const subTypeSelectData = this.addEmptyOption(subTypeSelectTree);
    // 根据 name 值获取 证件类型 Select的选项数据
    const IDTypeSelectTree = this.getNextSelectData(relationNameValue, nameSelectTree, 'certificateDTOs');
    const IDTypeSelectData = this.addEmptyOption(IDTypeSelectTree);
    // 生成 子类型 旁 提示图标的弹出层
    const popoverContent = this.getPopoverContent(relationNameValue, nameSelectTree);

    return (
      <Modal
        title={action === 'CREATE' ? '添加客户关联关系' : '修改客户关联关系'}
        size="normal"
        modalKey="addCustRelationships"
        wrapClassName={styles.addRelationshipModal}
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
                name="relationTypeValue"
                width="130px"
                needShowKey={false}
                value={relationTypeValue}
                data={typeSelectData}
                onChange={this.handleRelationTypeSelectChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关联关系名称" labelWidth={130}>
              <Select
                name="relationNameValue"
                width="130px"
                needShowKey={false}
                value={relationNameValue}
                data={nameSelectData}
                onChange={this.handleRelationNameSelectChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关联关系子类型" labelWidth={130}>
              <Select
                name="relationSubTypeValue"
                width="130px"
                needShowKey={false}
                value={relationSubTypeValue}
                data={subTypeSelectData}
                onChange={this.handleRelationSubTypeSelectChange}
              />
              <Popover placement="right" content={popoverContent}>
                <Icon type="info-circle-o" className={styles.tipsIcon} />
              </Popover>
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关系人名称" labelWidth={130}>
              <Input
                className={styles.relationInput}
                value={partyName}
                onChange={this.handleRelationPersonChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关系人证件类型" labelWidth={130}>
              <Select
                name="partyIDTypeValue"
                width="130px"
                needShowKey={false}
                value={partyIDTypeValue}
                data={IDTypeSelectData}
                onChange={this.handleRelationIDTypeSelectChange}
              />
            </FormItem>
          </div>
          <div className={styles.relationItem}>
            <FormItem label="关系人证件号码" labelWidth={130}>
              <Input
                className={styles.relationInput}
                value={partyIDNum}
                onChange={this.handleRelationIDNoChange}
              />
            </FormItem>
          </div>
        </div>
      </Modal>
    );
  }
}

