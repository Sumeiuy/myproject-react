/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:02:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-12-14 17:16:51
 * @description 添加个人客户地址信息联系方式的Form
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import {
  Select, Input, Form
} from 'antd';

import FormItemWrap from '../common/FormItem';
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
      sourceCode: isCreate ? SOURCE_CODE.finance : sourceCode,
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
    if (_.isEmpty(addrDictList)) {
      this.setState({
        cityList: [{ key: '', value: '--请选择--' }],
      });
    } else {
      this.setState({ cityList: addrDictList });
    }
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
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
    type: 'DropdownSelect',
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
    type: 'DropdownSelect',
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
        <div className={styles.formWrap}>
          <div className={styles.leftForm}>
            <FormItemWrap title="主要">
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
            </FormItemWrap>
            <FormItemWrap title="地址" isRequired>
              <FormItem>
                {getFieldDecorator('address', {
                  rules: [
                    { required: true, message: '请填写地址' },
                    { max: 100, message: '最多不超过100个字符' },
                    { whitespace: true, message: '头尾不能有空格' },
                  ],
                  initialValue: address,
                })(
                  <Input style={FORM_STYLE} />,
                )}
              </FormItem>
            </FormItemWrap>
            <FormItemWrap title="国家/地区">
              <FormItem>
                {getFieldDecorator('country', {
                  initialValue: country,
                })(
                  <Input style={FORM_STYLE} disabled />
                )}
              </FormItem>
            </FormItemWrap>
            <FormItemWrap title="城市" isRequired>
              <FormItem>
                {getFieldDecorator(
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
            </FormItemWrap>
          </div>
          <div className={styles.formSplit} />
          <div className={styles.rightForm}>
            <FormItemWrap title="地址类型">
              <FormItem>
                {getFieldDecorator(
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
            </FormItemWrap>
            <FormItemWrap title="邮政编码" isRequired>
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
            </FormItemWrap>
            <FormItemWrap title="省/(直辖)市" isRequired>
              <FormItem>
                {getFieldDecorator(
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
            </FormItemWrap>
            <FormItemWrap title="来源" isRequired>
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
            </FormItemWrap>
          </div>
        </div>
      </div>
    );
  }
}
