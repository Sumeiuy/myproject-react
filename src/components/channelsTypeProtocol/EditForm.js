/*
 * @Description: 通道类型协议新建/修改 页面
 * @Author: XuWenKang
 * @Date:   2017-09-19 14:47:08
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-02 14:02:29
*/
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { message } from 'antd';

import EditBaseInfo from './EditBaseInfo';
import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import SearchSelect from '../common/Select/SearchSelect';
import CommonTable from '../common/biz/CommonTable';
import MultiUploader from '../common/biz/MultiUploader';
import Transfer from '../../components/common/biz/TableTransfer';
import Button from '../common/Button';
import { seibelConfig } from '../../config';
import styles from './editForm.less';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// const EMPTY_PARAM = '暂无';
// const BOOL_TRUE = true;
const {
  underCustTitleList,  // 下挂客户表头集合
  protocolClauseTitleList,  // 协议条款表头集合
  protocolProductTitleList,  // 协议产品表头集合
  attachmentType,  // 附件类型数组
} = seibelConfig.channelsTypeProtocol;

export default class EditForm extends PureComponent {
  static propTypes = {
    // 查询客户
    onSearchCutList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 模板列表
    templateList: PropTypes.array.isRequired,
    // 协议详情-编辑时传入
    protocolDetail: PropTypes.object,
    // 查询子类型/操作类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationList: PropTypes.array.isRequired,
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
    underCustList: PropTypes.array,
    // 下挂客户接口
    onQueryCust: PropTypes.func.isRequired,
  }

  static defaultProps = {
    protocolDetail: EMPTY_OBJECT,
    underCustList: EMPTY_ARRAY,
  }

  constructor(props) {
    super(props);
    const isEdit = !_.isEmpty(props.protocolDetail);
    this.state = {
      isEdit,
      // 附件类型列表
      attachmentTypeList: attachmentType,
      // 下挂客户表格数据
      customerTableList: [],
    };
  }

  // 向父组件提供数据
  @autobind
  getData() {
    const baseInfoData = this.editBaseInfoComponent.getData();
    return Object.assign(EMPTY_OBJECT, baseInfoData, this.state);
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
    console.log('protocolList', flag, newSelect, changeSecondArray);
  }

  // 下挂客户添加事件
  @autobind
  changeFunction(value) {
    const { customerTableList } = this.state;
    this.setState({
      customerList: [...customerTableList, value],
    });
  }

  // 下挂客户搜索事件
  @autobind
  changeValue(value) {
    const { onQueryCust } = this.props;
    onQueryCust({
      keyWord: value,
    });
  }
  // 表格删除事件
  @autobind
  deleteTableData(record, index) {
    const { customerTableList } = this.state;
    const testArr = _.cloneDeep(customerTableList);
    const newTableList = _.remove(testArr, (n, i) => i !== index);
    this.setState({
      customerTableList: newTableList,
    });
  }

  // 文件上传成功
  @autobind
  handleUploadCallback(idx, attachment) {
    const { attachmentTypeList } = this.state;
    const newTypeList = _.cloneDeep(attachmentTypeList);
    newTypeList[idx].uuid = attachment;
    newTypeList[idx].length++;
    this.setState({
      attachmentTypeList: newTypeList,
    });
  }

  // 文件删除成功
  @autobind
  handleDeleteCallback(idx) {
    const { attachmentTypeList } = this.state;
    const newTypeList = _.cloneDeep(attachmentTypeList);
    if (newTypeList[idx].length > 0) {
      newTypeList[idx].length--;
    }
    this.setState({
      attachmentTypeList: newTypeList,
    });
  }

  // 检查附件必传项目
  @autobind
  checkAttachment() {
    const { attachmentTypeList } = this.state;
    const newAttachment = [];
    for (let i = 0; i < attachmentTypeList.length; i++) {
      const item = attachmentTypeList[i];
      if (item.length <= 0 && item.required) {
        message.error(`${item.title}附件为必传项`);
        return;
      }
      newAttachment.push({
        uuid: item.uuid,
        attachmentType: item.title,
        attachmentComments: item.attachmentComments,
      });
    }
    console.warn('newAttachment', newAttachment);
  }

