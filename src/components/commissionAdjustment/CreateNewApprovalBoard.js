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
import ThreeMatchTip from './ThreeMatchTip';
import { seibelConfig } from '../../config';
import { permission } from '../../utils';
import {
  pagination,
  singleColumns,
  subScribeProColumns,
} from './commissionTransferHelper/transferPropsHelper';
import approvalConfig from './choiceApprovalUserConfig';

import styles from './createNewApprovalBoard.less';

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
    empPostnList: PropTypes.array.isRequired,
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
    // 咨讯订阅、咨讯退订客户列表
    querySubscribelCustList: PropTypes.func.isRequired,
    subscribeCustList: PropTypes.array.isRequired,
    // 新建咨讯订阅可选产品列表
    getSubscribelProList: PropTypes.func.isRequired,
    subscribelProList: PropTypes.array.isRequired,
    // 新建咨讯订阅可选产品列表
    getUnSubscribelProList: PropTypes.func.isRequired,
    unSubscribelProList: PropTypes.array.isRequired,
    // 单佣金调整目标股基佣金率码值
    singleGJCommission: PropTypes.array.isRequired,
    getSingleGJ: PropTypes.func.isRequired,
    // 单佣金调整提交
    onSubmitSingle: PropTypes.func.isRequired,
    singleSubmit: PropTypes.string.isRequired,
    // 新建咨询订阅提交接口
    submitSub: PropTypes.func.isRequired,
    // 新建咨询退订提交接口
    submitUnSub: PropTypes.func.isRequired,
    // 查询审批人
    queryApprovalUser: PropTypes.func.isRequired,
    // 清空redux的state
    clearReduxState: PropTypes.func.isRequired,
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
    consultSubId: '',
    consultUnsubId: '',
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
      attachment: '',
      singleProductList: [], // 单佣金调整选择的产品列表
      singleProductMatchInfo: [], // 单佣金调整选择的产品的三匹配信息
      subProList: [], // 咨询订阅产品列表
      subscribelProductMatchInfo: [], // 咨询订阅的产品的三匹配信息
      unSubProList: [], // 咨询退订产品列表
    };
  }

  componentWillReceiveProps(nextProps) {
    const { threeMatchInfo: prev3 } = this.props;
    const { threeMatchInfo: next3 } = nextProps;
    if (!_.isEqual(prev3, next3)) {
      if (this.judgeSubtypeNow(commadj.single)) {
        // 单佣金
        this.merge3MatchInfo(next3);
      } else if (this.judgeSubtypeNow(commadj.subscribe)) {
        // 资讯订阅的
        this.merge3MatchSubInfo(next3);
      }
    }
  }

  @autobind
  merge3MatchInfo(info) {
    const { riskRankMhrt, investProdMhrt, investTypeMhrt, productCode } = info;
    const matchInfo = {
      productCode,
      riskMatch: riskRankMhrt,
      prodMatch: investProdMhrt,
      termMatch: investTypeMhrt,
    };
    const { singleProductMatchInfo } = this.state;
    const exsit = _.findIndex(singleProductMatchInfo, o => o.productCode === productCode) > -1;
    if (!exsit) {
      this.setState({
        singleProductMatchInfo: [matchInfo, ...singleProductMatchInfo],
      });
    }
  }

  @autobind
  merge3MatchSubInfo(info) {
    const { riskRankMhrt, investProdMhrt, investTypeMhrt, productCode } = info;
    const matchInfo = {
      productCode,
      riskMatch: riskRankMhrt,
      prodMatch: investProdMhrt,
      termMatch: investTypeMhrt,
    };
    const { subscribelProductMatchInfo } = this.state;
    const exsit = _.findIndex(subscribelProductMatchInfo, o => o.productCode === productCode) > -1;
    if (!exsit) {
      this.setState({
        subscribelProductMatchInfo: [matchInfo, ...subscribelProductMatchInfo],
      });
    }
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

  @autobind
  clearRedux() {
    // 清空redux的state
    this.props.clearReduxState({
      clearList: [
        {
          name: 'singleOtherCommissionOptions',
        },
        {
          name: 'singleCustomerList',
        },
        {
          name: 'singleComProductList',
        },
        {
          name: 'threeMatchInfo',
          value: {},
        },
        {
          name: 'singleGJCommission',
        },
      ],
    });
  }

  // 关闭弹出框后，清空页面数据
  @autobind
  clearApprovalBoard() {
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
      attachment: '',
      singleProductList: [],
      singleProductMatchInfo: [],
      subProList: [],
      subscribelProductMatchInfo: [],
      unSubProList: [],
    });
    this.clearRedux();
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

  // 修改单佣金父产品参数
  @autobind
  updateParamsProduct(product, matchInfos) {
    const { prodCode, prodName, prodRate } = product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodCode)[0] || {};
    return {
      prodCode,
      aliasName: prodName,
      prodCommission: prodRate,
      ...matchInfo,
    };
  }

  // 修改单佣金子产品参数
  @autobind
  updateParamChildProduct(product) {
    const { prodCode, prodName } = product;
    return {
      prodCode,
      aliasName: prodName,
    };
  }

  // 将选择的产品进行筛选，并合并入3匹配信息
  @autobind
  pickSingleProductList(list, matchInfos) {
    return list.map((item) => {
      const { children } = item;
      const product = this.updateParamsProduct(item, matchInfos);
      if (!_.isEmpty(children)) {
        product.subProductVO = children.map(this.updateParamChildProduct);
      }
      return product;
    });
  }

  // 批量佣金调整提交
  @autobind
  batchSubmit() {
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
  }

  // 选中的咨询订阅父产品数据结构改为提交所需
  @autobind
  changeSubmitscriProList(product, matchInfos) {
    const {
      prodId,
      prodName,
    } = product.product;
    const matchInfo = _.filter(matchInfos, item => item.productCode === prodId)[0] || {};
    return {
      prodCode: prodId,
      aliasName: prodName,
      ...matchInfo,
    };
  }

  // 选中的咨询退订父产品数据结构改为提交所需
  @autobind
  changeSubmitUnscriProList(product) {
    const {
      prodId,
      prodName,
    } = product.product;
    return {
      prodCode: prodId,
      aliasName: prodName,
    };
  }

  // 选中的咨询订阅、退订子产品数据结构改为提交所需
  @autobind
  changeSubmitSubscriProChildren(product) {
    const {
      parProdCode,
      prodName,
    } = product;
    return {
      prodCode: parProdCode,
      aliasName: prodName,
    };
  }


  // 将选中的咨询订阅产品数据结构改为提交所需
  @autobind
  changeSubmitSubProList(list, matchInfos) {
    const newSubmitSubscriProList = list.map((product) => {
      const { children } = product;
      const newSubmitSubscribel = this.changeSubmitscriProList(product, matchInfos);
      if (!_.isEmpty(children)) {
        // 存在子产品
        newSubmitSubscribel.subItem = children.map(this.changeSubmitSubscriProChildren);
      }
      return newSubmitSubscribel;
    });
    return newSubmitSubscriProList;
  }

  // 将选中的咨询退订产品数据结构改为提交所需
  @autobind
  changeSubmitUnSubProList(list) {
    const newSubmitUnSubscriProList = list.map((product) => {
      const { children } = product;
      const newSubmitUnSubscribel = this.changeSubmitUnscriProList(product);
      if (!_.isEmpty(children)) {
        // 存在子产品
        newSubmitUnSubscribel.subItem = children.map(this.changeSubmitSubscriProChildren);
      }
      return newSubmitUnSubscribel;
    });
    return newSubmitUnSubscriProList;
  }

  // 单佣金调整提交
  @autobind
  singleSubmit() {
    const {
      remark,
      newCommission,
      approverId,
      customer,
      attachment,
      singleProductList,
      singleProductMatchInfo,
    } = this.state;
    const otherCommissions = _.pick(this.state, otherComs);
    const productList = this.pickSingleProductList(singleProductList, singleProductMatchInfo);
    const params = {
      custRowId: customer.id,
      newComm: newCommission,
      comments: remark,
      attachmentNum: attachment,
      aprovaluser: approverId,
      productInfo: productList,
      ...otherCommissions,
    };
    this.props.onSubmitSingle(params);
  }

  // 资讯订阅提交
  @autobind
  advisorySub() {
    const { empNum } = this.props.empInfo;
    const {
      customer,
      remark,
      subProList,
      subscribelProductMatchInfo,
      approverId, // 审批人工号
      attachment, // 附件编号
    } = this.state;
    const newSubProList = this.changeSubmitSubProList(subProList, subscribelProductMatchInfo);
    const params = {
      type: customer.custType,
      aprovaluser: approverId,
      custNum: customer.custEcom,
      custId: customer.id,
      createdBy: empNum,
      comments: remark,
      attachmentNum: attachment,
      item: newSubProList,
    };
    // 提交
    this.props.submitSub(params);
  }

  // 资讯退订提交
  @autobind
  advisoryUnSub() {
    const { empNum } = this.props.empInfo;
    const {
      customer,
      unSubProList,
      remark,
      approverId, // 审批人工号
      attachment, // 附件编号
    } = this.state;
    const newUnSubProList = this.changeSubmitUnSubProList(unSubProList);
    const unParams = {
      type: customer.custType,
      aprovaluser: approverId,
      custNum: customer.custEcom,
      custId: customer.id,
      createdBy: empNum,
      comments: remark,
      attachmentNum: attachment,
      item: newUnSubProList,
    };
    // 提交
    this.props.submitUnSub(unParams);
  }

  // 提交
  @autobind
  handleSubmitApprovals(key) {
    const judge = this.judgeSubtypeNow;
    if (judge(commadj.batch)) {
      this.batchSubmit();
    } else if (judge(commadj.single)) {
      this.singleSubmit();
    } else if (judge(commadj.subscribe)) {
      this.advisorySub();
    } else if (judge(commadj.unsubscribe)) {
      this.advisoryUnSub();
    }
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
    if (key === '') return;
    this.setState({
      [name]: key,
    });
    let btnId = '';
    const { empInfo: { occDivnNum, empNum } } = this.props;
    const { approvalBtnId } = approvalConfig;
    if (commadj.batch === key) {
      // 如果切换批量佣金需要，先查一把0.16下目标产品
      this.props.queryProductList({
        prodCommision: 0.16,
        orgId: occDivnNum,
      });
      // 审批人的BtnId
      btnId = approvalBtnId.batch;
    } else if (commadj.single === key) {
      btnId = approvalBtnId.single;
    } else if (commadj.subscribe === key) {
      btnId = approvalBtnId.subscribe;
    } else if (commadj.unsubscribe === key) {
      btnId = approvalBtnId.unsubscribe;
    }
    this.props.queryApprovalUser({
      loginUser: empNum,
      btnId,
    });
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
    if (this.judgeSubtypeNow(commadj.batch)) {
      // 批量
      this.props.queryGJCommission({
        codeValue: v,
      });
    } else {
      // 单佣金 , 如果没有选择客户，提示用户选择客户
      const { customer } = this.state;
      if (_.isEmpty(customer)) {
        confirm({
          content: '请先选择需要申请的客户',
        });
      }
      this.props.getSingleGJ({
        custId: customer.custEcom,
        commision: v,
      });
    }
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

  // 根据用户输入查询客户列表(批量佣金)
  @autobind
  handleCustomerListSearch(keyword) {
    this.props.onSearchApplyCust({
      keyword,
    });
  }

  // 根据用户输入查询单佣金客户列表
  @autobind
  handleChangeSingleAssembly(keywords) {
    const { postnId, occDivnNum } = this.props.empInfo;
    this.props.querySingleCustList({
      keywords,
      postionId: postnId,
      deptCode: occDivnNum,
    });
  }

  // 根据用户输入查询咨讯订阅、咨讯退订客户列表
  @autobind
  handleChangeSubscribeAssembly(keyword) {
    const { postnId, occDivnNum } = this.props.empInfo;
    this.props.querySubscribelCustList({
      keyword,
      postnId,
      deptId: occDivnNum,
    });
  }

  // 将用户选择添加的客户列表返回到弹出层，以便提交试用（批量佣金）
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
      message.error('请选择目标产品');
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
      customer,
    });
    const typeNow = this.judgeSubtypeNow;
    if (typeNow(commadj.subscribe)) {
      const { custType } = customer;
      this.querySubscribelProList({
        custId: id,
        custType,
      });
    } else if (typeNow(commadj.unsubscribe)) {
      this.queryUnSubscribelProList({
        custRowId: id,
      });
    } else if (typeNow(commadj.single)) {
      // 根据选择的用户，查询该用户所能选的其他佣金费率
      this.props.getSingleOtherRates({
        custRowId: id,
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
  handleSingleTransferChange(flag, item, array, dValue) {
    this.setState({
      singleProductList: array,
    });
    if (flag === 'add') {
      // 如果是左侧列表添加到右侧列表,则需要查询三匹配信息
      const { prodCode } = item;
      const { customer } = this.state;
      this.props.queryThreeMatchInfo({
        custRowId: customer.id,
        custType: customer.custType,
        prdCode: prodCode,
      });
    }
    console.warn('还差多少', dValue);
  }

   // 咨讯订阅调整穿梭变化的时候处理程序
  @autobind
  handleSubscribelTransferChange(flag, item, array) {
    this.setState({
      subProList: array,
    });
    const { prodCode } = item;
    const { id, custType } = this.state.customer;
    this.props.queryThreeMatchInfo({
      custRowId: id,
      custType,
      prdCode: prodCode,
    });
  }

  // 咨讯退订调整穿梭变化的时候处理程序
  @autobind
  handleUnSubscribelTransferChange(flag, item, array) {
    this.setState({
      unSubProList: array,
    });
  }

  // 单佣金调整选择子产品的时候的处理程序
  @autobind
  handleSingleTransferSubProductCheck(item, array) {
    this.setState({
      singleProductList: array,
    });
  }

  // 咨讯订阅选择子产品的时候的处理程序
  @autobind
  handleSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      subProList: array,
    });
  }

  // 咨讯订阅选择子产品的时候的处理程序
  @autobind
  handleUnSubscribelTransferSubProductCheck(item, array) {
    this.setState({
      unSubProList: array,
    });
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
      // 传入的产品原始数据
      product,
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
      // 传入的产品原始数据
      product,
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
      // 传入的产品原始数据
      product,
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
      // 传入的产品原始数据
      product,
    };
  }

  // 重组咨讯订阅可选产品List
  @autobind
  createSubscribelProList(data) {
    const newSubscriProList = data.map((product) => {
      const { subProds } = product;
      const newSubscribel = this.changeSubscriProList(product);
      if (!_.isEmpty(subProds)) {
        // 存在子产品
        newSubscribel.children = subProds.map(this.changeSubscriProChildren);
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
      if (!_.isEmpty(subProds)) {
        // 存在子产品
        newUnSubscribel.children = subProds.map(this.changeUnSubscriProChildren);
      }
      return newUnSubscribel;
    });
    return newUnSubscriProList;
  }

  // 附件上传成功后的回调
  @autobind
  uploadCallBack(attachment) {
    this.setState({
      attachment,
    });
  }

  // 根据职责权限进行子类型选项
  @autobind
  authorityOptions(subTypes) {
    return subTypes.map((item) => {
      const newItem = {};
      const { value } = item;
      if (value === commadj.batch) {
        newItem.show = permission.hasCommissionBatchAuthority();
      } else if (value === commadj.single) {
        const { empPostnList } = this.props;
        newItem.show = permission.hasCommissionSingleAuthority(empPostnList);
      } else if (value === commadj.subscribe) {
        newItem.show = permission.hasCommissionADSubscribeAuthority();
      } else if (value === commadj.unsubscribe) {
        newItem.show = permission.hasCommissionADUnSubscribeAuthority();
      }
      return {
        ...item,
        ...newItem,
      };
    });
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
      singleGJCommission,
      singleOtherRatio,
      singleComProductList,
      singleCustList,
      subscribeCustList,
      subscribelProList,
      unSubscribelProList,
      threeMatchInfo,
    } = this.props;
    const newApproverList = approverList.map((item, index) => {
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
      approvalType,
      remark,
      choiceApprover,
      approverName,
      approverId,
      otherComReset,
      attachment,
    } = this.state;
    const needBtn = !this.judgeSubtypeNow('');

    // 附件上传配置项
    const uploadProps = {
      // 可上传，可编辑
      edit: true,
      attachmentList: [],
      // 上传成功callback
      uploadAttachment: this.uploadCallBack,
      // 附件Id
      attachment,
      needDefaultText: false,
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
      transferChange: this.handleSubscribelTransferChange,
      checkChange: this.handleSubscribelTransferSubProductCheck,
      onSearch: this.handleSearch,
      rowKey: 'key',
      showSearch: true,
      placeholder: '产品代码/产品名称',
      pagination,
      defaultCheckKey: 'xDefaultOpenFlag',
      supportSearchKey: [['prodId'], ['prodName']],
    };
    // 资讯退订中的服务产品退订配置
    const unsubScribetransferProps = {
      firstTitle: '可退订服务',
      secondTitle: '已选服务',
      firstData: newUnSubscribelProList,
      secondData: [],
      firstColumns: subScribeProColumns,
      secondColumns: subScribeProColumns,
      transferChange: this.handleUnSubscribelTransferChange,
      checkChange: this.handleUnSubscribelTransferSubProductCheck,
      onSearch: this.handleSearch,
      rowKey: 'key',
      defaultCheckKey: 'default',
      showSearch: false,
      placeholder: '产品代码/产品名称',
      pagination,
    };

    const wrapClassName = this.judgeSubtypeNow(commadj.noSelected) ? 'commissionModal' : '';
    const subTypesAfterAuthority = this.authorityOptions(newSubTypes);

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
                  data={subTypesAfterAuthority}
                  value={approvalType}
                  onChange={this.choiceApprovalSubType}
                  width="300px"
                />
              </CommissionLine>
              {
                !this.judgeSubtypeNow([commadj.single]) ? null
                : (
                  <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                    <SelectAssembly
                      dataSource={singleCustList}
                      onSearchValue={this.handleChangeSingleAssembly}
                      onSelectValue={this.handleSelectAssembly}
                    />
                  </CommissionLine>
                )
              }
              {
                !this.judgeSubtypeNow([commadj.subscribe, commadj.unsubscribe]) ? null
                : (
                  <CommissionLine label="客户" labelWidth="90px" needInputBox={false}>
                    <SelectAssembly
                      dataSource={subscribeCustList}
                      onSearchValue={this.handleChangeSubscribeAssembly}
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
                      dataSource={
                        this.judgeSubtypeNow(commadj.batch) ? gjCommission : singleGJCommission
                      }
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
              // 咨讯订阅产品三匹配信息
              !this.judgeSubtypeNow(commadj.subscribe) ? null
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
                  <CommonUpload {...uploadProps} />
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
