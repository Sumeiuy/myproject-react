/**
 * @Author: sunweibin
 * @Date: 2018-01-04 14:19:46
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-05 17:48:25
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
    empCurPost: PropTypes.string.isRequired,
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
    const { empRspList, onSwitchRsp } = this.props;
    const empRsp = this.findEmpResp(empRspList, key);
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
    const { empCurPost } = this.props;
    if (key === empCurPost) return;
    this.changeRsp(key);
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
      </Menu>
    );
  }

  render() {
    const { empRspList, empInfo, empCurPost } = this.props;
    let emp = {};
    const post = this.findEmpResp(empRspList, empCurPost);
    emp = {
      name: empInfo.empName,
      postName: post.postnName,
    };
    const empRspMenu = this.createMenu(empRspList);
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