  @autobind
  sendPayload() {
    const { saveProtocolData } = this.props;
    const attachment = [
      {
        attachmentComments: '',
        attachmentType: '申请表',
        uuid: '03f1f8eb-e338-41da-b8d1-c28565ff29a1',
      },
      {
        attachmentComments: '',
        attachmentType: '尽职调查表',
        uuid: '17442e87-4139-4511-a1f2-34e8322652c4',
      },
      {
        attachmentComments: '',
        attachmentType: '服务协议',
        uuid: '86c10985-99db-493a-a2ce-b3a932ffed51',
      },
      {
        attachmentComments: '',
        attachmentType: '承诺书',
        uuid: 'ad16723a-cbee-4e2f-b323-07f28b9286ff',
      },
      {
        attachmentComments: '',
        attachmentType: '授权委托书',
        uuid: 'cb8ded7a-6b6f-4eae-b27e-47962b86c12c',
      },
      {
        attachmentComments: '',
        attachmentType: '影像资料',
        uuid: 'a69e81ca-f3fe-4d21-81b0-213fd03d31be',
      },
      {
        attachmentComments: '',
        attachmentType: '其他',
        uuid: 'efe22106-3193-4b4a-9604-89bff1586270',
      },
    ];
    const obj = {
      id: '1-43WJSB9',
      action: null,
      subType: '0502',
      agreementNum: '1-43WJSB9',
      contactId: '1-2U9PLX2',
      accountId: '',
      custId: '1-2U9PLX2',
      custType: 'Contact',
      econNum: '045000028903',
      startDt: '10/19/2017',
      vailDt: '12/25/2017',
      content: '',
      flowid: 'B4BC46074B1F7649A9275DD97D41F2A1',
      applyId: '5142',
      empId: null,
      createdDt: null,
      contactName: '1-2U9PLX2',
      accountName: '',
      createdBy: '1-OXZ5',
      lastUpdateBy: '1-OXZ5',
      status: '01',
      divisionId: '1-5XNA',
      divisionName: null,
      createdName: '王华',
      lastUpdateName: '王华',
      approver: '',
      workflowName: '',
      workflowNode: '',
      workflowCode: 'B4BC46074B1F7649A9275DD97D41F2A1',
      attachment,
      operationType: '协议订购',
      templateId: '紫金高速通道',
      multiUsedFlag: '',
      levelTenFlag: 'N',
      item: [
        {
          rk: null,
          agrId: '1-43WJSB9',
          prodRowId: null,
          prodCode: 'SP0078',
          prodName: '紫金高速通道',
          prodType: '服务',
          prodTypeName: null,
          prodSubType: '',
          prodSubTypeName: null,
          commFlg: null,
          informFlg: null,
          packageFlg: null,
          discountFlg: null,
          price: '',
          riskMatch: null,
          termMatch: null,
          varietyMatch: null,
          confirmType: '',
        },
      ],
      term: [
        {
          rowId: null,
          agrId: '1-43WJSB9',
          seqNum: null,
          termsName: 'T21300',
          terms: null,
          paramName: null,
          param: null,
          typeCd: null,
          descText: null,
          furturePromotion: '',
          preCondition: '',
          xSynchBusSys: null,
          paraVal: '',
        },
      ],
      cust: [],
    };
    saveProtocolData(obj);
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
      operationList,
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
      underCustList,
    } = this.props;
    const {
      isEdit,
      customerTableList,
      attachmentTypeList,
    } = this.state;
    // 新建协议产品按钮
    const buttonProps = {
      type: 'primary',
      size: 'large',
      className: styles.addClauseButton,
      ghost: true,
      onClick: () => this.showModal('addProtocolProductModal'),
    };
    // 拟稿人信息 TODO 暂时写死在前端
    const draftInfo = {
      name: '南京营业部 张全蛋',
      date: '2017/08/31',
      status: '1',
    };
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
      firstColumns: protocolProductTitleList,
      secondColumns: protocolProductTitleList,
      transferChange: this.handleTransferChange,
      rowKey: 'key',
      isScrollX: true,
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      supportSearchKey: [['productCode'], ['productName']],
    };
    // 下挂客户组件需要的数据列表
    const customerSelectList = underCustList.map(item => ({
      ...item,
      status: '订购处理中',
    }));
    console.warn('customerSelectList', customerSelectList);
    const testCust = [
      {
        custName: '1-10004HU1',
        econNum: '024000030882',
        subCustType: 'per',
        custStatus: '订购处理中',
      },
      {
        custName: '1-10004HU2',
        econNum: '024000030882',
        subCustType: 'per',
        custStatus: '订购处理中',
      },
      {
        custName: '1-10004HU3',
        econNum: '024000030882',
        subCustType: 'per',
        custStatus: '订购处理中',
      },
    ];
    return (
      <div className={styles.editComponent}>
        <EditBaseInfo
          queryChannelProtocolItem={queryChannelProtocolItem}
          onSearchCutList={onSearchCutList}

          custList={canApplyCustList}
          templateList={templateList}
          ref={ref => this.editBaseInfoComponent = ref}
          queryTypeVaules={queryTypeVaules}
          operationList={operationList}
          subTypeList={subTypeList}
          queryChannelProtocolProduct={queryChannelProtocolProduct}
        />
        {
          isEdit ?
            <div className={styles.editWrapper}>
              <InfoTitle head="拟稿信息" />
              <InfoItem label="拟稿人" value={draftInfo.name} />
              <InfoItem label="提请时间" value={draftInfo.date} />
              <InfoItem label="状态" value={draftInfo.status} />
            </div>
            :
            null
        }
        <div className={styles.editWrapper}>
          <InfoTitle
            head="协议产品"
          />
          <Button {...buttonProps}>新建</Button>
          <Transfer
            {...transferProps}
          />
        </div>
        <div className={`${styles.editWrapper} ${styles.transferWrapper}`}>
          <InfoTitle
            head="协议条款"
          />
          <CommonTable
            data={protocolClauseList}
            titleList={protocolClauseTitleList}
          />
        </div>
        <div className={styles.editWrapper}>
          <InfoTitle head="下挂客户" />
          <SearchSelect
            onAddCustomer={this.changeFunction}
            onChangeValue={this.changeValue}
            width="184px"
            labelName="客户"
            dataSource={testCust}
          />
          <div className={styles.customerTable}>
            <CommonTable
              data={customerTableList || []}
              titleList={underCustTitleList}
              operation={customerOperation}
            />
          </div>
        </div>
        <div className={styles.editWrapper}>
          <InfoTitle head="附件" />
          {
            attachmentTypeList.map((item, index) => {
              const uploaderElement = item.show ? (
                <MultiUploader
                  attachment={''}
                  title={item.title}
                  required={item.required}
                  type={item.key}
                  index={index}
                  key={item.key}
                  attachmentList={[]}
                  uploadCallback={this.handleUploadCallback}
                  deleteCallback={this.handleDeleteCallback}
                  edit
                />
              ) : null;
              return (
                <div key={item.key}>
                  {uploaderElement}
                </div>
              );
            })
          }
        </div>
        <button onClick={this.sendPayload}>提交</button>
      </div>
    );
  }
}
