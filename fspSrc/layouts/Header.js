/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-05 09:50:20
 * @description 新头部导航
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import Logo from './widget/Logo';
import EmpRsp from './widget/EmpRp';
import styles from './header.less';

export default class Header extends PureComponent {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
    empRspList: PropTypes.array.isRequired,
    onSearch: PropTypes.func,
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
    navList: [],
    onSearch: () => {},
    onSwitchRsp: () => {},
  }

  @autobind
  handleSwitchRsp(rsp) {
    console.warn('handleSwitchRsp>>rsp', rsp);
    this.props.onSwitchRsp();
  }

  render() {
    const { empInfo, empRspList } = this.props;
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
              onSearch={value => console.log(value)}
              style={{ width: 155 }}
            />
          </div> */}
          <Dropdown overlay={statisticalMenu}>
            <spn className={styles.navItem}>常用工具</spn>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <spn className={styles.navItem}>移动版</spn>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <spn className={styles.navItem}>知识库</spn>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <spn className={styles.navItem}>运维管理</spn>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <spn className={styles.navItem}>通知提醒</spn>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <spn className={styles.navItem}>帮助</spn>
          </Dropdown>
          {
            (!_.isEmpty(empRspList) && !_.isEmpty(empInfo)) ?
            (<EmpRsp
              empRspList={empRspList}
              empCurRsp={empInfo}
              onSwitchRsp={this.handleSwitchRsp}
            />) :
            null
          }
        </div>
      </div>
    );
  }
}
