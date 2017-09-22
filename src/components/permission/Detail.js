/**
 * @file detail.js
 * @author shenxuxiang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import style from './detail.less';
import MessageList from '../common/MessageList';
import ServerPersonel from './ServerPersonel';
import Approval from './Approval';
import ApprovalRecord from './ApprovalRecord';
import BaseInfoModify from './BaseInfoModify';
import UploadFile from './UploadFile';

export default class Detail extends PureComponent {
  static propTypes = {
    num: PropTypes.string,
    baseInfo: PropTypes.array,
    draftInfo: PropTypes.array,
    serverInfo: PropTypes.array,
    approvalRecordList: PropTypes.array,
    attachInfoList: PropTypes.array,
    serverPersonelList: PropTypes.array.isRequired,
    customerList: PropTypes.array.isRequired,
  }

  static defaultProps = {
    num: '',
    baseInfo: [],
    draftInfo: [],
    serverInfo: [],
    approvalRecordList: [],
    attachInfoList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      // 状态： ready（可读） 、 modify （修改）、 approval（审批）
      statusType: 'ready',
      // 编号
      num: props.num,
      // 基本信息
      baseInfo: props.baseInfo,
      // 拟稿信息
      draftInfo: props.draftInfo,
      // 服务人员
      serverInfo: props.serverInfo,
      // 审批记录
      approvalRecordList: props.approvalRecordList,
      // 附件数据
      attachInfoList: props.attachInfoList,
      // 审批意见
      approvalComments: '他们什么都不晓得',
    };
  }

  get getBaseInfoModifyDom() {
    let result;
    if (this.state.statusType === 'ready') {
      result = (
        <MessageList
          head="基本信息"
          baseInfo={this.state.baseInfo}
        />
      );
    } else {
      result = (
        <BaseInfoModify
          head="基本信息"
          baseInfo={this.state.baseInfo}
          customerList={this.props.customerList}
        />
      );
    }
    return result;
  }

  get approvalDom() {
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
    this.setState({ [name]: value });
  }

  render() {
    const { num, draftInfo, serverInfo, approvalRecordList } = this.state;
    const modifyBtnClass = classnames([style.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    return (
      <div className={style.detailComponent}>
        <div className={style.dcHeader}>
          <span className={style.dcHaderNumb}>编号{num}</span>
          <span
            onClick={() => { this.setState({ statusType: 'modify' }); }}
            className={modifyBtnClass}
          >修改</span>
        </div>
        {this.getBaseInfoModifyDom}
        <MessageList
          head="拟稿信息"
          baseInfo={draftInfo}
        />
        <ServerPersonel
          head="服务人员"
          type="serverInfo"
          info={serverInfo}
          statusType={this.state.statusType}
          onEmitEvent={this.updateValue}
          serverPersonelList={this.props.serverPersonelList}
        />
        <UploadFile fileList={this.state.attachInfoList} />
        {this.approvalDom}
        <ApprovalRecord
          head="审批记录"
          info={approvalRecordList}
          statusType={this.state.statusType}
        />
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
      </div>
    );
  }
}
