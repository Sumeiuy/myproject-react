/**
 * @Description: 账户限制管理 驳回后修改页面
 * @Author: Xuwenkang
 * @Date: 2018-08-07 14:46:25
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-08 09:42:31
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
import { dva, emp } from '../../helper';
import logable from '../../decorators/logable';
import styles from './edit.less';

const dispatch = dva.generateEffect;

const {
  tableTitle: { approvalList },
} = config;

// 登陆人的组织 ID
const empOrgId = emp.getOrgId();
// const empOrgId = 'ZZ001041051';
// 登陆人的职位 ID
const empPstnId = emp.getPstnId();
// 审批人弹窗
const approverModalKey = 'approverModal';
// 取消按钮的值
// const BTN_CANCLE_VALUE = 'cancel';

const effects = {
  // 获取详情
  queryDetailInfo: 'accountLimitEdit/queryDetailInfo',
  // 获取下一步按钮以及审批人
  queryButtonList: 'accountLimitEdit/queryButtonList',
  // 查询限制类型
  queryLimtList: 'accountLimitEdit/queryLimtList',
  // 提交客户分配
  saveChange: 'accountLimitEdit/saveChange',
  // 数据修改
  editFormChange: 'accountLimitEdit/editFormChange',
};

const mapStateToProps = state => ({
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
  saveChangeData: state.accountLimitEdit.saveChangeData,
});

const mapDispatchToProps = {
  replace: routerRedux.replace,
  // 获取详情
  queryDetailInfo: dispatch(effects.queryDetailInfo, { loading: true, forceFull: true }),
  // 获取按钮列表和下一步审批人
  queryButtonList: dispatch(effects.queryButtonList, { loading: true, forceFull: true }),
  // 查询限制类型列表
  queryLimtList: dispatch(effects.queryLimtList, { loading: true, forceFull: true }),
  // 提交客户分配
  saveChange: dispatch(effects.saveChange, { loading: true, forceFull: true }),
  // 数据修改
  editFormChange: dispatch(effects.editFormChange, { loading: false, forceFull: true }),
};
@connect(mapStateToProps, mapDispatchToProps)
@withRouter
@Barable
export default class AccountLimitEdit extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
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
    // 提交数据
    saveChange: PropTypes.func.isRequired,
    saveChangeData: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      approverModal: false,
      // 审批人
      flowAuditors: [],
      // 审批意见
      remark: '',
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

  // 修改审批意见
  @autobind
  handleChangeRemark(e) {
    this.setState({
      remark: e.target.value,
    });
  }

  // 关闭弹窗
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '关闭分公司客户划转弹框' } })
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
  chekDataIsLegal() {
    const { editFormData } = this.props;
    if (_.isEmpty(editFormData.companyName)) {
      message.error('公司简介不能为空!');
      return false;
    }
    if (_.isEmpty(editFormData.stockCode)) {
      message.error('证券代码不能为空!');
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
    // 如果操作类型是设置限制
    if (editFormData.operateType === config.setCode) {
      if (_.isEmpty(editFormData.limitStartTime)) {
        message.error('设置日期不能为空!');
        return false;
      }
      if (moment(editFormData.limitStartTime, config.timeFormatStr) < moment().subtract(1, 'days')) {
        message.error('设置日期不得小于当前日期!');
        return false;
      }
      if (moment(editFormData.limitEndTime, config.timeFormatStr)
        <= moment(editFormData.limitStartTime, config.timeFormatStr)) {
        message.error('账户限制解除日期必须大于账户限制设置日期!');
        return false;
      }
    }
    // 如果操作类型是解除限制
    if (editFormData.operateType === config.relieveCode) {
      if (moment(editFormData.limitEndTime, config.timeFormatStr) < moment().subtract(1, 'days')) {
        message.error('账户限制解除日期不得小于当前日期!');
        return false;
      }
    }
    return true;
  }

  // 提交，点击后选择审批人
  @autobind
  handleSubmit(btnItem) {
    console.log('btn', btnItem);
    if (!this.chekDataIsLegal()) {
      return false;
    }
    return false;
    // const { saveChange } = this.props;
    // const payload = {
    //   TGConfirm: false,
    //   positionId: empPstnId,
    //   orgId: empOrgId,
    //   auditors: '',
    //   groupName: '',
    //   approverIdea: '',
    // };
    // saveChange(payload).then(() => {
    //   const { saveChangeData } = this.props;
    //   // 提交没有问题
    //   if (saveChangeData.errorCode === '0') {
    //     this.handleSuccessCallback();
    //   } else {
    //     commonConfirm({
    //       shortCut: 'hasTouGu',
    //       onOk: () => {
    //         this.setState({
    //           flowAuditors: btnItem.flowAuditors,
    //           approverModal: true,
    //         });
    //       },
    //     });
    //   }
    // });
  }

  // 提交成功之后的回调处理
  @autobind
  handleSuccessCallback() {
    Modal.success({
      title: '提示',
      content: '提交成功，后台正在进行数据处理！若数据校验失败，可在首页通知提醒中查看失败原因。',
      onOk: () => {
        // 关闭审批人弹窗
        this.closeModal({
          modalKey: approverModalKey,
          isNeedConfirm: false,
        });
      },
    });
  }

  // 选完审批人后的提交
  @autobind
  handleApproverModalOK(auth) {
    const { saveChange } = this.props;
    const { flowAuditors } = this.state;
    const payload = {
      TGConfirm: true,
      positionId: empPstnId,
      orgId: empOrgId,
      auditors: auth.login,
      groupName: flowAuditors.nextGroupName,
      approverIdea: '',
    };
    saveChange(payload).then(this.handleSuccessCallback());
  }

  render() {
    const {
      // replace,
      location,
      // empInfo,
      detailInfo,
      // 下一步按钮审批人数据以及接口
      buttonData,
      // 限制类型
      limitList,
      queryLimtList,
      // 提交走流程
      saveChange,
      editFormData,
      editFormChange,
    } = this.props;
    const {
      approverModal,
      flowAuditors,
      remark,
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
