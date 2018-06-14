/*
 * @Author: zhangjun
 * @Date: 2018-06-09 21:45:26
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-14 22:36:00
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Form, Radio } from 'antd';

import Select from '../common/Select';
import commonConfirm from '../common/confirm_';
import Icon from '../common/Icon';
import styles from './EditBasicInfo.less';

const FormItem = Form.Item;
const create = Form.create;
const RadioGroup = Radio.Group;
const EMPTY_INFO = '--';
// const EMPTY_OBJECT = {};
const EMPTY_LIST = [];

@create()
export default class EditBasicInfo extends PureComponent {
  static propTypes = {
    // 客户基本信息
    custInfo: PropTypes.object.isRequired,
    // 客户Id和客户名称信息
    customer: PropTypes.object.isRequired,
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
    // 流程Id
    flowId: PropTypes.string.isRequired,
    // select选择后触发父组件数据变化
    onEmitEvent: PropTypes.func.isRequired,
    // 受理时间
    accptTime: PropTypes.string.isRequired,
    // 客户交易级别
    custTransLv: PropTypes.string.isRequired,
    custTransLvName: PropTypes.string.isRequired,
    // 必填项校验错误提示信息
    // 客户交易级别校验
    isShowCustTransLvStatusError: PropTypes.bool.isRequired,
    custTransLvStatusErrorMessage: PropTypes.string.isRequired,
    // 股票申请客户类型校验
    isShowStockCustTypeStatusError: PropTypes.bool.isRequired,
    stockCustTypeStatusErrorMessage: PropTypes.string.isRequired,
    // 申请类型校验
    isShowReqTypeStatusError: PropTypes.bool.isRequired,
    reqTypeStatusErrorMessage: PropTypes.string.isRequired,
    // 开立期权市场类别校验
    isShowOpenOptMktCatgStatusError: PropTypes.bool.isRequired,
    openOptMktCatgStatusErrorMessage: PropTypes.string.isRequired,
    // 申报事项校验
    isShowDeclareBusStatusError: PropTypes.bool.isRequired,
    declareBusStatusErrorMessage: PropTypes.string.isRequired,
    // 已提供大专及以上的学历证明材料校验
    isShowDegreeFlagStatusError: PropTypes.bool.isRequired,
    degreeFlagStatusErrorMessage: PropTypes.string.isRequired,
    // A股账户开立时间6个月以上校验
    isShowAAcctOpenTimeFlagStatusError: PropTypes.bool.isRequired,
    aAcctOpenTimeFlagStatusErrorMessage: PropTypes.string.isRequired,
    // 已开立融资融券账户校验
    isShowRzrqzqAcctFlagStatusError: PropTypes.bool.isRequired,
    rzrqzqAcctFlagStatusErrorMessage: PropTypes.string.isRequired,
    // 已提供金融期货交易证明校验
    isShowJrqhjyFlagStatusError: PropTypes.bool.isRequired,
    jrqhjyFlagStatusErrorMessage: PropTypes.string.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps === prevState) {
      return null;
    }
    return {
      stockCustTypeMap: nextProps.stockCustTypeMap,
      reqTypeMap: nextProps.reqTypeMap,
      klqqsclbMap: nextProps.klqqsclbMap,
      busDivisionMap: nextProps.busDivisionMap,
      // stockCustType: nextProps.stockCustType,
      // reqType: nextProps.reqType,
      // openOptMktCatg: nextProps.openOptMktCatg,
      // busPrcDivId: nextProps.busPrcDivId,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      // 股票客户类型
      stockCustType: '',
      // 申请类型
      reqType: '',
      // 开立期权市场类别
      openOptMktCatg: '',
      // 业务受理营业部
      busPrcDivId: '',
      // 股票客户类型下拉列表
      stockCustTypeMap: EMPTY_LIST,
      // 申请类型下拉列表
      reqTypeMap: EMPTY_LIST,
      // 开立期权市场类别下拉列表
      klqqsclbMap: EMPTY_LIST,
      // 业务受理营业部下拉列表
      busDivisionMap: EMPTY_LIST,
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
      // 是否显示学历提示，默认是false
      isShowDegreePrompt: false,
      // 是否显示投资经历提示，默认是false
      isShowInvPrompt: false,
    };
  }

  // 客户类型,申请类型 select选择后设置value
  @autobind
  updateSelect(name, value) {
    this.setState({ [name]: value }, this.checkType);
    this.props.onEmitEvent(name, value);
  }

  // 检测是否是新开客户，初次申请，然后判断是否显示学历提示选项，和投资经历评估提示选项
  @autobind
  checkType() {
    const {
      custInfo: {
        invFlag,
        ageFlag,
      },
    } = this.props;
    const {
      stockCustType,
      reqType,
    } = this.state;
    // 新开客户，初次申请
    if (stockCustType === 'New' && reqType === 'New') {
      if (ageFlag === 'N') {
        commonConfirm({
          content: '客户的年龄条件不符合要求，请确认客户是否满足以下条件：',
        });
        this.setState({ isShowDegreePrompt: true });
      }
      if (invFlag === 'N') {
        commonConfirm({
          content: '客户在我公司投资经历评估不符合要求，请确认客户是否满足以下条件：',
        });
        this.setState({ isShowInvPrompt: true });
      }
    }
  }

  // 选择开立期权市场类别
  @autobind
  updateOpenOptMktCatg(name, value) {
    this.setState({ [name]: value });
    this.props.onEmitEvent(name, value);
  }

  // 选择业务受理营业部
  @autobind
  updateBusPrcDiv(name, value) {
    const {
      onEmitEvent,
      queryAcceptOrg,
      customer: {
        brokerNumber,
      },
      acceptOrgData,
      acceptOrgData: {
        accptTime,
        custTransLv,
        custTransLvName,
      },
    } = this.props;
    this.setState({ busPrcDivId: value });
    onEmitEvent('busPrcDivId', value);
    // 受理营业部变更，连带受理时间和交易级别变更
    queryAcceptOrg({
      econNum: brokerNumber,
      acceptOrg: value,
    });
    if (!_.isEmpty(acceptOrgData)) {
      onEmitEvent('accptTime', accptTime);
      onEmitEvent('custTransLv', custTransLv);
      onEmitEvent('custTransLvName', custTransLvName);
    }
  }

  // 申报事项改变
  @autobind
  changeDeclareBus(e) {
    const value = e.target.value;
    this.setState({ declareBus: value });
    this.props.onEmitEvent('declareBus', value);
  }

  // 提示选择变化
  @autobind
  changePrompt(e, name) {
    const value = e.target.value;
    this.setState({ [name]: value });
    this.props.onEmitEvent(name, value);
  }

  // 必填项校验,显示错误信息
  @autobind
  renderErrorMessage(status, message) {
    return status ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: message,
    } : null;
  }

  render() {
    const {
      // 选择客户带出的客户基本信息
      custInfo,
      custInfo: {
        divisionName,
        openDivName,
        idTypeName,
        idNum,
        isProfessInvset,
        aAcct,
        openSysName,
        busPrcDivId,
      },
      // 受理时间
      accptTime,
      // 客户交易级别
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
    } = this.props;
    const {
      stockCustType,
      reqType,
      openOptMktCatg,
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      declareBus,
      degreeFlag,
      aAcctOpenTimeFlag,
      rzrqzqAcctFlag,
      jrqhjyFlag,
      isShowDegreePrompt,
      isShowInvPrompt,
    } = this.state;
    let isProfessInvsetor = '';
    if (isProfessInvset) {
      isProfessInvsetor = isProfessInvset === 'Y' ? '是' : '否';
    }
    const isSelectDisabled = _.isEmpty(custInfo);

    return (
      <div className={styles.editBasicInfo}>
        <Form>
          <div className={styles.basicInfoWrapper}>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                所属营业部
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {divisionName || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                开户营业部
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {openDivName || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                证件类型
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {idTypeName || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                证件号码
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {idNum || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                是否专业投资者
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {isProfessInvsetor || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                上海A股账号
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {aAcct || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                开户系统
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {openSysName || EMPTY_INFO}
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                客户交易级别
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem
                  {
                  ...this.renderErrorMessage(isShowCustTransLvStatusError,
                    custTransLvStatusErrorMessage)
                  }
                >
                  {custTransLvName || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
          </div>
          <div className={styles.basicInfo}>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                客户类型
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value} >
                <FormItem
                  {
                  ...this.renderErrorMessage(isShowStockCustTypeStatusError,
                    stockCustTypeStatusErrorMessage)
                  }
                >
                  <Select
                    name="stockCustType"
                    data={stockCustTypeMap}
                    disabled={isSelectDisabled}
                    onChange={this.updateSelect}
                    value={stockCustType || '请选择'}
                  />
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                申请类型
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem
                  {
                  ...this.renderErrorMessage(isShowReqTypeStatusError,
                    reqTypeStatusErrorMessage)
                  }
                >
                  <Select
                    name="reqType"
                    data={reqTypeMap}
                    disabled={isSelectDisabled}
                    onChange={this.updateSelect}
                    value={reqType || '请选择'}
                  />
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                开立期权市场类别
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem
                  {
                  ...this.renderErrorMessage(isShowOpenOptMktCatgStatusError,
                    openOptMktCatgStatusErrorMessage)
                  }
                >
                  <Select
                    name="openOptMktCatg"
                    data={klqqsclbMap}
                    disabled={isSelectDisabled}
                    onChange={this.updateOpenOptMktCatg}
                    value={openOptMktCatg || '请选择'}
                  />
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                业务受理营业部
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  <Select
                    name="busPrcDiv"
                    data={busDivisionMap}
                    disabled={isSelectDisabled}
                    onChange={this.updateBusPrcDiv}
                    value={busPrcDivId || '请选择'}
                  />
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                受理时间
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value} >
                <FormItem>
                  {accptTime || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                申报事项
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value} >
                <div className={styles.applyContent}>
                  <FormItem
                    {
                    ...this.renderErrorMessage(isShowDeclareBusStatusError,
                      declareBusStatusErrorMessage)
                    }
                  >
                    <textarea
                      className={styles.applyTextarea}
                      value={declareBus}
                      onChange={this.changeDeclareBus}
                    />
                  </FormItem>
                </div>
              </div>
            </div>
          </div>
          {
            isShowDegreePrompt ?
            (
              <div className={styles.promptBox}>
                <div className={styles.head}>
                  <Icon type="jingshi" className={styles.promptIcon} />
                  <span className={styles.title}>客户在我公司投资经历评估不符合要求，请确认客户是否满足以下条件：</span>
                </div>
                <div className={styles.row}>
                  <div className={`${styles.label} ${styles.labelDegree}`}>
                    <i className={styles.isRequired}>*</i>
                      已提供大专及以上的学历证明材料
                    <span className={styles.colon}>:</span>
                  </div>
                  <div className={styles.value} >
                    <FormItem
                      {
                      ...this.renderErrorMessage(isShowDegreeFlagStatusError,
                        degreeFlagStatusErrorMessage)
                      }
                    >
                      <div className={styles.radioBox}>
                        <RadioGroup onChange={e => this.changePrompt(e, 'degreeFlag')} value={degreeFlag}>
                          <Radio value="Y">是</Radio>
                          <Radio value="N">否</Radio>
                        </RadioGroup>
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>
            ) : null
          }
          {
            isShowInvPrompt ?
            (
              <div className={styles.promptBox}>
                <div className={styles.head}>
                  <Icon type="jingshi" className={styles.promptIcon} />
                  <span className={styles.title}>客户在我公司投资经历评估不符合要求，请确认客户是否满足以下条件：</span>
                </div>
                <div className={styles.options}>
                  <div className={styles.coloumn}>
                    <div className={`${styles.label} ${styles.labelPrompt}`}>
                      <i className={styles.isRequired}>*</i>
                      A股账户开立时间6个月以上
                      <span className={styles.colon}>:</span>
                    </div>
                    <div className={styles.value} >
                      <FormItem
                        {
                        ...this.renderErrorMessage(isShowAAcctOpenTimeFlagStatusError,
                          aAcctOpenTimeFlagStatusErrorMessage)
                        }
                      >
                        <div className={styles.radioBox}>
                          <RadioGroup onChange={e => this.changePrompt(e, 'aAcctOpenTimeFlag')} value={aAcctOpenTimeFlag}>
                            <Radio value="Y">是</Radio>
                            <Radio value="N">否</Radio>
                          </RadioGroup>
                        </div>
                      </FormItem>
                    </div>
                  </div>
                  <div className={styles.coloumn}>
                    <div className={`${styles.label} ${styles.labelPrompt}`}>
                      <i className={styles.isRequired}>*</i>
                      已开立融资融券账户
                      <span className={styles.colon}>:</span>
                    </div>
                    <div className={styles.value} >
                      <FormItem
                        {
                        ...this.renderErrorMessage(isShowRzrqzqAcctFlagStatusError,
                          rzrqzqAcctFlagStatusErrorMessage)
                        }
                      >
                        <div className={styles.radioBox}>
                          <RadioGroup onChange={e => this.changePrompt(e, 'rzrqzqAcctFlag')} value={rzrqzqAcctFlag}>
                            <Radio value="Y">是</Radio>
                            <Radio value="N">否</Radio>
                          </RadioGroup>
                        </div>
                      </FormItem>
                    </div>
                  </div>
                  <div className={styles.coloumn}>
                    <div className={`${styles.label} ${styles.labelPrompt}`}>
                      <i className={styles.isRequired}>*</i>
                      已提供金融期货交易证明
                      <span className={styles.colon}>:</span>
                    </div>
                    <div className={styles.value} >
                      <FormItem
                        {
                        ...this.renderErrorMessage(isShowJrqhjyFlagStatusError,
                          jrqhjyFlagStatusErrorMessage)
                        }
                      >
                        <div className={styles.radioBox}>
                          <RadioGroup onChange={e => this.changePrompt(e, 'jrqhjyFlag')} value={jrqhjyFlag}>
                            <Radio value="Y">是</Radio>
                            <Radio value="N">否</Radio>
                          </RadioGroup>
                        </div>
                      </FormItem>
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          }
        </Form>
      </div>
    );
  }
}
