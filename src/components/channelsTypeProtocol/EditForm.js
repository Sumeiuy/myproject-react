/*
 * @Description: 通道类型协议新建/修改 页面
 * @Author: XuWenKang
 * @Date:   2017-09-19 14:47:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-14 10:49:25
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import EditBaseInfo from './EditBaseInfo';
import InfoTitle from '../common/InfoTitle';
import SearchSelect from '../common/Select/SearchSelect';
import CommonTable from '../common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import Transfer from '../../components/common/biz/TableTransfer';
import { seibelConfig } from '../../config';
import styles from './editForm.less';

const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
// const EMPTY_PARAM = '暂无';
// const BOOL_TRUE = true;
const {
  underCustTitleList,  // 下挂客户表头集合
  protocolClauseTitleList,  // 协议条款表头集合
  protocolProductTitleList,  // 协议产品表头集合
  attachmentMap,  // 附件类型数组
} = seibelConfig.channelsTypeProtocol;
const attachmentRequired = {
  // 没有下挂客户时，需要必传的附件类型
  noCust: [attachmentMap[0].type],
  // 有下挂客户时，需要必传的附件类型
  hasCust: [
    attachmentMap[0].type,
    attachmentMap[1].type,
    attachmentMap[2].type,
  ],
};
export default class EditForm extends PureComponent {
  static propTypes = {
    // 查询客户
    onSearchCutList: PropTypes.func,
    canApplyCustList: PropTypes.array,
    // 模板列表
    templateList: PropTypes.array.isRequired,
    // 协议详情-编辑时传入
    protocolDetail: PropTypes.object,
    // 查询子类型/操作类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationTypeList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    // 查询协议编号
    // onSearchProtocolNum: PropTypes.func.isRequired,
    // protocolNumList: PropTypes.array,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    // 所选模板对应协议条款列表
    protocolClauseList: PropTypes.array.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    // 协议产品列表
    protocolProductList: PropTypes.array.isRequired,
    // 保存详情
    saveProtocolData: PropTypes.func.isRequired,
    // 下挂客户列表
    underCustList: PropTypes.array.isRequired,
    // 下挂客户接口
    onQueryCust: PropTypes.func.isRequired,
    // 清空props数据
    clearPropsData: PropTypes.func.isRequired,
    // 验证客户
    getCustValidate: PropTypes.func.isRequired,
    // 附件列表
    attachmentList: PropTypes.array,
  }

  static defaultProps = {
    onSearchCutList: () => {},
    canApplyCustList: EMPTY_LIST,
    protocolDetail: EMPTY_OBJECT,
    attachmentList: [],
  }

  constructor(props) {
    super(props);
    const { underCustList } = props;
    const isEdit = !_.isEmpty(props.protocolDetail);// 下挂客户组件需要的数据列表
    this.state = {
      isEdit,
      // 附件类型列表
      attachmentTypeList: attachmentMap,
      // 下挂客户表格数据
      cust: EMPTY_LIST,
      // 所选协议产品列表
      productList: EMPTY_LIST,
      // 是否多账户
      multiUsedFlag: false,
      underCustList,
    };
  }

  componentWillMount() {
    // 更新附件组件必传项
    const hasCust = false;
    this.setUploadConfig(hasCust);
  }

  componentWillReceiveProps(nextProps) {
    // const { protocolDetail: prePD } = this.props;
    const { protocolDetail: nextPD, attachmentList } = nextProps;
    if (!_.isEmpty(nextPD) && attachmentList.length) {
      const { cust, item: productList } = nextPD;
      const assignAttachment = attachmentMap.map((item) => {
        let newItem = {};
        attachmentList.forEach((child) => {
          if (item.title === child.title) {
            newItem = {
              ...item,
              ...child,
            };
          } else {
            newItem = item;
          }
        });
        return newItem;
      });
      const hasCust = nextPD.multiUsedFlag === 'Y' || false;
      this.setState({
        isEdit: true,
        // 附件类型列表
        attachmentTypeList: assignAttachment,
        // 下挂客户表格数据
        cust,
        // 所选协议产品列表
        productList,
        multiUsedFlag: hasCust,
      }, () => this.setUploadConfig(hasCust));
    }
  }

  componentWillUnmount() {
    // 销毁组件时清空数据
    const { clearPropsData } = this.props;
    clearPropsData();
  }

  // 切换多账户
  @autobind
  onChangeMultiCustomer(boolean) {
    // 切换时隐藏显示下挂客户组件，并清空数据
    this.setState({
      multiUsedFlag: boolean,
      cust: [],
    });
  }

  // 向父组件提供数据
  @autobind
  getData() {
    const baseInfoData = this.editBaseInfoComponent.getData();
    const { protocolClauseList } = this.props;
    const { productList, attachmentTypeList, cust } = this.state;
    const formData = {
      subType: baseInfoData.subType,
      custId: baseInfoData.client.cusId,
      custType: baseInfoData.client.custType,
      econNum: baseInfoData.client.brokerNumber,
      startDt: '',
      vailDt: '',
      content: baseInfoData.content,
      operationType: baseInfoData.operationType,
      templateId: baseInfoData.protocolTemplate.rowId,
      multiUsedFlag: baseInfoData.multiUsedFlag ? 'Y' : 'N',
      levelTenFlag: baseInfoData.levelTenFlag ? 'Y' : 'N',
      item: productList,
      term: protocolClauseList,
      attachment: attachmentTypeList,
      cust,
    };
    return formData;
  }

  // 设置上传配置项
  @autobind
  setUploadConfig(hasCust) {
    const { attachmentTypeList } = this.state;
    // 找出需要必传的数组
    const requiredArr = hasCust ? attachmentRequired.hasCust : attachmentRequired.noCust;
    // 将附件数组做必传项配置
    const attachmentMapRequired = attachmentTypeList.map((item) => {
      if (_.includes(requiredArr, item.type)) {
        return {
          ...item,
          required: true,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: attachmentMapRequired,
    });
  }
  // 打开弹窗
  @autobind
  showModal(modalKey) {
    this.setState({
      [modalKey]: true,
    });
  }

  // 关闭弹窗
  @autobind
  closeModal(modalKey) {
    this.setState({
      [modalKey]: false,
      defaultData: {},
      editClause: false,
    });
  }

  // 添加协议产品
  @autobind
  handleTransferChange(flag, newSelect, changeSecondArray) {
    this.setState({
      ...this.state,
      productList: changeSecondArray,
    });
  }

  // 下挂客户添加事件
  @autobind
  changeFunction(value) {
    const baseInfoData = this.editBaseInfoComponent.getData();
    const { cust } = this.state;
    this.setState({
      underCustList: [],
    });
    if (baseInfoData.client.cusId === value.custId) {
      message.error('已选择的客户不能添加到下挂客户');
      return;
    }
    const filterCust = _.filter(cust, o => o.econNum === value.econNum);
    if (_.isEmpty(value)) {
      message.error('请选择客户');
      return;
    }
    if (filterCust.length) {
      message.error('相同客户不能重复添加');
      return;
    }
    const { subType, protocolTemplate: { rowId } } = baseInfoData;
    const { custId, econNum, subCustType } = value;
    const validatePayload = {
      id: custId,
      custType: subCustType === '个人客户' ? 'per' : 'org',
      econNum,
      agrId: '',
      agrType: subType,
      templateId: rowId,
      type: 'ItuCust',
    };
    const { getCustValidate } = this.props;
    getCustValidate(validatePayload).then(() => {
      const hasCust = true;
      this.setState({
        cust: [...cust, value],
      }, this.setUploadConfig(hasCust));
    });
  }

  // 下挂客户搜索事件
  @autobind
  changeValue(value) {
    const { onQueryCust } = this.props;
    if (_.isEmpty(value)) {
      message.error('请输入客户号或姓名');
      return;
    }
    onQueryCust({
      keyWord: value,
    }).then(() => {
      this.setState({
        underCustList: this.props.underCustList,
      });
    });
  }

  // 表格删除事件
  @autobind
  deleteTableData(record, index) {
    const { cust } = this.state;
    const testArr = _.cloneDeep(cust);
    const newTableList = _.remove(testArr, (n, i) => i !== index);
    // 设置必传的附件
    const hasCust = Boolean(newTableList.length) || false;
    this.setState({
      cust: newTableList,
    }, this.setUploadConfig(hasCust));
  }

  // 文件上传成功
  @autobind
  handleUploadCallback(attachmentType, attachment) {
    const { attachmentTypeList } = this.state;
    const newAttachmentTypeList = attachmentTypeList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType) {
        return {
          ...item,
          uuid: attachment,
          length: length + 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: newAttachmentTypeList,
    });
  }

  // 文件删除成功
  @autobind
  handleDeleteCallback(attachmentType) {
    const { attachmentTypeList } = this.state;
    const newAttachmentTypeList = attachmentTypeList.map((item) => {
      const { type, length } = item;
      if (type === attachmentType && length > 0) {
        return {
          ...item,
          length: length - 1,
        };
      }
      return item;
    });
    this.setState({
      attachmentTypeList: newAttachmentTypeList,
    });
  }

  // 清除附件信息
  @autobind
  resetUpload() {
    const { attachmentTypeList } = this.state;
    const newAttachmentList = attachmentTypeList.map((item) => {
      if (item.length) {
        const type = `uploader${item.type}`;
        this[type].getWrappedInstance().resetUpload();
        return {
          ...item,
          length: 0,
          uuid: '',
        };
      }
      return {
        ...item,
      };
    });
    console.warn('resetUpload newAttachmentList', newAttachmentList);
    this.setState({
      productList: [],
      attachmentTypeList: newAttachmentList,
    });
    // this.EditFormComponent.getData();
  }


  render() {
    const {
      // 客户列表
      canApplyCustList,
      // 查询客户
      onSearchCutList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 模板列表
      templateList,
      // 操作类型列表
      operationTypeList,
      // 子类型列表
      subTypeList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
      // 协议产品列表
      protocolProductList,
      // 查询协议产品列表
      queryChannelProtocolProduct,
      // 验证客户
      getCustValidate,
      // 详情数据
      protocolDetail,
      // 清除数据
      clearPropsData,
    } = this.props;
    const {
      isEdit,
      cust,
      attachmentTypeList,
      multiUsedFlag,
      // 下挂客户列表
      underCustList,
    } = this.state;
    // 下挂客户表格中需要的操作
    const customerOperation = {
      column: {
        key: 'delete', // 'check'\'delete'\'view'
        title: '操作',
      },
      operate: this.deleteTableData,
    };
    // 添加协议产品组件props
    const pagination = {
      defaultPageSize: 5,
      pageSize: 5,
      size: 'small',
    };
    const transferProps = {
      firstTitle: '待选协议产品',
      secondTitle: '已选协议产品',
      firstData: protocolProductList,
      secondData: protocolDetail.item,
      firstColumns: protocolProductTitleList,
      secondColumns: protocolProductTitleList,
      transferChange: this.handleTransferChange,
      rowKey: 'prodRowId',
      scrollX: 1010,
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      supportSearchKey: [['prodCode'], ['prodName']],
    };
    const customerSelectList = underCustList.length ? underCustList.map(item => ({
      ...item,
      custStatus: '开通处理中',
    })) : EMPTY_LIST;
    return (
      <div className={styles.editComponent}>
        <div className={styles.editWrapper}>
          <EditBaseInfo
            queryChannelProtocolItem={queryChannelProtocolItem}
            onSearchCutList={onSearchCutList}
            custList={canApplyCustList}
            templateList={templateList}
            ref={ref => this.editBaseInfoComponent = ref}
            queryTypeVaules={queryTypeVaules}
            operationTypeList={operationTypeList}
            subTypeList={subTypeList}
            queryChannelProtocolProduct={queryChannelProtocolProduct}
            onChangeMultiCustomer={this.onChangeMultiCustomer}
            resetUpload={this.resetUpload}
            getCustValidate={getCustValidate}
            formData={protocolDetail}
            clearPropsData={clearPropsData}
            isEdit={isEdit}
          />
        </div>
        <div className={`${styles.editWrapper} ${styles.transferWrapper}`}>
          <InfoTitle
            head="协议产品"
          />
          <Transfer
            {...transferProps}
          />
        </div>
        <div className={styles.editWrapper}>
          <InfoTitle
            head="协议条款"
          />
          <CommonTable
            data={isEdit ? protocolDetail.term : protocolClauseList}
            titleList={protocolClauseTitleList}
          />
        </div>
        {
          multiUsedFlag ?
            <div className={styles.editWrapper}>
              <InfoTitle head="下挂客户" />
              <SearchSelect
                onAddCustomer={this.changeFunction}
                onChangeValue={this.changeValue}
                width="184px"
                labelName="客户"
                dataSource={customerSelectList}
              />
              <div className={styles.customerTable}>
                <CommonTable
                  data={cust}
                  titleList={underCustTitleList}
                  operation={customerOperation}
                />
              </div>
            </div>
          :
            null
        }
        <div className={styles.editWrapper}>
          <InfoTitle head="附件" />
          {
            attachmentTypeList.map((item) => {
              const uploaderElement = item.show ? (
                <MultiUploader
                  key={item.type}
                  edit
                  type={item.type}
                  title={item.title}
                  required={item.required}
                  attachment={isEdit ? item.attachment : ''}
                  attachmentList={isEdit ? item.attachmentList : []}
                  uploadCallback={this.handleUploadCallback}
                  deleteCallback={this.handleDeleteCallback}
                  ref={(ref) => { this[`uploader${item.type}`] = ref; }}
                />
              ) : null;
              return (
                <div key={item.type}>
                  {uploaderElement}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
