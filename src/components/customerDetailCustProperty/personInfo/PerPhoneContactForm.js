/*
 * @Author: sunweibin
 * @Date: 2018-11-27 16:14:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-13 10:08:36
 * @description 添加个人客户电话信息联系方式的Form
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import {
  Row, Col, Select, Input, Form
} from 'antd';
import _ from 'lodash';

import { regxp } from '../../../helper';
import logable from '../../../decorators/logable';
import { FORM_STYLE, SOURCE_CODE } from '../common/config';
import {
  isCreateContact,
  isCellPhone,
  isLandline,
  isTax,
  isOtherContact,
} from '../common/utils';
import styles from '../contactForm.less';

const Option = Select.Option;
const FormItem = Form.Item;
const create = Form.create;

@create()
export default class PerPhoneContactForm extends PureComponent {
  static propTypes = {
    form: PropTypes.object.isRequired,
    // 操作类型, 如果是UPDATE,则不管hasMainMobile
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
      phoneNumber = '',
      sourceCode = '',
      contactWayCode = '',
    } = data;
    this.state = {
      // 是否主要,因为无论新建还是修改主要均为N
      // eslint-disable-next-line
      mainFlag: 'N',
      // 号码：
      tellphoneNumber: isCreate ? '' : phoneNumber,
      // 来源
      sourceCode: isCreate ? SOURCE_CODE.finance : sourceCode,
      // 联系方式
      contactWayCode: isCreate ? '' : contactWayCode,
    };
  }

  // 测试办公电话、家庭电话是否符合要求，
  // 目前新需求办公电话、家庭电话也要支持手机号码
  @autobind
  testLandLine(value) {
    return regxp.cellPhone.test(value) || regxp.tellPhone.test(value);
  }

  // 校验号码
  @autobind
  validateTellPhoneNumber(rule, value, callback) {
    const contactWayCode = this.props.form.getFieldValue('contactWayCode');
    const newInput = _.trim(value);
    if (!_.isEmpty(contactWayCode) && !_.isEmpty(newInput)) {
      // 如果选择的是手机号码
      if (isCellPhone(contactWayCode) && !regxp.cellPhone.test(newInput)) {
        callback('手机号码格式不正确');
      } else if (isLandline(contactWayCode) && !this.testLandLine(newInput)) {
        // 如果选择的是办公电话、家庭电话
        callback('电话号码或者手机号码格式不正确');
      } else if (isTax(contactWayCode) && !this.testLandLine(newInput)) {
        callback('传真号码格式不正确');
      } else if (isOtherContact(contactWayCode) && !_.size(newInput) <= 60) {
        callback('其他联系方式号码最大不超过60个字符');
      } else {
        callback();
      }
    } else {
      // 必须要调用
      callback();
    }
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '联系方式下拉',
      value: '$args[0]',
    },
  })
  handlePerPhonesContactWaySelectChange() {
    // 此方法专门用来记录日志的
  }

  @autobind
  renderOption(option) {
    return (<Option key={option.key} value={option.key}>{option.value}</Option>);
  }

  // 渲染个人客户的联系方式的下来框选项
  @autobind
  renderPhoneWayOption() {
    const { cust360Dict: { phoneList } } = this.context;
    return _.map(phoneList, this.renderOption);
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
      tellphoneNumber,
      contactWayCode,
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
                号码：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {getFieldDecorator('tellphoneNumber', {
                    rules: [
                      { required: true, message: '请输入号码' },
                      { validator: this.validateTellPhoneNumber },
                      { whitespace: true, message: '头尾不能有空格' },
                    ],
                    initialValue: tellphoneNumber,
                  })(
                    <Input style={FORM_STYLE} />,
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                来源：
              </div>
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
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                联系方式：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {getFieldDecorator('contactWayCode', {
                    rules: [{ required: true, message: '请选择联系方式' }],
                    initialValue: contactWayCode,
                  })(
                    <Select
                      style={FORM_STYLE}
                      onChange={this.handlePerPhonesContactWaySelectChange}
                    >
                      {this.renderPhoneWayOption()}
                    </Select>
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
