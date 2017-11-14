/*
 * @Author: LiuJianShu
 * @Date: 2017-11-09 16:37:27
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-11-13 19:46:01
 */

import React, { PureComponent, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { withRouter, routerRedux } from 'dva-react-router-3/router';
import { connect } from 'react-redux';
import { message, Modal } from 'antd';
import _ from 'lodash';

import { constructSeibelPostBody } from '../../utils/helper';
import EditForm from '../../components/channelsTypeProtocol/EditForm';
import BottonGroup from '../../components/permission/BottonGroup';
import { seibelConfig } from '../../config';
import Barable from '../../decorators/selfBar';
import styles from './edit.less';

const confirm = Modal.confirm;

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const {
  // channelsTypeProtocol,
  channelsTypeProtocol: { pageType },
  // channelsTypeProtocol: { pageType, subType, status, operationList },
} = seibelConfig;
// 新建/编辑弹窗按钮，暂时写死在前端
const FLOW_BUTTONS = {
  flowButtons: [
    {
      key: 'submit',
      flowBtnId: 'submit',
      btnName: '提交',
    },
  ],
};
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 子类型、操作类型、协议模版
  subTypeList: state.channelsEdit.subTypeList,
  // 查询右侧详情
  protocolDetail: state.channelsEdit.protocolDetail,
  // 附件
  attachmentList: state.channelsEdit.attachmentList,
  // 审批记录
  // flowHistory: state.channelsEdit.flowHistory,
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
    // 下挂客户接口
    queryCust: PropTypes.func.isRequired,
    // 下挂客户列表
    underCustList: PropTypes.array,
    // 清除props数据
    clearPropsData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    attachmentList: EMPTY_LIST,
    seibleListLoading: false,
    flowHistory: EMPTY_LIST,
    underCustList: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 最终传递的数据
      payload: EMPTY_OBJECT,
    };
  }

  componentDidMount() {
    const { getProtocolDetail, location: { query } } = this.props;
    getProtocolDetail({
      id: query.currentId,
    }).then(() => {
      const {
        protocolDetail,
        queryTypeVaules,
        // subTypeList,
      } = this.props;
      console.warn('protocolDetail', protocolDetail);

      // const filterSubType = _.filter(subTypeList, o => o.val === protocolDetail.subType);
      queryTypeVaules({
        typeCode: 'templateId',
        subType: protocolDetail.subType,
        operationType: protocolDetail.operationType,
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
  showconFirm(formData) {
    confirm({
      title: '提示',
      content: '经对客户与服务产品三匹配结果，请确认客户是否已签署服务计划书及适当确认书！',
      onOk: () => {
        const {
          location: {
            query,
          },
          saveProtocolData,
        } = this.props;
        const params = {
          ...constructSeibelPostBody(query, 1, 10),
          type: pageType,
        };
        saveProtocolData({
          formData,
          params,
        }).then(() => {
          this.closeModal('editFormModal');
        });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle() {
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
      // 弹出提示窗
      this.showconFirm(payload);
    }
  }

  render() {
    const {
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
      attachmentList,  // 附件列表
    } = this.props;

    const selfBtnGroup = (<BottonGroup
      list={FLOW_BUTTONS}
      onEmitEvent={this.footerBtnHandle}
    />);
    // editForm 需要的 props
    const editFormProps = {
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
    };
    return (
      <div className={styles.channelEditWrapper} >
        <EditForm
          {...editFormProps}
          ref={(ref) => { this.EditFormComponent = ref; }}
        />
        <div>
          {selfBtnGroup}
        </div>
      </div>
    );
  }
}
