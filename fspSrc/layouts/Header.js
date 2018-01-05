/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-05 16:08:06
 * @description 新头部导航
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import Logo from './widget/Logo';
import EmpRsp from './widget/EmpRp';
import NavItem from './widget/NavItem';
import styles from './header.less';

export default class Header extends PureComponent {
  static propTypes = {
    secondaryMenu: PropTypes.array.isRequired,
    loginInfo: PropTypes.object.isRequired,
    empRspList: PropTypes.array.isRequired,
    onSearch: PropTypes.func,
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
    secondaryMenu: [],
    onSearch: () => {},
    onSwitchRsp: () => {},
  }

  @autobind
  handleSwitchRsp(rsp) {
    this.props.onSwitchRsp(rsp);
  }

  render() {
    const { loginInfo, empRspList } = this.props;
    const statisticalMenu = (
      <Menu mode="vertical">
        <Menu.Item key="0">
          <a href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.SubMenu key="1" title="2级菜单">
          <Menu.Item key="3">
            <a href="http://www.alipay.com/">1st menu item</a>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    );

    return (
      <div className={styles.header}>
        <Logo />
        <div className={styles.headerContent}>
          {/* <div className={styles.search}>
            <Search
              placeholder="搜索"
              onSearch={this.handleOnSearch}
              style={{ width: 155 }}
            />
          </div> */}
          <Dropdown overlay={statisticalMenu}>
            <NavItem label="常用工具" />
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <NavItem label="移动版" downIcon={false} />
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <NavItem label="知识库" />
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <NavItem label="运维管理" />
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <NavItem label="业务申请" />
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <NavItem label="帮助" downIcon={false} line={false} />
          </Dropdown>
          {
            (!_.isEmpty(empRspList) && !_.isEmpty(loginInfo)) ?
            (<EmpRsp
              empRspList={empRspList}
              empCurRsp={loginInfo}
              onSwitchRsp={this.handleSwitchRsp}
            />) :
            null
          }
        </div>
      </div>
    );
  }
}
