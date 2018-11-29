/*
 * @Author: sunweibin
 * @Date: 2018-11-27 19:02:00
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-29 19:51:06
 * @description 添加个人客户地址信息联系方式的Form
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Row, Col, Select, Input } from 'antd';

import logable from '../../../decorators/logable';
import { FORM_STYLE } from '../common/config';
import { isCreateContact } from '../common/utils';
import styles from '../contactForm.less';

const Option = Select.Option;

export default class PerAddressContactForm extends PureComponent {
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
      mainFlag: 'N',
      // 地址类型
      addressType: isCreate ? '' : addressTypeCode,
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
      sourceCode: isCreate ? '' : sourceCode,
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

  // 将值传递出去
  @autobind
  saveChange() {
    const formData = _.omit(this.state, ['provinceList', 'cityList']);
    this.props.onChange(formData);
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
  handleAddresTypeChange(addressType) {
    this.setState({ addressType }, this.saveChange);
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
    this.setState({
      provinceCode,
      cityCode: '',
    }, this.saveChange);
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
  handleCityChange(cityCode) {
    // 切换省份后需要清空城市下拉，并且查询一把城市下拉
    this.setState({
      cityCode,
    }, this.saveChange);
  }

  // 修改地址
  @autobind
  handleAddressChange(e) {
    this.setState({ address: e.target.value }, this.saveChange);
  }

  // 修改邮政编码
  @autobind
  handleZipCodeChange(e) {
    this.setState({ zipCode: e.target.value }, this.saveChange);
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

  render() {
    const {
      addressType,
      address,
      zipCode,
      country,
      provinceCode,
      cityCode,
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
              <div className={styles.itemLable}><span className={styles.requried}>*</span>地址类型：</div>
              <div className={styles.valueArea}>
                <Select
                  value={addressType}
                  style={FORM_STYLE}
                  onChange={this.handleAddresTypeChange}
                >
                  {this.renderAddressTypeOption()}
                </Select>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>地址：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={address}
                  onChange={this.handleAddressChange}
                />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>邮政编码：</div>
              <div className={styles.valueArea}>
                <Input
                  style={FORM_STYLE}
                  value={zipCode}
                  onChange={this.handleZipCodeChange}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}>国家/地区：</div>
              <div className={styles.valueArea}>
                <Input style={FORM_STYLE} value={country} disabled />
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>省/(直辖)市：</div>
              <div className={styles.valueArea}>
                <Select
                  style={FORM_STYLE}
                  value={provinceCode}
                  onChange={this.handleProvinceChange}
                >
                  {this.renderProvinceOption()}
                </Select>
              </div>
            </div>
          </Col>
        </Row>
        <Row type="flex" gutter={16} align="middle">
          <Col span={12}>
            <div className={styles.formItem}>
              <div className={styles.itemLable}><span className={styles.requried}>*</span>城市：</div>
              <div className={styles.valueArea}>
                <Select
                  style={FORM_STYLE}
                  value={cityCode}
                  onChange={this.handleCityChange}
                >
                  {this.renderCityOption()}
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
                  defaultValue="N"
                  style={FORM_STYLE}
                >
                  <Option value="N">N</Option>
                  <Option value="Y">Y</Option>
                </Select>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

