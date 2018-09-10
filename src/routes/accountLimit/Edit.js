/**
 * @Description: 账户限制管理 驳回后修改页面
 * @Author: Xuwenkang
 * @Date: 2018-08-07 14:46:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-21 15:34:13
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import moment from 'moment';
import { Modal, message } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import _ from 'lodash';

import Barable from '../../decorators/selfBar';
import withRouter from '../../decorators/withRouter';
import TableDialog from '../../components/common/biz/TableDialog';
import BottonGroup from '../../components/permission/BottonGroup';
import commonConfirm from '../../components/common/confirm_';
import EditForm from '../../components/accountLimit/EditForm';
import config from '../../components/accountLimit/config';
import { dva, emp, data } from '../../helper';
import logable from '../../decorators/logable';
import styles from './edit.less';

const dispatch = dva.generateEffect;

const {
  tableTitle: { approvalList },
  STRING_LIMIT_LENGTH,
  SET_CODE,
  RELIEVE_CODE,
  TIME_FORMAT_STRING,
  EDIT_MESSAGE,
} = config;

// 限制类型--禁止账户留存指定金额流通资产转出 -5
const KEY_LIMIT_TRANSFER_NUMBER = '5';
// 审批人弹窗
const approverModalKey = 'approverModal';
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];
// 终止按钮的节点名称
const END_NODE_NAME = 'falseOver';
const effects = {
  // 获取服务经理数据
  queryEmpData: 'accountLimitEdit/queryEmpData',
  // 获取详情
  queryDetailInfo: 'accountLimitEdit/queryDetailInfo',
  // 获取下一步按钮以及审批人
  queryButtonList: 'accountLimitEdit/queryButtonList',
  // 查询限制类型
  queryLimtList: 'accountLimitEdit/queryLimtList',
  // 校验数据
  validateForm: 'accountLimitEdit/validateForm',
  // 提交客户分配
  saveChange: 'accountLimitEdit/saveChange',
  // 数据修改
  editFormChange: 'accountLimitEdit/editFormChange',
  // 提交流程
  doApprove: 'accountLimitEdit/doApprove',
};

const mapStateToProps = state => ({
  // 服务经理数据
  empData: state.accountLimitEdit.empData,
  // 员工基本信息
  empInfo: state.app.empInfo,
  // 右侧详情数据
  detailInfo: state.accountLimitEdit.detailInfo,
  // 用于编辑的详情数据
  editFormData: state.accountLimitEdit.editFormData,
  // 获取按钮列表和下一步审批人
  buttonData: state.accountLimitEdit.buttonData,
  // 限制类型列表
  limitList: state.accountLimitEdit.limitList,
  // 校验接口返回数据
  validateData: state.accountLimitEdit.validateData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取服务经理列表
  queryEmpData: dispatch(effects.queryEmpData, { forceFull: true }),
  // 获取详情
  queryDetailInfo: dispatch(effects.queryDetailInfo, { forceFull: true }),
  // 获取按钮列表和下一步审批人
  queryButtonList: dispatch(effects.queryButtonList, { forceFull: true }),
  // 查询限制类型列表
  queryLimtList: dispatch(effects.queryLimtList, { forceFull: true }),
  // 校验数据
  validateForm: dispatch(effects.validateForm, { forceFull: true }),
  // 提交客户分配
  saveChange: dispatch(effects.saveChange, { forceFull: true }),
  // 数据修改
  editFormChange: dispatch(effects.editFormChange, { loading: false, forceFull: true }),
  // 提交流程
  doApprove: dispatch(effects.doApprove, { forceFull: true }),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class AccountLimitEdit extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
    // 服务经理数据
    empData: PropTypes.object.isRequired,
    queryEmpData: PropTypes.func.isRequired,
    // 员工信息
    empInfo: PropTypes.object.isRequired,
    // 详情
    detailInfo: PropTypes.object.isRequired,
    queryDetailInfo: PropTypes.func.isRequired,
    // 用于编辑的详情数据
    editFormData: PropTypes.object.isRequired,
    editFormChange: PropTypes.func.isRequired,
    // 按钮以及下一步审批人列表
    buttonData: PropTypes.object.isRequired,
    queryButtonList: PropTypes.func.isRequired,
    // 查询限制类型列表
    limitList: PropTypes.array.isRequired,
    queryLimtList: PropTypes.func.isRequired,
    // 校验数据
    validateForm: PropTypes.func.isRequired,
    validateData: PropTypes.object.isRequired,
    // 提交数据
    saveChange: PropTypes.func.isRequired,
    // 提交流程
    doApprove: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      approverModal: false,
      // 审批人
      flowAuditors: EMPTY_ARRAY,
      // 审批意见
      remark: '',
      currentButtonItem: EMPTY_OBJECT,
      buttonData: EMPTY_OBJECT,
    };
  }

  componentDidMount() {
    const {
      location: {
        query: {
          flowId,
        },
      },
      queryDetailInfo,
      queryButtonList,
    } = this.props;
    queryDetailInfo({ flowId }).then(() => {
      const { detailInfo } = this.props;
      queryButtonList({
        flowId: detailInfo.flowId,
        operateType: detailInfo.operateType,
      }).then(() => {
        const { buttonData } = this.props;
        this.setButtonState(buttonData);
      });
    });
  }

  // 设置按钮数据
  @autobind
  setButtonState(btnData) {
    this.setState({
      buttonData: btnData,
    });
  }

  // 修改审批意见
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭账户限制管理弹框' } })
  closeModal(obj) {
    const { modalKey, isNeedConfirm = true } = obj;
    // 关闭模态框
    if (isNeedConfirm) {
      commonConfirm({
        shortCut: 'close',
        onOk: () => this.setState({
          [modalKey]: false,
        }),
      });
    } else {
      this.setState({
        [modalKey]: false,
      });
    }
  }

  @autobind
  chekDataIsLegal(operate = '') {
    // 如果点击的按钮是终止，就不做必填校验
    if (operate === END_NODE_NAME) {
      return true;
    }
    const { editFormData } = this.props;
    const { attachList } = editFormData;

    if (_.isEmpty(editFormData.companyName)) {
      message.error('公司简称不能为空!');
      return false;
    }
    if (data.getStrLen(editFormData.companyName) > STRING_LIMIT_LENGTH) {
      message.error(`公司简称长度不能超过${STRING_LIMIT_LENGTH}`);
      return false;
    }
    if (_.isEmpty(editFormData.stockCode)) {
      message.error('证券代码不能为空!');
      return false;
    }
    if (data.getStrLen(editFormData.stockCode) > STRING_LIMIT_LENGTH) {
      message.error(`证券代码长度不能超过${STRING_LIMIT_LENGTH}`);
      return false;
    }
    if (_.isEmpty(editFormData.custList)) {
      message.error('客户列表不能为空!');
      return false;
    }
    if (_.isEmpty(editFormData.limitType)) {
      message.error('限制类型不能为空!');
      return false;
    }
    // 如果有处于编辑状态的数据
    const filterResult = _.filter(editFormData.custList, o => o.edit);
    if (!_.isEmpty(filterResult)) {
      Modal.error({
        title: EDIT_MESSAGE,
      });
      return false;
    }
    // 如果操作类型是设置限制
    if (editFormData.operateType === SET_CODE) {
      // 业务对接人不能为空
      const filterDocking = _.filter(editFormData.custList, o => _.isEmpty(o.managerId));
      if (!_.isEmpty(filterDocking)) {
        message.error('业务对接人不能为空!');
        return false;
      }
      // 找出限制金额转出的限制类型
      const filterLimitType = _.filter(editFormData.limitType,
        o => o.key === KEY_LIMIT_TRANSFER_NUMBER);
      if (!_.isEmpty(filterLimitType)) {
        const filterlimitAmount = _.filter(editFormData.custList, o => !o.limitAmount);
        if (!_.isEmpty(filterlimitAmount)) {
          message.error('请填写禁止转出金额');
          return false;
        }
      }
      if (_.isEmpty(editFormData.limitStartTime)) {
        message.error('设置日期不能为空!');
        return false;
      }
      if (_.isEmpty(editFormData.limitEndTime)) {
        message.error('解除日期不能为空!');
        return false;
      }
      if (moment(editFormData.limitStartTime, TIME_FORMAT_STRING) < moment().subtract(1, 'days')) {
        message.error('设置日期不得小于当前日期!');
        return false;
      }
      if (moment(editFormData.limitEndTime, TIME_FORMAT_STRING)
        <= moment(editFormData.limitStartTime, TIME_FORMAT_STRING)) {
        message.error('账户限制解除日期必须大于账户限制设置日期!');
        return false;
      }
    }
    // 如果操作类型是解除限制
    if (editFormData.operateType === RELIEVE_CODE) {
      if (_.isEmpty(editFormData.limitEndTime)) {
        message.error('解除日期不能为空!');
        return false;
      }
      if (moment(editFormData.limitEndTime, TIME_FORMAT_STRING) < moment().subtract(1, 'days')) {
        message.error('账户限制解除日期不得小于当前日期!');
        return false;
      }
    }

    // 附件校验
    for (let i = 0; i < attachList.length; i++) {
      if (attachList[i].length <= 0 && attachList[i].required) {
        message.error(`请上传${attachList[i].title}`);
        return false;
      }
    }
    return true;
  }

  @autobind
  sendRequest(formData, callback = _.noop) {
    const { saveChange } = this.props;
    saveChange(formData).then(callback);
  }

  // 提交，点击后选择审批人
  @autobind
  handleSubmit(btnItem) {
    if (!this.chekDataIsLegal(btnItem.operate)) {
      return;
    }
    const { remark } = this.state;
    const { editFormData, validateForm, doApprove } = this.props;
    const { flowAuditors: auth } = btnItem;
    if (btnItem.operate === END_NODE_NAME) {
      // 如果点击的按钮是终止按钮，直接调流程接口，不需要保存，也不需要调保存接口
      doApprove({
        empId: emp.getId(),
        flowId: editFormData.flowId,
        approverIdea: remark,
        groupName: btnItem.nextGroupName,
        operate: btnItem.operate,
        auditors: auth[0].login,
        itemId: editFormData.id,
      }).then(() => {
        this.handleSuccessCallback();
      });
    } else if (btnItem.approverNum === 'none') {
      // 所点击按钮的approverNum为none时，不需要选审批人直接保存
      const flowAuditors = {
        auditors: emp.getId(),
        groupName: btnItem.nextGroupName,
        approverIdea: '',
      };
      validateForm({ ...editFormData, ...flowAuditors }).then(() => {
        const { validateData } = this.props;
        if (validateData.messageType === '0') {
          this.sendRequest({ ...editFormData, ...flowAuditors, amountConfirm: false }, () => {
            doApprove({
              empId: emp.getId(),
              flowId: editFormData.flowId,
              approverIdea: remark,
              groupName: btnItem.nextGroupName,
              operate: btnItem.operate,
              auditors: auth[0].login,
              itemId: editFormData.id,
            }).then(() => {
              this.handleSuccessCallback();
            });
          });
        } else {
          commonConfirm({
            shortCut: 'amountConfirm',
            onOk: () => {
              this.sendRequest({ ...editFormData, ...flowAuditors, amountConfirm: true }, () => {
                doApprove({
                  empId: emp.getId(),
                  flowId: editFormData.flowId,
                  approverIdea: remark,
                  groupName: btnItem.nextGroupName,
                  operate: btnItem.operate,
                  auditors: auth[0].login,
                  itemId: editFormData.id,
                }).then(() => {
                  this.handleSuccessCallback();
                });
              });
            },
          });
        }
      });
    } else {
      validateForm({ ...editFormData }).then(() => {
        const { validateData } = this.props;
        if (validateData.messageType === '0') {
          this.setState({
            [approverModalKey]: true,
            flowAuditors: btnItem.flowAuditors,
            currentButtonItem: btnItem,
          });
        } else {
          commonConfirm({
            shortCut: 'amountConfirm',
            onOk: () => {
              this.setState({
                [approverModalKey]: true,
                flowAuditors: btnItem.flowAuditors,
                currentButtonItem: btnItem,
              });
            },
          });
        }
      });
    }
  }

  // 提交成功之后的回调处理
  @autobind
  handleSuccessCallback() {
    Modal.success({
      title: '提示',
      content: '提交成功。',
      onOk: () => {
        // 关闭审批人弹窗
        this.closeModal({
          modalKey: approverModalKey,
          isNeedConfirm: false,
        });
        this.setState({
          buttonData: EMPTY_OBJECT,
        });
      },
    });
  }

  // 选完审批人后的提交
  @autobind
  handleApproverModalOK(auth) {
    const { editFormData, doApprove } = this.props;
    const { remark, currentButtonItem } = this.state;
    this.sendRequest({ ...editFormData, amountConfirm: true }, () => {
      doApprove({
        empId: emp.getId(),
        flowId: editFormData.flowId,
        approverIdea: remark,
        groupName: currentButtonItem.nextGroupName,
        operate: currentButtonItem.operate,
        auditors: auth.login,
        itemId: editFormData.id,
      }).then(() => {
        this.handleSuccessCallback();
      });
    });
  }

  render() {
    const {
      // replace,
      location,
      // empInfo,
      detailInfo,
      // 限制类型
      limitList,
      queryLimtList,
      // 提交走流程
      saveChange,
      editFormData,
      editFormChange,
      empData,
      queryEmpData,
    } = this.props;
    const {
      approverModal,
      flowAuditors,
      remark,
      // 下一步按钮审批人数据以及接口
      buttonData,
    } = this.state;

    // 提交相关按钮
    const selfBtnGroup = (<BottonGroup
      list={buttonData}
      onEmitEvent={this.handleSubmit}
    />);


    // 审批人弹窗
    const approvalProps = {
      visible: approverModal,
      onOk: this.handleApproverModalOK,
      onCancel: () => { this.setState({ approverModal: false }); },
      dataSource: flowAuditors,
      columns: approvalList,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'approverModal',
      rowKey: 'login',
      searchShow: false,
    };

    // 驳回后修改props
    const editFormProps = {
      location,
      queryLimtList,
      limitList,
      saveChange,
      detailInfo,
      editFormData,
      onEditFormChange: editFormChange,
      remark,
      onChangeRemark: this.handleChangeRemark,
      buttonData,
      empData,
      queryEmpData,
    };

    return (
      <div className={styles.editBox}>
        <EditForm {...editFormProps} />
        {selfBtnGroup}
        {
          approverModal ? <TableDialog {...approvalProps} /> : null
        }
      </div>
    );
  }
}
