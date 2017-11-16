/*
 * @Description: 合作合约 home 页面
 * @Author: LiuJianShu
 * @Date: 2017-09-22 14:49:16
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-16 17:36:22
 */
import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message, Modal } from 'antd';
import _ from 'lodash';

import { constructSeibelPostBody } from '../../utils/helper';
import SplitPanel from '../../components/common/splitPanel/CutScreen';
import ConnectedSeibelHeader from '../../components/common/biz/ConnectedSeibelHeader';
import Detail from '../../components/channelsTypeProtocol/Detail';
import ChannelsTypeProtocolList from '../../components/common/appList';
// import seibelColumns from '../../components/common/biz/seibelColumns';
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
const OMIT_ARRAY = ['isResetPageNum', 'currentId'];
const {
  channelsTypeProtocol,
  channelsTypeProtocol: { pageType, subType, status, operationList },
} = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询左侧列表
  seibleList: state.app.seibleList,
  // 列表请求状态
  seibleListLoading: state.loading.effects['app/getSeibleList'],
  // 查询客户
  canApplyCustList: state.app.canApplyCustList,
  // 查询右侧详情
  protocolDetail: state.channelsTypeProtocol.protocolDetail,
  protocolDetailLoading: state.loading.effects['channelsTypeProtocol/getProtocolDetail'],
  // 附件
  attachmentList: state.channelsTypeProtocol.attachmentList,
  // 审批记录
  flowHistory: state.channelsTypeProtocol.flowHistory,
  // 登陆人信息
  empInfo: state.app.empInfo,
  // 操作类型列表
  operationTypeList: state.channelsTypeProtocol.operationList,
  // 子类型列表
  subTypeList: state.channelsTypeProtocol.subTypeList,
  // 模板列表
  templateList: state.channelsTypeProtocol.templateList,
  // 模板对应协议条款列表
  protocolClauseList: state.channelsTypeProtocol.protocolClauseList,
  // 协议产品列表
  protocolProductList: state.channelsTypeProtocol.protocolProductList,
  underCustList: state.channelsTypeProtocol.underCustList,
  // 审批人
  flowStepInfo: state.channelsTypeProtocol.flowStepInfo,
  // 保存成功后返回itemId,提交审批流程所需
  itemId: state.channelsTypeProtocol.itemId,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取左侧列表
  getSeibleList: fetchDataFunction(true, 'app/getSeibleList'),
  // 获取客户列表
  getCanApplyCustList: fetchDataFunction(false, 'app/getCanApplyCustList'),
  // 获取右侧详情
  getProtocolDetail: fetchDataFunction(true, 'channelsTypeProtocol/getProtocolDetail'),
  // 查询操作类型/子类型/模板列表
  queryTypeVaules: fetchDataFunction(false, 'channelsTypeProtocol/queryTypeVaules'),
  // 根据所选模板id查询模板对应协议条款
  queryChannelProtocolItem: fetchDataFunction(false, 'channelsTypeProtocol/queryChannelProtocolItem'),
  // 查询协议产品列表
  queryChannelProtocolProduct: fetchDataFunction(false, 'channelsTypeProtocol/queryChannelProtocolProduct'),
  // 保存详情
  saveProtocolData: fetchDataFunction(true, 'channelsTypeProtocol/saveProtocolData'),
  // 查询客户
  queryCust: fetchDataFunction(true, 'channelsTypeProtocol/queryCust'),
  // 清除协议产品列表
  clearPropsData: fetchDataFunction(false, 'channelsTypeProtocol/clearPropsData'),
  // 获取审批人
  getFlowStepInfo: fetchDataFunction(true, 'channelsTypeProtocol/getFlowStepInfo'),
  // 提交审批流程
  doApprove: fetchDataFunction(true, 'channelsTypeProtocol/doApprove'),
  // 验证客户
  getCustValidate: fetchDataFunction(true, 'channelsTypeProtocol/getCustValidate'),
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
    // 附件
    attachmentList: PropTypes.array,

    // 审批记录
    flowHistory: PropTypes.array,
    // 登陆人信息
    empInfo: PropTypes.object.isRequired,
    // 查询操作类型/子类型/模板列表
    queryTypeVaules: PropTypes.func.isRequired,
    operationTypeList: PropTypes.array.isRequired,
    subTypeList: PropTypes.array.isRequired,
    templateList: PropTypes.array.isRequired,
    // 根据所选模板id查询模板对应协议条款
    queryChannelProtocolItem: PropTypes.func.isRequired,
    protocolClauseList: PropTypes.array.isRequired,
    // 查询协议产品列表
    queryChannelProtocolProduct: PropTypes.func.isRequired,
    protocolProductList: PropTypes.array.isRequired,
    // 保存详情
    saveProtocolData: PropTypes.func.isRequired,
    // 保存成功后返回itemId,提交审批流程所需
    itemId: PropTypes.string.isRequired,
    // 下挂客户接口
    queryCust: PropTypes.func.isRequired,
    // 下挂客户列表
    underCustList: PropTypes.array,
    // 清除props数据
    clearPropsData: PropTypes.func.isRequired,
    // 审批人
    flowStepInfo: PropTypes.object,
    getFlowStepInfo: PropTypes.func.isRequired,
    // 提交审批流程
    doApprove: PropTypes.func.isRequired,
    // 验证客户
    getCustValidate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    underCustList: EMPTY_LIST,
    flowStepInfo: EMPTY_OBJECT,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 新建编辑弹窗状态
      editFormModal: false,
      // 最终传递的数据
      payload: EMPTY_OBJECT,
      // 选择审批人弹窗状态
      approverModal: false,
      // 需要提交的数据
      protocolData: EMPTY_OBJECT,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
    };
  }

  componentDidMount() {
    const {
      getSeibleList,
      getProtocolDetail,
      location: {
        query,
        query: {
          pageNum,
          pageSize,
          currentId,
        },
      },
    } = this.props;
    const params = constructSeibelPostBody(query, pageNum || 1, pageSize || 10);
    // 默认筛选条件
    getSeibleList({ ...params, type: pageType }).then(() => {
      getProtocolDetail({
        id: currentId,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: prevQuery = EMPTY_OBJECT }, getSeibleList } = this.props;
    const { location: { query: nextQuery = EMPTY_OBJECT }, getProtocolDetail } = nextProps;
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
        }).then(() => {
          getProtocolDetail({
            id: nextQuery.currentId,
          });
        });
      }
    }
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

  // 点击列表每条的时候对应请求详情
  @autobind
  handleListRowClick(record) {
    const { id } = record;
    const {
      location: { query: { currentId } },
      getProtocolDetail,
    } = this.props;
    if (currentId === id) return;
    getProtocolDetail({
      id: currentId,
    });
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
    const { getFlowStepInfo } = this.props;
    getFlowStepInfo({
      flowId: '',
      operate: 1,
    }).then(() => {
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
    this.setState({
      [modalKey]: false,
    });
  }

  // 检查保存数据是否合法
  @autobind
  checkFormDataIsLegal(formData) {
    if (!formData.subType) {
      message.error('请选择子类型');
      return false;
    }
    if (!formData.operationType) {
      message.error('请选择操作类型');
      return false;
    }
    if (!formData.custId) {
      message.error('请选择客户');
      return false;
    }
    if (!formData.templateId) {
      message.error('请选择协议模板');
      return false;
    }
    if (!formData.item.length) {
      message.error('请选择协议产品');
      return false;
    }
    if (formData.multiUsedFlag === 'Y' && !formData.cust.length) {
      message.error('请添加下挂客户');
      return false;
    }
    return true;
  }

  // 点击提交按钮弹提示框
  @autobind
  showconFirm(formData, btnItem) {
    confirm({
      title: '提示',
      content: '经对客户与服务产品三匹配结果，请确认客户是否已签署服务计划书及适当确认书！',
      onOk: () => {
        // const {
        //   location: {
        //     query,
        //   },
        // } = this.props;
        // const params = {
        //   ...constructSeibelPostBody(query, 1, 10),
        //   type: pageType,
        // };
        this.setState({
          ...this.state,
          approverModal: true,
          flowAuditors: btnItem.flowAuditors,
          protocolData: formData,
        });
        // saveProtocolData({
        //   formData,
        //   params,
        // }).then(() => {
        //   this.closeModal('editFormModal');
        // });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  // 审批人弹窗点击确定
  @autobind
  handleApproverModalOK(auth) {
    const { saveProtocolData, doApprove } = this.props;
    const { protocolData } = this.state;
    saveProtocolData(protocolData).then(() => {
      const {
        location: {
          query,
        },
      } = this.props;
      const params = {
        ...constructSeibelPostBody(query, 1, 10),
        type: pageType,
      };
      doApprove({
        formData: {
          itemId: this.props.itemId,
          flowId: '',
          auditors: auth.login,
          groupName: auth.groupName,
          operate: '1',
          approverIdea: '',
        },
        params,
      }).then((data) => {
        console.log('data', data);
        this.closeModal('editFormModal');
        this.closeModal('approverModal');
      });
    });
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle(btnItem) {
    const formData = this.EditFormComponent.getData();
    // 对formData校验
    if (this.checkFormDataIsLegal(formData)) {
      const { attachment } = formData;
      const newAttachment = [];
      for (let i = 0; i < attachment.length; i++) {
        const item = attachment[i];
        if (item.length <= 0 && item.required) {
          message.error(`${item.title}附件为必传项`);
          return;
        }
        newAttachment.push({
          uuid: item.uuid,
          attachmentType: item.title,
          attachmentComments: '',
        });
      }
      _.remove(newAttachment, o => _.isEmpty(o.uuid));
      const payload = {
        ...formData,
        attachment: newAttachment,
      };
      // test
      console.log('btnItem', btnItem);
      // 弹出提示窗
      this.showconFirm(payload, btnItem);
    }
  }

  render() {
    const {
      location,
      replace,
      seibleList,
      attachmentList,
      flowHistory,
      empInfo,
      getCanApplyCustList, // 查询可申请客户列表
      canApplyCustList, // 可申请客户列表
      queryTypeVaules, // 查询操作类型/子类型/模板列表
      operationTypeList, // 操作类型列表
      subTypeList, // 子类型列表
      templateList, // 模板列表
      protocolDetail, // 协议详情
      queryChannelProtocolItem, // 根据所选模板id查询模板对应协议条款
      protocolClauseList, // 所选模板对应协议条款列表
      queryChannelProtocolProduct, // 查询协议产品列表
      protocolProductList, // 协议产品列表
      saveProtocolData,  // 保存详情
      underCustList,  // 下挂客户列表
      queryCust,  // 请求下挂客户接口
      clearPropsData, // 清除props数据
      flowStepInfo, // 审批人列表
      getCustValidate,  // 验证客户接口
    } = this.props;
    const {
      editFormModal,
      approverModal,
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
        empInfo={empInfo}
        needOperate
      />
    );
    const leftPanel = (
      <ChannelsTypeProtocolList
        list={seibleList}
        replace={replace}
        location={location}
        clickRow={this.handleListRowClick}
        pageName="channelsTypeProtocol"
        type="kehu1"
        pageData={channelsTypeProtocol}
      />
    );
    const rightPanel = (
      <Detail
        protocolDetail={protocolDetail}
        attachmentList={attachmentList}
        flowHistory={flowHistory}
      />
    );
    const selfBtnGroup = (<BottonGroup
      list={flowStepInfo}
      onEmitEvent={this.footerBtnHandle}
    />);
    // editForm 需要的 props
    const editFormProps = {
      // 客户列表
      canApplyCustList,
      // 查询客户
      onSearchCutList: getCanApplyCustList,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
      // 操作类型列表
      operationTypeList,
      // 子类型列表
      subTypeList,
      // 协议模板列表
      templateList,
      // 根据所选模板id查询模板对应协议条款
      queryChannelProtocolItem,
      // 所选模板对应协议条款列表
      protocolClauseList,
      // 协议详情 - 编辑时传入
      protocolDetail: EMPTY_OBJECT,
      // 查询协议产品列表
      queryChannelProtocolProduct,
      // 协议产品列表
      protocolProductList,
      // 保存详情
      saveProtocolData,
      // 下挂客户
      underCustList,
      // 下挂客户接口
      onQueryCust: queryCust,
      // 清除props数据
      clearPropsData,
      // 验证客户
      getCustValidate,
    };
    // editFormModal 需要的 props
    const editFormModalProps = {
      modalKey: 'editFormModal',
      title: '新建协议管理',
      closeModal: this.closeModal,
      visible: editFormModal,
      size: 'large',
      selfBtnGroup,
      // 子元素
      children: <EditForm
        {...editFormProps}
        ref={(ref) => { this.EditFormComponent = ref; }}
      />,
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
            <CommonModal {...editFormModalProps} />
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
