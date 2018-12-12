/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:10:24
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-12 11:03:55
 * @description 个人客户添加其他信息
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
import { FORM_STYLE, SOURCE_CODE } from '../common/config';
import { isCreateContact, isEmail } from '../common/utils';
import styles from '../contactForm.less';

const Option = Select.Option;
const FormItem = Form.Item;
const create = Form.create;

@create()
export default class PerOtherContactForm extends PureComponent {
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
      contactWayCode,
      contactText,
      sourceCode,
    } = data;
    this.state = {
      // 是否主要,无论新增还是修改都是N
      // eslint-disable-next-line
      mainFlag: 'N',
      // 号码：
      contactWayValue: isCreate ? '' : contactText,
      // 来源
      sourceCode: isCreate ? SOURCE_CODE.finance : sourceCode,
      // 联系方式
      contactWayCode: isCreate ? '' : contactWayCode,
    };
  }

  // 校验号码
  @autobind
  vakidateContactValue(rule, value, callback) {
    const contactWayCode = this.props.form.getFieldValue('contactWayCode');
    const newInput = _.trim(value);
    if (!_.isEmpty(contactWayCode) && !_.isEmpty(newInput)) {
      // 如果选择的是电子邮件
      if (isEmail(contactWayCode) && !regxp.email.test(newInput)) {
        callback('电子邮件格式不正确');
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
      name: '联系方式',
      value: '$args[0]',
    },
  })
  handleContactSelectChange() {
    // 记录日志用
  }

  @autobind
  renderOption(option) {
    return (<Option key={option.key} value={option.key}>{option.value}</Option>);
  }

  // 渲染个人客户的地址类型联系方式的下来框选项
  @autobind
  renderContactTypeOption() {
    const { cust360Dict: { otherList } } = this.context;
    return _.map(otherList, this.renderOption);
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
      contactWayValue,
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
                  {getFieldDecorator('contactWayValue', {
                    rules: [
                      { required: true, message: '请输入号码' },
                      { whitespace: true, message: '头尾不能有空格' },
                      { validator: this.vakidateContactValue },
                    ],
                    initialValue: contactWayValue,
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
                      onChange={this.handleContactSelectChange}
                    >
                      {this.renderContactTypeOption()}
                    </Select>
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
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
        </Row>
      </div>
    );
  }
}
