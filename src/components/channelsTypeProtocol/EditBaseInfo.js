/*
 * @Description: 通道类型协议新建/编辑 -基本信息
 * @Author: XuWenKang
 * @Date:   2017-09-21 15:27:31
 * @Last Modified by: zhushengnan
 * @Last Modified time: 2018-01-11 09:27:19
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import { Input } from 'antd';
import Select from '../common/Select';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import InfoForm from '../common/infoForm';
import DropDownSelect from '../common/dropdownSelect';
import CustomSwitch from '../common/customSwitch';
import { protocolIsShowSwitch } from '../../utils/permission';
import { time } from '../../helper';
import config from '../../routes/channelsTypeProtocol/config';

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
// 紫金通道 subType，新建协议判断切换的子类型
const violetGold = '507070';
const { subscribeArray } = config;
export default class EditBaseInfo extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询客户
    onSearchCutList: PropTypes.func.isRequired,
    custList: PropTypes.array.isRequired,
    templateList: PropTypes.array.isRequired,
    // 查询子类型/操作类型
    queryTypeVaules: PropTypes.func.isRequired,
    operationTypeList: PropTypes.array,
    subTypeList: PropTypes.array,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    // 编辑时传入元数据
    formData: PropTypes.object,
    // 查询协议接口
    getProtocolDetail: PropTypes.func,
    // 多账户切换
    onChangeMultiCustomer: PropTypes.func,
    // 清空附件
    resetUpload: PropTypes.func,
    // 清除协议产品
    resetProduct: PropTypes.func,
    // 验证客户
    getCustValidate: PropTypes.func,
    // 清除数据
    clearPropsData: PropTypes.func,
    // 模版数据
    template: PropTypes.object,
    // 是否是编辑
    isEdit: PropTypes.bool,
    // 协议 ID 列表
    protocolList: PropTypes.array,
    // 获取协议 ID 列表
    queryProtocolList: PropTypes.func,
    onChangeProtocolNumber: PropTypes.func,
    getFlowStepInfo: PropTypes.func,
    // 切换操作类型时向父组件返回数据
    changeOperationType: PropTypes.func.isRequired,
  }

  static defaultProps = {
    formData: EMPTY_OBJECT,
    getProtocolDetail: () => { },
    operationTypeList: EMPTY_ARRAY,
    onChangeMultiCustomer: () => { },
    resetUpload: () => { },
    resetProduct: () => { },
    clearPropsData: () => { },
    getCustValidate: () => { },
    queryProtocolList: () => { },
    protocolList: [],
    template: {},
    subTypeList: [],
    isEdit: false,
    onChangeProtocolNumber: () => { },
    getFlowStepInfo: () => { },
  }

  constructor(props) {
    super(props);
    const { formData = {}, templateList, location: { pathname } } = props;
    // 是否是编辑页面
    const isEditPage = pathname.indexOf('/edit') > -1;
    let flag = false;
    if (!_.isEmpty(formData)) {
      flag = _.includes(subscribeArray, formData.operationType);
    }
    let stateObj = {};
    if (isEditPage) {
      stateObj = {
        // 所选操作类型
        operationType: formData.operationType,
        // 所选子类型
        subType: formData.subType,
        // 客户信息
        client: {
          cusId: formData.custId,
          custType: formData.custType,
          brokerNumber: formData.econNum,
        },
        // 所选协议模板
        protocolTemplate: {
          prodName: formData.templateId,
          rowId: formData.templateId,
        },
        // 是否多账户
        multiUsedFlag: formData.multiUsedFlag === 'Y',
        // 是否订购十档行情
        levelTenFlag: formData.levelTenFlag === 'Y',
        // 备注
        content: formData.content,
        // 协议编号
        protocolNumber: formData.agreementNum,
        // 协议开始时间
        startDt: formData.startDt,
        // 协议有效时间
        vailDt: formData.vailDt,
        needMutliAndTen: formData.operationType === '协议订购',
      };
    } else {
      stateObj = {
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
        // 协议编号
        protocolNumber: '',
        needMutliAndTen: true,
      };
    }
    this.state = {
      ...stateObj,
      templateList,
      isSubscribe: flag,
      isEditPage,
      isHightSpeed: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      templateList: preTL,
    } = this.props;
    const {
      templateList: nextTL,
      formData: nextFD,
    } = nextProps;
    // 设定新的模版列表数据
    if (!_.isEqual(preTL, nextTL)) {
      const { templateId } = nextFD;
      const filterTemplate = _.filter(nextTL, o => o.prodName === templateId);
      this.setState({
        templateList: nextTL,
        protocolTemplate: (filterTemplate && filterTemplate[0]) || {},
      });
    }
  }

  // 向外传递数据
  @autobind
  getData() {
    return this.state;
  }

  @autobind
  compareFormData(next) {
    const {
      contactName,
      templateId,
      multiUsedFlag,
      levelTenFlag,
      startDt,
      vailDt,
    } = next;
    this.setState({
      needMutliAndTen: false,
      contactName,
      templateId,
      protocolTemplate: {
        ...this.state.protocolTemplate,
        prodName: templateId,
        rowId: templateId,
      },
      multiUsedFlag: multiUsedFlag === 'Y',
      levelTenFlag: levelTenFlag === 'Y',
      startDt,
      vailDt,
      // content,
      // client: {
      //   cusId: custId,
      //   custType,
      //   brokerNumber: econNum,
      // },
    });
  }

  // 通用Select Change方法
  @autobind
  handleSelectChange(key, value) {
    const {
      queryTypeVaules,
      onSearchCutList,
      clearPropsData,
      resetProduct,
      changeOperationType,
    } = this.props;
    let sub = true;
    let isHightSpeed = false;
    let needMutliAndTen = this.state.needMutliAndTen;
    if (key === 'operationType') {
      sub = _.includes(subscribeArray, value);
      if (sub) {
        needMutliAndTen = true;
      }
      changeOperationType(value);
    } else if (key === 'subTyp') {
      // 判断子类型是否为紫金通道，不是则不展现多用户和十档行情选择
      if (value !== violetGold) {
        isHightSpeed = true;
      }
    }
    clearPropsData();
    resetProduct();
    this.setState({
      content: '',
      operationType: '',
      client: EMPTY_OBJECT,
      protocolTemplate: EMPTY_OBJECT,
      multiUsedFlag: false,
      levelTenFlag: false,
      startDt: '',
      vailDt: '',
      protocolNumber: '',
      isSubscribe: sub,
      needMutliAndTen,
      [key]: value,
      isHightSpeed,
    }, () => {
      const { onChangeMultiCustomer, resetUpload } = this.props;
      const { isEditPage } = this.state;
      // 清除详情
      this.clearDetailData();
      // 清除客户列表
      this.selectCustComponent.clearValue();
      // 清除协议模版
      if (this.selectTemplateComponent) {
        this.selectTemplateComponent.clearValue();
      }
      // 清除下挂客户
      onChangeMultiCustomer(false);
      if (!isEditPage) {
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
        const { subType } = this.state;
        if (_.includes(subscribeArray, value)) {
          // 子类型发生变化且为订购时查询协议模板列表
          queryTypeVaules({
            typeCode: 'templateId',
            subType,
            operationType: value,
          });
        }
      }
    });
  }

  // 清除数据
  @autobind
  clearDetailData() {
    this.setState({
      contactName: '',
      templateId: '',
      protocolTemplate: {},
      multiUsedFlag: false,
      levelTenFlag: false,
      startDt: '',
      vailDt: '',
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
      queryProtocolList,
      resetProduct,
    } = this.props;
    // 清除详情
    const { isSubscribe, operationType, isEditPage, subType } = this.state;
    const { cusId, custType, brokerNumber } = value;
    const validatePayload = {
      id: cusId,
      custType,
      econNum: brokerNumber,
      agrId: '',
      agrType: subType,
      templateId: '',
      type: 'PriCust',
    };
    // 清除下挂客户
    onChangeMultiCustomer(false);
    if (!isEditPage) {
      // 清除附件
      resetUpload();
    }
    clearPropsData();
    resetProduct();
    this.clearDetailData();
    this.setState({
      ...this.state,
      content: '',
      protocolTemplate: EMPTY_OBJECT,
      multiUsedFlag: false,
      levelTenFlag: false,
      startDt: '',
      vailDt: '',
      protocolNumber: '',
    }, () => {
      this.handleSearchClient();
      this.selectCustComponent.clearSearchValue();
    });
    getCustValidate(validatePayload).then(
      () => {
        this.setState({
          client: value,
        }, () => {
          if (isSubscribe) {
            // 清空协议模版
            this.selectTemplateComponent.clearValue();
          } else {
            // 查询协议 ID 列表
            queryProtocolList({
              custId: cusId,
              subType,
              operationType,
            });
          }
        });
      },
      () => {
        // 清除客户列表
        this.selectCustComponent.clearValue();
        this.setState({
          client: {},
        });
      },
    );
  }

  // 查询协议产品列表
  @autobind
  queryChannelProtocolProduct() {
    const { client, protocolTemplate, subType } = this.state;
    const { queryChannelProtocolProduct } = this.props;
    if (!_.isEmpty(client) && !_.isEmpty(protocolTemplate)) {
      queryChannelProtocolProduct({
        subType,
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
  handleSearchClient(v = '') {
    const { subType } = this.state;
    this.props.onSearchCutList({
      type: '05', // type 根据后端要求写死
      subType,
      keyword: v,
    });
  }

  // 选择协议模板
  @autobind
  handleSelectTemplate(value) {
    this.setState({
      content: '',
      multiUsedFlag: false,
      levelTenFlag: false,
      protocolTemplate: value,
    }, () => {
      const {
        queryChannelProtocolItem,
        onChangeMultiCustomer,
        resetUpload,
        resetProduct,
      } = this.props;
      const { isEditPage, subType } = this.state;
      // 清除下挂客户
      onChangeMultiCustomer(false);
      if (!isEditPage) {
        // 清除附件
        resetUpload();
      }
      resetProduct();
      queryChannelProtocolItem({
        subType,
        keyword: value.rowId,
      });
      // 触发查询协议产品列表
      this.queryChannelProtocolProduct();
    });
  }

  // 根据填入关键词筛选协议模板
  @autobind
  handleSearchTemplate(value) {
    console.warn('进入搜索方法', value);
  }

  // 修改备注
  @autobind
  handleChangeContent(e) {
    this.setState({
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

  // 选择协议 ID
  @autobind
  handleSelectProtocol(key, value) {
    const [id, flowId] = value.split('~');
    const {
      getProtocolDetail,
      onChangeProtocolNumber,
      getFlowStepInfo,
    } = this.props;
    this.setState({
      [key]: id,
    }, () => {
      getProtocolDetail({
        needAttachment: false,
        needFlowHistory: false,
        data: {
          flowId,
        },
      }).then(() => {
        const { formData: nextFD } = this.props;
        const { operationType } = this.state;
        getFlowStepInfo({
          flowId,
          operate: 1,
        });
        this.compareFormData(nextFD);
        onChangeProtocolNumber(operationType);
      });
    });
  }

  render() {
    const {
      custList,
      operationTypeList,
      subTypeList,
      formData: protocolDetail,
      protocolList,
    } = this.props;
    const {
      isEditPage,
      subType,
      operationType,
      multiUsedFlag,
      levelTenFlag,
      protocolTemplate,
      templateList,
      client,
      isSubscribe,
      protocolNumber,
      content,
      startDt,
      vailDt,
      needMutliAndTen,
      isHightSpeed,
    } = this.state;
    let newProtocolList = [];
    if (protocolList && protocolList.length) {
      newProtocolList = protocolList.map(item => ({
        show: true,
        label: item.id,
        value: `${item.id}~${item.flowId}`,
      }));
    }
    if (isEditPage) {
      newProtocolList = [
        {
          show: true,
          label: protocolNumber,
          value: protocolNumber,
        },
      ];
    }
    const accountNumber = protocolIsShowSwitch(protocolTemplate.rowId || '', subType, needMutliAndTen) ?
      (<div>
        <InfoForm label="是否多账户使用" >
          <CustomSwitch
            name="multiUsedFlag"
            value={multiUsedFlag}
            onChange={this.handleChangeSwitchValue}
          />
        </InfoForm>
        <InfoForm label="是否订购十档行情">
          <CustomSwitch
            name="levelTenFlag"
            value={levelTenFlag}
            onChange={this.handleChangeSwitchValue}
          />
        </InfoForm>
      </div>
      )
      :
      null;
    return (
      <div className={styles.editWrapper}>
        <InfoTitle head="基本信息" />
        {
          isEditPage ?
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
                  value={`${client.custName || ''} ${client.brokerNumber || ''}` || ''}
                  searchList={custList}
                  emitSelectItem={this.handleSelectClient}
                  emitToSearch={this.handleSearchClient}
                  boxStyle={dropDownSelectBoxStyle}
                  ref={ref => this.selectCustComponent = ref}
                />
              </InfoForm>
            </div>
        }
        {
          isSubscribe ?
            <InfoForm label="协议模板" required>
              <DropDownSelect
                placeholder="协议模板"
                showObjKey="prodName"
                objId="rowId"
                value={isEditPage ? `${protocolTemplate.prodName || ''} ${protocolTemplate.rowId || ''}` : ''}
                searchList={templateList}
                emitSelectItem={this.handleSelectTemplate}
                emitToSearch={this.handleSearchTemplate}
                boxStyle={dropDownSelectBoxStyle}
                ref={ref => this.selectTemplateComponent = ref}
              />
            </InfoForm>
            :
            <div>
              {
                isEditPage ?
                  <InfoItem label="协议编号" value={protocolNumber || ''} />
                  :
                  <InfoForm label="协议编号" required>
                    <Select
                      name="protocolNumber"
                      data={newProtocolList}
                      value={protocolNumber}
                      onChange={this.handleSelectProtocol}
                    />
                  </InfoForm>
              }
              <InfoItem label="协议模版" value={protocolTemplate.prodName || ''} />
            </div>
        }
        {
          !isHightSpeed ? accountNumber : null
        }
        <InfoItem label="协议开始日期" value={time.format(startDt)} />
        <InfoItem label="协议有效期" value={time.format(vailDt)} />
        <InfoForm label="备注">
          <TextArea
            onChange={this.handleChangeContent}
            value={content}
          />
        </InfoForm>
      </div>
    );
  }
}
