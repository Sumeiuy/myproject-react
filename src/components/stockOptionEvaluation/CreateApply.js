/*
 * @Author: zhangjun
 * @Date: 2018-06-09 20:30:15
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-25 13:19:46
 */

import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Form, message, Modal } from 'antd';
import CommonModal from '../common/biz/CommonModal';
import commonConfirm from '../common/confirm_';
import TableDialog from '../common/biz/TableDialog';
import InfoTitle from '../common/InfoTitle';
import AutoComplete from '../common/similarAutoComplete';
import BottonGroup from '../permission/BottonGroup';
import EditBasicInfo from './EditBasicInfo';
import UploadFile from '../permission/UploadFile';
import config from './config';

import styles from './createApply.less';

const FormItem = Form.Item;
const { approvalColumns } = config;
const SRTYPE = 'SRStkOpReq';
const EMPTY_INFO = '--';

export default class CreateApply extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
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
    // 新建页面获取下一步按钮和审批人
    createButtonListData: PropTypes.object.isRequired,
    getCreateButtonList: PropTypes.func.isRequired,
    // 验证提交数据结果
    validateResultData: PropTypes.object.isRequired,
    validateResult: PropTypes.func.isRequired,
    // 新建修改的更新接口
    updateBindingFlowAppId: PropTypes.string.isRequired,
    updateBindingFlow: PropTypes.func.isRequired,
    // 更新申请列表
    queryAppList: PropTypes.func.isRequired,
    // 走流程接口
    doApprove: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.createButtonListData !== prevState.createButtonListData) {
      return {
        createButtonListData: nextProps.createButtonListData,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      pageSize: 10,
      // 模态框是否显示 默认状态下是隐藏的
      isShowModal: true,
      // 下一步按钮
      createButtonListData: {},
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
    };
    this.isValidateError = false;
  }

  @autobind
  setBasicInfoFormRef(form) {
    this.basicInfoForm = form;
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

  // 客户校验填完值后重置错误状态和错误提示
  @autobind
  resetCustomerErrorProps() {
    this.setState({
      isShowCustomerStatusError: false,
      customerStatusErrorMessage: '',
    });
  }

  // 客户交易级别校验填完值后重置错误状态和错误提示
  @autobind
  resetCustTransLvErrorProps() {
    this.setState({
      isShowCustTransLvStatusError: false,
      custTransLvStatusErrorMessage: '',
    });
  }

  // 校验必填项
  @autobind
  checkIsRequired() {
    const {
      customer,
      custTransLvName,
    } = this.state;
    // 客户校验
    if (_.isEmpty(customer)) {
      this.setCustomerErrorProps();
    }
    // 客户交易级别校验
    if (!custTransLvName || custTransLvName === EMPTY_INFO) {
      this.setCustTransLvErrorProps();
    }
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
    // 选中客户
    this.setState({ customer: item });
    if (!_.isEmpty(item)) {
      this.resetCustomerErrorProps();
      this.getCustInfo(item);
    }
  }

  // 根据经济客户号查询客户附带信息
  @autobind
  getCustInfo(item) {
    const { getCustInfo, getSelectMap } = this.props;
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
        const {
          custTransLv,
          custTransLvName,
          accptTime,
          busPrcDivId,
          divisionName,
          openDivName,
          busPrcDivName,
        } = custInfo;
        this.handleChange({
          custInfo,
          custTransLv,
          custTransLvName,
          accptTime,
          busPrcDivId,
        });
        // 获取下一步按钮和审批人
        const { flowId } = this.state;
        const param = {
          flowId,
          divisionName,
          openDivName,
          busPrcDivName,
        };
        this.getCreateButtonList(param);
      }
    });
    // 获取股票客户类型,申请类型,开立期权市场类别,业务受理营业部的下拉选择
    getSelectMap({
      econNum: brokerNumber,
      custType,
    });
  }

  // 获取下一步按钮和审批人
  @autobind
  getCreateButtonList(param) {
    this.props.getCreateButtonList(param);
  }

  @autobind
  handleSubmit(item) {
    // 校验必填项
    this.isValidateError = false;
    const { validateFieldsAndScroll } = this.basicInfoForm.getForm();
    validateFieldsAndScroll((err) => {
      this.checkIsRequired();
      if (this.isValidateError) return;
      if (!err) {
        const {
          customer: {
            custType,
          },
          custInfo: {
            isProfessInvset,
          },
        } = this.state;
        // 个人客户且是专业投资者
        if (custType === 'per' && isProfessInvset) {
          commonConfirm({
            content: '请确认是否上传客户朗读风险揭示书确认条款的视频及其它适当性评估材料。',
            onOk: () => this.showNextApprover(item),
          });
        } else {
          commonConfirm({
            content: '请确认是否已上传相关附件。',
            onOk: () => this.showNextApprover(item),
          });
        }
      }
    });
  }

  // 展示下一步审批人
  @autobind
  showNextApprover(item) {
    this.setState({
      operate: item.operate,
      groupName: item.nextGroupName,
      auditors: !_.isEmpty(item.flowAuditors) ? item.flowAuditors[0].login : '',
      nextApproverList: item.flowAuditors,
      nextApproverModal: true,
    });
  }

  // 校验数据
  @autobind
  validateResult(value) {
    if (_.isEmpty(value)) {
      message.error('请选择审批人');
      return;
    }
    this.setState({
      nextApproverModal: false,
    });
    // 校验的数据
    const {
      customer: {
        brokerNumber: econNum,
      },
      custTransLv,
      stockCustType,
      reqType,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      custInfo: {
        invFlag,
        nonAlertblackFlag,
        riskEval,
        riskEvalTime,
        age,
        ageFlag,
      },
      degreeFlag,
    } = this.state;
    const query = {
      bizId: '',
      econNum,
      custTransLv,
      stockCustType,
      reqType,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      invFlag,
      nonAlertblackFlag,
      riskEval,
      riskEvalTime,
      age,
      ageFlag,
      degreeFlag,
    };
    // 提交前先对提交的数据调验证接口进行进行验证
    this.props.validateResult(query)
      .then(() => {
        const {
          validateResultData: {
            isValid,
            msg,
          },
        } = this.props;
        // isValid为true，代码数据验证通过，此时可以往下走，为false弹出错误信息
        if (isValid) {
          this.sendCreateRequest(value);
        } else {
          Modal.error({
            title: '提示信息',
            okText: '确定',
            content: msg,
          });
        }
      });
  }

  // 发送请求，先走新建（修改）接口，再走流程接口
  @autobind
  sendCreateRequest(value) {
    const {
      flowId,
      customer: {
        brokerNumber: econNum,
        cusId: custId,
        custName,
        custType,
      },
      custTransLv,
      stockCustType,
      reqType,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      custInfo: {
        divisionId,
        openDivId,
        idType,
        idNum,
        aAcct,
        openSys,
        isProfessInvset,
        invFlag,
        nonAlertblackFlag,
        riskEval,
        riskEvalTime,
        age,
        ageFlag,
        investPrefer,
      },
      degreeFlag,
      openOptMktCatg,
      busPrcDivId,
      accptTime,
      declareBus,
      attachment,
      auditors,
    } = this.state;
    const query = {
      id: '',
      bizId: '',
      flowId,
      custId,
      custName,
      custType,
      econNum,
      divisionId,
      openDivId,
      idType,
      idNum,
      aAcct,
      openSys,
      isProfessInvset,
      custTransLv,
      stockCustType,
      reqType,
      openOptMktCatg,
      busPrcDivId,
      accptTime,
      declareBus,
      srType: SRTYPE,
      attachment,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      invFlag,
      nonAlertblackFlag,
      riskEval,
      riskEvalTime,
      age,
      ageFlag,
      degreeFlag,
      investPrefer,
      auditors: !_.isEmpty(value) ? value.login : auditors,
    };
    this.props.updateBindingFlow(query)
      .then(() => {
        this.sendDoApproveRequest(value);
      });
  }

  // 走流程接口
  @autobind
  sendDoApproveRequest(value) {
    const {
      doApprove,
      updateBindingFlowAppId,
      queryAppList,
      location: { query, query: { pageNum, pageSize } },
    } = this.props;
    const { groupName, auditors, operate } = this.state;
    doApprove({
      itemId: updateBindingFlowAppId,
      groupName,
      auditors: !_.isEmpty(value) ? value.login : auditors,
      operate,
    }).then(() => {
      message.success('股票期权申请新建成功');
      this.setState({
        isShowModal: false,
      }, () => {
        // 新建成功，清楚新建弹框的数据
        this.props.clearProps();
        queryAppList(query, pageNum, pageSize);
      });
    });
  }

  // 更新基本信息数据
  @autobind
  handleChange(obj) {
    this.setState({ ...obj }, () => {
      const { custTransLvName } = this.state;
      if (custTransLvName && custTransLvName !== EMPTY_INFO) {
        this.resetCustTransLvErrorProps();
      }
    });
  }

  render() {
    const {
      busCustList,
      custInfo,
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      acceptOrgData,
      queryAcceptOrg,
    } = this.props;
    const {
      isShowModal,
      createButtonListData,
      customer,
      accptTime,
      busPrcDivId,
      custTransLv,
      custTransLvName,
      degreeFlag,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      attachment,
      isShowCustomerStatusError,
      customerStatusErrorMessage,
      nextApproverModal,
      nextApproverList,
      isShowCustTransLvStatusError,
      custTransLvStatusErrorMessage,
    } = this.state;
    // 客户交易级别校验
    const customerStatusErrorProps = isShowCustomerStatusError ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: customerStatusErrorMessage,
    } : null;
    // 下一步按钮
    const selfBtnGroup = (<BottonGroup
      list={createButtonListData}
      onEmitEvent={this.handleSubmit}
    />);
    const searchProps = {
      visible: nextApproverModal,
      onOk: this.validateResult,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      dataSource: nextApproverList,
      columns: approvalColumns,
      title: '选择下一审批人员',
      modalKey: 'stockApplyNextApproverModal',
      rowKey: 'login',
      searchShow: false,
    };
    return (
      <CommonModal
        title="新增股票期权评估申请"
        modalKey="stockOptionModal"
        onOk={this.handleOk}
        closeModal={this.handleCloseModal}
        afterClose={this.afterClose}
        visible={isShowModal}
        selfBtnGroup={selfBtnGroup}
        size="large"
      >
        <div className={styles.createApplyBox}>
          <div className={styles.module}>
            <InfoTitle head="基本信息" />
            <Form>
              <div className={`${styles.coloumn} ${styles.custInfo}`}>
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
                      style={{ width: 160 }}
                      onSelect={this.selectCustomer}
                      onSearch={this.searchCanApplyCustList}
                    />
                  </FormItem>
                </div>
              </div>
            </Form>
            <EditBasicInfo
              wrappedComponentRef={this.setBasicInfoFormRef}
              stockCustTypeMap={stockCustTypeMap}
              reqTypeMap={reqTypeMap}
              klqqsclbMap={klqqsclbMap}
              busDivisionMap={busDivisionMap}
              customer={customer}
              custInfo={custInfo}
              accptTime={accptTime}
              busPrcDivId={busPrcDivId}
              custTransLv={custTransLv}
              custTransLvName={custTransLvName}
              degreeFlag={degreeFlag}
              aAcctOpenTimeFlag={aAcctOpenTimeFlag}
              rzrqzqAcctFlag={rzrqzqAcctFlag}
              jrqhjyFlag={jrqhjyFlag}
              onChange={this.handleChange}
              acceptOrgData={acceptOrgData}
              queryAcceptOrg={queryAcceptOrg}
              isShowCustTransLvStatusError={isShowCustTransLvStatusError}
              custTransLvStatusErrorMessage={custTransLvStatusErrorMessage}
            />
          </div>
          <UploadFile
            fileList={[]}
            edit
            type="attachment"
            attachment={attachment}
            onEmitEvent={this.handleChange}
            needDefaultText={false}
          />
          <TableDialog {...searchProps} />
        </div>
      </CommonModal>
    );
  }
}
