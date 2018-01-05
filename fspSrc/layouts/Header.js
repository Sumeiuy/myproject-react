/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
<<<<<<< HEAD
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-05 14:28:06
=======
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-05 14:25:34
>>>>>>> 2e086200c1301fa4daac35c75626cabd4f20227c
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
<<<<<<< HEAD
    secondaryMenu: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
=======
    navList: PropTypes.array.isRequired,
    loginInfo: PropTypes.object.isRequired,
>>>>>>> 2e086200c1301fa4daac35c75626cabd4f20227c
    empRspList: PropTypes.array.isRequired,
    onSearch: PropTypes.func,
    onSwitchRsp: PropTypes.func,
  }

  static defaultProps = {
<<<<<<< HEAD
    secondaryMenu: [],
    onExit: () => {},
=======
    navList: [],
>>>>>>> 2e086200c1301fa4daac35c75626cabd4f20227c
    onSearch: () => {},
    onSwitchRsp: () => {},
  }

  @autobind
  handleSwitchRsp(rsp) {
    console.warn('handleSwitchRsp>>rsp', rsp);
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
