import React, { PureComponent } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
// import { Modal, message } from 'antd';
// import _ from 'lodash';
import CommonModal from '../common/biz/CommonModal';
import ServerPersonel from './ServerPersonel';
import BaseInfoModify from './BaseInfoModify';
import MessageList from '../common/MessageList';
import ApprovalRecord from './ApprovalRecord';
import UploadFile from './UploadFile';
import TableDialog from '../common/biz/TableDialog';
import BottonGroup from './BottonGroup';
import { seibelConfig } from '../../config';
import style from './modifyPrivateClient.less';

const subTypeList = seibelConfig.permission.subType;
const statusList = seibelConfig.permission.status;
const columns = [{
  title: '工号',
  dataIndex: 'ptyMngId',
  key: 'ptyMngId',
}, {
  title: '姓名',
  dataIndex: 'ptyMngName',
  key: 'ptyMngName',
}, {
  title: '所属营业部',
  dataIndex: 'businessDepartment',
  key: 'businessDepartment',
}];

export default class modifyPrivateClient extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
    flowId: PropTypes.string,
    type: PropTypes.string,
    subType: PropTypes.string,
    custName: PropTypes.string,
    custNumber: PropTypes.string,
    remark: PropTypes.string,
    empName: PropTypes.string,
    createTime: PropTypes.string,
    status: PropTypes.string,
    empList: PropTypes.array,
    workflowHistoryBeans: PropTypes.array,
    attachInfoList: PropTypes.array,
    attachment: PropTypes.string,
    searchServerPersonList: PropTypes.array.isRequired,
    nextApproverList: PropTypes.array.isRequired,
    getNextApproverList: PropTypes.func.isRequired,
    bottonList: PropTypes.array.isRequired,
    getBottonList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
    getModifyCustApplication: PropTypes.func.isRequired,
    modifyCustApplication: PropTypes.object.isRequired,
    addListenModify: PropTypes.bool.isRequired,
    subTypeList: PropTypes.array.isRequired,
    onEmitClearModal: PropTypes.func.isRequired,
  }
  static defaultProps = {
    id: '',
    flowId: '',
    type: '',
    subType: '',
    custName: '',
    custNumber: '',
    remark: '',
    empName: '',
    createTime: '',
    status: '',
    empList: [],
    workflowHistoryBeans: [],
    attachInfoList: [],
    attachment: '',
  }
  constructor() {
    super();
    this.state = {
      // 模态框是否显示   默认状态下是隐藏的
      isShowModal: true,
      // 子类型
      subType: '',
      // 客户对象
      customer: {
        // 客户姓名
        custName: '',
        // 客户id
        custNumber: '',
      },
      // 备注
      remark: '',
      // 拟稿人
      empName: '',
      // 服务人员列表
      empList: [],
      // 长传附件的id
      attachment: '',
      // 审批模态框是否展示
      nextApproverModal: false,
      // 下一组ID
      nextGroupId: '',
      // 下一步按钮名称
      btnName: '',
      // 下一步按钮id
      btnId: '',
      // 下一步操作id
      routeId: '',
      // 下一审批人列表
      nextApproverList: [],
      bottonList: [],
    };
  }
  componentWillMount() {
    const {
      subType,
      custName,
      custNumber,
      remark,
      empList,
    } = this.props;

    this.setState({
      subType,
      customer: {
        custName,
        custNumber,
      },
      remark,
      empList,
    });
    // 获取下一步骤按钮列表
    this.props.getBottonList({ flowId: this.props.flowId });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bottonList && nextProps.bottonList !== this.props.bottonList) {
      this.setState({ bottonList: nextProps.bottonList });
    }
  }
  @autobind
  selectNextApproverList() {
    // 点击下一步按钮 选择下一审批人列表

  }
  @autobind
  closeModal() {
    // 关闭模态框
    this.setState({ isShowModal: false });
  }
  @autobind
  afterClose() {
    // 模态框关闭之后执行的函数
    this.props.onEmitClearModal('isShowModifyModal');
  }
  @autobind
  updateValue(name, value) {
    // 更新state
    console.log(name, value);
    if (name === 'customer') {
      this.setState({ customer: {
        custName: value.custName,
        custNumber: value.cusId,
      } });
    }
    this.setState({ [name]: value });
  }
  @autobind
  submitModifyInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      nextApproverModal: true,
      routeId: item.routeId,
      btnName: item.btnName,
      btnId: item.btnId,
      nextGroupId: item.nextGroupId,
    });
  }
  @autobind
  searchNextApproverList() {
    // 按照给出的条件 搜索查询 下一审批人列表
    this.props.getNextApproverList({
      approverNum: 'single',
      btnId: this.state.btnId,
      flowId: this.props.flowId,
    });
  }
  @autobind
  confirmSubmit(value) {
    // 提交 修改私密客户申请
    const queryConfig = {
      title: '私密客户申请',
      id: this.props.id,
      // 流程ID
      flowId: this.props.flowId,
      // 主类型
      type: this.props.type,
      // 子类型
      subType: this.state.subType,
      // 客户id
      custNumber: this.props.custNumber,
      // 客户名称
      custName: this.props.custName,
      // 状态
      status: this.props.status,
      // 审批意见
      suggestion: this.state.suggestion,
      // 备注
      remark: this.state.remark,
      // 下一审批人
      approvalIds: this.state.nextApproverList.concat(value.ptyMngId),
      // 下一组ID
      nextGroupId: this.state.nextGroupId,
      btnName: this.state.btnName,
      routeId: this.state.routeId,
      // 服务人员列表
      empList: this.state.empList,
      // 附件上传后的id
      attachment: this.state.attachment,
    };
    this.setState({ nextApproverModal: false });
    this.props.getModifyCustApplication(queryConfig);
  }
  get baseInfoModifyDom() {
    // 返回基本信息修改组件
    let subTypeTxt = subTypeList.filter(item => item.value === this.state.subType);
    subTypeTxt = subTypeTxt[0].label || '请选择';
    return (
      <BaseInfoModify
        head="基本信息"
        subTypeTxt={subTypeTxt}
        customer={`${this.state.customer.custName}（${this.state.customer.custNumber}）`}
        remark={this.state.remark}
        canApplyCustList={this.props.canApplyCustList}
        onEmitEvent={this.updateValue}
        subTypeList={this.props.subTypeList}
      />
    );
  }
  get draftInfo() {
    // 返回拟稿信息组件
    const { empName, createTime, status } = this.props;
    let statusTxt = statusList.filter(item => item.value === status);
    statusTxt = statusTxt[0].label || '无';
    const info = [
      {
        title: '拟稿',
        content: empName,
      }, {
        title: '提请时间',
        content: createTime,
      }, {
        title: '状态',
        content: statusTxt,
      },
    ];
    return (
      <MessageList
        head="拟稿信息"
        baseInfo={info}
      />
    );
  }
  render() {
    const searchProps = {
      visible: this.state.nextApproverModal,
      onOk: this.confirmSubmit,
      onCancel: () => { this.setState({ nextApproverModal: false }); },
      onSearch: this.searchNextApproverList,
      dataSource: this.props.nextApproverList,
      columns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'nextApproverModal',
      rowKey: 'ptyMngId',
    };
    return (
      <CommonModal
        title="私密客户管理修改"
        visible={this.state.isShowModal}
        onOk={this.selectNextApproverList}
        okText="提交"
        closeModal={this.closeModal}
        size="large"
        modalKey="myModal"
        afterClose={this.afterClose}
      >
        <div className={style.modifyPrivateClient}>
          <div className={style.dcHeader}>
            <span className={style.dcHaderNumb}>编号{this.props.id}</span>
          </div>
          {this.baseInfoModifyDom}
          {this.draftInfo}
          <ServerPersonel
            head="服务人员"
            type="empList"
            info={this.props.empList}
            radioName="modifyRadio"
            statusType="modify"
            onEmitEvent={this.updateValue}
            searchServerPersonList={this.props.searchServerPersonList}
          />
          <UploadFile
            fileList={this.props.attachInfoList}
            edit
            type="attachment"
            attachment={this.props.attachment || ''}
            onEmitEvent={this.updateValue}
          />
          <ApprovalRecord
            head="审批记录"
            info={this.props.workflowHistoryBeans}
            statusType="modify"
          />
          <BottonGroup
            list={this.state.bottonList}
            onEmitEvent={this.submitModifyInfo}
          />
          <TableDialog
            {...searchProps}
          />
        </div>
      </CommonModal>
    );
  }
}
