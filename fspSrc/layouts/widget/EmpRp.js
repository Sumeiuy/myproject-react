/**
 * @Author: sunweibin
 * @Date: 2018-01-04 14:19:46
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-14 01:56:13
 * @description 头部用户名称以及岗位信息展示部件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import { Link } from 'dva/router';
import { autobind } from 'core-decorators';
import _ from 'lodash';

import Icon from '../../../src/components/common/Icon';
import styles from './empRp.less';

export default class EmpRp extends PureComponent {
  static propTypes = {
    empPostnList: PropTypes.array.isRequired,
    empCurrentPosition: PropTypes.string.isRequired,
    empInfo: PropTypes.object.isRequired,
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
    onSwitchRsp: () => {},
  }

  // 找到当前用户的岗位对象
  @autobind
  findEmpResp(list, key) {
    return _.find(list, rsp => rsp.postnId === key);
  }

  // 切换岗位后展示新的岗位名称
  @autobind
  changeRsp(key) {
    const { empPostnList, onSwitchRsp } = this.props;
    const empRsp = this.findEmpResp(empPostnList, key);
    // 取出需要传递给后端的参数
    const param = {
      pstnId: empRsp.postnId,
      orgId: empRsp.orgId,
      orgName: empRsp.orgName,
      pstnName: empRsp.postnName,
      orgRowId: empRsp.orgRowId,
    };
    onSwitchRsp(param);
  }

  // 选择某个岗位
  @autobind
  handleRspChange({ key }) {
    const { empCurrentPosition } = this.props;
    if (key === empCurrentPosition || key === 'userCenter') return;
    this.changeRsp(key);
  }

  // 根据empRspList生成Menu
  @autobind
  createMenu(list) {
    return (
      <Menu style={{ width: '150px' }} onClick={this.handleRspChange}>
        {
          list.map(item => (
            <Menu.Item key={item.postnId}>
              <span className={styles.empRspItem} title={item.postnName}>{item.postnName}</span>
            </Menu.Item>))
        }
        <Menu.Divider />
        <Menu.Item key="userCenter">
          <Link to="/userCenter" className={styles.empRspItem}>用户中心</Link>
        </Menu.Item>
        <Menu.Item key="myProcess">
          <Link to="/customerPool/todo" className={styles.empRspItem}>我的流程</Link>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { empPostnList, empInfo, empCurrentPosition } = this.props;
    let emp = {};
    const post = this.findEmpResp(empPostnList, empCurrentPosition) || empPostnList[0];
    emp = {
      name: empInfo.empName,
      postName: post.postnName,
    };
    const empRspMenu = this.createMenu(empPostnList);
    return (
      <Dropdown overlay={empRspMenu}>
        <dl className={styles.position}>
          <dt className={styles.empName}><Icon type="touxiang" />&nbsp;{emp.name}</dt>
          <dd className={styles.empRsp}>{emp.postName}</dd>
        </dl>
      </Dropdown>
    );
  }
}
