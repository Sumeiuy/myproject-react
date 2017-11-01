/**
 * @file routes/commissionChange/Home.js
 * @description 佣金调整、资讯订阅、资讯退订驳回再修改页面
 * @author baojiajia
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'dva-react-router-3/router';
import { autobind } from 'core-decorators';
import { Input, Icon, message } from 'antd';
import _ from 'lodash';

import confirm from '../../components/common/Confirm/confirm';
import CommonUpload from '../../components/common/biz/CommonUpload';
import Transfer from '../../components/common/biz/TableTransfer';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import InfoTitle from '../../components/common/InfoTitle';
import AutoComplete from '../../components/common/AutoComplete';
import OtherCommissionSelectList from '../../components/commissionAdjustment/OtherCommissionSelectList';
import CommissionLine from '../../components/commissionAdjustment/CommissionLine';
import Button from '../../components/common/Button';
import ThreeMatchTip from '../../components/commissionAdjustment/ThreeMatchTip';
import { seibelConfig } from '../../../config';
import Barable from '../../decorators/selfBar';
import {
  pagination,
  singleColumns,
  subScribeProColumns,
} from '../../components/commissionAdjustment/commissionTransferHelper/transferPropsHelper';

import styles from './home.less';

const { TextArea } = Input;
const { commadj } = seibelConfig;

const effects = {
  applyCustList: 'commissionChange/getCanApplyCustList',
  productList: 'commissionChange/getProductList',
  validate: 'commissionChange/validateCustInfo',
  submitBatch: 'commissionChange/submitBatchCommission',
  gjCommissionRate: 'commissionChange/getGJCommissionRate',
  singleCustList: 'commissionChange/getSingleCustList',
  singleComOptions: 'commissionChange/getSingleOtherCommissionOptions',
  singleProList: 'commissionChange/getSingleComProductList',
  threeMatchInfo: 'commissionChange/queryThreeMatchInfo',
  subscribelProList: 'commissionChange/getSubscribelProList',
  unSubscribelProList: 'commissionChange/getUnSubscribelProList',
  // 数据库中订单待修改数据（详情）
  // 单佣金
  singleDetailToChange: 'commissionChange/getSingleDetailToChange',
  // 订阅、退订详情
  subscribeDetailToChange: 'commissionChange/getSubscribeDetailToChange',
  unsubDetailToChange: 'commissionChange/getUnSubscribeDetailToChange',

};

const mapStateToProps = state => ({
  // 字典
  dict: state.app.dict,
  // empInfo:
  empInfo: state.app.empInfo,
  // 目标产品列表
  productList: state.commissionChange.productList,
  // 审批人员列表
  approvalUserList: state.commissionChange.approvalUserList,
  // 可申请的客户列表
  canApplyCustList: state.commissionChange.canApplyCustList,
  // 验证结果描述
  validateResult: state.commissionChange.validateResult,
  // 验证过程
  validataLoading: state.commissionChange.validataLoading,
  // 提交批量佣金申请调整的进程
  batchSubmitProcess: state.loading.effects[effects.submitBatch],
  // 目标股基佣金率码值列表
  gjCommissionList: state.commissionChange.gjCommission,
  // 单佣金调整的其他佣金费率码值
  singleOtherRatio: state.commissionChange.singleOtherCommissionOptions,
  // 单佣金调整页面客户查询列表
  singleCustomerList: state.commissionChange.singleCustomerList,
  // 单佣金调整可选产品列表
  singleComProductList: state.commissionChange.singleComProductList,
  // 客户与产品的三匹配信息
  threeMatchInfo: state.commissionChange.threeMatchInfo,
  // 新建咨讯订阅可选产品列表
  subscribelProList: state.commissionChange.subscribelProList,
  // 新建咨讯订阅可选产品列表
  unSubscribelProList: state.commissionChange.unSubscribelProList,
  // 单佣金佣金详情
  singleDetailToChange: state.commissionChange.singleDetail,
  // 咨询订阅详情
  subscribeDetailToChange: state.commissionChange.subscribeDetail,
  // 咨询退订详情
  unsubDetailToChange: state.commissionChange.subscribeDetail,
});

const getDataFunction = (loading, type) => query => ({
  type,
  payload: query || {},
  loading,
});


const mapDispatchToProps = {
  // 通过关键字，查询可选的可申请用户列表
  getCanApplyCustList: getDataFunction(false, effects.applyCustList),
  // 查询目标产品列表
  getProductList: getDataFunction(false, effects.productList),
  // 校验用户资格
  validateCustInfo: getDataFunction(false, effects.validate),
  // 提交批量佣金调整申请
  submitBatch: getDataFunction(false, effects.submitBatch),
  // 获取目标股基佣金率
  getGJCommissionRate: getDataFunction(false, effects.gjCommissionRate),
  // 获取单佣金调整中的其他佣金费率选项
  getSingleOtherRates: getDataFunction(false, effects.singleComOptions),
  // 查询单佣金调整页面客户列表
  getSingleCustList: getDataFunction(false, effects.singleCustList),
  // 获取单佣金调整中的可选产品列表
  getSingleProductList: getDataFunction(false, effects.singleProList),
  // 查询产品与客户的三匹配信息
  queryThreeMatchInfo: getDataFunction(false, effects.threeMatchInfo),
  // 获取新建咨讯订阅可选产品列表
  getSubscribelProList: getDataFunction(false, effects.subscribelProList),
  // 获取新建咨讯退订可选产品列表
  getUnSubscribelProList: getDataFunction(false, effects.unSubscribelProList),
  // 获取单佣金调整Detail
  getSingleDetailToChange: getDataFunction(true, effects.singleDetailToChange),
  // 获取咨询订阅详情Detail
  getSubscribeDetailToChange: getDataFunction(true, effects.subscribeDetailToChange),
  // 获取资讯退订详情Detail
  getUnSubscribeDetailToChange: getDataFunction(true, effects.unsubDetailToChange),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class RejectionAndAmendment extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    dict: PropTypes.object.isRequired,
    getCanApplyCustList: PropTypes.func.isRequired,
    productList: PropTypes.array,
    approvalUserList: PropTypes.array,
    canApplyCustList: PropTypes.array,
    validateResult: PropTypes.string,
    validataLoading: PropTypes.bool,
    getProductList: PropTypes.func.isRequired,
    validateCustInfo: PropTypes.func.isRequired,
    submitBatch: PropTypes.func.isRequired,
    otherRatio: PropTypes.array,
    empInfo: PropTypes.object.isRequired,
    gjCommissionList: PropTypes.array.isRequired,
    getGJCommissionRate: PropTypes.func.isRequired,
    getSingleOtherRates: PropTypes.func.isRequired,
    singleOtherRatio: PropTypes.array.isRequired,
    // 获取单佣金调整中的产品列表
    getSingleProductList: PropTypes.func.isRequired,
    singleComProductList: PropTypes.array.isRequired,
    // 产品与客户的三匹配信息
    threeMatchInfo: PropTypes.object.isRequired,
    queryThreeMatchInfo: PropTypes.func.isRequired,
    // 单佣金调整客户列表
    getSingleCustList: PropTypes.func.isRequired,
    singleCustomerList: PropTypes.array.isRequired,
    // 新建咨讯订阅可选产品列表
    getSubscribelProList: PropTypes.func.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    // 新建咨讯订阅可选产品列表
    getUnSubscribelProList: PropTypes.func.isRequired,
    unSubscribelProList: PropTypes.array.isRequired,
    // 单佣金、订阅、退订详情
    getSubscribeDetailToChange: PropTypes.func.isRequired,
    getUnSubscribeDetailToChange: PropTypes.func.isRequired,
    getSingleDetailToChange: PropTypes.func.isRequired,
    singleDetailToChange: PropTypes.object.isRequired,
    subscribeDetailToChange: PropTypes.object.isRequired,
    unsubscribeDetailToChange: PropTypes.object.isRequired,
  }

  static defaultProps = {
    visible: false,
    validateResult: '',
    validataLoading: false,
    onClose: () => {},
    productList: [],
    canApplyCustList: [],
    approvalUserList: [],
    otherRatio: [],
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
      customer: {}, // 单佣金、资讯退订、资讯订阅选择的客户
    };
  }

  componentDidMount() {
    const { location: { query } } = this.props;
    this.getDetail3Subtye(query);
  }

  // 查询佣金调整3个子类型的详情信息
  getDetail3Subtye(record) {
    const { flowCode, custType, subType } = record;
    const {
      getSubscribeDetailToChange,
      getUnSubscribeDetailToChange,
      getSingleDetailToChange,
    } = this.props;
    switch (subType) {
      case '佣金':
        getSingleDetailToChange({ flowCode });
        break;
      case '订购':
        getSubscribeDetailToChange({ flowCode, type: custType });
        break;
      case '退订':
        getUnSubscribeDetailToChange({ flowCode, type: custType });
        break;
      default:
        break;
    }
  }

   // 判断当前是否某个子类型
  @autobind
  judgeSubtypeNow(assert) {
    const type = '0201';
    if (Array.isArray(assert)) {
      return _.includes(assert, type);
    }
    return type === assert;
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
      customer: {},
    });
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
      this.props.getProductList({
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
    this.props.getProductList({ ...param, orgId: occDivnNum });
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
    if (this.judgeSubtypeNow(commadj.single)) {
      const { id } = this.state.customer; // 取出客户的row_id
      this.querySingleProductList({
        custRowId: id,
        commRate: v.codeValue,
      });
    }
  }

  // 客户输入目标股基佣金率调用方法
  @autobind
  changeTargetGJCommission(v) {
    this.props.getGJCommissionRate({
      codeValue: v,
    });
  }

  @autobind
  addCustomerRef(input) {
    this.addCustomer = input;
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

  // 根据用户输入查询单佣金客户列表
  @autobind
  handleChangeAssembly(keyword) {
    const { postnId, occDivnNum } = this.props.empInfo;
    this.props.getSingleCustList({
      keyword,
      postionId: postnId,
      deptCode: occDivnNum,
    });
  }

  // 验证用户资格
  @autobind
  handleCustomerValidate(customer) {
    const { newCommission, targetProduct } = this.state;
    const { cusId, custType } = customer;
    if (_.isEmpty(targetProduct)) {
      message.error('请选择目标产品');
      return;
    }
    this.props.validateCustInfo({
      businessType: null,
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
      customer,
    });
    if (this.judgeSubtypeNow(commadj.subscribe)) {
      this.querySubscribelProList({
        custId: id, // TODO 此参数等客户接口写好需要修改
        custType: 'per', // TODO 此参数等客户接口写好需要修改
      });
    } else if (this.judgeSubtypeNow(commadj.unsubscribe)) {
      this.queryUnSubscribelProList({
        custRowId: id, // TODO 此参数等客户接口写好需要修改
      });
    }
  }

  // 查询咨讯订阅调整产品
  @autobind
  querySubscribelProList(param) {
    this.props.getSubscribelProList(param);
  }
  // 查询咨讯退订调整产品
  @autobind
  queryUnSubscribelProList(param) {
    this.props.getUnSubscribelProList(param);
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

  @autobind
  changeSubscriProList(product) {
    const { prodRowId, prodId, prodName } = product;
    return {
      key: prodRowId,
      // 产品代码
      prodCode: prodId,
      // 产品名称
      prodName,
    };
  }

  @autobind
  changeUnSubscriProList(product) {
    const { prodRowId, prodId, prodName } = product;
    return {
      key: prodRowId,
      // 产品代码
      prodCode: prodId,
      // 产品名称
      prodName,
    };
  }

  // 重组咨讯订阅可选产品子产品
  @autobind
  changeSubscriProChildren(product) {
    const { prodRowid, prodCode, prodName, xDefaultOpenFlag } = product;
    return {
      key: prodRowid,
      // 产品代码
      prodCode,
      // 产品名称
      prodName,
      // 是否默认选择
      xDefaultOpenFlag,
    };
  }

  // 重组咨讯退订可选产品子产品
  @autobind
  changeUnSubscriProChildren(product) {
    const { rowId, prodId, prodName } = product;
    return {
      key: rowId,
      // 产品代码
      prodCode: prodId,
      // 产品名称
      prodName,
    };
  }

  // 重组咨讯订阅可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const { subProds } = product;
      const newSubscribel = this.changeSubscriProList(product);
      let children = null;
      if (!_.isEmpty(subProds)) {
        // 存在子产品
        children = subProds.map(this.changeSubscriProChildren);
        return { ...newSubscribel, children };
      }
      return newSubscribel;
    });
    return newSubscriProList;
  }

 // 重组咨讯退订可选产品List
  @autobind
  createUnSubscribelProList(data) {
    const newUnSubscriProList = data.map((product) => {
      const { subProds } = product;
      const newUnSubscribel = this.changeUnSubscriProList(product);
      let children = null;
      if (!_.isEmpty(subProds)) {
        // 存在子产品
        children = subProds.map(this.changeUnSubscriProChildren);
        return { ...newUnSubscribel, children };
      }
      return newUnSubscribel;
    });
    return newUnSubscriProList;
  }

  render() {
    const {
      approvalUserList,
      gjCommissionList,
      singleOtherRatio,
      singleComProductList,
      threeMatchInfo,
      subscribelProList,
      unSubscribelProList,
    } = this.props;
    const newApproverList = approvalUserList.map((item, index) => {
      const key = `${new Date().getTime()}-${index}`;
      return {
        ...item,
        key,
      };
    });

    const newSingleProList = singleComProductList.map(p => ({ key: p.id, ...p }));
    const newSubscribelProList = this.createSubscribelProList(subscribelProList);
    const newUnSubscribelProList = this.createUnSubscribelProList(unSubscribelProList);
    const {
      newCommission,
      remark,
      choiceApprover,
      approverName,
      approverId,
      otherComReset,
    } = this.state;

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
      firstData: newSubscribelProList,
      secondData: [],
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleTransferChange, // 三匹配未做
      checkChange: this.handleCheckChange,
      onSearch: this.handleSearch,
      rowKey: 'key',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      supportSearchKey: [['prodId'], ['prodName']],
      totalData: newSubscribelProList,
    };
    // 资讯退订中的服务产品退订配置
    const unsubScribetransferProps = {
      firstTitle: '可退订服务',
      secondTitle: '已选服务',
      firstData: newUnSubscribelProList,
      secondData: [],
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
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
      supportSearchKey: [['prodId'], ['prodName']],
      totalData: newUnSubscribelProList,
      finishTips: ['产品组合等于目标佣金值', '产品组合等于目标佣金值'],
      warningTips: ['产品组合比目标佣金高 0.5%', '产品组合离目标佣金还差 0.63%'],
    };

    return (
      <div className={styles.rejectAmend}>
        <div className={styles.newApprovalBox} ref={this.newApprovalBoxRef}>
          <div className={styles.approvalBlock}>
            <InfoTitle head="基本信息" />
            <CommissionLine label="子类型" labelWidth="90px" required>
              <Input
                value="佣金调整"
                disabled
              />
            </CommissionLine>
            {
              this.judgeSubtypeNow([commadj.noSelected]) ? null
              : (
                <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                  <Input
                    value="测试数据-张三"
                    disabled
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
            !this.judgeSubtypeNow([commadj.single]) ? null
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
                    dataSource={gjCommissionList}
                    onChangeValue={this.changeTargetGJCommission}
                    onSelectValue={this.selectTargetGJCommission}
                    width="100px"
                  />
                </CommissionLine>
                {
                  // 单佣金调整中的产品选择
                  !this.judgeSubtypeNow(commadj.single) ? null
                  : (
                    <Transfer {...singleTransferProps} />
                  )
                }
                {
                  // 单佣金调整产品三匹配信息
                  !this.judgeSubtypeNow([commadj.single, commadj.subscribe]) ? null
                  : (<ThreeMatchTip info={threeMatchInfo} />)
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
            // 咨讯订阅调整产品三匹配信息
            !this.judgeSubtypeNow([commadj.single, commadj.subscribe]) ? null
            : (<ThreeMatchTip info={threeMatchInfo} />)
          }
          {
            // 资讯退订中的资讯产品选择
            !this.judgeSubtypeNow(commadj.unsubscribe) ? null
            : (
              <div className={styles.approvalBlock}>
                <InfoTitle head="服务产品退订" />
                <Transfer {...unsubScribetransferProps} />
              </div>
            )
          }
          {
            // 单佣金调整中的其他佣金费率
            !this.judgeSubtypeNow([commadj.single]) ? null
            : (
              <div className={styles.approvalBlock}>
                <InfoTitle head="其他佣金费率" />
                <OtherCommissionSelectList
                  showTip={!this.judgeSubtypeNow(commadj.batch)}
                  reset={otherComReset}
                  otherRatios={singleOtherRatio}
                  onChange={this.changeOtherCommission}
                />
              </div>
            )
          }
          {
            // 单佣金调整中的附件信息
            this.judgeSubtypeNow([commadj.noSelected]) ? null
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
        <ChoiceApproverBoard
          visible={choiceApprover}
          approverList={newApproverList}
          onClose={this.closeChoiceApproverModal}
          onOk={this.handleApproverModalOK}
        />
        <Button>提交</Button>
        <Button>终止</Button>
      </div>
    );
  }
}
