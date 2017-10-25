/*eslint-disable */
/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by:   XuWenKang
 * @Last Modified time: 2017-10-24 16:47:47
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message } from 'antd';
import _ from 'lodash';
import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ContractHeader from '../../components/common/biz/SeibelHeader';
import Detail from '../../components/channelsTypeProtocol/Detail';
import ContractList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import AddForm from '../../components/channelsTypeProtocol/AddForm';
import BottonGroup from '../../components/permission/BottonGroup';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';

import styles from './home.less';

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
  // 查询拟稿人
  drafterList: state.app.drafterList,
  // 查询部门
  custRange: state.app.custRange,
  // 查询客户
  customerList: state.app.customerList,
  // 查询右侧详情
  baseInfo: state.channelsTypeProtocol.baseInfo,
  baseInfoLoading: state.loading.effects['channelsTypeProtocol/getBaseInfo'],
  // 退订时查询详情
  // unsubscribeBaseInfo: state.contract.unsubscribeBaseInfo,
  // 附件列表
  attachmentList: state.channelsTypeProtocol.attachmentList,
  // 新建/修改 客户列表
  // canApplyCustList: state.app.canApplyCustList,
  // 合作合约编号列表
  // contractNumList: state.contract.contractNumList,
  // 审批记录
  flowHistory: state.channelsTypeProtocol.flowHistory,
  // 新增合约条款-条款名称
  // clauseNameList: state.contract.clauseNameList,
  // 新增合约条款-合作部门
  // cooperDeparment: state.contract.cooperDeparment,
  // 列表请求状态  // 获取列表数据进程
  // saveContractDataLoading: state.loading.effects['contract/saveContractData'],
  // 审批人
  flowStepInfo: state.channelsTypeProtocol.flowStepInfo,
  // 新建时的审批人
  addFlowStepInfo: state.channelsTypeProtocol.addFlowStepInfo,
  // doApprove: state.contract.doApprove,
  // unsubFlowStepInfo: state.contract.unsubFlowStepInfo,
  // 登陆人信息
  empInfo: state.app.empInfo,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取拟稿人
  getDrafterList: fetchDataFunction(false, 'app/getDrafterList'),
  // 获取部门
  getCustRange: fetchDataFunction(false, 'app/getCustRange'),
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getBaseInfo: fetchDataFunction(true, 'channelsTypeProtocol/getBaseInfo'),
  // 重置退订合约详情数据
  // resetUnsubscribeDetail: fetchDataFunction(true, 'contract/resetUnsubscribeDetail'),
  // 获取附件列表
  getAttachmentList: fetchDataFunction(true, 'contract/getAttachmentList'),
  // 获取可申请客户列表
  // getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 保存合作合约
  // saveContractData: fetchDataFunction(true, 'contract/saveContractData'),
  // 合作合约退订
  // contractUnSubscribe: fetchDataFunction(true, 'contract/contractUnSubscribe'),
  // 查询合作合约编号
  // getContractNumList: fetchDataFunction(false, 'contract/getContractNumList'),
  // 查询条款名称列表
  // getClauseNameList: fetchDataFunction(false, 'contract/getClauseNameList'),
  // 查询合作部门
  // getCooperDeparmentList: fetchDataFunction(false, 'contract/getCooperDeparmentList'),
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
    // 查询拟稿人
    getDrafterList: PropTypes.func.isRequired,
    drafterList: PropTypes.array.isRequired,
    // 查询部门
    getCustRange: PropTypes.func.isRequired,
    custRange: PropTypes.array.isRequired,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 查询可申请客户列表
    // getCanApplyCustList: PropTypes.func.isRequired,
    // canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object.isRequired,
    baseInfoLoading: PropTypes.bool,
    // resetUnsubscribeDetail: PropTypes.func.isRequired,
    // 退订
    // unsubscribeBaseInfo: PropTypes.object.isRequired,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 保存合作合约
    // saveContractData: PropTypes.func.isRequired,
    // 保存合作合约请求状态
    // saveContractDataLoading: PropTypes.bool,
    // 合作合约退订
    // contractUnSubscribe: PropTypes.func.isRequired,
    // 查询合作合约编号
    // getContractNumList: PropTypes.func.isRequired,
    // contractNumList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 查询条款名称列表
    // getClauseNameList: PropTypes.func.isRequired,
    // clauseNameList: PropTypes.array.isRequired,
    // 查询合作部门
    // getCooperDeparmentList: PropTypes.func.isRequired,
    // cooperDeparment: PropTypes.array.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    getFlowStepInfo: PropTypes.func.isRequired,
    // 新建时的审批人
    addFlowStepInfo: PropTypes.object,
    unsubFlowStepInfo: PropTypes.object,
    // 审批接口
    postDoApprove: PropTypes.func.isRequired,
    doApprove: PropTypes.object,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    // contractDetail: EMPTY_OBJECT,
    // saveContractDataLoading: false,
    baseInfoLoading: false,
    flowStepInfo: EMPTY_OBJECT,
    addFlowStepInfo: EMPTY_OBJECT,
    // unsubFlowStepInfo: EMPTY_OBJECT,
    doApprove: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 操作类型
      business2: '',
      createTime: '',
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
      // unsubFlowStepInfo: EMPTY_OBJECT,
      addOrEditSelfBtnGroup: '',
      // 是否有修改的权限
      hasEditPermission: false,
      // 修改合作合约对象的操作类型和id
      editContractInfo: {
        operationType: '',
        id: '',
      },
      // 审批人弹窗是否可见
      approverModal: false,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
      // 弹窗底部按钮数据
      footerBtnData: EMPTY_OBJECT,
      // 所选择的审批人
      selectApproveData: EMPTY_OBJECT,
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
      getCustRange,
      // getClauseNameList,
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);

    getCustRange(EMPTY_OBJECT);
    // 默认筛选条件
    getSeibleList({
      ...params,
      type: pageType,
    });

    // getClauseNameList({});
  }

  componentWillReceiveProps(nextProps) {
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

  /**
   * 点击列表每条的时候对应请求详情
   */
  @autobind
  getListRowId(obj) {
    const { getBaseInfo } = this.props;
    getBaseInfo({
      flowId: obj.flowId,
      id: '',
    });
    this.setState({
      business2: obj.business2,
      createTime: obj.createTime,
    });
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
  // @autobind
  // handleSearchContractNum(data) {
  //   this.props.getContractNumList({ subType: data.subType, Type: '3', business1: data.client.cusId });
  // }

  // 查询客户
  // @autobind
  // handleSearchCutList(value) {
  //   const { getCanApplyCustList } = this.props;
  //   getCanApplyCustList({
  //     keyword: value,
  //   });
  // }

  // 查询合约详情
  // @autobind
  // handleSearchContractDetail(data) {
  //   this.props.getBaseInfo({
  //     type: 'unsubscribeDetail',
  //     id: '',
  //     flowId: data.flowId,
  //     operate: '2',
  //   });
  // }

  // 接收AddForm数据
  // @autobind
  // handleChangeContractForm(formData) {
  //   this.setState({
  //     ...this.state,
  //     contractFormData: {
  //       ...this.state.contractFormData,
  //       ...formData,
  //     },
  //   });
  // }

  // 根据关键词查询合作部门
  // @autobind
  // handleSearchCooperDeparment(keyword) {
  //   if (keyword) {
  //     this.props.getCooperDeparmentList({ name: keyword });
  //   }
  // }

  // 查询拟稿人
  @autobind
  toSearchDrafter(value) {
    const { getDrafterList } = this.props;
    getDrafterList({
      keyword: value,
      type: pageType,
    });
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
    this.showModal('addFormModal');
    // 每次打开弹窗的时候重置退订详情数据
    resetUnsubscribeDetail();
  }

  // 显示修改合作合约弹框
  @autobind
  handleShowEditForm() {
    this.setState({
      ...this.state,
      editContractInfo: this.props.baseInfo,
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
    console.warn('点击了关闭弹窗', modalKey);
    this.setState({
      [modalKey]: false,
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
  // @autobind
  // footerBtnHandle(btnItem) {
  //   console.warn('item', btnItem);
  //   // item 不为空，并且 approverNum 不等于 'none'
  //   if (!_.isEmpty(btnItem) && btnItem.approverNum !== 'none') {
  //     const listData = btnItem.flowAuditors;
  //     const newApproverList = listData.map((item, index) => {
  //       const key = `${new Date().getTime()}-${index}`;
  //       return {
  //         empNo: item.login || '',
  //         empName: item.empName || '无',
  //         belowDept: item.occupation || '无',
  //         key,
  //       };
  //     });
  //     this.setState({
  //       flowAuditors: newApproverList,
  //       footerBtnData: btnItem,
  //     }, this.showModal('approverModal'));
  //   } else {
  //     console.warn('不需要选择审批人');
  //     this.setState({
  //       flowAuditors: EMPTY_LIST,
  //       footerBtnData: btnItem,
  //     }, this.saveContractData);
  //   }
  // }

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
    console.warn('approver', approver);
    this.setState({
      selectApproveData: {
        approverName: approver.empName,
        approverId: approver.empNo,
      },
    }, this.saveContractData);
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      drafterList,
      custRange,
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
    } = this.props;
    const {
      addFormModal,
      editFormModal,
      approverModal,
      business2,
      createTime,
      addOrEditSelfBtnGroup,
      hasEditPermission,
      flowAuditors,
    } = this.state;
    if (!custRange || !custRange.length) {
      return null;
    }
    const isEmpty = _.isEmpty(seibleList.resultData);
    const topPanel = (
      <ContractHeader
        location={location}
        replace={replace}
        page="contractPage"
        subtypeOptions={subType}
        stateOptions={status}
        toSearchDrafter={this.toSearchDrafter}
        toSearchCust={this.toSearchCust}
        drafterList={drafterList}
        customerList={customerList}
        custRange={custRange}
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
        clickRow={this.getListRowId}
        backKeys={['flowId', 'business2', 'createTime']}
      />
    );
    const rightPanel = (
      <Detail
        baseInfo={baseInfo}
        operationType={business2}
        createTime={createTime}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
        hasEditPermission={hasEditPermission}
        showEditModal={this.handleShowEditForm}
      />
    );
    // 新建表单props
    /*
    const addFormProps = {
      // 合约编号
      onSearchContractNum: this.handleSearchContractNum,
      contractNumList,
      // 可申请客户列表
      onSearchCutList: this.handleSearchCutList,
      // onSearchCutList: this.toSearchCust,
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
      baseInfo: {
        ...baseInfo,
        business2,
        createTime,
      },
      attachmentList,
      flowHistory,
    };
    const editFormProps = {
      custList: customerList,
      contractDetail,
      onSearchCutList: this.toSearchCust,
      onChangeForm: this.handleChangeContractForm,
      uploadAttachment: this.onUploadComplete,
      operationType: this.state.editContractInfo.operationType || '',
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
    */
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