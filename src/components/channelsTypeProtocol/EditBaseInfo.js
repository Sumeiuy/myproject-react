/*
 * @Description: 通道类型协议新建/编辑 -基本信息
 * @Author: XuWenKang
 * @Date:   2017-09-21 15:27:31
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-13 21:24:56
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
    operationTypeList: PropTypes.array.isRequired,
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
    // 多账户切换
    onChangeMultiCustomer: PropTypes.func,
    // 清空附件
    resetUpload: PropTypes.func,
    // 验证客户
    getCustValidate: PropTypes.func.isRequired,
    // 清除数据
    clearPropsData: PropTypes.func,
    isEdit: PropTypes.bool,
  }

  static defaultProps = {
    formData: EMPTY_OBJECT,
    protocolNumList: EMPTY_ARRAY,
    onChangeMultiCustomer: () => {},
    resetUpload: () => {},
    clearPropsData: () => {},
    isEdit: false,
  }

  constructor(props) {
    super(props);
    const { templateList } = props;
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
    // // 判断是否传入formData
    // if (!_.isEmpty(formData)) {
    //   stateObj.operationType = formData.operationType;
    //   stateObj.subType = formData.subType;
    //   stateObj.client = formData.client;
    //   stateObj.protocolTemplate = formData.protocolTemplate;
    //   stateObj.multiUsedFlag = formData.multiUsedFlag;
    //   stateObj.levelTenFlag = formData.levelTenFlag;
    //   stateObj.content = formData.content;
    // }
    this.state = {
      ...stateObj,
      edit: false,
      templateList,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { templateList: preTL, formData: preFD } = this.props;
    const {
      templateList: nextTL,
      formData: nextFD,
      // queryTypeVaules,
      // subTypeList,
    } = nextProps;
    // 设定新的模版列表数据
    if (!_.isEqual(preTL, nextTL)) {
      this.setState({
        templateList: nextTL,
      });
    }
    if (!_.isEqual(preFD, nextFD) && !_.isEmpty(nextFD)) {
      // console.warn('两次数据不一样，并且有值', nextFD);
      // const filterSubType = _.filter(subTypeList, o => o.val === nextFD.subType);
      // console.warn('filterSubType', filterSubType);
      // console.warn('subTypeList', subTypeList);
      // console.warn('nextFD.subType', nextFD.subType);
      // queryTypeVaules({
      //   typeCode: 'templateId',
      //   subType: value,
      // });
      const {
        operationType,
        subType,
        contactName,
        templateId,
        multiUsedFlag,
        levelTenFlag,
        startDt,
        vailDt,
        content,
      } = nextFD;
      this.setState({
        operationType,
        subType,
        contactName,
        templateId,
        multiUsedFlag,
        levelTenFlag,
        startDt,
        vailDt,
        content,
        edit: true,
      });
    }
  }

  // 向外传递数据
  @autobind
  getData() {
    return this.state;
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    const { queryTypeVaules, onSearchCutList } = this.props;
    this.setState({
      content: '',
      operationType: '',
      client: EMPTY_OBJECT,
      protocolTemplate: EMPTY_OBJECT,
      multiUsedFlag: false,
      [key]: value,
    }, () => {
      const { onChangeMultiCustomer, resetUpload, isEdit } = this.props;
      // 清除客户列表
      this.selectCustComponent.clearValue();
      // 清除协议模版
      this.selectTemplateComponent.clearValue();
      // 清除下挂客户
      onChangeMultiCustomer(false);
      if (!isEdit) {
        // 清除附件
        resetUpload();
      }
      if (key === 'subType') {
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
        // this.clearValue();
      } else if (key === 'operationType') {
        console.warn('操作类型');
        const { subType } = this.state;
        // 子类型发生变化查询协议模板列表
        queryTypeVaules({
          typeCode: 'templateId',
          subType,
          operationType: value,
        });
        // 如果切换的是操作类型，
        // 操作类型是“协议退订”、“协议续订”、“新增或删除下挂客户”时查询协议编号
      }
      // const { operationType } = this.state;
      // if (operationType > 1) {
      //   this.handleSearchProtocolNum();
      // }
    });
  }

  // 选择客户
  @autobind
  handleSelectClient(value) {
    const {
      getCustValidate,
      clearPropsData,
      onChangeMultiCustomer,
      resetUpload,
      isEdit,
    } = this.props;
    console.warn('选择客户 value', value);
    const { cusId, custType, brokerNumber } = value;
    const validatePayload = {
      id: cusId,
      custType,
      econNum: brokerNumber,
      agrId: '',
      agrType: '',
      templateId: '',
      type: 'PriCust',
      ignoreCatch: true,
    };
    getCustValidate(validatePayload).then(() => {
      clearPropsData();
      this.setState({
        ...this.state,
        content: '',
        protocolTemplate: EMPTY_OBJECT,
        client: value,
        multiUsedFlag: false,
      }, () => {
        // 清除下挂客户
        onChangeMultiCustomer(false);
        if (!isEdit) {
          // 清除附件
          resetUpload();
        }
        // 清空协议模版
        this.selectTemplateComponent.clearValue();
        // 操作类型是“协议退订”、“协议续订”、“新增或删除下挂客户”时查询协议编号
        // const { operationType } = this.state;
        // if (operationType > 1) {
        //   this.handleSearchProtocolNum();
        // }
        // 选择客户之后查询协议产品列表
        this.queryChannelProtocolProduct();
      });
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
      content: '',
      multiUsedFlag: false,
      protocolTemplate: value,
    }, () => {
      const { queryChannelProtocolItem, onChangeMultiCustomer, resetUpload, isEdit } = this.props;
      // 清除下挂客户
      onChangeMultiCustomer(false);
      if (!isEdit) {
        // 清除附件
        resetUpload();
      }
      queryChannelProtocolItem({
        keyword: value.rowId,
      });
      // 触发查询协议产品列表
      this.queryChannelProtocolProduct();
    });
  }

  // 根据填入关键词筛选协议模板
  @autobind
  handleSearchTemplate(value) {
    const {
      templateList,
    } = this.props;
    const newTemplateList = _.filter(templateList, o => o.prodName.indexOf(value) !== -1);
    this.setState({
      templateList: newTemplateList,
    });
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
    const { onChangeMultiCustomer } = this.props;
    this.setState({
      ...this.state,
      [name]: value,
    }, () => {
      // 判断是否是多账户的切换
      if (name === 'multiUsedFlag') {
        onChangeMultiCustomer(value);
      }
    });
  }

  // 查询协议编号
  @autobind
  handleSearchProtocolNum() {

  }


  // 切换子类型清空所选模板和所选客户
  // @autobind
  // clearValue() {
  //   this.setState({
  //     ...this.state,
  //     operationType: '',
  //     client: EMPTY_OBJECT,
  //     protocolTemplate: EMPTY_OBJECT,
  //   }, () => {
  //     this.selectCustComponent.clearValue();
  //     this.selectTemplateComponent.clearValue();
  //   });
  // }

  render() {
    const {
      custList,
      operationTypeList,
      subTypeList,
      formData: protocolDetail,
    } = this.props;
    const {
      subType,
      operationType,
      multiUsedFlag,
      levelTenFlag,
      protocolTemplate,
      templateList,
      edit,
    } = this.state;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        {
          edit ?
            <div>
              <InfoItem label="子类型" value={subType} />
              <InfoItem label="操作类型" value={protocolDetail.operationType} />
              <InfoItem label="客户" value={`${(protocolDetail.contactName || protocolDetail.accountName)} ${protocolDetail.econNum}`} />
            </div>
          :
            <div className={styles.editWrapperThree}>
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
                  data={operationTypeList}
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
            </div>
        }
        <InfoForm label="协议模板" required>
          <DropDownSelect
            placeholder="协议模板"
            showObjKey="prodName"
            objId="rowId"
            value={edit ? (this.state.protocolTemplate.rowId || '') : protocolDetail.templateId}
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
          <TextArea
            onChange={this.handleChangeContent}
            defaultValue={edit ? protocolDetail.content : ''}
          />
        </InfoForm>
      </div>
    );
  }
}
