/*
 * @Author: LiuJianShu
 * @Date: 2017-11-09 16:37:27
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-01-29 16:33:56
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import { message, Modal } from 'antd';
import _ from 'lodash';

import InfoTitle from '../../components/common/InfoTitle';
import ApproveList from '../../components/common/approveList';
import seibelHelper from '../../helper/page/seibel';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import BottonGroup from '../../components/permission/BottonGroup';
import ChoiceApproverBoard from '../../components/commissionAdjustment/ChoiceApproverBoard';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import config from './config';

import styles from './edit.less';

const confirm = Modal.confirm;

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const {
  // channelsTypeProtocol,
  channelsTypeProtocol: { pageType },
  // channelsTypeProtocol: { pageType, subType, status, operationList },
} = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const { btnEnd, textEnd, unSubscribeArray, tenHQ } = config;
const mapStateToProps = state => ({
  // 子类型、操作类型、协议模版
  subTypeList: state.channelsEdit.subTypeList,
  // 查询右侧详情
  protocolDetail: state.channelsEdit.protocolDetail,
  // 附件
  attachmentList: state.channelsEdit.attachmentList,
  // 审批记录
  flowHistory: state.channelsEdit.flowHistory,
  // 登陆人信息
  empInfo: state.app.empInfo,
  // 模板列表
  templateList: state.channelsEdit.templateList,
  // 模板对应协议条款列表
  protocolClauseList: state.channelsEdit.protocolClauseList,
  // 协议产品列表
  protocolProductList: state.channelsEdit.protocolProductList,
  // 下挂客户
  underCustList: state.channelsEdit.underCustList,
  // 审批人
  flowStepInfo: state.channelsEdit.flowStepInfo,
  // 保存成功后返回itemId,提交审批流程所需
  itemId: state.channelsEdit.itemId,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取右侧详情
  getProtocolDetail: fetchDataFunction(true, 'channelsEdit/getProtocolDetail'),
  // 查询操作类型/子类型/模板列表
  queryTypeVaules: fetchDataFunction(false, 'channelsEdit/queryTypeVaules'),
  // 根据所选模板id查询模板对应协议条款
  queryChannelProtocolItem: fetchDataFunction(false, 'channelsEdit/queryChannelProtocolItem'),
  // 查询协议产品列表
  queryChannelProtocolProduct: fetchDataFunction(false, 'channelsEdit/queryChannelProtocolProduct'),
  // 保存详情
  saveProtocolData: fetchDataFunction(true, 'channelsEdit/saveProtocolData'),
  // 查询客户
  queryCust: fetchDataFunction(true, 'channelsEdit/queryCust'),
  // 清除协议产品列表
  clearPropsData: fetchDataFunction(false, 'channelsEdit/clearPropsData'),
  // 获取审批人
  getFlowStepInfo: fetchDataFunction(true, 'channelsEdit/getFlowStepInfo'),
  // 提交审批流程
  doApprove: fetchDataFunction(true, 'channelsEdit/doApprove'),
  // 验证客户
  getCustValidate: fetchDataFunction(true, 'channelsTypeProtocol/getCustValidate'),
  // 清除审批人
  cleartBtnGroup: fetchDataFunction(false, 'channelsEdit/cleartBtnGroup'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class ChannelsTypeProtocolEdit extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
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
    itemId: PropTypes.string,
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
    // 清除审批人
    cleartBtnGroup: PropTypes.func,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    underCustList: EMPTY_LIST,
    flowStepInfo: EMPTY_OBJECT,
    itemId: '',
    cleartBtnGroup: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      // 最终传递的数据
      payload: EMPTY_OBJECT,
      // 选择审批人弹窗状态
      approverModal: false,
      // 需要提交的数据
      protocolData: EMPTY_OBJECT,
      // 审批人列表
      flowAuditors: EMPTY_LIST,
      template: {},
    };
  }

  componentDidMount() {
    const { getProtocolDetail, location: { query } } = this.props;
    // 获取详情
    getProtocolDetail({
      flowId: query.flowId,
    }).then(() => {
      const {
        protocolDetail,
        queryTypeVaules,
      } = this.props;
      // 获取协议模版
      queryTypeVaules({
        typeCode: 'templateId',
        subType: protocolDetail.subType,
        operationType: protocolDetail.operationType,
      }).then(() => {
        const { templateList } = this.props;
        const filterTemplate =
          _.filter(templateList, o => o.prodName === protocolDetail.templateId);
        this.setState({
          template: filterTemplate[0] || {},
        });
      });
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
    // 如果操作类型是退订并且协议模版是十档行情，不进行验证
    if (formData.templateId === tenHQ &&
      _.includes(unSubscribeArray, formData.operationType)) {
      return true;
    }
    if (!formData.templateId) {
      message.error('请选择协议模板');
      return false;
    }
    if (formData.content && formData.content.length > 120) {
      message.error('备注字段长度不能超过120');
      return false;
    }
    if (!formData.item.length) {
      message.error('请选择协议产品');
      return false;
    }
    return true;
  }

  // 点击提交按钮弹提示框
  @autobind
  showconFirm(formData, btnItem) {
    const { protocolDetail, saveProtocolData, doApprove, cleartBtnGroup } = this.props;
    let confirmContent = '';
    const protocolData = {
      ...protocolDetail,
      ...formData,
    };
    if (btnItem.nextGroupName === btnEnd && btnItem.operate === textEnd) {
      confirmContent = '是否确定终止？';
    } else {
      confirmContent = '经对客户与服务产品三匹配结果，请确认客户是否已签署服务计划书及适当确认书！';
    }
    confirm({
      title: '提示',
      content: confirmContent,
      onOk: () => {
        if (btnItem.approverNum === 'none') {
          const auth = btnItem.flowAuditors[0];
          saveProtocolData(protocolData).then(() => {
            const {
              location: {
                query,
              },
            } = this.props;
            const params = {
              ...seibelHelper.constructSeibelPostBody(query, 1, 10),
              type: pageType,
            };
            doApprove({
              formData: {
                // itemId: this.props.itemId,
                flowId: protocolDetail.flowid,
                auditors: auth.empNo,
                groupName: auth.groupName,
                approverIdea: '',
              },
              params,
            }).then(() => {
              message.success('提交成功');
              cleartBtnGroup();
              this.closeModal('editFormModal');
            });
          });
        } else {
          this.setState({
            ...this.state,
            approverModal: true,
            flowAuditors: btnItem.flowAuditors,
            protocolData,
          });
        }
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  // 审批人弹窗点击确定
  @autobind
  handleApproverModalOK(auth) {
    const { protocolDetail, saveProtocolData, doApprove, cleartBtnGroup } = this.props;
    const { protocolData } = this.state;
    saveProtocolData(protocolData).then(() => {
      const {
        location: {
          query,
        },
      } = this.props;
      const params = {
        ...seibelHelper.constructSeibelPostBody(query, 1, 10),
        type: pageType,
      };
      doApprove({
        formData: {
          // itemId: this.props.itemId,
          flowId: protocolDetail.flowid,
          auditors: auth.empNo,
          groupName: auth.groupName,
          approverIdea: '',
        },
        params,
      }).then(() => {
        message.success('提交成功');
        cleartBtnGroup();
        this.closeModal('editFormModal');
        this.closeModal('approverModal');
      });
    });
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle(btnItem) {
    const formData = this.EditFormComponent.getData();
    console.warn('formData', formData);
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
      // 弹出提示窗
      this.showconFirm(payload, btnItem);
    }
  }

  render() {
    const {
      location,
      flowHistory,
      queryTypeVaules, // 查询操作类型/子类型/模板列表
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
      attachmentList,  // 附件列表
      cleartBtnGroup,  // 清除审批人
      getFlowStepInfo,
    } = this.props;
    const {
      approverModal,
      flowAuditors,
      template,
    } = this.state;
    if (_.isEmpty(protocolDetail)) {
      return null;
    }
    const selfBtnGroup = (<BottonGroup
      list={flowStepInfo}
      onEmitEvent={this.footerBtnHandle}
    />);
    // editForm 需要的 props
    const editFormProps = {
      location,
      // 查询操作类型/子类型/模板列表
      queryTypeVaules,
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
      // 保存详情
      saveProtocolData,
      // 下挂客户
      underCustList,
      // 下挂客户接口
      onQueryCust: queryCust,
      // 清除props数据
      clearPropsData,
      // 附件信息
      attachmentList,
      // 模版信息
      template,
      // 验证客户
      getCustValidate,
      // 清除审批人
      cleartBtnGroup,
      getFlowStepInfo,
    };
    const nowStep = {
      // 当前步骤
      stepName: protocolDetail.workflowNode || '',
      // 当前审批人
      handleName: protocolDetail.approver || '',
    };
    return (
      <div className={styles.channelEditWrapper} >
        <EditForm
          {...editFormProps}
          ref={(ref) => { this.EditFormComponent = ref; }}
        />
        <div className={styles.editComponent}>
          <InfoTitle head="审批记录" />
          <ApproveList data={flowHistory} nowStep={nowStep} />
        </div>
        <div>
          {selfBtnGroup}
        </div>
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
