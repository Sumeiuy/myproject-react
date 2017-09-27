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

const subTypeList = seibelConfig.permission.subType;
const statusList = seibelConfig.permission.status;

export default class Detail extends PureComponent {
  static propTypes = {
    id: PropTypes.number,
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
    canApplyCustList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    id: '',
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
      createTime: '',
      // 状态
      status: '',
      // 主服务经理
      empList: [],
      // 审批意见
      approvalComments: '',
    };
  }

  componentWillMount() {
    const {
      subType,
      custName,
      custNumber,
      remark,
      empName,
      createTime,
      status,
      empList,
    } = this.props;

    this.setState({
      subType,
      customer: {
        custName,
        custNumber,
      },
      remark,
      empName,
      createTime,
      status,
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
          type="approvalComments"
          textValue={this.state.approvalComments}
          onEmitEvent={this.updateValue}
        />
      );
    }
    return result;
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

  render() {
    const modifyBtnClass = classnames([style.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    return (
      <div className={style.detailComponent}>
        <div className={style.dcHeader}>
          <span className={style.dcHaderNumb}>编号{this.props.id}</span>
          <span
            onClick={() => { this.setState({ statusType: 'modify' }); }}
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
        {
          this.state.statusType !== 'ready' ?
            <div className={style.dcFooter}>
              <span
                className={style.spClearBtn}
                onClick={this.removeServerPerson}
              >终止</span>
              <span
                className={style.spAddBtn}
                onClick={this.addServerPerson}
              >提交</span>
            </div>
          :
            null
        }
      </div>
    );
  }
}
