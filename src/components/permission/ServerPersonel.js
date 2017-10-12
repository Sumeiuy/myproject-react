import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { message } from 'antd';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import Button from '../common/Button';
import TableList from '../common/TableList';
import style from './serverpersonel.less';
import DropdownSelect from '../common/dropdownSelect';

export default class ServerPersonel extends PureComponent {
  static propTypes = {
    head: PropTypes.string.isRequired,
    info: PropTypes.array,
    statusType: PropTypes.string.isRequired,
    onEmitEvent: PropTypes.func,
    type: PropTypes.string.isRequired,
    searchServerPersonList: PropTypes.array,
    radioName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    info: [],
    searchServerPersonList: [],
    onEmitEvent: () => {},
  }

  static contextTypes = {
    getSearchServerPersonList: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      // 服务人员信息
      serverInfo: [],
      // 选中作为 添加项 添加到table列表中
      addSelectedValue: {},
      // 选中table列表中的某一项 作为 即将要移除
      removeSelectedValue: {},
    };
  }
  componentWillMount() {
    this.setState({ serverInfo: this.props.info });
  }

  componentWillReceiveProps(newProps) {
    if (newProps.info !== this.props.info) {
      this.setState({ serverInfo: newProps.info });
    }
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
              searchList={this.props.searchServerPersonList}
              showObjKey="ptyMngName"
              objId="ptyMngId"
              emitSelectItem={this.dropdownSelectedItem}
              emitToSearch={this.dropdownToSearchInfo}
              boxStyle={{ border: '1px solid #d9d9d9' }}
            />
          </div>
          {
            !_.isEmpty(this.state.addSelectedValue) ?
              <Button
                type="primary"
                onClick={this.addServerPerson}
                className={style.spAddBtn}
              >
              添加
            </Button>
            :
              <Button
                type="primary"
                disabled
                className={style.spAddBtn}
              >
              添加
            </Button>
          }
          {
            !_.isEmpty(this.state.removeSelectedValue) ?
              <Button
                type="primary"
                onClick={this.removeServerPerson}
                className={style.spClearBtn}
              >
              移除
            </Button>
            :
              <Button
                type="primary"
                disabled
                className={style.spClearBtn}
              >
              移除
            </Button>
          }
        </div>
      );
    }
    return result;
  }

  @autobind
  dropdownSelectedItem(item) {
    // 下拉菜单添加选中对象
    this.setState({ addSelectedValue: { ...item, isMain: 'false' } });
  }

  @autobind
  dropdownToSearchInfo(value) {
    // 下拉菜单搜错查询关键字
    this.context.getSearchServerPersonList(value);
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
        serverInfo: [].concat(this.state.addSelectedValue, prevState.serverInfo),
      }), () => {
        this.props.onEmitEvent(this.props.type, this.state.serverInfo);
      });
    }
  }

  @autobind
  removeServerPerson() { // 移除服务人员按钮
    const { removeSelectedValue } = this.state;
    if (removeSelectedValue.isMain === 'true') {
      message.error('主服务经理不能删除');
    } else if (!_.isEmpty(this.state.removeSelectedValue)) {
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
          radioName={this.props.radioName}
          statusType={this.props.statusType}
          selectValue={this.state.removeSelectedValue}
          onEmitUpdateValue={this.updateRadioValue}
        />
      </div>
    );
  }
}
