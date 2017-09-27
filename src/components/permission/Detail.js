/**
 * @file detail.js
 * @author shenxuxiang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import style from './detail.less';
import MessageList from '../common/MessageList';
import ServerPersonel from './ServerPersonel';
import Approval from './Approval';
import ApprovalRecord from './ApprovalRecord';
import BaseInfoModify from './BaseInfoModify';
import UploadFile from './UploadFile';
import { seibelConfig } from '../../config';
import TableDialog from '../common/biz/TableDialog';
import BottonGroup from './BottonGroup';

const subTypeList = seibelConfig.permission.subType;
const statusList = seibelConfig.permission.status;

export default class Detail extends PureComponent {
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
    searchServerPersonList: PropTypes.array.isRequired,
    nextApproverList: PropTypes.array.isRequired,
    getNextApproverList: PropTypes.func.isRequired,
    bottonList: PropTypes.array.isRequired,
    getBottonList: PropTypes.func.isRequired,
    canApplyCustList: PropTypes.array.isRequired,
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
  }

  constructor(props) {
    super(props);
    this.state = {
      // 状态： ready（可读） 、 modify （修改）、 approval（审批）
      statusType: 'ready',
      // 编号
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
      // 提请时间
      // createTime: '',
      // 状态
      // status: '',
      // 服务人员列表
      empList: [],
      // 审批意见
      suggestion: '',
      // 长传附件的id
      attachment: '123456789',
      // 审批模态框是否展示
      approvalModal: false,
      // 下一组ID
      nextGroupId: '',
      // 按钮名称
      btnName: '',
      // 下一步操作id
      routeId: '',
      // 下一审批人
      nextApproverList: [],
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
      // empName,
      // createTime,
      // status,
      empList,
    });
  }

  get getBaseInfoModifyDom() {
    // 返回基本信息或者基本信息修改组件
    let result;
    const { subType, custName, custNumber, remark } = this.props;
    const subTypeTxt = this.changeDisplay(subType, subTypeList);
    const info = [
      {
        title: '子类型',
        content: subTypeTxt,
      }, {
        title: '客户',
        content: `${custName}（${custNumber}）`,
      }, {
        title: '备注',
        content: remark,
      },
    ];

    if (this.state.statusType === 'ready') {
      result = (
        <MessageList
          head="基本信息"
          baseInfo={info}
        />
      );
    } else {
      result = (
        <BaseInfoModify
          head="基本信息"
          subTypeTxt={subTypeTxt}
          customer={`${this.state.customer.custName}（${this.state.customer.custNumber}）`}
          remark={this.state.remark}
          canApplyCustList={this.props.canApplyCustList}
          onEmitEvent={this.updateValue}
        />
      );
    }
    return result;
  }

  get draftInfo() {
    // 返回拟稿信息组件
    const { empName, createTime, status } = this.props;
    const statusTxt = this.changeDisplay(status, statusList);
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

  get approvalDom() {
    // 返回审批意见组件
    let result;
    if (this.state.statusType === 'ready') {
      result = null;
    } else {
      result = (
        <Approval
          head="审批"
          type="suggestion"
          textValue={this.state.suggestion}
          onEmitEvent={this.updateValue}
        />
      );
    }
    return result;
  }
  @autobind
  toChangeStatus() {
    this.setState({ statusType: 'modify' });
    this.props.getBottonList({ flowId: this.props.flowId });
  }

  @autobind
  updateValue(name, value) { // 更新本地数据
    console.log(name, value);
    this.setState({ [name]: value });
  }

  // 后台返回的子类型字段、状态字段转化为对应的中文显示
  @autobind
  changeDisplay(st, options) {
    if (st && !_.isEmpty(st)) {
      const nowStatus = _.find(options, o => o.value === st) || {};
      return nowStatus.label || '无';
    }
    return '无';
  }
  @autobind
  submitModifyInfo(item) {
    // 修改状态下的提交按钮
    // 点击按钮后 弹出下一审批人 模态框
    this.setState({
      approvalModal: true,
      routeId: item.routeId,
      btnName: item.btnName,
      nextGroupId: item.nextGroupId,
    });
  }

  @autobind
  searchNextApproverList() {
    // 按照给出的条件 搜索查询 下一审批人列表
    this.props.getNextApproverList({
      approverNum: 'single',
    });
  }

  @autobind
  confirmSubmit(value) {
    console.log('1234656', value.login);
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
      approvalIds: this.state.nextApproverList.concat(value.login),
      // 下一组ID
      nextGroupId: this.state.nextGroupId,
      btnName: this.state.btnName,
      routeId: this.state.routeId,
      // 服务人员列表
      ptyMngDtoList: this.state.empList,
      // 附件上传后的id
      attachment: this.state.attachment,
    };
    console.log(queryConfig, value);
    this.setState({ approvalModal: false });
  }

  render() {
    const modifyBtnClass = classnames([style.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    const columns = [{
      title: '工号',
      dataIndex: 'login',
      key: 'login',
    }, {
      title: '姓名',
      dataIndex: 'empName',
      key: 'empName',
    }, {
      title: '所属营业部',
      dataIndex: 'occupation',
      key: 'occupation',
    }];
    const searchProps = {
      visible: this.state.approvalModal,
      onOk: this.confirmSubmit,
      onCancel: () => { this.setState({ approvalModal: false }); },
      onSearch: this.searchNextApproverList,
      dataSource: this.props.nextApproverList,
      columns,
      title: '选择下一审批人员',
      placeholder: '员工号/员工姓名',
      modalKey: 'approvalModal',
      rowKey: 'login',
    };

    return (
      <div className={style.detailComponent}>
        <div className={style.dcHeader}>
          <span className={style.dcHaderNumb}>编号{this.props.id}</span>
          <span
            onClick={this.toChangeStatus}
            className={modifyBtnClass}
          >修改</span>
        </div>
        {this.getBaseInfoModifyDom}
        {this.draftInfo}
        <ServerPersonel
          head="服务人员"
          type="empList"
          info={this.props.empList}
          statusType={this.state.statusType}
          onEmitEvent={this.updateValue}
          searchServerPersonList={this.props.searchServerPersonList}
        />
        <UploadFile fileList={this.props.attachInfoList} />
        {this.approvalDom}
        <ApprovalRecord
          head="审批记录"
          info={this.props.workflowHistoryBeans}
          statusType={this.state.statusType}
        />
        <BottonGroup
          list={this.props.bottonList}
          onEmitEvent={this.submitModifyInfo}
        />
        <TableDialog
          {...searchProps}
        />
      </div>
    );
  }
}
