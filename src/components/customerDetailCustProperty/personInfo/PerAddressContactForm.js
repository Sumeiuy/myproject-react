/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:02:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-04 17:19:42
 * @description 添加个人客户地址信息联系方式的Form
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
import { isCreateContact } from '../common/utils';
import styles from '../contactForm.less';

const Option = Select.Option;
const FormItem = Form.Item;
const create = Form.create;

@create()
export default class PerAddressContactForm extends PureComponent {
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
    queryProvinceCity: PropTypes.func.isRequired,
    cust360Dict: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { action, data } = props;
    const isCreate = isCreateContact(action);
    const {
      addressTypeCode = '',
      address = '',
      zipCode = '',
      provinceCode = '',
      cityCode = '',
      sourceCode = '',
    } = data;

    this.state = {
      // 是否主要,因为无论新建还是修改主要均为N
      // eslint-disable-next-line
      mainFlag: 'N',
      // 地址类型
      addressTypeCode: isCreate ? '' : addressTypeCode,
      // 地址
      address: isCreate ? '' : address,
      // 邮政编码
      zipCode: isCreate ? '' : zipCode,
      // 国家/地区
      country: '中国',
      // 省份
      provinceCode: isCreate ? '' : provinceCode,
      // 城市
      cityCode: isCreate ? '' : cityCode,
      // 来源
      sourceCode: isCreate ? SOURCE_CODE.ocrm : sourceCode,
      // 省份
      provinceList: [],
      // 城市
      cityList: [],
    };
  }

  componentDidMount() {
    const { action, data } = this.props;
    const isCreate = isCreateContact(action);
    // 进入先查询一把省份的数据
    this.context.queryProvinceCity().then(this.saveProvince);
    if (!isCreate && !_.isEmpty(data.provinceCode)) {
      // 如果是编辑，并且存在provinceCode，则初始化的时候还需要查询一下城市的联动数据
      this.context.queryProvinceCity({
        provCd: data.provinceCode,
      }).then(this.saveCity);
    }
  }

  // 保存省份数据
  @autobind
  saveProvince({ addrDictList }) {
    this.setState({ provinceList: addrDictList });
  }

  // 保存城市联动的数据
  @autobind
  saveCity({ addrDictList }) {
    this.setState({ cityList: addrDictList });
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '地址类型',
      value: '$args[0]',
    },
  })
  handleAddresTypeChange() {
    // 记录日志用
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '省/(直辖)市',
      value: '$args[0]',
    },
  })
  handleProvinceChange(provinceCode) {
    // 切换省份后需要清空城市下拉，并且查询一把城市下拉
    this.props.form.setFieldsValue({ cityCode: '' });
    // 城市联动
    this.context.queryProvinceCity({
      provCd: provinceCode,
    }).then(this.saveCity);
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '城市',
      value: '$args[0]',
    },
  })
  handleCityChange() {
    // 记录日志用
  }

  @autobind
  renderOption(option) {
    return (<Option key={option.key} value={option.key}>{option.value}</Option>);
  }

  // 渲染个人客户的地址类型联系方式的下来框选项
  @autobind
  renderAddressTypeOption() {
    const { cust360Dict: { addrTypeList } } = this.context;
    return _.map(addrTypeList, this.renderOption);
  }

  // 渲染个人客户的省份
  @autobind
  renderProvinceOption() {
    const { provinceList } = this.state;
    return _.map(provinceList, this.renderOption);
  }

  // 渲染个人客户的城市
  @autobind
  renderCityOption() {
    const { cityList } = this.state;
    return _.map(cityList, this.renderOption);
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
      addressTypeCode,
      address,
      zipCode,
      country,
      provinceCode,
      cityCode,
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
                地址类型：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                    getFieldDecorator(
                      'addressTypeCode',
                      {
                        rules: [{ required: true, message: '请选择地址类型' }],
                        initialValue: addressTypeCode,
                      }
                    )(
                      <Select
                        style={FORM_STYLE}
                        onChange={this.handleAddresTypeChange}
                      >
                        {this.renderAddressTypeOption()}
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
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                地址：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {getFieldDecorator('address', {
                    rules: [
                      { required: true, message: '请填写地址' },
                      { whitespace: true, message: '头尾不能有空格' },
                    ],
                    initialValue: address,
                  })(
                    <Input style={FORM_STYLE} />,
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                邮政编码：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {getFieldDecorator('zipCode', {
                    rules: [
                      { required: true, message: '请填写邮政编码' },
                      { pattern: regxp.zipCode, message: '邮政编码格式不正确' },
                      { whitespace: true, message: '头尾不能有空格' },
                    ],
                    initialValue: zipCode,
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
              <div className={styles.itemLable}>国家/地区：</div>
              <div className={styles.valueArea}>
                <FormItem>
                  {getFieldDecorator('country', {
                    initialValue: country,
                  })(
                    <Input style={FORM_STYLE} disabled />
                  )}
                </FormItem>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                省/(直辖)市：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                    getFieldDecorator(
                      'provinceCode',
                      {
                        rules: [{ required: true, message: '请选择省/(直辖)市' }],
                        initialValue: provinceCode,
                      }
                    )(
                      <Select
                        style={FORM_STYLE}
                        onChange={this.handleProvinceChange}
                      >
                        {this.renderProvinceOption()}
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
              <div className={styles.itemLable}>
                <span className={styles.requried}>*</span>
                城市：
              </div>
              <div className={styles.valueArea}>
                <FormItem>
                  {
                    getFieldDecorator(
                      'cityCode',
                      {
                        rules: [{ required: true, message: '城市' }],
                        initialValue: cityCode,
                      }
                    )(
                      <Select
                        style={FORM_STYLE}
                        onChange={this.handleCityChange}
                      >
                        {this.renderCityOption()}
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
