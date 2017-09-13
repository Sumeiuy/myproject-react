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

export default class Detail extends PureComponent {
  static propTypes = {
    num: PropTypes.string,
    baseInfo: PropTypes.object,
    draftInfo: PropTypes.object,
    serverInfo: PropTypes.array,
    approvalRecordList: PropTypes.array,
  }

  static defaultProps = {
    num: '',
    baseInfo: {},
    draftInfo: {},
    serverInfo: [],
    approvalRecordList: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      statusType: 'ready', // 状态： ready（可读） 、 modify （修改）、 approval（审批）
      num: props.num, // 编号
      baseInfo: props.baseInfo, // 基本信息
      draftInfo: props.draftInfo, // 拟稿信息
      serverInfo: props.serverInfo, // 服务人员
      approvalComments: '他们什么都不晓得', // 审批意见
    };
  }

  get getApprovalDom() {
    let result;
    if (this.state.statusType === 'ready') {
      result = null;
    } else {
      result = (
        <Approval
          head="审批"
          type="approvalComments"
          textValue={this.state.approvalComments}
          emitEvent={this.updateValue}
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
    const { num, baseInfo, draftInfo, serverInfo, approvalRecordList } = this.props;
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
        <MessageList {...baseInfo} />
        <BaseInfoModify
          head="基本信息"
          serverInfo={this.state.serverInfo}
          baseInfo={this.state.baseInfo}
        />
        <MessageList {...draftInfo} />
        <ServerPersonel
          head="服务人员"
          type="serverInfo"
          info={serverInfo}
          statusType={this.state.statusType}
          emitEvent={this.updateValue}
        />
        {this.getApprovalDom}
        <ApprovalRecord
          head="审批记录"
          info={approvalRecordList}
          statusType={this.state.statusType}
        />
      </div>
    );
  }
}
