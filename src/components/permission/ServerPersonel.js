import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import TableList from '../common/TableList';
import style from './serverpersonel.less';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    info: PropTypes.array.isRequired,
    statusType: PropTypes.string.isRequired,
    emitEvent: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      serverInfo: props.info,
      addSelectedValue: {}, // 添加选中的值
      removeSelectedValue: {}, // 移除选中的值
    };
  }
  get getModifyDom() { // 只读或者编辑状态下所对应的操作状态
    let result;
    if (this.props.statusType === 'ready') {
      result = (
        <div
          className={style.spAlerts}
        >
          <span className={style.spAlertsCircle}>&nbsp;</span>
          <span className={style.spAlertsCon}>
            私密客户交易权限分配、私密客户设置 在下面客户服务团队视图中编辑；仅具有柜台系统交易信息查询权限的A类员工才能通过柜台查询该客户交易信息。
          </span>
        </div>
      );
    } else if (this.props.statusType === 'modify') {
      result = (
        <div className={style.spBtnGroup}>
          <span className={style.spAddServerPerson}>新增服务人员：</span>
          <span
            className={style.spAddBtn}
            onClick={this.addServerPerson}
          >添加</span>
          <span
            className={style.spClearBtn}
            onClick={this.removeServerPerson}
          >移除</span>
        </div>
      );
    }
    return result;
  }

  @autobind
  UpdateValue(item) { // state更新
    this.setState({ removeSelectedValue: item });
  }

  @autobind
  addServerPerson() { // 添加服务人员按钮
    if (!_.isEmpty(this.state.addSelectedValue)) {
      this.setState(prevState => ({
        serverInfo: prevState.serverInfo.concat(this.state.addSelectedValue),
      }), () => {
        this.props.emitEvent(this.props.type, this.state.serverInfo);
      });
    }
  }

  @autobind
  removeServerPerson() { // 移除服务人员按钮
    const { removeSelectedValue } = this.state;
    if (!_.isEmpty(this.state.removeSelectedValue)) {
      this.setState(prevState => ({
        serverInfo: prevState.serverInfo.filter(
          item => item.ptyMngId !== removeSelectedValue.ptyMngId,
        ),
      }), () => {
        this.props.emitEvent(this.props.type, this.state.serverInfo);
      });
    }
  }

  render() {
    return (
      <div className={style.serverPersonel}>
        <InfoTitle head={this.props.head} />
        {this.getModifyDom}
        <TableList
          info={this.state.serverInfo}
          statusType={this.props.statusType}
          selectValue={this.state.removeSelectedValue}
          emitUpdateValue={this.UpdateValue}
        />
      </div>
    );
  }
}
