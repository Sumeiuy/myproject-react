/**
 * @Author: sunweibin
 * @Date: 2018-01-04 14:19:46
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-04 17:22:14
 * @description 头部用户名称以及岗位信息展示部件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../../src/components/common/Icon';
import styles from './empRp.less';

export default class EmpRp extends PureComponent {

  static propTypes = {
    empRspList: PropTypes.array.isRequired,
    empCurRsp: PropTypes.object.isRequired,
    onExit: PropTypes.func,
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
    onExit: () => {},
    onSwitchRsp: () => {},
  }

  constructor(props) {
    super(props);
    const { empCurRsp, empRspList } = props;
    const { postnId } = empCurRsp;
    const empRsp = this.findEmpResp(empRspList, postnId);
    this.state = {
      name: empCurRsp.empName,
      empRsp: empRsp.postnName,
      rspId: postnId,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { empRspList: prevRspList, empCurRsp: prevEmp } = this.props;
    const { empRspList: nextRspList, empCurRsp: nextEmp } = nextProps;
    if (prevRspList !== nextRspList || prevEmp !== nextEmp) {
      const { postnId } = nextEmp;
      const empRsp = this.findEmpResp(nextRspList, postnId);
      this.setState({
        name: nextEmp.empName,
        empRsp: empRsp.postnName,
        rspId: empRsp.postnId,
      });
    }
  }

  // 找到当前用户的岗位对象
  @autobind
  findEmpResp(list, postnId) {
    return _.find(list, rsp => rsp.postnId === postnId);
  }

  // 切换岗位后展示新的岗位名称
  @autobind
  changeRsp(key) {
    const { empRspList, onSwitchRsp } = this.props;
    const empRsp = this.findEmpResp(empRspList, key);
    this.setState({
      empRsp: empRsp.postnName,
      rspId: empRsp.postnId,
    });
    // TODO 添加切换岗位后的操作
    onSwitchRsp(empRsp);
  }

  // 退出系统操作
  @autobind
  loginout() {
    this.props.onExit();
  }
  // 选择某个
  @autobind
  handleRspChange({ key }) {
    const { rspId } = this.state;
    if (key === rspId) return;
    switch (key) {
      case 'loginout':
        this.loginout();
        break;
      default:
        this.changeRsp(key);
        break;
    }
  }

  // 根据empRspList生成Menu
  @autobind
  createMenu(list) {
    return (
      <Menu style={{ width: '150px' }} onClick={this.handleRspChange}>
        {
          list.map(item => (<Menu.Item key={item.postnId}>
            <span className={styles.empRspItem} title={item.postnName}>{item.postnName}</span>
          </Menu.Item>))
        }
        <Menu.Item key="loginout">
          <span className={styles.empRspItem}><Icon type="tuichu" />&nbsp;退出系统</span>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { empRspList } = this.props;
    const empRspMenu = this.createMenu(empRspList);
    const { name = '', empRsp = '' } = this.state;
    return (
      <Dropdown overlay={empRspMenu} className="xxx">
        <dl className={styles.position}>
          <dt className={styles.empName}><Icon type="touxiang" />&nbsp;{name}</dt>
          <dd className={styles.empRsp}>{empRsp}</dd>
        </dl>
      </Dropdown>
    );
  }
}
