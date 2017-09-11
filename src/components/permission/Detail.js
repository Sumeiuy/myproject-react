/**
 * @file detail.js
 * @author shenxuxiang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import style from './detail.less';
import MessageList from './MessageList';
import ServerPersonel from './ServerPersonel';

export default class Detail extends PureComponent {
  static propTypes = {
    num: PropTypes.string.isRequired,
    baseInfo: PropTypes.object.isRequired,
    draftInfo: PropTypes.object.isRequired,
    serverInfo: PropTypes.array.isRequired,
  }

  constructor() {
    super();
    this.state = {
      statusType: 'modify', // 状态： ready（可读） 、 modify （修改）、 Approval（审批）
    };
  }

  render() {
    const { num, baseInfo, draftInfo, serverInfo } = this.props;
    return (
      <div className={style.detailComponent}>
        <header className={style.dcHeader}>
          <span className={style.dcHaderNumb}>编号{num}</span>
          <span
            className={this.state.statusType === 'modify' ? style.dcHeaderModifyBtn : `${style.dcHeaderModifyBtn} hide`}
          >修改</span>
        </header>
        <MessageList {...baseInfo} />
        <MessageList {...draftInfo} />
        <ServerPersonel
          head="服务人员"
          info={serverInfo}
          statusType={this.state.statusType}
        />
      </div>
    );
  }
}

