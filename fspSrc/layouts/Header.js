/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-05 09:52:36
 * @description 新头部导航
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';
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
    onExit: PropTypes.func,
    onSearch: PropTypes.func,
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
    navList: [],
    onExit: () => {},
    onSearch: () => {},
    onSwitchRsp: () => {},
  }

  @autobind
  handleLoginout() {
    this.props.onExit();
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
            <div>
              <span className={styles.navItem}>
                常用工具<Icon type="down" style={{ marginLeft: '2px' }} />
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <div>
              <span className={styles.navItem}>移动版</span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <div>
              <span className={styles.navItem}>
                知识库<Icon type="down" style={{ marginLeft: '2px' }} />
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <div>
              <span className={styles.navItem}>
                运维管理<Icon type="down" style={{ marginLeft: '2px' }} />
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <div>
              <span className={styles.navItem}>
                通知提醒<Icon type="down" style={{ marginLeft: '2px' }} />
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>
          <Dropdown overlay={statisticalMenu}>
            <div>
              <span className={styles.navItem}>
                帮助<Icon type="down" style={{ marginLeft: '2px' }} />
              </span>
            </div>
          </Dropdown>
          {
            (!_.isEmpty(empRspList) && !_.isEmpty(empInfo)) ?
            (<EmpRsp
              empRspList={empRspList}
              empCurRsp={empInfo}
              onExit={this.handleLoginout}
              onSwitchRsp={this.handleSwitchRsp}
            />) :
            null
          }
        </div>
      </div>
    );
  }
}
