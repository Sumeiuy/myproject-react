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
import { Modal } from 'antd';
import _ from 'lodash';
import { constructSeibelPostBody, getEmpId } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/SplitPanel';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/channelsTypeProtocol/Detail';
import ChannelsTypeProtocolList from '../../components/common/biz/CommonList';
import seibelColumns from '../../components/common/biz/seibelColumns';
import CommonModal from '../../components/common/biz/CommonModal';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import BottonGroup from '../../components/permission/BottonGroup';
// import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
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
// 通道类型协议新建/编辑弹窗按钮，暂时写死在前端
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
  // 操作类型列表
  operationList: state.channelsTypeProtocol.operationList,
  // 子类型列表
  subTypeList: state.channelsTypeProtocol.subTypeList,
  // 模板列表
  templateList: state.channelsTypeProtocol.templateList,
  // 模板对应协议条款列表
  protocolClauseList: state.channelsTypeProtocol.protocolClauseList,
  // 协议产品列表
  protocolProductList: state.channelsTypeProtocol.protocolProductList,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 获取右侧详情
  getProtocolDetail: fetchDataFunction(true, 'channelsTypeProtocol/getProtocolDetail'),
  // 获取附件列表
  getAttachmentList: fetchDataFunction(true, 'channelsTypeProtocol/getAttachmentList'),
  // 查询操作类型/子类型/模板列表
  queryTypeVaules: fetchDataFunction(false, 'channelsTypeProtocol/queryTypeVaules'),
  // 根据所选模板id查询模板对应协议条款
  queryChannelProtocolItem: fetchDataFunction(false, 'channelsTypeProtocol/queryChannelProtocolItem'),
  // 查询协议产品列表
  queryChannelProtocolProduct: fetchDataFunction(false, 'channelsTypeProtocol/queryChannelProtocolProduct'),
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
    // 查询可申请客户列表
    getCanApplyCustList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    // 查询右侧详情
    getProtocolDetail: PropTypes.func.isRequired,
    protocolDetail: PropTypes.object.isRequired,
    protocolDetailLoading: PropTypes.bool,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 审批记录
    flowHistory: PropTypes.array,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
    // 查询操作类型/子类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    templateList: PropTypes.array.isRequired,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    protocolClauseList: PropTypes.array.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    protocolProductList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    protocolDetailLoading: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEmpty: true,
      // 新建/编辑弹窗状态
      editFormModal: true,
      // 是否有修改的权限
      hasEditPermission: false,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
    };
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

  // 查询客户
  @autobind
  handleSearchCutList(param) {
    const { getCanApplyCustList } = this.props;
    getCanApplyCustList(param);
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
    // 从editFormComponent组件中取出值
    const formData = this.EditFormComponent.getData();
    console.log('formData',formData)
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
      attachmentList,
      flowHistory,
      empInfo,
      getCustRange,
      getCanApplyCustList, // 查询可申请客户列表
      canApplyCustList, // 可申请客户列表
      queryTypeVaules, // 查询操作类型/子类型/模板列表
      operationList, // 操作类型列表
      subTypeList, // 子类型列表
      templateList, // 模板列表
      protocolDetail, // 协议详情
      queryChannelProtocolItem, // 根据所选模板id查询模板对应协议条款
      protocolClauseList, // 所选模板对应协议条款列表
      queryChannelProtocolProduct, // 查询协议产品列表
      protocolProductList, // 协议产品列表
    } = this.props;
    const {
      editFormModal,
      hasEditPermission,
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
        protocolDetail={protocolDetail}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
        hasEditPermission={hasEditPermission}
        showEditModal={this.handleShowEditForm}
      />
    );
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
      custList: canApplyCustList,
      // 查询客户
      onSearchCutList: getCanApplyCustList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 操作类型列表
      operationList,
      // 子类型列表
      subTypeList,
      // 协议模板列表
      templateList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
      // 协议详情 - 编辑时传入
      protocolDetail,
      // 查询协议产品列表
      queryChannelProtocolProduct,
      // 协议产品列表
      protocolProductList,
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
      </div>
    );
  }
}
/*eslint-disable */