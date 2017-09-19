import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import InfoTitle from '../common/InfoTitle';
import TableList from '../common/TableList';
import style from './serverpersonel.less';
import DropdownSelect from '../common/dropdownSelect';
import PubSub from '../../utils/pubsub';

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
      // 服务人员信息
      serverInfo: props.info,
      // 选中添加值
      addSelectedValue: {},
      // 选中移除值
      removeSelectedValue: {},
      // 新增服务人员 查询信息列表
      searchList: [],
      list: [
        {
          ptyMngId: '0101017',
          ptyMngName: '五大',
          job: '岗位C',
          businessDepartment: '南京奥体东营业部BBB',
          isMain: false,
        }, {
          ptyMngId: '0101018',
          ptyMngName: '五三',
          job: '岗位D',
          businessDepartment: '南京奥体东营业部CCC',
          isMain: false,
        }, {
          ptyMngId: '0101019',
          ptyMngName: '无二',
          job: '岗位F',
          businessDepartment: '南京奥体东营业部DDD',
          isMain: false,
        },
      ],
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
          <div className={style.spAddDropdownSelect}>
            <DropdownSelect
              value="全部"
              placeholder="请输入姓名或工号"
              searchList={this.state.searchList}
              showObjKey="ptyMngName"
              objId="ptyMngId"
              emitSelectItem={this.selectItem}
              emitToSearch={this.toSearchInfo}
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

  componentDIdMount() {
    PubSub.serverPersonelList.add((data) => {
      this.setState({ searchList: data });
    });
  }

  @autobind
  selectItem(item) {
    // 添加选中对象
    console.log(item);
    this.setState({ addSelectedValue: item });
  }

  @autobind
  toSearchInfo(value) {
    // 搜错查询关键字
    // 通过pubsub触发查询获取服务人员列表
    PubSub.dispatchServerPersonelList.dispatch(value);
    // this.setState({searchList: this.state.list});
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
