/*
 * @Author: zhangjun
 * @Date: 2018-06-09 21:45:26
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-07-11 20:01:45
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Form, Radio, Select } from 'antd';

import Icon from '../common/Icon';
import logable, { logCommon } from '../../decorators/logable';
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
    // 客户类型下拉列表
    stockCustTypeList: PropTypes.array.isRequired,
    // 申请类型下拉列表
    reqTypeList: PropTypes.array.isRequired,
    // 开立期权市场类别下拉列表
    optionMarketTypeList: PropTypes.array.isRequired,
    // 业务受理营业部下拉列表
    busDivisionList: PropTypes.array.isRequired,
    // 触发父组件数据变化
    onChange: PropTypes.func.isRequired,
    // 受理时间
    accptTime: PropTypes.string,
    // 股票客户类型
    stockCustType: PropTypes.string,
    // 申请类型
    reqType: PropTypes.string,
    // 开立期权市场类别
    openOptMktCatg: PropTypes.string,
    // 受理营业部Id
    busPrcDivId: PropTypes.string,
    // 客户交易级别
    custTransLv: PropTypes.string,
    custTransLvName: PropTypes.string,
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
    // 客户交易级别校验
    isShowCustTransLvStatusError: PropTypes.bool,
    custTransLvStatusErrorMessage: PropTypes.string,
    // 新建时，业务受理营业部变化获取下一步按钮和审批人列表
    getCreateButtonList: PropTypes.func,
  }

  static defaultProps = {
    isEdit: false,
    accptTime: '',
    busPrcDivId: '',
    stockCustType: '',
    reqType: '',
    openOptMktCatg: '',
    custTransLv: '',
    custTransLvName: '',
    degreeFlag: '',
    aAcctOpenTimeFlag: '',
    rzrqzqAcctFlag: '',
    jrqhjyFlag: '',
    getCreateButtonList: _.noop,
    isShowCustTransLvStatusError: false,
    custTransLvStatusErrorMessage: '',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {};
    if (nextProps.stockCustTypeList !== prevState.stockCustTypeList) {
      newState.stockCustTypeList = nextProps.stockCustTypeList;
    }
    if (nextProps.reqTypeList !== prevState.reqTypeList) {
      newState.reqTypeList = nextProps.reqTypeList;
    }
    if (nextProps.optionMarketTypeList !== prevState.optionMarketTypeList) {
      newState.optionMarketTypeList = nextProps.optionMarketTypeList;
    }
    if (nextProps.busDivisionList !== prevState.busDivisionList) {
      newState.busDivisionList = nextProps.busDivisionList;
    }
    if (nextProps.custInfo !== prevState.custInfo) {
      newState.custInfo = nextProps.custInfo;
      newState.isSelectDisabled = _.isEmpty(nextProps.custInfo);
      // 用户是空，基本信息的数据需要清空
      if (_.isEmpty(nextProps.custInfo)) {
        newState = {
          ...newState,
          stockCustTypeList: EMPTY_LIST,
          reqTypeList: EMPTY_LIST,
          optionMarketTypeList: EMPTY_LIST,
          busDivisionList: EMPTY_LIST,
          stockCustType: '',
          reqType: '',
          openOptMktCatg: '',
          declareBus: '',
          isShowDegreePrompt: false,
          isShowInvPrompt: false,
        };
      } else {
        const {
          stockCustType,
          reqType,
          ageFlag,
          invFlag,
          custType,
        } = nextProps.custInfo;
        const isShowDegreePrompt = custType === 'per' && stockCustType === 'New' && ageFlag === 'N';
        // 个人客户，申请类型为初次申请，投资经历评估不符合要求
        const isShowInvPrompt = custType === 'per' && reqType === 'New' && invFlag === 'N';
        newState = {
          ...newState,
          isShowDegreePrompt,
          isShowInvPrompt,
        };
      }
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
        custType,
        declareBus,
      },
    } = this.props;
    // 个人客户，客户类型为新开客户,年龄条件不符合要求
    isShowDegreePrompt = isEdit && custType === 'per' && stockCustType === 'New' && ageFlag === 'N';
    // 个人客户，申请类型为初次申请，投资经历评估不符合要求
    isShowInvPrompt = isEdit && custType === 'per' && reqType === 'New' && invFlag === 'N';
    this.state = {
      // 基本信息
      custInfo: {},
      // select初始状态为禁用
      isSelectDisabled: true,
      // 股票客户类型下拉列表
      stockCustTypeList: EMPTY_LIST,
      // 申请类型下拉列表
      reqTypeList: EMPTY_LIST,
      // 开立期权市场类别下拉列表
      optionMarketTypeList: EMPTY_LIST,
      // 业务受理营业部下拉列表
      busDivisionList: EMPTY_LIST,
      // 申报事项
      declareBus: declareBus || '',
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
    const { onChange } = this.props;
    this.setState({ [name]: value }, this.checkType);
    onChange({ [name]: value });
    // 重选客户类型，需要把学历提示项清空
    if (name === 'stockCustType') {
      onChange({ degreeFlag: '' });
    }
    // 重选申请类型，需要把投资经历评估选项清空
    if (name === 'reqType') {
      onChange({
        aAcctOpenTimeFlag: '',
        rzrqzqAcctFlag: '',
        jrqhjyFlag: '',
      });
    }

    // 神策日志
    logCommon({
      type: 'DropdownSelect',
      payload: {
        name: name === 'stockCustType' ? '客户类型' : '申请类型',
        value,
      },
    });
  }

  // 检测是否是新开客户，初次申请，然后判断是否显示学历提示选项，和投资经历评估提示选项
  @autobind
  checkType() {
    const {
      custInfo: {
        invFlag,
        ageFlag,
        custType,
      },
      stockCustType,
      reqType,
    } = this.props;
    // 个人客户，客户类型为新开客户,年龄条件不符合要求
    this.setState({
      isShowDegreePrompt: custType === 'per' && stockCustType === 'New' && ageFlag === 'N',
    });
    // 个人客户，申请类型为初次申请，投资经历评估不符合要求
    this.setState({
      isShowInvPrompt: custType === 'per' && reqType === 'New' && invFlag === 'N',
    });
  }

  // 选择开立期权市场类别
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '开立期权市场类别',
      value: '$args[1]',
    },
  })
  updateOpenOptMktCatg(name, value) {
    this.setState({ [name]: value });
    this.props.onChange({ [name]: value });
  }

  // 选择业务受理营业部
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '业务受理营业部',
      value: '$args[1]',
    },
  })
  upd

  updateBusPrcDiv(name, value) {
    const {
      onChange,
      queryAcceptOrg,
      custInfo: {
        econNum,
      },
    } = this.props;
    this.setState({ busPrcDivId: value });
    onChange({ busPrcDivId: value });
    // 受理营业部变更，连带受理时间和交易级别变更
    queryAcceptOrg({
      econNum,
      acceptOrg: value,
    }).then(() => {
      const {
        isEdit,
        acceptOrgData,
        acceptOrgData: {
          accptTime,
          custTransLv,
          custTransLvName,
          busPrcDivName,
        },
        custInfo: {
          divisionName,
          openDivName,
        },
        getCreateButtonList,
      } = this.props;
      // 新建申请时，受理营业部变更需要重新获取审批人列表
      if (!isEdit) {
        getCreateButtonList({
          flowId: '',
          divisionName,
          openDivName,
          busPrcDivName,
        });
      }
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
    return !_.isEmpty(item) ? item.map(i => <Option key={i.value} value={i.value}>{i.label}</Option>, ) : null;
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
        isProfessInvsetCn,
        // 上海A股股东账号
        aAcct,
        // 开户系统
        openSys,
        // 股票客户类型
        stockCustTypeName,
        // 申请类型
        reqTypeName,
      },
      custTransLvName,
      // 受理时间
      accptTime,
      // 股票客户类型
      stockCustType,
      // 申请类型
      reqType,
      // 开立期权市场类别
      openOptMktCatg,
      // 受理营业部Id
      busPrcDivId,
      // 已提供大专及以上的学历证明材料
      degreeFlag,
      // A股账户开立时间6个月以上
      aAcctOpenTimeFlag,
      // 已开立融资融券账户
      rzrqzqAcctFlag,
      // 已提供金融期货交易证明
      jrqhjyFlag,
      // 客户交易级别校验
      isShowCustTransLvStatusError,
      custTransLvStatusErrorMessage,
    } = this.props;
    const {
      isSelectDisabled,
      stockCustTypeList,
      optionMarketTypeList,
      reqTypeList,
      busDivisionList,
      declareBus,
      isShowDegreePrompt,
      isShowInvPrompt,
    } = this.state;

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
                  {isProfessInvsetCn || EMPTY_INFO}
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
                  {openSys || EMPTY_INFO}
                </FormItem>
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
                    ...this.getErrorMessage(isShowCustTransLvStatusError,
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
              <div className={styles.value}>
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
                            { this.getSelectOption(stockCustTypeList) }
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
                              { this.getSelectOption(reqTypeList) }
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
                        { this.getSelectOption(optionMarketTypeList) }
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
                  {
                    getFieldDecorator('busPrcDivId', {
                      initialValue: busPrcDivId || '',
                    })(
                      <Select
                        disabled={isSelectDisabled}
                        onChange={key => this.updateBusPrcDiv('busPrcDivId', key)}
                      >
                        { this.getSelectOption(busDivisionList) }
                      </Select>,
                    )
                  }
                </FormItem>
              </div>
            </div>
            <div className={styles.coloumn}>
              <div className={styles.label}>
                受理时间
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <FormItem>
                  {(accptTime && accptTime.slice(0, 10)) || EMPTY_INFO}
                </FormItem>
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.label}>
                <i className={styles.isRequired}>*</i>
                申报事项
                <span className={styles.colon}>:</span>
              </div>
              <div className={styles.value}>
                <div className={styles.applyContent}>
                  <FormItem>
                    {
                      getFieldDecorator('declareBus', {
                        rules: [{
                          required: true, message: '申报事项不能为空',
                        }, {
                          max: 200, message: '最大长度不能超过200个字符',
                        }],
                        initialValue: declareBus,
                      })(
                        <textarea
                          disabled={isSelectDisabled}
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
            isShowDegreePrompt
              ? (
                <div className={styles.promptBox}>
                  <div className={styles.head}>
                    <Icon type="jingshi" className={styles.promptIcon} />
                    <span className={styles.title}>客户的年龄条件不符合要求，请确认客户是否满足以下条件：</span>
                  </div>
                  <div className={styles.row}>
                    <div className={`${styles.label} ${styles.labelDegree}`}>
                      <i className={styles.isRequired}>*</i>
                      已提供大专及以上的学历证明材料
                      <span className={styles.colon}>:</span>
                    </div>
                    <div className={styles.value}>
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
            isShowInvPrompt
              ? (
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
                      <div className={styles.value}>
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
                      <div className={styles.value}>
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
                      <div className={styles.value}>
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
