/*
 * @Author: sunweibin
 * @Date: 2018-11-27 16:14:23
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-27 20:33:23
 * @description 添加个人客户电话信息联系方式的Form
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Select, Input } from 'antd';

import { FORM_STYLE } from '../config';
import styles from '../contactForm.less';

const Option = Select.Option;

export default class AddPhoneContactForm extends Component {
  static propTypes = {
    // 操作类型
    action: PropTypes.oneOf(['CREATE', 'UPDATE']).isRequired,
    // 数据
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  constructor(props) {
    super(props);
    const { action, data } = props;
    this.state = {
      // 是否主要
      mainFlag: 'N',
      // 号码：
      tellphoneNumber: '',
      // 来源
      sourceCode: '',
      // 联系方式
      contactWay: '',
    };
  }

  render() {
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
                <Input style={FORM_STYLE} />
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
                  style={FORM_STYLE}
                >
                  <Option value="OCRMS">OCRM系统</Option>
                </Select>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

