import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoTitle from './InfoTitle';
import TableList from './TableList';
import style from './serverpersonel.less';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    info: PropTypes.array.isRequired,
    statusType: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      serverInfo: props.info,
      selectedValue: props.info[0],
    };
  }

  @autobind
  UpdateValue(item) {
    this.setState({ selectedValue: item });
  }

  render() {
    return (
      <div className={style.serverPersonel}>
        <InfoTitle head={this.props.head} />
        <div
          className={style.spAlerts}
        >
          <span className={style.spAlertsCircle}>&nbsp;</span>
          <span className={style.spAlertsCon}>
            私密客户交易权限分配、私密客户设置 在下面客户服务团队视图中编辑；仅具有柜台系统交易信息查询权限的A类员工才能通过柜台查询该客户交易信息。
          </span>
        </div>
        <TableList
          info={this.state.serverInfo}
          statusType={this.props.statusType}
          selectValue={this.state.selectedValue}
          emitUpdateValue={this.UpdateValue}
        />
      </div>
    );
  }
}
