/*
 * @Author: zhangjun
 * @Date: 2018-06-15 09:08:24
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-19 10:10:46
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import InfoTitle from '../common/InfoTitle';
import EditBasicInfo from './EditBasicInfo';
import AssessTable from './AssessTable';
import CommonUpload from '../common/biz/CommonUpload';
import Approval from '../permission/Approval';
import ApprovalRecord from '../permission/ApprovalRecord';

import styles from './applyEditForm.less';

const EMPTY_INFO = '--';

export default class ApplyEditForm extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 详情数据
    detailInfo: PropTypes.object.isRequired,
    // 附件列表
    attachmentList: PropTypes.array,
    // 客户类型下拉列表
    stockCustTypeMap: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeMap: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    klqqsclbMap: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionMap: PropTypes.array.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
  }
  static defaultProps = {
    attachmentList: [],
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.detailInfo !== prevState.detailInfo) {
      return {
        detailInfo: nextProps.detailInfo,
        custType: nextProps.detailInfo.custType,
        custName: nextProps.detailInfo.custName,
        custTransLv: nextProps.detailInfo.custTransLv,
        custTransLvName: nextProps.detailInfo.custTransLvName,
        stockCustType: nextProps.detailInfo.stockCustType,
        reqType: nextProps.detailInfo.reqType,
        openOptMktCatg: nextProps.detailInfo.detailInfo,
        busPrcDivId: nextProps.detailInfo.busPrcDivId,
        accptTime: nextProps.detailInfo.accptTime,
        declareBus: nextProps.detailInfo.declareBus,
        degreeFlag: nextProps.detailInfo.degreeFlag,
        aAcctOpenTimeFlag: nextProps.detailInfo.aAcctOpenTimeFlag,
        rzrqzqAcctFlag: nextProps.detailInfo.rzrqzqAcctFlag,
        jrqhjyFlag: nextProps.detailInfo.jrqhjyFlag,
        attachment: nextProps.detailInfo.attachment,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      // 详情信息
      detailInfo: {},
      // 是否是编辑页面
      isEdit: true,
      // 审批意见
      suggestion: '',
      // 下一步审批人列表
      nextApproverList: [],
      // 审批人弹窗
      nextApproverModal: false,
      // 客户信息
      customer: {},
      // 客户类型
      custType: '',
      // 新建时 选择的该客户姓名
      custName: '',
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
      attachment: '',
      // 必填项校验错误提示信息
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

  // 更新基本信息数据
  @autobind
  handleEmitEvent(name, value) {
    this.setState({ [name]: value }, () => {
      if (value) {
        switch (name) {
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

  // 修改审批意见
  @autobind
  changeTextValue(name, value) {
    this.setState({ suggestion: value });
  }
  render() {
    const {
      detailInfo,
      detailInfo: {
        custId,
        custName,
        id,
        empId,
        empName,
        orgName,
        createTime,
        statusDesc,
        custType,
        workflowHistoryBeans,
        currentApproval,
        currentNodeName,
      },
      attachmentList,
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      acceptOrgData,
      queryAcceptOrg,
    } = this.props;
    const {
      isEdit,
      suggestion,
      customer,
      accptTime,
      busPrcDivId,
      custTransLv,
      custTransLvName,
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
    if (_.isEmpty(this.props.detailInfo)) {
      return null;
    }
    const custInfo = `${custName}(${custId})`;
    // 拟稿人信息
    const drafter = `${orgName} - ${empName} (${empId})`;
    // 判断是否是个人客户
    const isPerCustType = custType === 'per';
    return (
      <div className={styles.applyEditForm}>
        <div className={styles.inner}>
          <div className={styles.innerWrap}>
            <h1 className={styles.title}>编号{id}</h1>
            <div className={styles.module}>
              <div className={styles.coloumn}>
                <div className={styles.label}>
                  <i className={styles.isRequired}>*</i>
                  客户
                  <span className={styles.colon}>:</span>
                </div>
                <div className={styles.value}>
                  { custInfo || EMPTY_INFO }
                </div>
              </div>
              <EditBasicInfo
                isEdit={isEdit}
                stockCustTypeMap={stockCustTypeMap}
                reqTypeMap={reqTypeMap}
                klqqsclbMap={klqqsclbMap}
                busDivisionMap={busDivisionMap}
                customer={customer}
                custInfo={detailInfo}
                accptTime={accptTime}
                busPrcDivId={busPrcDivId}
                custTransLv={custTransLv}
                custTransLvName={custTransLvName}
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
            <div className={styles.module}>
              <InfoTitle head="适当性评估表" />
              {
                isPerCustType ?
                  <AssessTable data={detailInfo} />
                : null
              }
            </div>
            <div className={styles.module}>
              <InfoTitle head="拟稿信息" />
              <div className={styles.modContent}>
                <ul className={styles.propertyList}>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        拟稿人
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {drafter || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        申请请时间
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {createTime || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.coloumn}>
                      <div className={styles.label}>
                        状态
                        <span className={styles.colon}>:</span>
                      </div>
                      <div className={styles.value}>
                        {statusDesc || EMPTY_INFO}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.module}>
              <CommonUpload
                attachmentList={attachmentList}
                wrapClassName={styles.stockAttachmentList}
                edit
              />
            </div>
            <div className={styles.module}>
              <Approval
                head="审批"
                type="suggestion"
                textValue={suggestion}
                onEmitEvent={this.changeTextValue}
              />
            </div>
            <div id="approvalRecord_module" className={styles.module}>
              <ApprovalRecord
                head="审批记录"
                info={workflowHistoryBeans}
                currentApproval={currentApproval}
                currentNodeName={currentNodeName}
                statusType="ready"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
