/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-27 17:24:57
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message, Modal } from 'antd';
import _ from 'lodash';

import { constructSeibelPostBody, getEmpId, hasPermissionOfPostion } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
// import ContractHeader from '../../components/common/biz/SeibelHeader';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/contract/Detail';
import ContractList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/contract/EditForm';
import AddForm from '../../components/contract/AddForm';
import BottonGroup from '../../components/permission/BottonGroup';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';


const confirm = Modal.confirm;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 退订的类型
const unsubscribe = '2';
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const { contract, contract: { pageType, subType, operationList, status } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
  // 列表请求状态
  // 获取列表数据进程
  seibleListLoading: state.loading.effects['app/getSeibleList'],
  // 查询客户
  customerList: state.app.customerList,
  // 查询右侧详情
  baseInfo: state.contract.baseInfo,
  baseInfoLoading: state.loading.effects['contract/getBaseInfo'],
  // 退订时查询详情
  unsubscribeBaseInfo: state.contract.unsubscribeBaseInfo,
  // 附件列表
  attachmentList: state.contract.attachmentList,
  // 新建/修改 客户列表
  canApplyCustList: state.app.canApplyCustList,
  // 合作合约编号列表
  contractNumList: state.contract.contractNumList,
  // 审批记录
  flowHistory: state.contract.flowHistory,
  // 新增合约条款-条款名称
  clauseNameList: state.contract.clauseNameList,
  // 新增合约条款-合作部门
  cooperDeparment: state.contract.cooperDeparment,
  // 列表请求状态  // 获取列表数据进程
  saveContractDataLoading: state.loading.effects['contract/saveContractData'],
  // 审批人
  flowStepInfo: state.contract.flowStepInfo,
  // 新建时的审批人
  addFlowStepInfo: state.contract.addFlowStepInfo,
  doApprove: state.contract.doApprove,
  // 审批进程
  postDoApproveLoading: state.loading.effects['contract/postDoApprove'],
  unsubFlowStepInfo: state.contract.unsubFlowStepInfo,
  // 登陆人信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getBaseInfo: fetchDataFunction(true, 'contract/getBaseInfo'),
  // 重置退订合约详情数据
  resetUnsubscribeDetail: fetchDataFunction(true, 'contract/resetUnsubscribeDetail'),
  // 获取附件列表
  getAttachmentList: fetchDataFunction(true, 'contract/getAttachmentList'),
  // 获取可申请客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 保存合作合约
  saveContractData: fetchDataFunction(true, 'contract/saveContractData'),
  // 合作合约退订
  contractUnSubscribe: fetchDataFunction(true, 'contract/contractUnSubscribe'),
  // 查询合作合约编号
  getContractNumList: fetchDataFunction(false, 'contract/getContractNumList'),
  // 查询条款名称列表
  getClauseNameList: fetchDataFunction(false, 'contract/getClauseNameList'),
  // 查询合作部门
  getCooperDeparmentList: fetchDataFunction(false, 'contract/getCooperDeparmentList'),
  // 获取审批人
  getFlowStepInfo: fetchDataFunction(true, 'contract/getFlowStepInfo'),
  // 审批接口
  postDoApprove: fetchDataFunction(true, 'contract/postDoApprove'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class Contract extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 查询左侧列表
    getSeibleList: PropTypes.func.isRequired,
    seibleList: PropTypes.object.isRequired,
    seibleListLoading: PropTypes.bool,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 查询可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object.isRequired,
    baseInfoLoading: PropTypes.bool,
    resetUnsubscribeDetail: PropTypes.func.isRequired,
    // 退订
    unsubscribeBaseInfo: PropTypes.object.isRequired,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 保存合作合约
    saveContractData: PropTypes.func.isRequired,
    // 保存合作合约请求状态
    saveContractDataLoading: PropTypes.bool,
    // 合作合约退订
    contractUnSubscribe: PropTypes.func.isRequired,
    // 查询合作合约编号
    getContractNumList: PropTypes.func.isRequired,
    contractNumList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 查询条款名称列表
    getClauseNameList: PropTypes.func.isRequired,
    clauseNameList: PropTypes.array.isRequired,
    // 查询合作部门
    getCooperDeparmentList: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    getFlowStepInfo: PropTypes.func.isRequired,
    // 新建时的审批人
    addFlowStepInfo: PropTypes.object,
    unsubFlowStepInfo: PropTypes.object,
    // 审批接口
    postDoApprove: PropTypes.func.isRequired,
    doApprove: PropTypes.object,
    postDoApproveLoading: PropTypes.bool,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    contractDetail: EMPTY_OBJECT,
    saveContractDataLoading: false,
    baseInfoLoading: false,
    postDoApproveLoading: false,
    flowStepInfo: EMPTY_OBJECT,
    addFlowStepInfo: EMPTY_OBJECT,
    unsubFlowStepInfo: EMPTY_OBJECT,
    doApprove: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      // 默认状态下新建弹窗不可见 false 不可见  true 可见
      createApprovalBoard: false,
      // 合作合约表单数据
      contractFormData: EMPTY_OBJECT,
      // 新建合作合约弹窗状态
      addFormModal: false,
      // 修改合作合约弹窗状态
      editFormModal: false,
      addFlowStepInfo: EMPTY_OBJECT,
      unsubFlowStepInfo: EMPTY_OBJECT,
      addOrEditSelfBtnGroup: '',
      // 是否有修改的权限
      hasEditPermission: false,
      // 审批人弹窗是否可见
      approverModal: false,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
      // 弹窗底部按钮数据
      footerBtnData: EMPTY_OBJECT,
      // 所选择的审批人
      selectApproveData: EMPTY_OBJECT,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
      // 临时审批人数据
      tempApproveData: EMPTY_OBJECT,
    };
  }

  componentWillMount() {
    const {
      location: {
        query,
        query: {
          pageNum,
          pageSize,
        },
      },
      getSeibleList,
      getClauseNameList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);

    // 默认筛选条件
    getSeibleList({
      ...params,
      type: pageType,
    });

    getClauseNameList({});
  }

  componentWillReceiveProps(nextProps) {
    const {
      seibleListLoading: prevSLL,
      // baseInfo: preBI,
      baseInfoLoading: preBIL,
      unsubFlowStepInfo: preUFSI,
      // doApprove: preDA,
      postDoApproveLoading: prePDA,
      location: { query: { currentId: prevCurrentId } },
    } = this.props;
    const {
      seibleList: nextSL,
      seibleListLoading: nextSLL,
      getBaseInfo,
      baseInfo: nextBI,
      baseInfoLoading: nextBIL,
      addFlowStepInfo: nextAFSI,
      unsubFlowStepInfo: nextUFSI,
      // doApprove: nextDA,
      postDoApproveLoading: nextPDA,
      location: { query: { currentId } },
      empInfo,
    } = nextProps;

    const { location: { query: prevQuery = EMPTY_OBJECT }, getSeibleList } = this.props;
    const { location: { query: nextQuery = EMPTY_OBJECT } } = nextProps;
    const { isResetPageNum = 'N', pageNum, pageSize } = nextQuery;
    // 深比较值是否相等
    // url发生变化，检测是否改变了筛选条件
    if (!_.isEqual(prevQuery, nextQuery)) {
      if (!this.diffObject(prevQuery, nextQuery)) {
        // 只监测筛选条件是否变化
        const params = constructSeibelPostBody(nextQuery,
          isResetPageNum === 'Y' ? 1 : pageNum,
          isResetPageNum === 'Y' ? 10 : pageSize,
        );
        getSeibleList({
          ...params,
          type: pageType,
        });
      }
    }
    if ((preBIL && !nextBIL)) {
      let hasEditPermission = false;
      // 如果当前登陆人与详情里的审批人相等，并且状态是驳回时显示编辑按钮
      if (getEmpId() === nextBI.approver && nextBI.status === '04') {
        hasEditPermission = true;
      }
      hasEditPermission = hasPermissionOfPostion(empInfo);
      this.setState({
        hasEditPermission,
      });
    }
    /* currentId变化重新请求 */
    // 获取到 seibleList,并且 seibleList 的 resultData 有数据
    if (((prevSLL && !nextSLL) && nextSL.resultData.length) ||
    (currentId && (currentId !== prevCurrentId))) {
      getBaseInfo({
        id: currentId,
      });
      this.setState({
        addFormModal: false,
        editFormModal: false,
      });
    }
    // // 获取到基本信息
    // if (!_.isEqual(preBI, nextBI)) {
    //   this.setState({
    //     contractFormData: nextBI,
    //   });
    // }

    // 获取到新建订购时的按钮
    if (!_.isEmpty(nextAFSI)) {
      // 获取到 flowStepInfo
      this.setState({
        addFlowStepInfo: nextAFSI,
        addOrEditSelfBtnGroup: <BottonGroup
          list={nextAFSI}
          onEmitEvent={this.footerBtnHandle}
        />,
      });
    }
    // 获取到新建退订时的按钮
    if (!_.isEqual(preUFSI, nextUFSI)) {
      this.setState({
        unsubFlowStepInfo: nextUFSI,
        addOrEditSelfBtnGroup: <BottonGroup
          list={nextUFSI}
          onEmitEvent={this.footerBtnHandle}
        />,
      });
    }
    // postDoApprove 方法结束后，关闭所有弹窗，清空审批信息
    if (prePDA && !nextPDA) {
      this.setState({
        tempApproveData: EMPTY_OBJECT,
      });
      console.warn('doApprove 结束，关闭弹窗');
      this.closeModal('approverModal');
      this.closeModal('addFormModal');
      this.closeModal('editFormModal');
    }

    // if (!_.isEqual(preDA, nextDA)) {
    //   // 获取到 flowStepInfo
    //   this.closeModal('addFormModal');
    // }
  }

  componentDidUpdate() {
    const { location: { pathname, query, query: { isResetPageNum } }, replace } = this.props;
    // 重置pageNum和pageSize
    if (isResetPageNum === 'Y') {
      replace({
        pathname,
        query: {
          ...query,
          isResetPageNum: 'N',
          pageNum: 1,
        },
      });
    }
  }

  @autobind
  onOk(modalKey) {
    this.setState({
      [modalKey]: false,
    });
  }

  // 上传成功后回调
  @autobind
  onUploadComplete(formData) {
    this.setState({
      ...this.state,
      contractFormData: formData,
    });
  }

  // 根据传入的条款列表和Key返回分类后的二维数组
  @autobind
  getTwoDimensionClauseList(list, key) {
    const uniqedArr = _.uniqBy(list, key);
    const tmpArr1 = [];
    uniqedArr.forEach((v) => {
      const paraName = v[key];
      let tmpArr2 = [];
      list.forEach((sv) => {
        if (paraName === sv[key]) {
          tmpArr2.push(sv);
        }
      });
      tmpArr1.push(tmpArr2);
      tmpArr2 = [];
    });
    return tmpArr1;
  }

  /**
   * 检查部分属性是否相同
   * @param {*} prevQuery 前一次query
   * @param {*} nextQuery 后一次query
   */
  diffObject(prevQuery, nextQuery) {
    const prevQueryData = _.omit(prevQuery, OMIT_ARRAY);
    const nextQueryData = _.omit(nextQuery, OMIT_ARRAY);
    if (!_.isEqual(prevQueryData, nextQueryData)) {
      return false;
    }
    return true;
  }

  // 根据子类型和客户查询合约编号
  @autobind
  handleSearchContractNum(data) {
    this.props.getContractNumList({ subType: data.subType, Type: '3', custId: data.client.cusId });
  }

  // 查询客户
  @autobind
  handleSearchCutList(value) {
    const { getCanApplyCustList } = this.props;
    getCanApplyCustList({
      keyword: value,
    });
  }

  // 查询合约详情
  @autobind
  handleSearchContractDetail(data) {
    this.props.getBaseInfo({
      type: 'unsubscribeDetail',
      id: '',
      flowId: data.flowId,
      operate: '2',
    });
  }

  // 接收AddForm数据
  @autobind
  handleChangeContractForm(formData) {
    this.setState({
      ...this.state,
      contractFormData: {
        ...this.state.contractFormData,
        ...formData,
      },
    });
  }

  // 根据关键词查询合作部门
  @autobind
  handleSearchCooperDeparment(keyword) {
    if (keyword) {
      this.props.getCooperDeparmentList({ name: keyword });
    }
  }

  // 判断合约有效期是否大于当前日期+5天
  @autobind
  isBiggerThanTodayAddFive(vailDt) {
    const vailDateHs = new Date(vailDt).getTime();
    const date = new Date();
    return vailDateHs > (date.getTime() + (86400000 * 5));
  }

  // 判断合约有效期是否大于开始日期
  @autobind
  isBiggerThanStartDate(contractFormData) {
    const startDate = new Date(contractFormData.startDt).getTime();
    const vailDate = new Date(contractFormData.vailDt).getTime();
    return startDate > vailDate;
  }

  // 检查每个每个部门只能选一种合约条款
  @autobind
  checkClauseIsUniqueness(list) {
    const tmpArr = this.getTwoDimensionClauseList(list, 'termsName');
    const tmpObj = {};
    let clauseStatus = true;
    tmpArr.forEach((v) => {
      v.forEach((sv) => {
        if (v.length > 1) {
          if (tmpObj[sv.divIntegrationId]) {
            clauseStatus = false;
          } else {
            tmpObj[sv.divIntegrationId] = 1;
          }
        }
      });
    });
    return clauseStatus;
  }

  // 检查合约条款值是否合法
  @autobind
  checkClauseIsLegal(list) {
    const tmpArr = this.getTwoDimensionClauseList(list, 'paraName');
    let clauseStatus = true;
    for (let i = 0; i < tmpArr.length; i++) {
      if (tmpArr[i][0].paraDisplayName.indexOf('比例') > -1) {
        let result = 0;
        tmpArr[i].forEach((v) => {
          result += Number(v.paraVal);
        });
        if (+result !== 1) {
          clauseStatus = false;
          break;
        }
      }
    }
    return clauseStatus;
  }

  // 保存合作合约 新建/修改 数据
  // @autobind
  // saveContractData() {
  //   const {
  //     saveContractData,
  //   } = this.props;
  //   const {
  //     contractFormData,
  //     editFormModal,
  //     footerBtnData,
  //     selectApproveData: { approverId = '' }
  //   } = this.state;
  //   console.warn('contractFormData', contractFormData);
  //   if (!contractFormData.subType) {
  //     message.error('请选择子类型');
  //     return;
  //   }
  //   if (!contractFormData.custName) {
  //     message.error('请选择客户');
  //     return;
  //   }
  //   // 新建合作合约弹窗
  //   if (!editFormModal) {
  //     const operationType = contractFormData.workflowname;
  //     // 判断是退订
  //     if (operationType === unsubscribe) {
  //       if (!contractFormData.contractNum.flowId) {
  //         message.error('请选择合约编号');
  //         return;
  //       }
  //       if (!contractFormData.approverId) {
  //         message.error('请选择审批人');
  //         return;
  //       }
  //       this.props.postDoApprove({
  //         flowId: contractFormData.contractNum.flowId,
  //         approverIdea: contractFormData.appraval || '',
  //         groupName: footerBtnData.nextGroupName,
  //         auditors: approverId,
  //         operate: '2',
  //       });
  //       // this.props.contractUnSubscribe(condition);
  //     } else {
  //       if (!contractFormData.startDt) {
  //         message.error('请选择合约开始日期');
  //         return;
  //       }
  //       if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
  //         message.error('合约开始日期不能大于合约有效期');
  //         return;
  //       }
  //       if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
  //         message.error('合约有效期必须大于当前日期加5天');
  //         return;
  //       }
  //       if (!contractFormData.terms.length) {
  //         message.error('请添加合约条款');
  //         return;
  //       }
  //       if (!this.checkClauseIsLegal(contractFormData.terms)) {
  //         message.error('合约条款中每种明细参数的值加起来必须要等于1');
  //         return;
  //       }
  //       const payload = {
  //         type: 'add',
  //         data: contractFormData,
  //         approveData: {
  //           flowId: '',
  //           approverIdea: contractFormData.appraval || '',
  //           groupName: footerBtnData.nextGroupName,
  //           auditors: approverId,
  //           operate: '1',
  //         },
  //       };
  //       console.warn('新建保存时的数据', payload);
  //       saveContractData(payload);
  //     }
  //     // // 新建窗口关闭后，请求左侧列表
  //     // const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
  //     // // 默认筛选条件
  //     // getSeibleList({
  //     //   ...params,
  //     //   type: pageType,
  //     // });
  //   } else {
  //     // 编辑合作合约弹窗
  //     if (!contractFormData.startDt) {
  //       message.error('请选择合约开始日期');
  //       return;
  //     }
  //     if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
  //       message.error('合约开始日期不能大于合约有效期');
  //       return;
  //     }
  //     if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
  //       message.error('合约有效期必须大于当前日期加5天');
  //       return;
  //     }
  //     if (!contractFormData.terms.length) {
  //       message.error('请添加合约条款');
  //       return;
  //     }
  //     if (!this.checkClauseIsLegal(contractFormData.terms)) {
  //       message.error('合约条款中每种明细参数的值加起来必须要等于1');
  //       return;
  //     }
  //     const payload = {
  //       type: 'edit',
  //       data: contractFormData,
  //     };
  //     console.warn('编辑保存时的 payload', payload);
  //     this.props.postDoApprove({
  //       flowId: this.state.flowId,
  //       approverIdea: contractFormData.appraval || '',
  //       groupName: footerBtnData.nextGroupName,
  //       auditors: approverId,
  //       operate: footerBtnData.operate,
  //     });
  //     saveContractData(payload);
  //     // 编辑窗口关闭后，请求此 flowId 的详情
  //     // getBaseInfo({
  //     //   flowId: this.state.flowId,
  //     //   id: '',
  //     // });
  //   }
  // }

  // 查询客户
  @autobind
  toSearchCust(value) {
    const { getCustomerList } = this.props;
    getCustomerList({
      keyword: value,
      type: pageType,
    });
  }

  // 头部新建按钮点击事件处理程序
  @autobind
  handleCreateBtnClick() {
    const { getFlowStepInfo, resetUnsubscribeDetail } = this.props;
    getFlowStepInfo({
      operate: 1,
      flowId: '',
    });
    this.showModal('addFormModal');
    // 每次打开弹窗的时候重置退订详情数据
    resetUnsubscribeDetail();
  }

  // 显示修改合作合约弹框
  @autobind
  handleShowEditForm() {
    this.setState({
      ...this.state,
      contractFormData: this.props.baseInfo,
    }, () => {
      console.warn('baseInfo', this.props.baseInfo);
      this.showModal('editFormModal');
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
    // 可能需要清空 contractFormData--TODO
    this.setState({
      [modalKey]: false,
      contractFormData: modalKey === 'approverModal' ?
        this.state.contractFormData
      :
        EMPTY_OBJECT,
    }, () => {
      if (modalKey === 'addFormModal' && this.AddFormComponent) {
        this.AddFormComponent.handleReset();
      }
    });
  }

  @autobind
  constructTableColumns() {
    return seibelColumns({
      pageName: 'contract',
      type: 'kehu1',
      pageData: contract,
    });
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle(btnItem) {
    console.warn('item', btnItem);
    // TODO-设定好相应的值传过去，注意 operation
    const { unsubscribeBaseInfo } = this.props;
    const { editFormModal, contractFormData } = this.state;
    console.warn('contractFormData', contractFormData);
    let payload = EMPTY_OBJECT;
    // 操作类型
    const operationType = contractFormData.workflowname;
    // 新建窗口时
    if (!editFormModal) {
      // 操作类型是退订时
      if (operationType === unsubscribe) {
        if (!contractFormData.subType) {
          message.error('请选择子类型');
          return;
        }
        if (!contractFormData.custName) {
          message.error('请选择客户');
          return;
        }
        if (!contractFormData.contractNum.flowId) {
          message.error('请选择合约编号');
          return;
        }
        payload = {
          ...unsubscribeBaseInfo,
          tduuid: contractFormData.tduuid || '',
          tdDescription: contractFormData.tdDescription || '',
        };
        console.warn('新建窗口，退订所有数据完毕', payload);
        // 数据判断完毕，请求接口
      } else {
        // 操作类型是订购时
        if (!contractFormData.subType) {
          message.error('请选择子类型');
          return;
        }
        if (!contractFormData.custName) {
          message.error('请选择客户');
          return;
        }
        if (!contractFormData.startDt) {
          message.error('请选择合约开始日期');
          return;
        }
        if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
          message.error('合约开始日期不能大于合约有效期');
          return;
        }
        if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
          message.error('合约有效期必须大于当前日期加5天');
          return;
        }
        if (!contractFormData.terms.length) {
          message.error('请添加合约条款');
          return;
        }
        if (!this.checkClauseIsLegal(contractFormData.terms)) {
          message.error('合约条款中比例明细参数的值加起来必须要等于1');
          return;
        }
        if (!this.checkClauseIsUniqueness(contractFormData.terms)) {
          message.error('合约条款中每个部门不能有相同的合约条款！');
          return;
        }
        payload = contractFormData;
        console.warn('新建窗口所有数据完毕 payload', payload);
        // 数据判断完毕，请求接口
      }
    } else {
      // 编辑窗口
      if (!contractFormData.startDt) {
        message.error('请选择合约开始日期');
        return;
      }
      if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
        message.error('合约开始日期不能大于合约有效期');
        return;
      }
      if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
        message.error('合约有效期必须大于当前日期加5天');
        return;
      }
      if (!contractFormData.terms.length) {
        message.error('请添加合约条款');
        return;
      }
      if (!this.checkClauseIsLegal(contractFormData.terms)) {
        message.error('合约条款中比例明细参数的值加起来必须要等于1');
        return;
      }
      if (!this.checkClauseIsUniqueness(contractFormData.terms)) {
        message.error('合约条款中每个部门不能有相同的合约条款！');
        return;
      }
      payload = contractFormData;
      console.warn('编辑窗口所有数据完毕', payload);
      // 数据判断完毕，请求接口
    }
    let tempApproveData = EMPTY_OBJECT;
    // 判断弹窗类型，生成不同数据--新建
    if (!editFormModal) {
      // 操作类型是退订时
      if (operationType === unsubscribe) {
        tempApproveData = {
          type: 'unsubscribe',
          flowId: contractFormData.contractNum.flowId,
          approverIdea: contractFormData.appraval || '',
          operate: '2',
        };
      } else {
        // 订购
        tempApproveData = {
          type: 'add',
          flowId: '',
          approverIdea: contractFormData.appraval || '',
          operate: '1',
        };
      }
    } else {
      // 编辑
      tempApproveData = {
        type: 'edit',
        flowId: contractFormData.flowid,
        approverIdea: contractFormData.appraval || '',
        operate: btnItem.operate || '',
      };
    }
    // item 不为空，并且 approverNum 不等于 'none'，
    // 需要选择审批人
    if (!_.isEmpty(btnItem) && btnItem.approverNum !== 'none') {
      const listData = btnItem.flowAuditors;
      const newApproverList = listData.map((item, index) => {
        const key = `${new Date().getTime()}-${index}`;
        return {
          empNo: item.login || '',
          empName: item.empName || '无',
          belowDept: item.occupation || '无',
          key,
        };
      });
      this.setState({
        flowAuditors: newApproverList,
        footerBtnData: btnItem,
        payload,
        tempApproveData,
      }, this.showModal('approverModal'));
    } else {
      // 不需要审批人
      // 设置审批人信息
      const selectApproveData = {
        approverName: btnItem.flowAuditors[0].empName,
        approverId: btnItem.flowAuditors[0].login,
      };
      // 设置按钮信息
      const footerBtnData = btnItem;
      const sendPayload = {
        payload,
        approveData: {
          ...tempApproveData,
          groupName: btnItem.nextGroupName,
          auditors: btnItem.flowAuditors[0].login,
        },
        selectApproveData,
        footerBtnData,
      };
      // 按钮是终止时，弹出确认框，确定之后调用接口
      if (btnItem.btnName === '终止') {
        const that = this;
        confirm({
          title: '确认要终止此任务吗?',
          content: '确认后，操作将不可取消。',
          onOk() {
            that.sendRequest(sendPayload);
          },
        });
      } else {
        this.sendRequest(sendPayload);
      }
    }
  }

  // 构造底部按钮集合
  // @autobind
  // constructSelfBtnGroup() {
  //   const { flowStepInfo, unsubFlowStepInfo } = this.state;
  //   let list = [];
  //   if (unsubFlowStepInfo) {
  //     list = unsubFlowStepInfo;
  //   } else {
  //     list = flowStepInfo;
  //   }
  //   this.setState({
  //     addOrEditSelfBtnGroup: <BottonGroup
  //       list={list}
  //       onEmitEvent={this.footerBtnHandle}
  //     />,
  //   });
  // }
  // 审批人弹出框确认按钮
  @autobind
  handleApproverModalOK(approver) {
    const { payload, footerBtnData, tempApproveData } = this.state;
    const selectApproveData = {
      approverName: approver.empName,
      approverId: approver.empNo,
    };
    const sendPayload = {
      payload,
      approveData: {
        ...tempApproveData,
        groupName: footerBtnData.nextGroupName,
        auditors: approver.empNo,
      },
      footerBtnData,
      selectApproveData,
    };
    console.warn('审批人确认时的 sendPayload', sendPayload);
    this.sendRequest(sendPayload);
  }

  // 最终发出接口请求
  @autobind
  sendRequest(sendPayload) {
    const {
      saveContractData,
      location: { query },
    } = this.props;
    const payload = {
      ...sendPayload,
      currentQuery: query,
    };
    console.warn('sendRequest payload', payload);
    saveContractData(payload);
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      customerList,
      baseInfo,
      attachmentList,
      flowHistory,
      canApplyCustList,
      contractNumList,
      flowStepInfo,
      addFlowStepInfo,
      getFlowStepInfo,
      empInfo,
      resetUnsubscribeDetail,
    } = this.props;
    const {
      addFormModal,
      editFormModal,
      approverModal,
      addOrEditSelfBtnGroup,
      hasEditPermission,
      flowAuditors,
    } = this.state;
    const isEmpty = _.isEmpty(seibleList.resultData);
    const topPanel = (
      <ConnectedSeibelHeader
        location={location}
        replace={replace}
        page="contractPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        operateOptions={operationList}
        needOperate
        empInfo={empInfo}
      />
    );
    const leftPanel = (
      <ContractList
        list={seibleList}
        replace={replace}
        location={location}
        columns={this.constructTableColumns()}
      />
    );
    const rightPanel = (
      <Detail
        baseInfo={baseInfo}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
        hasEditPermission={hasEditPermission}
        showEditModal={this.handleShowEditForm}
      />
    );
    // 新建表单props
    const addFormProps = {
      // 合约编号
      onSearchContractNum: this.handleSearchContractNum,
      contractNumList,
      // 可申请客户列表
      onSearchCutList: this.handleSearchCutList,
      custList: canApplyCustList,
      // 基本信息
      onSearchContractDetail: this.handleSearchContractDetail,
      contractDetail: this.props.unsubscribeBaseInfo,
      // 表单变化
      onChangeForm: this.handleChangeContractForm,
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
      // 审批人
      flowStepInfo: addFlowStepInfo,
      // 获取审批人
      getFlowStepInfo,
      // 清空退订合作合约详情
      resetUnsubscribeDetail,
    };
    const addFormModalProps = {
      modalKey: 'addFormModal',
      title: '新建合约申请',
      closeModal: this.closeModal,
      visible: addFormModal,
      size: 'large',
      // 底部按钮
      selfBtnGroup: addOrEditSelfBtnGroup,
    };
    // 修改表单props
    const contractDetail = {
      baseInfo,
      attachmentList,
      flowHistory,
    };
    const editFormProps = {
      custList: customerList,
      contractDetail,
      onSearchCutList: this.toSearchCust,
      onChangeForm: this.handleChangeContractForm,
      uploadAttachment: this.onUploadComplete,
      // 条款名称列表
      clauseNameList: this.props.clauseNameList,
      // 合作部门列表
      cooperDeparment: this.props.cooperDeparment,
      // 根据管检测查询合作部门
      searchCooperDeparment: this.handleSearchCooperDeparment,
      // 审批人相关信息
      flowStepInfo,
    };
    const selfBtnGroup = (<BottonGroup
      list={flowStepInfo}
      onEmitEvent={this.footerBtnHandle}
    />);
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '修改合约申请',
      closeModal: this.closeModal,
      visible: editFormModal,
      size: 'large',
      selfBtnGroup,
    };
    return (
      <div className={styles.premissionbox} >
        <SplitPanel
          isEmpty={isEmpty}
          topPanel={topPanel}
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          leftListClassName="contractList"
        />
        {
          addFormModal ?
            <CommonModal {...addFormModalProps} >
              <AddForm
                {...addFormProps}
                ref={(AddFormComponent) => { this.AddFormComponent = AddFormComponent; }}
              />
            </CommonModal>
          :
            null
        }
        {
          editFormModal ?
            <CommonModal {...editFormModalProps}>
              <EditForm {...editFormProps} />
            </CommonModal>
          :
            null
        }
        {
          approverModal ?
            <ChoiceApproverBoard
              visible={approverModal}
              approverList={flowAuditors}
              onClose={() => this.closeModal('approverModal')}
              onOk={this.handleApproverModalOK}
            />
          :
            null
        }
      </div>
    );
  }
}
