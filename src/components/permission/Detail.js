/**
 * @file detail.js
 * @author shenxuxiang
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import style from './detail.less';
import MessageList from '../common/MessageList';
import ServerPersonel from './ServerPersonel';

export default class Detail extends PureComponent {
  static propTypes = {
    num: PropTypes.string.isRequired,
    baseInfo: PropTypes.object.isRequired,
    draftInfo: PropTypes.object.isRequired,
    serverInfo: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      statusType: 'ready', // 状态： ready（可读） 、 modify （修改）、 Approval（审批）
      num: props.num, // 编号
      baseInfo: props.baseInfo, // 基本信息
      draftInfo: props.draftInfo, // 拟稿信息
      serverInfo: props.serverInfo, // 服务人员
    };
  }

  @autobind
  updateValue(name, value) { // 更新本地数据
    this.setState({ [name]: value });
  }

  render() {
    const { num, baseInfo, draftInfo, serverInfo } = this.props;
    return (
      <div className={style.detailComponent}>
        <div className={style.dcHeader}>
          <span className={style.dcHaderNumb}>编号{num}</span>
          <span
            onClick={() => { this.setState({ statusType: 'modify' }); }}
            className={
              this.state.statusType !== 'ready'
              ? `hide ${style.dcHeaderModifyBtn}`
              : style.dcHeaderModifyBtn
            }
          >修改</span>
        </div>
        <MessageList {...baseInfo} />
        <MessageList {...draftInfo} />
        <ServerPersonel
          head="服务人员"
          info={serverInfo}
          statusType={this.state.statusType}
          emitEvent={this.updateValue}
        />
      </div>
    );
  }
}

