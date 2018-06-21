/*
 * @Author: zhangjun
 * @Date: 2018-06-09 21:45:26
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-06-21 08:59:02
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Form, Radio, Select } from 'antd';

import Icon from '../common/Icon';
import styles from './editBasicInfo.less';

const FormItem = Form.Item;
const create = Form.create;
const RadioGroup = Radio.Group;
const EMPTY_INFO = '--';
const Option = Select.Option;
const EMPTY_LIST = [];

@create()
export default class EditBasicInfo extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    // 是否是编辑页面
    isEdit: PropTypes.bool,
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
    // 触发父组件数据变化
    onChange: PropTypes.func.isRequired,
    // 受理时间
    accptTime: PropTypes.string.isRequired,
    // 受理营业部Id
    busPrcDivId: PropTypes.string.isRequired,
    // 客户交易级别
    custTransLv: PropTypes.string.isRequired,
    custTransLvName: PropTypes.string.isRequired,
    // 受理营业部变更
    acceptOrgData: PropTypes.object.isRequired,
    queryAcceptOrg: PropTypes.func.isRequired,
    // 已提供大专及以上的学历证明材料
    degreeFlag: PropTypes.string,
    // A股账户开立时间6个月以上
    aAcctOpenTimeFlag: PropTypes.string,
    // 已开立融资融券账户
    rzrqzqAcctFlag: PropTypes.string,
    // 已提供金融期货交易证明
    jrqhjyFlag: PropTypes.string,
  }

  static defaultProps = {
    isEdit: false,
    degreeFlag: '',
    aAcctOpenTimeFlag: '',
    rzrqzqAcctFlag: '',
    jrqhjyFlag: '',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {};
    if (nextProps.stockCustTypeMap !== prevState.stockCustTypeMap) {
      newState.stockCustTypeMap = nextProps.stockCustTypeMap;
    }
    if (nextProps.reqTypeMap !== prevState.reqTypeMap) {
      newState.reqTypeMap = nextProps.reqTypeMap;
    }
    if (nextProps.klqqsclbMap !== prevState.klqqsclbMap) {
      newState.klqqsclbMap = nextProps.klqqsclbMap;
    }
    if (nextProps.busDivisionMap !== prevState.busDivisionMap) {
      newState.busDivisionMap = nextProps.busDivisionMap;
    }
    if (nextProps.custInfo !== prevState.custInfo) {
      newState.custInfo = nextProps.custInfo;
      newState.isSelectDisabled = _.isEmpty(nextProps.custInfo);
    }
    return newState;
  }

  constructor(props) {
    super(props);
    let isShowDegreePrompt = false;
    let isShowInvPrompt = false;
    const {
      isEdit,
      custInfo: {
        stockCustType,
        reqType,
        ageFlag,
        invFlag,
      },
    } = this.props;
    if (isEdit && stockCustType === 'New' && reqType === 'New') {
      if (ageFlag === 'N') {
        isShowDegreePrompt = true;
      }
      if (invFlag === 'N') {
        isShowInvPrompt = true;
      }
    }
    this.state = {
      // 基本信息
      custInfo: {},
      // select初始状态为禁用
      isSelectDisabled: true,
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
      // 是否显示学历提示，默认是false
      isShowDegreePrompt,
      // 是否显示投资经历提示，默认是false
      isShowInvPrompt,
    };
  }

  @autobind
  getForm() {
    return this.props.form;
  }

  // 客户类型,申请类型 select选择后设置value
  @autobind
  updateSelect(name, value) {
    this.setState({ [name]: value }, this.checkType);
    this.props.onChange({ [name]: value });
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
        this.setState({ isShowDegreePrompt: true });
      }
      if (invFlag === 'N') {
        this.setState({ isShowInvPrompt: true });
      }
    }
  }

  // 选择开立期权市场类别
  @autobind
  updateOpenOptMktCatg(name, value) {
    this.setState({ [name]: value });
    this.props.onChange({ [name]: value });
  }

  // 选择业务受理营业部
  @autobind
  updateBusPrcDiv(name, value) {
    const {
      onChange,
      queryAcceptOrg,
      customer: {
        brokerNumber,
      },
    } = this.props;
    this.setState({ busPrcDivId: value });
    onChange({ busPrcDivId: value });
    // 受理营业部变更，连带受理时间和交易级别变更
    queryAcceptOrg({
      econNum: brokerNumber,
      acceptOrg: value,
    }).then(() => {
      const {
        acceptOrgData,
        acceptOrgData: {
          accptTime,
          custTransLv,
          custTransLvName,
        },
      } = this.props;
      if (!_.isEmpty(acceptOrgData)) {
        onChange({
          accptTime,
          custTransLv,
          custTransLvName,
        });
      }
    });
  }

  // 申报事项改变
  @autobind
  changeDeclareBus(e) {
    const value = e.target.value;
    this.setState({ declareBus: value });
    this.props.onChange({ declareBus: value });
  }

  // 提示选择变化
  @autobind
  changePrompt(e, name) {
    const value = e.target.value;
    this.setState({ [name]: value });
    this.props.onChange({ [name]: value });
  }

  // 必填项校验,显示错误信息
  @autobind
  getErrorMessage(status, message) {
    return status ? {
      hasFeedback: false,
      validateStatus: 'error',
      help: message,
    } : null;
  }

  // 生产select的option
  @autobind
  getSelectOption(item) {
    return !_.isEmpty(item) ? item.map(i =>
      <Option key={i.value} value={i.value}>{i.label}</Option>,
    ) : null;
  }

  render() {
    const {
      form: {
        getFieldDecorator,
      },
      // 是否是编辑页面
      isEdit,
      // 选择客户带出的客户基本信息
      custInfo: {
        divisionName,
        openDivName,
        idTypeName,
        // 证件号码
        idNum,
        // 是否专业投资者
        isProfessInvset,
        // 上海A股股东账号
        aAcct,
        // 开户系统
        openSysName,
        // 股票客户类型
        stockCustTypeName,
        // 申请类型
        reqTypeName,
      },
      // 受理时间
      accptTime,
      // 受理营业部Id
      busPrcDivId,
      // 客户交易级别
      custTransLvName,
      // 已提供大专及以上的学历证明材料
      degreeFlag,
      // A股账户开立时间6个月以上
      aAcctOpenTimeFlag,
      // 已开立融资融券账户
      rzrqzqAcctFlag,
      // 已提供金融期货交易证明
      jrqhjyFlag,
    } = this.props;
    const {
      isSelectDisabled,
      stockCustType,
      reqType,
      openOptMktCatg,
      stockCustTypeMap,
      reqTypeMap,
      klqqsclbMap,
      busDivisionMap,
      declareBus,
      isShowDegreePrompt,
      isShowInvPrompt,
    } = this.state;
    let isProfessInvsetor = '';
    if (isProfessInvset) {
      isProfessInvsetor = isProfessInvset === 'Y' ? '是' : '否';
    }
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
                <FormItem>
                  {divisionName || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                开户营业部
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {openDivName || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                证件类型
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {idTypeName || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                证件号码
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {idNum || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                是否专业投资者
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {isProfessInvsetor || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                上海A股账号
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {aAcct || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                开户系统
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {openSysName || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                客户交易级别
                <span className={styles.colon}>:</span>
              </div>
              <div className={`${styles.value} ${styles.custTransLv}`}>
                <FormItem>
                  {
                    getFieldDecorator('custTransLvName', {
                      rules: [{
                        required: true, message: '客户交易级别不能为空',
                      }],
                      initialValue: custTransLvName || EMPTY_INFO,
                    })(
                      <input readOnly />,
                    )
                  }
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
                {
                  isEdit ? (
                    <FormItem>
                      {stockCustTypeName || EMPTY_INFO}
                    </FormItem>
                    )
                  : (
                    <FormItem>
                      {
                        getFieldDecorator('stockCustType', {
                          rules: [{
                            required: true, message: '请选择客户类型',
                          }],
                          initialValue: stockCustType,
                        })(
                          <Select
                            disabled={isSelectDisabled}
                            onChange={key => this.updateSelect('stockCustType', key)}
                          >
                            { this.getSelectOption(stockCustTypeMap) }
                          </Select>,
                        )
                      }
                    </FormItem>
                  )
                }
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                申请类型
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                {
                    isEdit ? (
                      <FormItem>
                        {reqTypeName || EMPTY_INFO}
                      </FormItem>
                    )
                    : (
                      <FormItem>
                        {
                          getFieldDecorator('reqType', {
                            rules: [{
                              required: true, message: '请选择申请类型',
                            }],
                            initialValue: reqType,
                          })(
                            <Select
                              disabled={isSelectDisabled}
                              onChange={key => this.updateSelect('reqType', key)}
                            >
                              { this.getSelectOption(reqTypeMap) }
                            </Select>,
                          )
                        }
                      </FormItem>
                    )
                }
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                开立期权市场类别
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {
                    getFieldDecorator('openOptMktCatg', {
                      rules: [{
                        required: true, message: '请选择开立期权市场类别',
                      }],
                      initialValue: openOptMktCatg,
                    })(
                      <Select
                        disabled={isSelectDisabled}
                        onChange={key => this.updateOpenOptMktCatg('openOptMktCatg', key)}
                      >
                        { this.getSelectOption(klqqsclbMap) }
                      </Select>,
                    )
                  }
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
                    disabled={isSelectDisabled}
                    onChange={key => this.updateBusPrcDiv('busPrcDivId', key)}
                    value={busPrcDivId}
                  >
                    { this.getSelectOption(busDivisionMap) }
                  </Select>
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
                  <FormItem>
                    {
                      getFieldDecorator('declareBus', {
                        rules: [{
                          required: true, message: '申报事项不能为空',
                        }],
                        initialValue: declareBus,
                      })(
                        <textarea
                          className={styles.applyTextarea}
                          onChange={this.changeDeclareBus}
                        />,
                      )
                    }
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
                    <FormItem>
                      {
                        getFieldDecorator('degreeFlag', {
                          rules: [{
                            required: true, message: '请选择已提供大专及以上的学历证明材料',
                          }],
                          initialValue: degreeFlag,
                        })(
                          <RadioGroup onChange={e => this.changePrompt(e, 'degreeFlag')}>
                            <Radio value="Y">是</Radio>
                            <Radio value="N">否</Radio>
                          </RadioGroup>,
                        )
                      }
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
                      <FormItem>
                        {
                          getFieldDecorator('aAcctOpenTimeFlag', {
                            rules: [{
                              required: true, message: '请选择A股账户开立时间6个月以上',
                            }],
                            initialValue: aAcctOpenTimeFlag,
                          })(
                            <RadioGroup onChange={e => this.changePrompt(e, 'aAcctOpenTimeFlag')}>
                              <Radio value="Y">是</Radio>
                              <Radio value="N">否</Radio>
                            </RadioGroup>,
                          )
                        }
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
                      <FormItem>
                        {
                          getFieldDecorator('rzrqzqAcctFlag', {
                            rules: [{
                              required: true, message: '请选择已开立融资融券账户',
                            }],
                            initialValue: rzrqzqAcctFlag,
                          })(
                            <RadioGroup onChange={e => this.changePrompt(e, 'rzrqzqAcctFlag')}>
                              <Radio value="Y">是</Radio>
                              <Radio value="N">否</Radio>
                            </RadioGroup>,
                          )
                        }
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
                      <FormItem>
                        {
                          getFieldDecorator('jrqhjyFlag', {
                            rules: [{
                              required: true, message: '请选择已提供金融期货交易证明',
                            }],
                            initialValue: jrqhjyFlag,
                          })(
                            <RadioGroup onChange={e => this.changePrompt(e, 'jrqhjyFlag')}>
                              <Radio value="Y">是</Radio>
                              <Radio value="N">否</Radio>
                            </RadioGroup>,
                          )
                        }
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
