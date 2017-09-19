/*
 * @Description: 合作合约详情页面
 * @Author: LiuJianShu
 * @Date: 2017-09-19 09:37:42
 * @Last Modified by: LiuJianShu
 * @Last Modified time: 2017-09-19 13:54:14
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

import InfoTitle from '../common/InfoTitle';
import InfoItem from '../common/infoItem';
import styles from './detail.less';
import MessageList from '../common/MessageList';
import CommonUpload from '../common/biz/CommonUpload';
import ServerPersonel from '../permission/ServerPersonel';
import Approval from '../permission/Approval';
import ApprovalRecord from '../permission/ApprovalRecord';
import BaseInfoModify from '../permission/BaseInfoModify';

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
      // 审批意见
      approvalComments: '他们什么都不晓得',
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
    const modifyBtnClass = classnames([styles.dcHeaderModifyBtn,
      { hide: this.state.statusType !== 'ready' },
    ]);
    const uploadProps = {
      fileList: [{
        name: '测试.jpg',
        size: 1024000,
        lastModified: 1501926296785,
      }],
    };
    return (
      <div className={styles.detailComponent}>
        <div className={styles.dcHeader}>
          <span className={styles.dcHaderNumb}>编号{num}</span>
          <span
            onClick={() => { this.setState({ statusType: 'modify' }); }}
            className={modifyBtnClass}
          >修改</span>
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="基本信息" />
          <InfoItem label="合约名称" value="这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值这是备注的值" />
          <InfoItem label="子类型" value="私密客户交易信息权限分配" />
          <InfoItem label="客户" value="张三 123456" />
          <InfoItem label="合约开始日期" value="2017/08/31" />
          <InfoItem label="合约有效期" value="2018/05/31" />
          <InfoItem label="合约终止日期" value="2018/05/31" />
          <InfoItem label="合约内容" value="这里是合约内容" />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="拟稿信息" />
          <InfoItem label="拟稿人" value="南京分公司长江路营业部-李四（001654321）" />
          <InfoItem label="提请事件" value="2017/08/31" />
          <InfoItem label="状态" value="已完成" />
        </div>
        <div className={styles.detailWrapper}>
          <InfoTitle head="合约条款" />

        </div>
        <MessageList
          head="基本信息"
          {...baseInfo}
        />
        <BaseInfoModify
          head="基本信息"
          serverInfo={this.state.serverInfo}
          baseInfo={this.state.baseInfo}
        />
        <MessageList
          head="拟稿信息"
          {...draftInfo}
        />
        <ServerPersonel
          head="服务人员"
          type="serverInfo"
          info={serverInfo}
          statusType={this.state.statusType}
          emitEvent={this.updateValue}
        />
        {this.getApprovalDom}
        <CommonUpload {...uploadProps} />
        <ApprovalRecord
          head="审批记录"
          info={approvalRecordList}
          statusType={this.state.statusType}
        />
      </div>
    );
  }
}
