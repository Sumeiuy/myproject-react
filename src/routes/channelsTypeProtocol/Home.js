/*eslint-disable */
/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-10-26 17:50:46
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message, Modal } from 'antd';
import _ from 'lodash';
import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
// import ContractHeader from '../../components/common/biz/SeibelHeader';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/channelsTypeProtocol/Detail';
import ChannelsTypeProtocolList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import BottonGroup from '../../components/permission/BottonGroup';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';


const confirm = Modal.confirm;
const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
// 退订的类型
// const unsubscribe = '2';
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const {
  channelsTypeProtocol,
  channelsTypeProtocol: { pageType, subType, operationList, status },
} = seibelConfig;
// 新建/编辑弹窗按钮，暂时写死在前端
const FLOW_BUTTONS = {
  flowButtons: [
    {
      btnName: '提交',
    }
  ]
}
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
  canApplyCustList: state.app.canApplyCustList,
  // 查询右侧详情
  protocolDetail: state.channelsTypeProtocol.protocolDetail,
  protocolDetailLoading: state.loading.effects['channelsTypeProtocol/getProtocolDetail'],
  // 附件列表
  attachmentList: state.contract.attachmentList,

  // 审批记录
  flowHistory: state.contract.flowHistory,

  // 登陆人信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
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
export default class ChannelsTypeProtocol extends PureComponent {
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
      seibleListLoading: nextSLL,
      getBaseInfo,
      baseInfo: nextBI,
      baseInfoLoading: nextBIL,
      addFlowStepInfo: nextAFSI,
      unsubFlowStepInfo: nextUFSI,
      // doApprove: nextDA,
      postDoApproveLoading: nextPDA,
      location: { query: { currentId } },
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
      this.setState({
        hasEditPermission,
      });
    }
    /* currentId变化重新请求 */
    if ((prevSLL && !nextSLL) || (currentId && (currentId !== prevCurrentId))) {
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
    this.showModal('editFormModal');
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
      pageName: 'channelsTypeProtocol',
      type: 'kehu1',
      pageData: channelsTypeProtocol,
    });
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle(btnItem) {
    console.warn('item', btnItem);
    // TODO-设定好相应的值传过去，注意 operation
    const { unsubscribeBaseInfo } = this.props;
    const formData = this.EditFormComponent.getData();
    console.log('formData',formData)
  }

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
      getCustRange,
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
        page="channelsTypeProtocolPage"
        pageType={pageType}
        subtypeOptions={subType}
        stateOptions={status}
        creatSeibelModal={this.handleCreateBtnClick}
        operateOptions={operationList}
        needOperate
        empInfo={empInfo}
        getCustRange={getCustRange}
      />
    );
    const leftPanel = (
      <ChannelsTypeProtocolList
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
    // 新建/修改表单props
    const contractDetail = {
      baseInfo,
      attachmentList,
      flowHistory,
    };
    const selfBtnGroup = (<BottonGroup
      list={FLOW_BUTTONS}
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
    const editFormProps = {
      // 客户列表
      custList: customerList,
      // 查询客户
      onSearchCutList: this.toSearchCust,
      // 查询协议模板
      onSearchProtocolTemplate: ()=>{},
      // 协议模板列表
      protocolTemplateList: [],
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
          editFormModal ?
            <CommonModal {...editFormModalProps} >
              <EditForm
                {...editFormProps}
                ref={(ref) => { this.EditFormComponent = ref; }}
              />
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
/*eslint-disable */