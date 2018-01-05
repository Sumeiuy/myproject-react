/**
 * @Author: sunweibin
 * @Date: 2018-01-04 14:19:46
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-05 16:06:52
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
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
    onSwitchRsp: () => {},
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
    // 取出需要传递给后端的参数
    const param = {
      postId: empRsp.postnId,
      postName: empRsp.postnName,
      orgId: empRsp.orgId,
      name: empRsp.loginName,
    };
    onSwitchRsp(param);
  }

  // 选择某个岗位
  @autobind
  handleRspChange({ key }) {
    const { empCurRsp } = this.props;
    if (key === empCurRsp.postId) return;
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
    const { empRspList, empCurRsp } = this.props;
    const empRspMenu = this.createMenu(empRspList);
    return (
      <Dropdown overlay={empRspMenu}>
        <dl className={styles.position}>
          <dt className={styles.empName}><Icon type="touxiang" />&nbsp;{empCurRsp.name}</dt>
          <dd className={styles.empRsp}>{empCurRsp.postName}</dd>
        </dl>
      </Dropdown>
    );
  }
}
