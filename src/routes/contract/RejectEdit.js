/*
 * @Description: 驳回界面修改
 * @Author: zhangjunli
 * @Date: 2017-11-21 17:24:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { withRouter } from 'dva-react-router-3/router';
import { message, Modal } from 'antd';

import { seibelConfig } from '../../config';
import BottonGroup from '../../components/permission/BottonGroup';
import EditForm from '../../components/contract/EditForm';
import styles from './rejectEdit.less';

const EMPTY_LIST = [];
const EMPTY_OBJECT = {};
const confirm = Modal.confirm;
const { contract: { pageType } } = seibelConfig;
const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  // 查询客户
  customerList: state.app.customerList,
  // 查询右侧详情
  baseInfo: state.contract.baseInfo,
  // 附件列表
  attachmentList: state.contract.attachmentList,
  // 审批记录
  flowHistory: state.contract.flowHistory,
  // 新增合约条款-条款名称
  clauseNameList: state.contract.clauseNameList,
  // 新增合约条款-合作部门
  cooperDeparment: state.contract.cooperDeparment,
  // 审批人
  flowStepInfo: state.contract.flowStepInfo,
});

const mapDispatchToProps = {
  // 获取客户列表
  getCustomerList: fetchDataFunction(false, 'app/getCustomerList'),
  // 获取右侧详情
  getBaseInfo: fetchDataFunction(true, 'contract/getBaseInfo'),
  // 获取附件列表
  getAttachmentList: fetchDataFunction(true, 'contract/getAttachmentList'),
  // 查询条款名称列表
  getClauseNameList: fetchDataFunction(false, 'contract/getClauseNameList'),
  // 查询合作部门
  getCooperDeparmentList: fetchDataFunction(false, 'contract/getCooperDeparmentList'),
  // 获取审批人
  getFlowStepInfo: fetchDataFunction(true, 'contract/getFlowStepInfo'),
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class RejectEdit extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    // 查询客户
    getCustomerList: PropTypes.func.isRequired,
    customerList: PropTypes.array.isRequired,
    // 审批记录
    flowHistory: PropTypes.array,
    // 附件列表
    getAttachmentList: PropTypes.func.isRequired,
    attachmentList: PropTypes.array,
    // 查询右侧详情
    getBaseInfo: PropTypes.func.isRequired,
    baseInfo: PropTypes.object,
    // 查询条款名称列表
    getClauseNameList: PropTypes.func.isRequired,
    clauseNameList: PropTypes.array,
    // 查询合作部门
    getCooperDeparmentList: PropTypes.func.isRequired,
    cooperDeparment: PropTypes.array,
    // 审批人
    flowStepInfo: PropTypes.object,
    getFlowStepInfo: PropTypes.func.isRequired,
  }

  static defaultProps = {
    flowHistory: EMPTY_LIST,
    attachmentList: EMPTY_LIST,
    flowStepInfo: EMPTY_OBJECT,
    baseInfo: EMPTY_OBJECT,
    clauseNameList: EMPTY_LIST,
    cooperDeparment: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 合作合约表单数据
      contractFormData: EMPTY_OBJECT,
    };
  }

  componentWillMount() {
    const {
      getFlowStepInfo,
      getClauseNameList,
      getBaseInfo,
      location: { query: { currentId } },
    } = this.props;
    getClauseNameList({});
    getBaseInfo({ id: currentId });
    getFlowStepInfo({ operate: 1, flowId: '' });
  }

  // 上传成功后回调
  @autobind
  onUploadComplete(formData) {
    this.setState({
      ...this.state,
      contractFormData: formData,
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

  // 根据关键词查询合作部门
  @autobind
  handleSearchCooperDeparment(keyword) {
    if (keyword) {
      this.props.getCooperDeparmentList({ name: keyword });
    }
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

  // 最终发出接口请求
  @autobind
  sendRequest(sendPayload) {
    console.log(sendPayload);
  }

  // 判断合约有效期是否大于开始日期
  @autobind
  isBiggerThanStartDate(contractFormData) {
    const startDate = new Date(contractFormData.startDt).getTime();
    const vailDate = new Date(contractFormData.vailDt).getTime();
    return startDate > vailDate;
  }

  // 判断合约有效期是否大于当前日期+5天
  @autobind
  isBiggerThanTodayAddFive(vailDt) {
    const vailDateHs = new Date(vailDt).getTime();
    const date = new Date();
    return vailDateHs > (date.getTime() + (86400000 * 5));
  }

  // 检查必填项
  checkRequireFileds(contractFormData) {
    let result = true;
    // 编辑窗口
    if (!contractFormData.startDt) {
      message.error('请选择合约开始日期');
      result = false;
    }
    if (contractFormData.vailDt && this.isBiggerThanStartDate(contractFormData)) {
      message.error('合约开始日期不能大于合约有效期');
      result = false;
    }
    if (contractFormData.vailDt && !this.isBiggerThanTodayAddFive(contractFormData.vailDt)) {
      message.error('合约有效期必须大于当前日期加5天');
      result = false;
    }
    if (!contractFormData.terms.length) {
      message.error('请添加合约条款');
      result = false;
    }
    if (!this.checkClauseIsLegal(contractFormData.terms)) {
      message.error('合约条款中比例明细参数的值加起来必须要等于1');
      result = false;
    }
    if (!this.checkClauseIsUniqueness(contractFormData.terms)) {
      message.error('合约条款中每个部门不能有相同的合约条款！');
      result = false;
    }
    return result;
  }

  // 弹窗底部按钮事件
  @autobind
  footerBtnHandle(btnItem) {
    const { contractFormData } = this.state;
    if (this.checkRequireFileds(contractFormData)) {
      return;
    }
    const payload = contractFormData;
    // 编辑
    const tempApproveData = {
      type: 'edit',
      flowId: contractFormData.flowid,
      approverIdea: contractFormData.appraval || '',
      operate: btnItem.operate || '',
    };
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

  render() {
    const {
      customerList,
      flowHistory,
      attachmentList,
      baseInfo,
      flowStepInfo,
    } = this.props;
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
    };
    const selfBtnGroup = (<BottonGroup
      list={flowStepInfo}
      onEmitEvent={this.footerBtnHandle}
    />);
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
