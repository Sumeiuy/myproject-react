/*
 * @Author: sunweibin
 * @Date: 2018-11-27 16:14:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 10:28:35
 * @description 添加个人客户电话信息联系方式的Form
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col, Select, Input } from 'antd';
import _ from 'lodash';

import logable from '../../../decorators/logable';
import { FORM_STYLE } from '../common/config';
import { isCreateContact } from '../common/utils';
import styles from '../contactForm.less';

const Option = Select.Option;

export default class PerPhoneContactForm extends PureComponent {
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
      phoneNumber = '',
      sourceCode = '',
      contactWayCode = '',
    } = data;
    this.state = {
      // 是否主要,因为无论新建还是修改主要均为N
      mainFlag: 'N',
      // 号码：
      tellphoneNumber: isCreate ? '' : phoneNumber,
      // 来源
      sourceCode: isCreate ? 'OCRM' : sourceCode,
      // 联系方式
      contactWayCode: isCreate ? '' : contactWayCode,
    };
  }

  // 将值传递出去
  @autobind
  saveChange() {
    this.props.onChange(this.state);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '联系方式下拉',
      value: '$args[0]',
    },
  })
  handlePerPhonesContactWaySelectChange(contactWayCode) {
    this.setState({ contactWayCode }, this.saveChange);
  }

  @autobind
  handlePhoneNumberChange(e) {
    this.setState({ tellphoneNumber: e.target.value }, this.saveChange);
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

  render() {
    const { tellphoneNumber, contactWayCode } = this.state;

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
              <div className={styles.itemLable}><span className={styles.requried}>*</span>号码：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={tellphoneNumber}
                  onChange={this.handlePhoneNumberChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>来源：</div>
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
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>联系方式：</div>
              <div className={styles.valueArea}>
                <Select
                  value={contactWayCode}
                  style={FORM_STYLE}
                  onChange={this.handlePerPhonesContactWaySelectChange}
                >
                  {this.renderPhoneWayOption()}
                </Select>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

