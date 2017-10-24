/**
 * @file components/commissionAdjustment/CreateNewApprovalBoard.js
 * @description 新建佣金调整、批量佣金调整、资讯订阅、资讯退订弹出框
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Input, Icon, message } from 'antd';
import _ from 'lodash';

import confirm from '../common/Confirm/confirm';
import CommonModal from '../common/biz/CommonModal';
import CommonUpload from '../common/biz/CommonUpload';
import Transfer from '../common/biz/TableTransfer';
import ChoiceApproverBoard from './ChoiceApproverBoard';
import AddCustomer from './AddCustomer';
import InfoTitle from '../common/InfoTitle';
import Select from '../common/Select';
import AutoComplete from '../common/AutoComplete';
import ProductsDropBox from './ProductsDropBox';
import OtherCommissionSelectList from './OtherCommissionSelectList';
import CommissionLine from './CommissionLine';
import SelectAssembly from './SelectAssembly';
import { seibelConfig } from '../../config';
import {
  pagination,
  singleColumns,
} from './commissionTransferHelper/transferPropsHelper';

import styles from './createNewApprovalBoard.less';

// 临时设置的单佣金调整需要的产品结构Mock数据
import {
  subscribelData,
  unsubcribeData,
  productColumns,
} from '../../routes/templeModal/MockTableData';

const { TextArea } = Input;
const { commission: { subType }, comsubs: commadj } = seibelConfig;
// 给subType去除全部的选项
const newSubTypes = _.filter(subType, item => !!item.value);
// 增加一个"请选择申请类型的option"
newSubTypes.unshift({
  show: true,
  label: '请选择申请类型',
  value: '',
});

// 其他佣金率的参数名称数组
const otherComs = [
  'zqCommission',
  'stkCommission',
  'creditCommission',
  'ddCommission',
  'hCommission',
  'dzCommission',
  'coCommission',
  'stbCommission',
  'oCommission',
  'doCommission',
  'hkCommission',
  'bgCommission',
  'qCommission',
  'dqCommission',
  'opCommission',
  'dCommission',
];

export default class CreateNewApprovalBoard extends PureComponent {
  static propTypes = {
    modalKey: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    onClose: PropTypes.func,
    onSearchApplyCust: PropTypes.func.isRequired,
    targetProductList: PropTypes.array,
    approverList: PropTypes.array,
    customerList: PropTypes.array,
    validateResult: PropTypes.string,
    validataLoading: PropTypes.bool,
    queryProductList: PropTypes.func.isRequired,
    validateCust: PropTypes.func.isRequired,
    onBatchSubmit: PropTypes.func.isRequired,
    otherRatios: PropTypes.array,
    empInfo: PropTypes.object.isRequired,
    gjCommission: PropTypes.array.isRequired,
    queryGJCommission: PropTypes.func.isRequired,
    getSingleOtherRates: PropTypes.func.isRequired,
    singleOtherRatio: PropTypes.array.isRequired,
    // 获取单佣金调整中的产品列表
    getSingleProductList: PropTypes.func.isRequired,
    singleComProductList: PropTypes.array.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 单佣金调整客户列表
    querySingleCustList: PropTypes.func.isRequired,
    singleCustList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    visible: false,
    validateResult: '',
    validataLoading: false,
    onClose: () => {},
    targetProductList: [],
    customerList: [],
    approverList: [],
    otherRatios: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      approvalType: '',
      remark: '',
      targetProduct: '',
      choiceApprover: false,
      newCommission: '0.16',
      approverName: '',
      approverId: '',
      custLists: [],
      otherComReset: new Date().getTime(), // 用来判断是否重置
      customerRowId: '', // 客户rowid
    };
  }

  // 判断当前是否某个子类型
  @autobind
  judgeSubtypeNow(assert) {
    const { approvalType } = this.state;
    if (Array.isArray(assert)) {
      return _.includes(assert, approvalType);
    }
    return approvalType === assert;
  }

  // 关闭弹出框后，清空页面数据
  @autobind
  clearApprovalBoard() {
    if (this.digital) this.digital.reset();
    if (this.addCustomer) this.addCustomer.clearCustList();
    this.setState({
      approvalType: '',
      remark: '',
      targetProduct: '',
      choiceApprover: false,
      newCommission: '0.16',
      approverName: '',
      approverId: '',
      custLists: [],
      otherComReset: new Date().getTime(),
      customerRowId: '',
    });
  }

  // 关闭弹窗
  @autobind
  closeModal() {
    // 此处需要弹出确认框
    confirm({
      shortCut: 'close',
      onOk: this.clearBoardAllData,
    });
  }

  // 清空弹出层数据
  @autobind
  clearBoardAllData() {
    const { modalKey, onClose } = this.props;
    this.clearApprovalBoard();
    onClose(modalKey);
  }

  // 提交
  @autobind
  handleSubmitApprovals(key) {
    const {
      newCommission,
      targetProduct,
      remark,
      approverId,
      custLists,
    } = this.state;
    // 判断什么时候能够提交
    if (_.isEmpty(targetProduct)) {
      message.error('请选择目标产品');
      return;
    }
    if (_.isEmpty(custLists)) {
      message.error('请添加客户');
      return;
    }
    if (_.isEmpty(approverId)) {
      message.error('审批人员不能为空');
      return;
    }
    // 挑选出用户选择的其他佣金率
    const otherCommissions = _.pick(this.state, otherComs);
    const { empInfo: { occDivnNum, empNum } } = this.props;
    const submitParams = {
      custLists,
      newCommsion: newCommission,
      prodInfo: { prdCode: targetProduct },
      aprovaluser: approverId,
      remark,
      loginUser: empNum,
      orgId: occDivnNum,
      ...otherCommissions,
    };
    // 提交
    this.props.onBatchSubmit(submitParams);
    this.props.onClose(key);
    this.clearApprovalBoard();
  }

  @autobind
  newApprovalBoxRef(input) {
    this.approvalBody = input;
  }

  // 选择申请子类型
  @autobind
  choiceApprovalSubType(name, key) {
    this.setState({
      [name]: key,
    });
    // 如果切换批量佣金需要，先查一把0.16下目标产品
    if (name === 'approvalType') {
      const { empInfo: { occDivnNum } } = this.props;
      this.props.queryProductList({
        prodCommision: 0.16,
        orgId: occDivnNum,
      });
    }
  }

  // 填写备注
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 根据目标佣金率查询批量佣金调整产品
  @autobind
  queryBatchProductList(param) {
    const { empInfo: { occDivnNum } } = this.props;
    this.props.queryProductList({ ...param, orgId: occDivnNum });
  }

  // 查询单佣金调整产品
  @autobind
  querySingleProductList(param) {
    this.props.getSingleProductList(param);
  }

  // 切换目标产品股基佣金率
  @autobind
  selectTargetGJCommission(v) {
    this.setState({
      newCommission: v.codeValue,
    });
    if (this.judgeSubtypeNow(commadj.batch)) {
      this.queryBatchProductList({ prodCommision: v.codeValue });
    }
    if (this.judgeSubtypeNow(commadj.single)) {
      this.querySingleProductList({
        custRowId: '1-xxxxxx', // TODO 此参数等客户接口写好需要修改
        commRate: v.codeValue,
      });
    }
  }

  // 客户输入目标股基佣金率调用方法
  @autobind
  changeTargetGJCommission(v) {
    this.props.queryGJCommission({
      codeValue: v,
    });
  }

  @autobind
  addCustomerRef(input) {
    this.addCustomer = input;
  }

  @autobind
  digitalRef(input) {
    this.digital = input;
  }

  // 清空用户选择的客户列表
  @autobind
  clearCustList() {
    this.addCustomer.clearCustList();
  }

  // 切换选择某个产品
  @autobind
  handleSelectProduct(targetProduct) {
    const { custLists } = this.state;
    this.setState({
      targetProduct,
    });
    if (!_.isEmpty(custLists)) {
      confirm({
        shortCut: 'changeproduct',
        onOk: this.clearCustList,
      });
    }
  }

  // 选择其他佣金比率
  @autobind
  changeOtherCommission(name, value) {
    this.setState({
      [name]: value,
    });
  }

  // 打开选择审批人弹窗
  @autobind
  openApproverBoard() {
    this.setState({
      choiceApprover: true,
    });
  }

  // 关闭审批人员选择弹出窗
  @autobind
  closeChoiceApproverModal() {
    this.setState({
      choiceApprover: false,
    });
  }

  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    this.setState({
      approverName: approver.empName,
      approverId: approver.empNo,
    });
  }

  // 根据用户输入查询客户列表
  @autobind
  handleCustomerListSearch(keyword) {
    this.props.onSearchApplyCust({
      keyword,
    });
  }

  // 根据用户输入查询单佣金客户列表
  @autobind
  handleChangeAssembly(keyword) {
    this.props.querySingleCustList({
      keyword,
    });
  }

  // 将用户选择添加的客户列表返回到弹出层，以便提交试用
  @autobind
  saveSelectedCustomerList(list) {
    this.setState({
      custLists: list,
    });
  }

  // 验证用户资格
  @autobind
  handleCustomerValidate(customer) {
    const { approvalType, newCommission, targetProduct } = this.state;
    const { cusId, custType } = customer;
    if (_.isEmpty(targetProduct)) {
      message.error('请选择目标产品', 2);
      return;
    }
    // 如果是批量佣金则传递businessType = 'BatchProcess'
    // '0202' ：表示批量佣金调整
    this.props.validateCust({
      businessType: approvalType === commadj.batch ? 'BatchProcess' : null,
      custId: cusId,
      custType,
      newCommission,
      prodCode: targetProduct,
      ignoreCatch: true,
    });
  }

  // 单佣金、咨询订阅、退订基本信息选择客户
  @autobind
  handleSelectAssembly(customer) {
    const { id } = customer;
    this.setState({
      customerRowId: id,
    });
  }

  // 单佣金调整穿梭变化的时候处理程序
  @autobind
  handleSingleTransferChange(item, array) {
    const { prodID } = item;
    this.props.queryThreeMatchInfo({
      custRowId: '1-xxxxxx', // TODO 后面需要修改成取客户row_id
      custType: 'per', // TODO 后面需要修改成取客户的类型
      prdCode: prodID,
    });
    // TODO需要根据接口将值传进state里面
    console.warn('handleSingleTransferChange', array);
  }

  // 单佣金调整选择子产品的时候的处理程序
  @autobind
  handleSingleTransferSubProductCheck() {

  }

  render() {
    const {
      modalKey,
      visible,
      targetProductList,
      approverList,
      validataLoading,
      validateResult,
      customerList,
      otherRatios,
      gjCommission,
      singleOtherRatio,
      singleComProductList,
      singleCustList,
    } = this.props;
    const newApproverList = approverList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });
    const newSingleProList = singleComProductList.map(p => ({ key: p.id, ...p }));
    const {
      newCommission,
      approvalType,
      remark,
      choiceApprover,
      approverName,
      approverId,
      otherComReset,
    } = this.state;
    const needBtn = !this.judgeSubtypeNow('');

    const uploadProps = {
      attachmentList: [{
        creator: '002332',
        attachId: '{6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
        name: '新建文本文档 (3).txt',
        size: '0',
        createTime: '2017/09/12 13:37:45',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={6795CB98-B0CD-4CEC-8677-3B0B9298B209}',
        realDownloadURL: '/attach/download?filename=%E6%96%B0%E5%BB%BA%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3+%283%29.txt&attachId={6795CB98-B0CD-4CEC-8677-3B0B9298B209',
      },
      {
        creator: '002332',
        attachId: '{2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
        name: '测试.docx',
        size: '11',
        createTime: '2017/09/12 11:53:36',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D}',
        realDownloadURL: '/attach/download?filename=%E6%B5%8B%E8%AF%95.docx&attachId={2EF837DE-508C-4FCA-93B8-99CEA68DCB0D',
      },
      {
        creator: '002332',
        attachId: '{24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
        name: '生产sql和修改后sql.txt',
        size: '2',
        createTime: '2017/09/12 11:55:32',
        downloadURL: 'http://ceflow:8086/unstructured/downloadDocument?sessionId=675fd3be-baca-4099-8b52-bf9dde9f2b59&documentId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F}',
        realDownloadURL: '/attach/download?filename=%E7%94%9F%E4%BA%A7sql%E5%92%8C%E4%BF%AE%E6%94%B9%E5%90%8Esql.txt&attachId={24C098F0-9DE3-4DC6-9E7D-FECE683E4B6F',
      }],
    };

    // 单佣金调整中的产品选择配置
    const singleTransferProps = {
      firstData: newSingleProList,
      secondData: [],
      firstColumns: singleColumns,
      secondColumns: singleColumns,
      transferChange: this.handleSingleTransferChange,
      checkChange: this.handleSingleTransferSubProductCheck,
      rowKey: 'key',
      defaultCheckKey: 'default',
      placeholder: '产品代码/产品名称',
      pagination,
      aboutRate: [newCommission, 'prodRate'],
      supportSearchKey: [['prodCode'], ['prodName']],
      totalData: newSingleProList,
    };
    // 资讯订阅中的产品选择配置
    const subScribetransferProps = {
      firstTitle: '可选服务',
      secondTitle: '已选服务',
      firstData: subscribelData,
      secondData: unsubcribeData,
      firstColumns: productColumns,
      secondColumns: productColumns,
      transferChange: this.handleTransferChange,
      checkChange: this.handleCheckChange,
      onSearch: this.handleSearch,
      rowKey: 'key',
      defaultCheckKey: 'default',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
    };
    // 资讯退订中的服务产品退订配置
    const unsubScribetransferProps = {
      firstTitle: '可退订服务',
      secondTitle: '已选服务',
      firstData: subscribelData,
      secondData: unsubcribeData,
      firstColumns: productColumns,
      secondColumns: productColumns,
      transferChange: this.handleTransferChange,
      checkChange: this.handleCheckChange,
      onSearch: this.handleSearch,
      rowKey: 'key',
      defaultCheckKey: 'default',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination: {
        defaultPageSize: 5,
        pageSize: 5,
        size: 'small',
      },
      finishTips: ['产品组合等于目标佣金值', '产品组合等于目标佣金值'],
      warningTips: ['产品组合比目标佣金高 0.5%', '产品组合离目标佣金还差 0.63%'],
    };

    const wrapClassName = this.judgeSubtypeNow(commadj.noSelected) ? 'commissionModal' : '';

    return (
      <div>
        <CommonModal
          title="新建"
          modalKey={modalKey}
          needBtn={needBtn}
          maskClosable={false}
          size="large"
          visible={visible}
          closeModal={this.closeModal}
          okText="提交"
          showCancelBtn={false}
          onOk={this.handleSubmitApprovals}
          wrapClassName={wrapClassName}
        >
          <div className={styles.newApprovalBox} ref={this.newApprovalBoxRef}>
            <div className={styles.approvalBlock}>
              <InfoTitle head="基本信息" />
              <CommissionLine label="子类型" labelWidth="90px" required>
                <Select
                  name="approvalType"
                  data={newSubTypes}
                  value={approvalType}
                  onChange={this.choiceApprovalSubType}
                />
              </CommissionLine>
              {
                this.judgeSubtypeNow([commadj.batch, commadj.noSelected]) ? null
                : (
                  <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                    <SelectAssembly
                      dataSource={singleCustList}
                      onSearchValue={this.handleChangeAssembly}
                      onSelectValue={this.handleSelectAssembly}
                    />
                  </CommissionLine>
                )
              }
              {
                this.judgeSubtypeNow(commadj.noSelected) ? null
                : (
                  <CommissionLine label="备注" labelWidth="90px">
                    <TextArea
                      placeholder="备注内容"
                      value={remark}
                      onChange={this.handleChangeRemark}
                      style={{
                        fontSize: '14px',
                      }}
                    />
                  </CommissionLine>
                )
              }
            </div>
            {
              !this.judgeSubtypeNow([commadj.batch, commadj.single]) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="佣金产品选择" />
                  <CommissionLine
                    label="目标股基佣金率"
                    labelWidth={this.judgeSubtypeNow([commadj.single]) ? '110px' : '135px'}
                    needInputBox={false}
                    extra={
                      <span
                        style={{
                          fontSize: '14px',
                          color: '#9b9b9b',
                          lineHeight: '26px',
                          paddingLeft: '4px',
                        }}
                      >
                        ‰
                      </span>
                    }
                  >
                    <AutoComplete
                      dataSource={gjCommission}
                      onChangeValue={this.changeTargetGJCommission}
                      onSelectValue={this.selectTargetGJCommission}
                      width="100px"
                    />
                  </CommissionLine>
                  {
                    !this.judgeSubtypeNow(commadj.batch) ? null
                    : (
                      <CommissionLine label="目标产品" labelWidth="135px" needInputBox={false}>
                        <ProductsDropBox
                          productList={targetProductList}
                          onSelect={this.handleSelectProduct}
                        />
                      </CommissionLine>
                    )
                  }
                  {
                    // 单佣金调整中的产品选择
                    !this.judgeSubtypeNow(commadj.single) ? null
                    : (
                      <Transfer {...singleTransferProps} />
                    )
                  }
                </div>
              )
            }
            {
              // 资讯订阅中的资讯产品选择
              !this.judgeSubtypeNow(commadj.subscribe) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="资讯产品选择" />
                  <Transfer {...subScribetransferProps} />
                </div>
              )
            }
            {
              // 资讯订阅中的资讯产品选择
              !this.judgeSubtypeNow(commadj.unsubscribe) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="服务产品退订" />
                  <Transfer {...unsubScribetransferProps} />
                </div>
              )
            }
            {
              // 批量佣金调整和单佣金调整中的其他佣金匪类
              !this.judgeSubtypeNow([commadj.batch, commadj.single]) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="其他佣金费率" />
                  <OtherCommissionSelectList
                    showTip={!this.judgeSubtypeNow(commadj.batch)}
                    reset={otherComReset}
                    otherRatios={
                      this.judgeSubtypeNow(commadj.batch) ? otherRatios
                      : singleOtherRatio
                    }
                    onChange={this.changeOtherCommission}
                  />
                </div>
              )
            }
            {
              // 批量佣金调整中的添加客户组件
              !this.judgeSubtypeNow(commadj.batch) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="客户" />
                  <AddCustomer
                    onSearch={this.handleCustomerListSearch}
                    passList2Home={this.saveSelectedCustomerList}
                    onValidate={this.handleCustomerValidate}
                    validateResult={validateResult}
                    validataLoading={validataLoading}
                    searchList={customerList}
                    ref={this.addCustomerRef}
                  />
                </div>
              )
            }
            {
              // 单佣金调整中的附件信息
              this.judgeSubtypeNow([commadj.batch, commadj.noSelected]) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="附件信息" />
                  <CommonUpload edit {...uploadProps} />
                </div>
              )
            }
            {
              // 选择审批人
              this.judgeSubtypeNow(commadj.noSelected) ? null
              : (
                <div className={styles.approvalBlock}>
                  <InfoTitle head="审批人" />
                  <CommissionLine label="选择审批人" labelWidth="110px">
                    <div className={styles.checkApprover} onClick={this.openApproverBoard}>
                      {approverName === '' ? '' : `${approverName}(${approverId})`}
                      <div className={styles.searchIcon}>
                        <Icon type="search" />
                      </div>
                    </div>
                  </CommissionLine>
                </div>
              )
            }
          </div>
        </CommonModal>
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
      </div>
    );
  }
}
