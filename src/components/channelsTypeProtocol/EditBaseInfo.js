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
import { protocolIsShowSwitch } from '../../utils/permission';

import styles from './editBaseInfo.less';

const { TextArea } = Input;

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
    templateList: PropTypes.array.isRequired,
    // 查询子类型/操作类型
    queryTypeVaules: PropTypes.func.isRequired,
    operationList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
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
      // 所选操作类型
      operationType: '',
      // 所选子类型
      subType: '',
      // 所选客户
      client: EMPTY_OBJECT,
      // 所选协议模板
      protocolTemplate: EMPTY_OBJECT,
      // 是否多账户
      multiUsedFlag: false,
      // 是否订购十档行情
      levelTenFlag: false,
      // 备注
      content: '',
    };
    // 判断是否传入formData
    if (!_.isEmpty(formData)) {
      stateObj.operationType = formData.operationType;
      stateObj.subType = formData.subType;
      stateObj.client = formData.client;
      stateObj.protocolTemplate = formData.protocolTemplate;
      stateObj.multiUsedFlag = formData.multiUsedFlag;
      stateObj.levelTenFlag = formData.levelTenFlag;
      stateObj.content = formData.content;
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
        const { queryTypeVaules, onSearchCutList } = this.props;
        // 子类型发生变化查询操作类型
        queryTypeVaules({
          typeCode: 'operationType',
          subType: value,
        });
        // 子类型发生变化查询客户列表 type 根据后端要求写死，subType取子类型
        onSearchCutList({
          type: '05',
          subType: value,
        });
        // 子类型发生变化查询协议模板列表
        queryTypeVaules({
          typeCode: 'templateId',
          subType: value,
        });
        this.clearValue();
      }
      // 操作类型是“协议退订”、“协议续订”、“新增或删除下挂客户”时查询协议编号
      // const { operationType } = this.state;
      // if (operationType > 1) {
      //   this.handleSearchProtocolNum();
      // }
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
      // const { operationType } = this.state;
      // if (operationType > 1) {
      //   this.handleSearchProtocolNum();
      // }
      // 选择客户之后查询协议产品列表
      this.queryChannelProtocolProduct();
    });
  }

  // 查询协议产品列表
  @autobind
  queryChannelProtocolProduct() {
    const { client, protocolTemplate } = this.state;
    const { queryChannelProtocolProduct } = this.props;
    if (!_.isEmpty(client) && !_.isEmpty(protocolTemplate)) {
      queryChannelProtocolProduct({
        custId: client.cusId,
        custType: client.custType,
        promotionId: protocolTemplate.rowId,
        pageNum: 1,
        pageSize: 100,
        keyword: '',
      });
    }
  }

  // 根据关键字查询客户
  @autobind
  handleSearchClient(v) {
    const { subType } = this.state;
    this.props.onSearchCutList({
      keyword: v,
      type: '05', // type 根据后端要求写死
      subType,
    });
  }

  // 选择协议模板
  @autobind
  handleSelectTemplate(value) {
    this.setState({
      ...this.state,
      protocolTemplate: value,
    }, () => {
      console.log('value', value);
      const { queryChannelProtocolItem } = this.props;
      queryChannelProtocolItem();
      // 触发查询协议产品列表
      this.queryChannelProtocolProduct();
    });
  }

  // 根据填入关键词筛选协议模板
  @autobind
  handleSearchTemplate(value) {
    console.log('value', value);
    // this.props.onSearchProtocolTemplate(value);
  }

  // 修改备注
  @autobind
  handleChangeContent(e) {
    this.setState({
      ...this.state,
      content: e.target.value,
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

  // 切换子类型清空所选模板和所选客户
  @autobind
  clearValue() {
    this.setState({
      ...this.state,
      client: EMPTY_OBJECT,
      protocolTemplate: EMPTY_OBJECT,
    }, () => {
      this.selectCustComponent.clearValue();
      this.selectTemplateComponent.clearValue();
    });
  }

  render() {
    const {
      custList,
      templateList,
      operationList,
      subTypeList,
    } = this.props;
    const {
      subType,
      operationType,
      multiUsedFlag,
      levelTenFlag,
      protocolTemplate,
    } = this.state;
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
            name="operationType"
            data={operationList}
            value={operationType}
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
            showObjKey="prodName"
            objId="rowId"
            value={this.state.protocolTemplate.rowId || ''}
            searchList={templateList}
            emitSelectItem={this.handleSelectTemplate}
            emitToSearch={this.handleSearchTemplate}
            boxStyle={dropDownSelectBoxStyle}
            ref={ref => this.selectTemplateComponent = ref}
          />
        </InfoForm>
        {
          protocolIsShowSwitch(protocolTemplate.rowId, subType) ?
            <InfoForm label="是否多账户使用" >
              <CustomSwitch
                name="multiUsedFlag"
                value={multiUsedFlag}
                onChange={this.handleChangeSwitchValue}
              />
            </InfoForm>
          :
          null
        }
        {
          protocolIsShowSwitch(protocolTemplate.rowId, subType) ?
            <InfoForm label="是否订购十档行情">
              <CustomSwitch
                name="levelTenFlag"
                value={levelTenFlag}
                onChange={this.handleChangeSwitchValue}
              />
            </InfoForm>
            :
            null
        }
        <InfoItem label="协议开始日期" value={''} />
        <InfoItem label="协议有效期" value={''} />
        <InfoForm label="备注">
          <TextArea onChange={this.handleChangeContent} />
        </InfoForm>
      </div>
    );
  }

}
