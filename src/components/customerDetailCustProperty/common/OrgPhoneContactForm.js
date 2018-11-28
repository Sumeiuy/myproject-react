/*
 * @Author: sunweibin
 * @Date: 2018-11-27 20:29:33
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 20:12:10
 * @description 添加机构客户电话信息Form
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col, Select, Input } from 'antd';

import logable from '../../../decorators/logable';
import { isCreateContact } from './utils';
import { FORM_STYLE } from '../config';
import styles from '../contactForm.less';

const Option = Select.Option;

export default class OrgPhoneContactForm extends PureComponent {
  static propTypes = {
    // 操作类型
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    // 数据
    data: PropTypes.object,
    // 新增，编辑数据后的回调
    onChange: PropTypes.func.isRequired,
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
      // 手机号码, 因为ecif那边传递过来修改需要传递手机号码的系统识别号
      mobile: isCreate ? {} : mobile,
      // 固定号码，因为ecif那边传递过来修改需要传递固定电话的系统识别号
      landline: isCreate ? {} : landline,
      // 电子邮件，因为ecif那边传递过来修改需要传递电子邮件的系统识别号
      email: isCreate ? {} : email,
      // 来源
      sourceCode: isCreate ? '' : sourceCode,
    };
  }

  // 将值传递出去
  @autobind
  saveChange() {
    this.props.onChange(this.state);
  }

  // 修改姓名
  @autobind
  handleNameChange(e) {
    this.setState({ name: e.target.value }, this.saveChange);
  }

  // 证件号码
  @autobind
  handleCretificatNoChange(e) {
    this.setState({ cretificateNumber: e.target.value }, this.saveChange);
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

  // 证件类型下拉
  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '证件类型',
      value: '$args[0]',
    },
  })
  handleCretifiateTypeChange(cretificateType) {
    this.setState({ cretificateType }, this.saveChange);
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
  handleDutyChange(dutyCode) {
    this.setState({ dutyCode }, this.saveChange);
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
  handleLinkManChange(contacterTypeCode) {
    this.setState({ contacterTypeCode }, this.saveChange);
  }

  @autobind
  renderOption(option) {
    return (<Option key={option.key} value={option.key}>{option.value}</Option>);
  }

  // 渲染机构客户的证件类型下拉
  @autobind
  renderCretificateOption() {
    const { cust360Dict: { addrTypeList } } = this.context;
    return _.map(addrTypeList, this.renderOption);
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


  render() {
    const {
      name,
      cretificateType,
      cretificateNumber,
      dutyCode,
      contacterTypeCode,
      mobile,
      landline,
      email,
    } = this.state;

    return (
      <div className={styles.addContactWrap}>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>主要：</div>
              <div className={styles.valueArea}>
                <Select
                  disabled
                  defaultValue="N"
                  style={FORM_STYLE}
                >
                  <Option value="N">N</Option>
                </Select>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>姓名：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={name}
                  onChange={this.handleNameChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>证件类型：</div>
              <div className={styles.valueArea}>
                <Select
                  style={FORM_STYLE}
                  value={cretificateType}
                  onChange={this.handleCretifiateTypeChange}
                >
                  {this.renderCretificateOption()}
                </Select>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>证件号码：</div>
              <div className={styles.valueArea}>
                <Input
                  value={cretificateNumber}
                  style={FORM_STYLE}
                  onChange={this.handleCretificatNoChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>职务：</div>
              <div className={styles.valueArea}>
                <Select
                  style={FORM_STYLE}
                  value={dutyCode}
                  onChange={this.handleDutyChange}
                >
                  {this.renderDutyOption()}
                </Select>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>联系人类型：</div>
              <div className={styles.valueArea}>
                <Select
                  style={FORM_STYLE}
                  value={contacterTypeCode}
                  onChange={this.handleLinkManChange}
                >
                  {this.renderLinkManOption()}
                </Select>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>手机号码：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={mobile.value || ''}
                  onChange={this.handlePhoneChange}
                />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>固定电话：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={landline.value || ''}
                  onChange={this.handleLandLineChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>电子邮件：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={email.value || ''}
                  onChange={this.handleEmailChange}
                />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>来源：</div>
              <div className={styles.valueArea}>
                <Select
                  disabled
                  defaultValue="OCRM"
                  style={FORM_STYLE}
                >
                  <Option value="OCRM">OCRM系统</Option>
                </Select>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

