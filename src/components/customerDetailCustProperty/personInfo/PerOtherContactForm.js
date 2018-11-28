/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:10:24
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-28 19:25:08
 * @description 个人客户添加其他信息
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col, Select, Input } from 'antd';

import logable from '../../../decorators/logable';
import { FORM_STYLE } from '../config';
import { isCreateContact } from '../common/utils';
import styles from '../contactForm.less';

const Option = Select.Option;

export default class PerOtherContactForm extends PureComponent {
  static propTypes = {
    // 操作类型
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    // 数据
    data: PropTypes.object,
    // 修改数据后的回调
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    data: {},
  }

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
      mainFlag: 'N',
      // 号码：
      contactWayValue: isCreate ? '' : contactText,
      // 来源
      sourceCode: isCreate ? '' : sourceCode,
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
  handleNumberChange(e) {
    this.setState({ contactWayValue: e.target.value }, this.saveChange);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '联系方式',
      value: '$args[0]',
    },
  })
  handleContactSelectChange(contactWayCode) {
    this.setState({ contactWayCode }, this.saveChange);
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

  render() {
    const {
      contactWayValue,
      contactWayCode,
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
              <div className={styles.itemLable}><span className={styles.requried}>*</span>号码：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={contactWayValue}
                  onChange={this.handleNumberChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>联系方式：</div>
              <div className={styles.valueArea}>
                <Select
                  value={contactWayCode}
                  style={FORM_STYLE}
                  onChange={this.handleContactSelectChange}
                >
                  {this.renderContactTypeOption()}
                </Select>
              </div>
            </div>
          </Col>
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
        </Row>
      </div>
    );
  }
}

