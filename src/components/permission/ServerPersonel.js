import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import TableList from '../common/TableList';
import style from './serverpersonel.less';
import DropdownSelect from '../common/dropdownSelect';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    info: PropTypes.array.isRequired,
    statusType: PropTypes.string.isRequired,
    onEmitEvent: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    serverPersonelList: PropTypes.array.isRequired,
  }

  static contextTypes = {
    getServerPersonelList: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 服务人员信息
      serverInfo: props.info,
      // 选中添加值
      addSelectedValue: {},
      // 选中移除值
      removeSelectedValue: {},
      // 新增服务人员 查询信息列表
      searchList: [],
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ serverInfo: newProps.info });
  }

  get modifyDom() { // 只读或者编辑状态下所对应的操作状态
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
          <div className={style.spAddDropdownSelect}>
            <DropdownSelect
              value="全部"
              placeholder="请输入姓名或工号"
              searchList={this.props.serverPersonelList}
              showObjKey="ptyMngName"
              objId="ptyMngId"
              emitSelectItem={this.dropdownSelectedItem}
              emitToSearch={this.dropdownToSearchInfo}
              boxStyle={{ border: '1px solid #d9d9d9' }}
            />
          </div>
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
  dropdownSelectedItem(item) {
    // 下拉菜单添加选中对象
    console.log(item);
    this.setState({ addSelectedValue: item });
  }

  @autobind
  dropdownToSearchInfo(value) {
    // 下拉菜单搜错查询关键字
    this.context.getServerPersonelList(value);
  }

  @autobind
  updateRadioValue(item) {
    // 更新table列表的选中值
    this.setState({ removeSelectedValue: item });
  }

  @autobind
  addServerPerson() {
    // 添加服务人员按钮
    if (!_.isEmpty(this.state.addSelectedValue)) {
      this.setState(prevState => ({
        serverInfo: prevState.serverInfo.concat(this.state.addSelectedValue),
      }), () => {
        this.props.onEmitEvent(this.props.type, this.state.serverInfo);
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
        this.props.onEmitEvent(this.props.type, this.state.serverInfo);
      });
    }
  }

  @autobind
  updateSearchListValue(data) {
    this.setState({ searchList: data });
  }

  render() {
    return (
      <div className={style.serverPersonel}>
        <InfoTitle head={this.props.head} />
        {this.modifyDom}
        <TableList
          info={this.state.serverInfo}
          statusType={this.props.statusType}
          selectValue={this.state.removeSelectedValue}
          emitUpdateValue={this.updateRadioValue}
        />
      </div>
    );
  }
}
