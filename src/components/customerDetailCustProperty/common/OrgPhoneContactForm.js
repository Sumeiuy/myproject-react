/*
 * @Author: sunweibin
 * @Date: 2018-11-27 20:29:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 10:17:45
 * @description 添加机构客户电话信息Form
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import {
  Row, Col, Select, Input, Form
} from 'antd';

import { regxp } from '../../../helper';
import logable from '../../../decorators/logable';
import { isCreateContact } from './utils';
import { FORM_STYLE, SOURCE_CODE } from './config';
import styles from '../contactForm.less';

const Option = Select.Option;
const FormItem = Form.Item;
const create = Form.create;

@create()
export default class OrgPhoneContactForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    // 操作类型
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    // 数据
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  static contextTypes = {
    cust360Dict: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { action, data } = props;
    const isCreate = isCreateContact(action);
    const {
      name = '',
      certificateTypeCode = '',
      cretificateNo = '',
      dutyCode = '',
      contactTypeCode = '',
      sourceCode = '',
      mobile = {},
      landline = {},
      email = {},
    } = data;
    this.state = {
      // 是否主要,只传N
      // eslint-disable-next-line
      mainFlag: 'N',
      // 姓名
      name: isCreate ? '' : name,
      // 证件类型
      cretificateType: isCreate ? '' : certificateTypeCode,
      // 证件号码
      cretificateNumber: isCreate ? '' : cretificateNo,
      // 职务
      dutyCode: isCreate ? '' : dutyCode,
      // 联系人类型
      contacterTypeCode: isCreate ? '' : contactTypeCode,
      // 手机号码, 因为ecif那边传递过来修改需要传递手机号码为一个对象
      mobileValue: isCreate ? '' : this.getContactValue(mobile),
      // 固定号码，因为ecif那边传递过来修改需要传递固定电话为一个对象
      landlineValue: isCreate ? '' : this.getContactValue(landline),
      // 电子邮件，因为ecif那边传递过来修改需要传递电子邮件为一个对象
      emailValue: isCreate ? '' : this.getContactValue(email),
      // 来源
      sourceCode: isCreate ? SOURCE_CODE.finance : sourceCode,
    };
  }

  // 因为手机、固定电话、电子邮件为对象，没有相关的值
  // 则对象为null，因此此处需要针对该种情况做特殊处理
  @autobind
  getContactValue(contact) {
    if (!_.isEmpty(contact) && _.hasIn(contact, 'value')) {
      return contact.value;
    }
    return '';
  }

  // 手机号码
  @autobind
  handlePhoneChange(e) {
    // 因为手机号码在新增和修改的时候均需要传递id和contactWayCode,
    // 因为ecif那边针对手机号码、固定号码、电子邮箱分别有一个ID和code值来控制
    // 新增的时候传空字符串
    const { mobile } = this.state;
    this.setState({
      mobile: {
        id: '',
        contactWayCode: '',
        ...mobile,
        value: e.target.value,
      },
    }, this.saveChange);
  }

  // 固定号码
  @autobind
  handleLandLineChange(e) {
    // 因为固定号码在新增和修改的时候均需要传递id和contactWayCode,
    // 因为ecif那边针对手机号码、固定号码、电子邮箱分别有一个ID和code值来控制
    // 新增的时候传空字符串
    const { landline } = this.state;
    this.setState({
      landline: {
        id: '',
        contactWayCode: '',
        ...landline,
        value: e.target.value,
      },
    }, this.saveChange);
  }

  // 电子邮箱
  @autobind
  handleEmailChange(e) {
    // 因为电子邮箱在新增和修改的时候均需要传递id和contactWayCode,
    // 因为ecif那边针对手机号码、固定号码、电子邮箱分别有一个ID和code值来控制
    // 新增的时候传空字符串
    const { email } = this.state;
    this.setState({
      email: {
        id: '',
        contactWayCode: '',
        ...email,
        value: e.target.value,
      },
    }, this.saveChange);
  }

  // 职务下拉
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '职务',
      value: '$args[0]',
    },
  })
  handleDutyChange() {
    // 日志记录用
  }

  // 联系人类型下拉
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '联系人类型',
      value: '$args[0]',
    },
  })
  handleLinkManChange() {
    // 日志记录用
  }

  @autobind
  renderOption(option) {
    return (<Option key={option.key} value={option.key}>{option.value}</Option>);
  }

  // 渲染机构客户的证件类型下拉
  @autobind
  renderCretificateOption() {
    const { cust360Dict: { certTypeList } } = this.context;
    return _.map(certTypeList, this.renderOption);
  }

  // 渲染机构客户的联系人类型下拉
  @autobind
  renderLinkManOption() {
    const { cust360Dict: { linkManTypeList } } = this.context;
    return _.map(linkManTypeList, this.renderOption);
  }

  // 渲染机构客户的职务下拉
  @autobind
  renderDutyOption() {
    const { cust360Dict: { dutyList } } = this.context;
    return _.map(dutyList, this.renderOption);
  }

  // 渲染个人客户的来源的下来框选项
  @autobind
  renderSourceOption() {
    const { cust360Dict: { sourceList } } = this.context;
    return _.map(sourceList, this.renderOption);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      name,
      cretificateType,
      cretificateNumber,
      dutyCode,
      contacterTypeCode,
      mobileValue,
      landlineValue,
      emailValue,
      sourceCode,
    } = this.state;

    return (
      <div className={styles.addContactWrap}>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>主要：</div>
              <div className={styles.valueArea}>
                {/** 因为只能新增修改非主要信息，因此此处使用固定的值 */}
                <FormItem>
                  {getFieldDecorator('mainFlag', {
                    initialValue: 'N',
                  })(
                    <Select
                      disabled
                      style={FORM_STYLE}
                    >
                      <Option value="N">N</Option>
                    </Select>
                  )
                 }
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                姓名：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                   getFieldDecorator(
                     'name',
                     {
                       rules: [
                         { required: true, message: '请输入姓名' },
                         { max: 50, message: '最多不超过个字符' },
                       ],
                       initialValue: name,
                     }
                   )(
                     <Input style={FORM_STYLE} />
                   )
                 }
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                证件类型：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                  getFieldDecorator(
                    'cretificateType',
                    {
                      initialValue: cretificateType,
                    }
                  )(
                    <Select
                      disabled
                      style={FORM_STYLE}
                    >
                      {this.renderCretificateOption()}
                    </Select>
                  )
                }
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                证件号码：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                  getFieldDecorator(
                    'cretificateNumber',
                    {
                      initialValue: cretificateNumber,
                    }
                  )(
                    <Input disabled style={FORM_STYLE} />
                  )
                }
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>职务：</div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                    getFieldDecorator(
                      'dutyCode',
                      {
                        initialValue: dutyCode,
                      }
                    )(
                      <Select
                        style={FORM_STYLE}
                        onChange={this.handleDutyChange}
                      >
                        {this.renderDutyOption()}
                      </Select>
                    )
                  }
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                联系人类型：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                  getFieldDecorator(
                    'contacterTypeCode',
                    {
                      rules: [{ required: true, message: '请选择联系人类型' }],
                      initialValue: contacterTypeCode,
                    }
                  )(
                    <Select
                      style={FORM_STYLE}
                      onChange={this.handleDutyChange}
                    >
                      {this.renderLinkManOption()}
                    </Select>
                  )
                }
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>手机号码：</div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                  getFieldDecorator(
                    'mobileValue',
                    {
                      rules: [
                        { pattern: regxp.cellPhone, message: '手机号码格式不正确' }
                      ],
                      initialValue: mobileValue,
                    }
                  )(
                    <Input style={FORM_STYLE} />
                  )
                }
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>固定电话：</div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                  getFieldDecorator(
                    'landlineValue',
                    {
                      rules: [
                        { pattern: regxp.tellPhone, message: '固定电话号码格式不正确' }
                      ],
                      initialValue: landlineValue,
                    }
                  )(
                    <Input style={FORM_STYLE} />
                  )
                }
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>电子邮件：</div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                  getFieldDecorator(
                    'emailValue',
                    {
                      rules: [
                        { pattern: regxp.email, message: '电子邮件格式不正确' },
                        { max: 50, message: '最多不超过50个字符' },
                      ],
                      initialValue: emailValue,
                    }
                  )(
                    <Input style={FORM_STYLE} />
                  )
                }
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>来源：</div>
              <div className={styles.valueArea}>
                <FormItem>
                  {getFieldDecorator('sourceCode', {
                    initialValue: sourceCode,
                  })(
                    <Select
                      disabled
                      style={FORM_STYLE}
                    >
                      {this.renderSourceOption()}
                    </Select>
                  )
                  }
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
