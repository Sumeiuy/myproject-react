/*
 * @Description: 通道类型协议新建/编辑 -基本信息
 * @Author: XuWenKang
 * @Date:   2017-09-21 15:27:31
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-19 21:11:48
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { Input } from 'antd';
// import moment from 'moment';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../common/infoForm';
import DropDownSelect from '../common/dropdownSelect';
import CustomSwitch from '../common/customSwitch';
import { seibelConfig } from '../../config';

import styles from './editBaseInfo.less';

const { TextArea } = Input;

// 子类型列表
const subTypeList = _.filter(seibelConfig.channelsTypeProtocol.subType, v => v.label !== '全部');
// 下拉搜索组件样式
const dropDownSelectBoxStyle = {
  width: 220,
  height: 32,
  border: '1px solid #d9d9d9',
};
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
export default class EditBaseInfo extends PureComponent {
  static propTypes = {
    // 查询客户
    onSearchCutList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    // 查询协议模板
    onSearchProtocolTemplate: PropTypes.func.isRequired,
    protocolTemplateList: PropTypes.array.isRequired,
    // 查询协议编号
    // onSearchProtocolNum: PropTypes.func.isRequired,
    // protocolNumList: PropTypes.array,
    // 编辑时传入元数据
    formData: PropTypes.object,
  }

  static defaultProps = {
    formData: EMPTY_OBJECT,
    protocolNumList: EMPTY_ARRAY,
  }

  constructor(props) {
    super(props);
    const { formData } = props;
    const stateObj = {
      // 操作类型列表
      operationList: EMPTY_ARRAY,
      // 所选操作类型
      operation: '',
      // 所选子类型
      subType: '',
      // 所选客户
      client: EMPTY_OBJECT,
      // 所选协议模板
      protocolTemplate: EMPTY_OBJECT,
      // 是否多账户
      isMultiAccount: false,
      // 是否订购十档行情
      isTenMarket: false,
      // 备注
      remark: '',
    };
    // 判断是否传入formData
    if (!_.isEmpty(formData)) {
      stateObj.operation = formData.operation;
      stateObj.subType = formData.subType;
      stateObj.client = formData.client;
      stateObj.protocolTemplate = formData.protocolTemplate;
      stateObj.isMultiAccount = formData.isMultiAccount;
      stateObj.isTenMarket = formData.isTenMarket;
      stateObj.remark = formData.remark;
    }
    this.state = {
      ...stateObj,
    };
  }

  // 向外传递数据
  @autobind
  getData() {
    return this.state;
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    this.setState({
      ...this.state,
      [key]: value,
    }, () => {
      if (key === 'subType') {
        const operationList = _.filter(subTypeList, v => v.value === value)[0].operationList;
        this.setState({
          ...this.state,
          operation: '',
          operationList,
        });
      }
      // 操作类型是“协议退订”、“协议续订”、“新增或删除下挂客户”时查询协议编号
      const { operation } = this.state;
      if (operation > 1) {
        this.handleSearchProtocolNum();
      }
    });
  }

  // 选择客户
  @autobind
  handleSelectClient(value) {
    this.setState({
      ...this.state,
      client: value,
    }, () => {
      // 操作类型是“协议退订”、“协议续订”、“新增或删除下挂客户”时查询协议编号
      const { operation } = this.state;
      if (operation > 1) {
        this.handleSearchProtocolNum();
      }
    });
  }

  // 根据关键字查询客户
  @autobind
  handleSearchClient(v) {
    this.props.onSearchCutList(v);
  }

  // 选择协议模板
  @autobind
  handleSelectTemplate(value) {
    this.setState({
      ...this.state,
      protocolTemplate: value,
    });
  }

  // 根据填入关键词筛选协议模板
  @autobind
  handleSearchTemplate(value) {
    this.props.onSearchProtocolTemplate(value);
  }

  // 修改备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      ...this.state,
      remark: e.target.value,
    }, this.transferDataToHome);
  }

  // 修改开关
  @autobind
  handleChangeSwitchValue(name, value) {
    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  // 查询协议编号
  @autobind
  handleSearchProtocolNum() {

  }

  // 判断是否显示switch开关
  @autobind
  isShowSwitch() {
    return true;
  }

  render() {
    const { custList, protocolTemplateList } = this.props;
    const { subType, operation, isMultiAccount, isTenMarket, operationList } = this.state;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        <InfoForm label="子类型" required>
          <Select
            name="subType"
            data={subTypeList}
            value={subType}
            onChange={this.handleSelectChange}
          />
        </InfoForm>
        <InfoForm label="操作类型" required>
          <Select
            name="operation"
            data={operationList}
            value={operation}
            onChange={this.handleSelectChange}
          />
        </InfoForm>
        <InfoForm label="客户" required>
          <DropDownSelect
            placeholder="经纪客户号/客户名称"
            showObjKey="custName"
            objId="brokerNumber"
            value={this.state.client.brokerNumber || ''}
            searchList={custList}
            emitSelectItem={this.handleSelectClient}
            emitToSearch={this.handleSearchClient}
            boxStyle={dropDownSelectBoxStyle}
            ref={ref => this.selectCustComponent = ref}
          />
        </InfoForm>
        <InfoForm label="协议模板" required>
          <DropDownSelect
            placeholder="协议模板"
            showObjKey="custName"
            objId="brokerNumber"
            value={this.state.protocolTemplate.brokerNumber || ''}
            searchList={protocolTemplateList}
            emitSelectItem={this.handleSelectTemplate}
            emitToSearch={this.handleSearchTemplate}
            boxStyle={dropDownSelectBoxStyle}
            ref={ref => this.selectTemplateComponent = ref}
          />
        </InfoForm>
        {
          this.isShowSwitch() ?
            <InfoForm label="是否多账户使用" >
              <CustomSwitch
                name="isMultiAccount"
                value={isMultiAccount}
                onChange={this.handleChangeSwitchValue}
              />
            </InfoForm>
          :
          null
        }
        {
          this.isShowSwitch() ?
            <InfoForm label="是否订购十档行情">
              <CustomSwitch
                name="isTenMarket"
                value={isTenMarket}
                onChange={this.handleChangeSwitchValue}
              />
            </InfoForm>
            :
            null
        }
        <InfoItem label="协议开始日期" value={'2017/08/31'} />
        <InfoItem label="协议有效期" value={'2017/08/31'} />
        <InfoForm label="备注">
          <TextArea onChange={this.handleChangeRemark} />
        </InfoForm>
      </div>
    );
  }

}
