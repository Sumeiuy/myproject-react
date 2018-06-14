/*
 * @Author: zhangjun
 * @Date: 2018-06-09 20:30:15
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-14 23:28:05
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Form } from 'antd';
import CommonModal from '../common/biz/CommonModal';
import commonConfirm from '../common/confirm_';
import InfoTitle from '../common/InfoTitle';
import AutoComplete from '../common/similarAutoComplete';
import EditBasicInfo from './EditBasicInfo';
import UploadFile from './UploadFile';

import styles from './createApply.less';

const FormItem = Form.Item;
const create = Form.create;

@create()
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
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 10,
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
      // 客户信息
      customer: {},
      // 客户基本信息
      custInfo: {},
      // 新建时 选择的客户
      custId: '',
      // 新建时 选择的该客户类型
      custType: '',
      // 新建时 选择的该客户姓名
      custName: '',
      // 新建时流程Id是空
      flowId: '',
      // 客户交易级别
      custTransLv: '',
      // 客户交易级别Name
      custTransLvName: '',
      // 股票客户类型
      stockCustType: '',
      // 申请类型
      reqType: '',
      // 开立期权市场类别
      openOptMktCatg: '',
      // 业务受理营业部
      busPrcDivId: '',
      // 受理时间
      accptTime: '',
      // 申报事项
      declareBus: '',
      // 已提供大专及以上的学历证明材料
      degreeFlag: '',
      // A股账户开立时间6个月以上
      aAcctOpenTimeFlag: '',
      // 已开立融资融券账户
      rzrqzqAcctFlag: '',
      // 已提供金融期货交易证明
      jrqhjyFlag: '',
      // 附件信息
      attachment: '',
      // 必填项校验错误提示信息
      // 客户校验
      isShowCustomerStatusError: false,
      customerStatusErrorMessage: '',
      // 客户交易级别校验
      isShowCustTransLvStatusError: false,
      custTransLvStatusErrorMessage: '',
      // 股票申请客户类型校验
      isShowStockCustTypeStatusError: false,
      stockCustTypeStatusErrorMessage: '',
      // 申请类型校验
      isShowReqTypeStatusError: false,
      reqTypeStatusErrorMessage: '',
      // 开立期权市场类别校验
      isShowOpenOptMktCatgStatusError: false,
      openOptMktCatgStatusErrorMessage: '',
      // 申报事项校验
      isShowDeclareBusStatusError: false,
      declareBusStatusErrorMessage: '',
      // 已提供大专及以上的学历证明材料校验
      isShowDegreeFlagStatusError: false,
      degreeFlagStatusErrorMessage: '',
      // A股账户开立时间6个月以上校验
      isShowAAcctOpenTimeFlagStatusError: false,
      aAcctOpenTimeFlagStatusErrorMessage: '',
      // 已开立融资融券账户校验
      isShowRzrqzqAcctFlagStatusError: false,
      rzrqzqAcctFlagStatusErrorMessage: '',
      // 已提供金融期货交易证明校验
      isShowJrqhjyFlagStatusError: false,
      jrqhjyFlagStatusErrorMessage: '',
    };
    this.isValidateError = false;
  }

  // 客户校验必填错误时设置错误状态和错误提示
  @autobind
  setCustomerErrorProps() {
    this.setState({
      isShowCustomerStatusError: true,
      customerStatusErrorMessage: '客户不能为空',
    });
    this.isValidateError = true;
  }

  // 客户交易级别必填错误时设置错误状态和错误提示
  @autobind
  setCustTransLvErrorProps() {
    this.setState({
      isShowCustTransLvStatusError: true,
      custTransLvStatusErrorMessage: '客户交易级别不能为空',
    });
    this.isValidateError = true;
  }

  // 股票申请客户类型校验必填错误时设置错误状态和错误提示
  @autobind
  setStockCustTypeErrorProps() {
    this.setState({
      isShowStockCustTypeStatusError: true,
      stockCustTypeStatusErrorMessage: '请选择客户类型',
    });
    this.isValidateError = true;
  }

  // 申请类型校验必填错误时设置错误状态和错误提示
  @autobind
  setReqTypeErrorProps() {
    this.setState({
      isShowReqTypeStatusError: true,
      reqTypeStatusErrorMessage: '请选择申请类型',
    });
    this.isValidateError = true;
  }

  // 开立期权市场类别校验必填错误时设置错误状态和错误提示
  @autobind
  setOpenOptMktCatgErrorProps() {
    this.setState({
      isShowOpenOptMktCatgStatusError: true,
      openOptMktCatgStatusErrorMessage: '请选择开立期权市场类别',
    });
    this.isValidateError = true;
  }

  // 申报事项校验必填错误时设置错误状态和错误提示
  @autobind
  setOpenDeclareBusErrorProps() {
    this.setState({
      isShowDeclareBusStatusError: true,
      declareBusStatusErrorMessage: '申报事项不能为空',
    });
    this.isValidateError = true;
  }

  // 学历证明材料校验必填错误时设置错误状态和错误提示
  @autobind
  setDegreeFlagErrorProps() {
    this.setState({
      isShowDegreeFlagStatusError: true,
      degreeFlagStatusErrorMessage: '请选择已提供大专及以上的学历证明材料',
    });
    this.isValidateError = true;
  }

  // A股账户校验必填错误时设置错误状态和错误提示
  @autobind
  setAAcctOpenTimeFlagErrorProps() {
    this.setState({
      isShowAAcctOpenTimeFlagStatusError: true,
      aAcctOpenTimeFlagStatusErrorMessage: '请选择A股账户开立时间6个月以上',
    });
    this.isValidateError = true;
  }

  // 已开立融资融券账户校验必填错误时设置错误状态和错误提示
  @autobind
  setRzrqzqAcctFlagErrorProps() {
    this.setState({
      isShowRzrqzqAcctFlagStatusError: true,
      rzrqzqAcctFlagStatusErrorMessage: '请选择已开立融资融券账户',
    });
    this.isValidateError = true;
  }

  // 已提供金融期货交易证明校验必填错误时设置错误状态和错误提示
  @autobind
  setJrqhjyFlagErrorProps() {
    this.setState({
      isShowJrqhjyFlagStatusError: true,
      jrqhjyFlagStatusErrorMessage: '请选择已提供金融期货交易证明',
    });
    this.isValidateError = true;
  }

  // 客户校验填完值后重置错误状态和错误提示
  @autobind
  reSetCustomerErrorProps() {
    this.setState({
      isShowCustomerStatusError: false,
      customerStatusErrorMessage: '',
    });
  }

  // 客户交易级别校验填完值后重置错误状态和错误提示
  @autobind
  reSetCustTransLvErrorProps() {
    this.setState({
      isShowCustTransLvStatusError: false,
      custTransLvStatusErrorMessage: '',
    });
  }

  // 客户类型校验填完值后重置错误状态和错误提示
  @autobind
  reSetStockCustTypeErrorProps() {
    this.setState({
      isShowStockCustTypeStatusError: false,
      stockCustTypeStatusErrorMessage: '',
    });
  }

  // 申请类型校验填完值后重置错误状态和错误提示
  @autobind
  reSetReqTypeErrorProps() {
    this.setState({
      isShowReqTypeStatusError: false,
      reqTypeStatusErrorMessage: '',
    });
  }

  // 开立期权市场类别校验填完值后重置错误状态和错误提示
  @autobind
  reSetOpenOptMktCatgErrorProps() {
    this.setState({
      isShowOpenOptMktCatgStatusError: false,
      openOptMktCatgStatusErrorMessage: '',
    });
  }

  // 申报事项校验填完值后重置错误状态和错误提示
  @autobind
  reSetDeclareBusErrorProps() {
    this.setState({
      isShowDeclareBusStatusError: false,
      declareBusStatusErrorMessage: '',
    });
  }

  // 学历证明材料校验填完值后重置错误状态和错误提示
  @autobind
  reSetDegreeFlagErrorProps() {
    this.setState({
      isShowDegreeFlagStatusError: false,
      degreeFlagStatusErrorMessage: '',
    });
  }

  // A股账户开立时间6个月以上校验填完值后重置错误状态和错误提示
  @autobind
  reSetAAcctOpenTimeFlagErrorProps() {
    this.setState({
      isShowAAcctOpenTimeFlagStatusError: false,
      aAcctOpenTimeFlagStatusErrorMessage: '',
    });
  }

  // 已开立融资融券账户校验填完值后重置错误状态和错误提示
  @autobind
  reSetRzrqzqAcctFlagErrorProps() {
    this.setState({
      isShowRzrqzqAcctFlagStatusError: false,
      rzrqzqAcctFlagStatusErrorMessage: '',
    });
  }

  // 已提供金融期货交易证明校验填完值后重置错误状态和错误提示
  @autobind
  reSetJrqhjyFlagErrorProps() {
    this.setState({
      isShowJrqhjyFlagStatusError: false,
      jrqhjyFlagStatusErrorMessage: '',
    });
  }

  // 校验必填项
  @autobind
  checkIsRequired() {
    const {
      customer,
      custInfo: {
        invFlag,
        ageFlag,
      },
      custTransLvName,
      stockCustType,
      reqType,
      openOptMktCatg,
      declareBus,
      degreeFlag,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
    } = this.state;
    // 客户校验
    if (_.isEmpty(customer)) {
      this.setCustomerErrorProps();
    }
    // 客户交易级别校验
    if (!custTransLvName) {
      this.setCustTransLvErrorProps();
    }
    // 股票申请客户类型校验
    if (!stockCustType) {
      this.setStockCustTypeErrorProps();
    }
    // 申请类型校验
    if (!reqType) {
      this.setReqTypeErrorProps();
    }
    // 开立期权市场类别校验
    if (!openOptMktCatg) {
      this.setOpenOptMktCatgErrorProps();
    }
    // 申报事项校验
    if (!declareBus) {
      this.setOpenDeclareBusErrorProps();
    }
    // 检测是否是新开客户，初次申请，学历提示选项校验，和投资经历评估3个提示选项校验
    if (stockCustType === 'New' && reqType === 'New') {
      // 学历不符合
      if (ageFlag === 'N') {
        if (!degreeFlag) {
          this.setDegreeFlagErrorProps();
        }
      }
      // 投资经历不符合
      if (invFlag === 'N') {
        if (!aAcctOpenTimeFlag) {
          this.setAAcctOpenTimeFlagErrorProps();
        }
        if (!rzrqzqAcctFlag) {
          this.setRzrqzqAcctFlagErrorProps();
        }
        if (!jrqhjyFlag) {
          this.setJrqhjyFlagErrorProps();
        }
      }
    }
  }

  // 点击提交按钮
  @autobind
  handleOk() {
    this.checkIsRequired();
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

    const {
      flowId,
    } = this.state;
    // 选中客户
    this.setState({ customer: item });
    if (!_.isEmpty(item)) {
      this.reSetCustomerErrorProps();
      const {
        brokerNumber,
        custType,
      } = item;
      // 根据经济客户号查询客户附带信息
      getCustInfo({
        brokerNumber,
        custType,
      }).then(() => {
        const { custInfo } = this.props;
        if (!_.isEmpty(custInfo)) {
          this.handleEmitEvent('custInfo', custInfo);
          // 设置客户交易级别
          this.handleEmitEvent('custTransLv', custInfo.custTransLv);
          this.handleEmitEvent('custTransLvName', custInfo.custTransLvName);
          this.handleEmitEvent('accptTime', custInfo.accptTime);
        }
      });
      // 获取股票客户类型,申请类型,开立期权市场类别,业务受理营业部的下拉选择
      getSelectMap({ flowId });
    }
  }

  // 更新基本信息数据
  @autobind
  handleEmitEvent(name, value) {
    this.setState({ [name]: value }, () => {
      if (value) {
        switch (name) {
          // 客户交易级别
          case 'custTransLvName':
            this.reSetCustTransLvErrorProps();
            break;
          // 股票申请客户
          case 'stockCustType':
            this.reSetStockCustTypeErrorProps();
            break;
          // 申报事项
          case 'reqType':
            this.reSetReqTypeErrorProps();
            break;
          // 开立期权市场类别
          case 'openOptMktCatg':
            this.reSetOpenOptMktCatgErrorProps();
            break;
          // 申报事项
          case 'declareBus':
            this.reSetDeclareBusErrorProps();
            break;
          // 学历
          case 'degreeFlag':
            this.reSetDegreeFlagErrorProps();
            break;
          // A股账户开立时间6个月以上
          case 'aAcctOpenTimeFlag':
            this.reSetAAcctOpenTimeFlagErrorProps();
            break;
          // 已开立融资融券账户
          case 'rzrqzqAcctFlag':
            this.reSetRzrqzqAcctFlagErrorProps();
            break;
          // 已提供金融期货交易证明
          case 'jrqhjyFlag':
            this.reSetJrqhjyFlagErrorProps();
            break;
          default:
            break;
        }
      }
    });
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
      acceptOrgData,
      queryAcceptOrg,
    } = this.props;
    const {
      isShowModal,
      customer,
      accptTime,
      custTransLv,
      custTransLvName,
      flowId,
      isShowCustomerStatusError,
      customerStatusErrorMessage,
      // 客户交易级别校验
      isShowCustTransLvStatusError,
      custTransLvStatusErrorMessage,
      // 股票申请客户类型校验
      isShowStockCustTypeStatusError,
      stockCustTypeStatusErrorMessage,
      // 申请类型校验
      isShowReqTypeStatusError,
      reqTypeStatusErrorMessage,
      // 开立期权市场类别校验
      isShowOpenOptMktCatgStatusError,
      openOptMktCatgStatusErrorMessage,
      // 申报事项校验
      isShowDeclareBusStatusError,
      declareBusStatusErrorMessage,
      // 已提供大专及以上的学历证明材料校验
      isShowDegreeFlagStatusError,
      degreeFlagStatusErrorMessage,
      // A股账户开立时间6个月以上校验
      isShowAAcctOpenTimeFlagStatusError,
      aAcctOpenTimeFlagStatusErrorMessage,
      // 已开立融资融券账户校验
      isShowRzrqzqAcctFlagStatusError,
      rzrqzqAcctFlagStatusErrorMessage,
      // 已提供金融期货交易证明校验
      isShowJrqhjyFlagStatusError,
      jrqhjyFlagStatusErrorMessage,
    } = this.state;
    // 客户交易级别校验
    const customerStatusErrorProps = isShowCustomerStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: customerStatusErrorMessage,
    } : null;
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
          <div className={styles.module}>
            <InfoTitle head="基本信息" />
            <Form>
              <div className={styles.coloumn}>
                <div className={styles.label}>
                  <i className={styles.isRequired}>*</i>
                  客户
                  <span className={styles.colon}>:</span>
                </div>
                <div className={styles.value}>
                  <FormItem {...customerStatusErrorProps}>
                    <AutoComplete
                      placeholder="客户号/客户名称"
                      optionList={busCustList}
                      showNameKey="custName"
                      showIdKey="cusId"
                      style={{ width: 200 }}
                      onSelect={this.selectCustomer}
                      onSearch={this.searchCanApplyCustList}
                    />
                  </FormItem>
                </div>
              </div>
            </Form>
            <EditBasicInfo
              stockCustTypeMap={stockCustTypeMap}
              reqTypeMap={reqTypeMap}
              klqqsclbMap={klqqsclbMap}
              busDivisionMap={busDivisionMap}
              getSelectMap={getSelectMap}
              customer={customer}
              custInfo={custInfo}
              accptTime={accptTime}
              custTransLv={custTransLv}
              custTransLvName={custTransLvName}
              getCustInfo={getCustInfo}
              flowId={flowId}
              onEmitEvent={this.handleEmitEvent}
              isShowCustTransLvStatusError={isShowCustTransLvStatusError}
              custTransLvStatusErrorMessage={custTransLvStatusErrorMessage}
              isShowStockCustTypeStatusError={isShowStockCustTypeStatusError}
              stockCustTypeStatusErrorMessage={stockCustTypeStatusErrorMessage}
              isShowReqTypeStatusError={isShowReqTypeStatusError}
              reqTypeStatusErrorMessage={reqTypeStatusErrorMessage}
              isShowOpenOptMktCatgStatusError={isShowOpenOptMktCatgStatusError}
              openOptMktCatgStatusErrorMessage={openOptMktCatgStatusErrorMessage}
              isShowDeclareBusStatusError={isShowDeclareBusStatusError}
              declareBusStatusErrorMessage={declareBusStatusErrorMessage}
              isShowDegreeFlagStatusError={isShowDegreeFlagStatusError}
              degreeFlagStatusErrorMessage={degreeFlagStatusErrorMessage}
              isShowAAcctOpenTimeFlagStatusError={isShowAAcctOpenTimeFlagStatusError}
              aAcctOpenTimeFlagStatusErrorMessage={aAcctOpenTimeFlagStatusErrorMessage}
              isShowRzrqzqAcctFlagStatusError={isShowRzrqzqAcctFlagStatusError}
              rzrqzqAcctFlagStatusErrorMessage={rzrqzqAcctFlagStatusErrorMessage}
              isShowJrqhjyFlagStatusError={isShowJrqhjyFlagStatusError}
              jrqhjyFlagStatusErrorMessage={jrqhjyFlagStatusErrorMessage}
              acceptOrgData={acceptOrgData}
              queryAcceptOrg={queryAcceptOrg}
            />
          </div>
          <div className={styles.moduleAttachment}>
            <InfoTitle head="附件信息" />
            <UploadFile
              fileList={[]}
              edit
              type="attachment"
              onEmitEvent={this.handleEmitEvent}
              needDefaultText={false}
            />
          </div>
        </div>
      </CommonModal>
    );
  }
}
