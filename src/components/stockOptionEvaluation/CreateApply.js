/*
 * @Author: zhangjun
 * @Date: 2018-06-09 20:30:15
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-12 15:33:36
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CommonModal from '../common/biz/CommonModal';
import commonConfirm from '../common/confirm_';
import InfoTitle from '../common/InfoTitle';
import AutoComplete from '../common/similarAutoComplete';
import EditBasicInfo from './EditBasicInfo';

import styles from './createApply.less';

export default class CreateApply extends PureComponent {
  static propTypes = {
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 清除数据
    clearProps: PropTypes.func.isRequired,
    // 关闭蒙框
    onEmitClearModal: PropTypes.func.isRequired,
    // 本营业部客户
    busCustList: PropTypes.array.isRequired,
    getBusCustList: PropTypes.func.isRequired,
    // 客户基本信息
    custInfo: PropTypes.object.isRequired,
    getCustInfo: PropTypes.func.isRequired,
    // 客户类型下拉列表
    stockCustTypeMap: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeMap: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    klqqsclbMap: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionMap: PropTypes.array.isRequired,
    // 获取基本信息的多个select数据
    getSelectMap: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
      // 客户信息
      customer: {},
      // 新建时 选择的客户
      custId: '',
      // 新建时 选择的该客户类型
      custType: '',
      // 新建时 选择的该客户姓名
      custName: '',
      // 新建时流程Id是空
      flowId: '',
      // 股票客户类型
      stockCustType: '',
      // 申请类型
      reqType: '',
      // 开立期权市场类别
      openOptMktCatg: '',
      // 业务受理营业部
      busPrcDivId: '',
      // 申报事项
      declareBus: '',

    };
  }
  // 点击提交按钮
  @autobind
  handleOk() {
  }
  // 关闭弹窗
  @autobind
  handleCloseModal() {
    // 关闭模态框
    commonConfirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    this.setState({
      isShowModal: false,
      nextApproverModal: false,
    }, this.props.clearProps);
  }

  @autobind
  afterClose() {
    this.props.onEmitClearModal();
  }

  // 更新数据
  @autobind
  updateValue(name, value) {
    this.setState({ [name]: value });
    if (name === 'customer') {
      this.setState({
        customer: {
          custName: value.custName,
          custNumber: value.cusId,
          brokerNumber: value.brokerNumber,
        },
        custId: value.cusId,
        custType: value.custType,
      });
    }
  }

  // 搜索本营业部客户
  @autobind
  searchCanApplyCustList(value) {
    const {
      empInfo: {
        empInfo: {
          postnId,
          occDivnNum,
        },
      },
      getBusCustList,
    } = this.props;
    const {
      pageNum,
      pageSize,
    } = this.state;
    const query = {
      postnId,
      pageNum,
      pageSize,
      deptCode: occDivnNum,
      keyword: value,
    };
    getBusCustList(query);
  }

  // 选择本营业部客户
  @autobind
  selectCustomer(item) {
    const {
      getCustInfo,
      getSelectMap,
    } = this.props;

    const { flowId } = this.state;
    // 选中客户
    this.setState({ customer: item });
    if (!_.isEmpty(item)) {
      const {
        brokerNumber,
        custType,
      } = item;
      // 根据经济客户号查询客户附带信息
      getCustInfo({
        brokerNumber,
        custType,
      });
      getSelectMap({ flowId });
    }
  }

  // 基本信息select选择后修改相应的值
  @autobind
  handleEmitEvent(name, value) {
    this.setState({ [name]: value });
  }
  render() {
    const {
      busCustList,
      custInfo,
      getCustInfo,
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      getSelectMap,
    } = this.props;
    const {
      isShowModal,
      customer,
      flowId,
    } = this.state;
    const custAccount = !_.isEmpty(customer) ? `${customer.custName}（${customer.custNumber}）` : '';
    return (
      <CommonModal
        title="新增股票期权评估申请"
        modalKey="stockOptionModal"
        onOk={this.handleOk}
        closeModal={this.handleCloseModal}
        afterClose={this.afterClose}
        visible={isShowModal}
        size="large"
      >
        <div className={styles.createApplyBox}>
          <InfoTitle head="基本信息" />
          <div className={styles.custInfo}>
            <div className={styles.label}>
              <i className={styles.isRequired}>*</i>
              客户
              <span className={styles.colon}>:</span>
            </div>
            <div className={styles.value}>
              <AutoComplete
                placeholder="客户号/客户名称"
                optionList={busCustList}
                showNameKey="custName"
                showIdKey="cusId"
                style={{ width: 200 }}
                onSelect={this.selectCustomer}
                onSearch={this.searchCanApplyCustList}
              />
            </div>
          </div>
          <EditBasicInfo
            stockCustTypeMap={stockCustTypeMap}
            reqTypeMap={reqTypeMap}
            klqqsclbMap={klqqsclbMap}
            busDivisionMap={busDivisionMap}
            getSelectMap={getSelectMap}
            customer={custAccount}
            custInfo={custInfo}
            getCustInfo={getCustInfo}
            flowId={flowId}
            onEmitEvent={this.handleEmitEvent}
          />
        </div>
      </CommonModal>
    );
  }
}
