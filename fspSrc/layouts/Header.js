/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-16 16:05:26
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
import QRCode from './img/qrcode.png';
import { fixExternUrl } from '../components/utils/tab';
import withRouter from '../../src/decorators/withRouter';

@withRouter
export default class Header extends PureComponent {
  static propTypes = {
    secondaryMenu: PropTypes.array,
    empInfo: PropTypes.object.isRequired,
    // 用户岗位列表
    empRspList: PropTypes.array.isRequired,
    empCurrentPosition: PropTypes.string.isRequired,
    onSearch: PropTypes.func,
    onSwitchRsp: PropTypes.func,
    onIsolationWallModalShow: PropTypes.func,
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
  }
  static defaultProps = {
    secondaryMenu: [],
    empInfo: {},
    onSearch: () => { },
    onSwitchRsp: () => { },
    onIsolationWallModalShow: () => { },
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  getDropdownMenu(menu) {
    if (menu.name === '移动版') {
      return (
        <img src={QRCode} alt="移动端二维码" />
      );
    }
    return (
      <Menu>
        {
          this.getMenus(menu.children)
        }
      </Menu>
    );
  }

  getMenus(array, level = 2) {
    return array.map((item) => {
      if (item.children && !_.isEmpty(item.children)) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={item.name}
          >
            {this.getMenus(item.children, level + 1)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.id}
        >
          <div
            title={item.name}
            onClick={() => this.handleLinkClick(item)}
          >
            {item.name}
          </div>
        </Menu.Item>
      );
    });
  }

  preTreatment(secondaryMenu) {
    return _.filter(secondaryMenu,
      menu =>
        menu.name === '移动版'
        || (!_.isEmpty(menu.children))
        || (!!menu.path));
  }

  @autobind
  fakeLogin() {
    if (process.env.NODE_ENV === 'development') {
      window.open('fsp/login?iv-user=002332#/report', '_blank');
    }
  }

  @autobind
  handleLinkClick(menuItem) {
    const { push, location } = this.props;
    if (menuItem.action === 'loadExternSystemPage') {
      const externUrl = fixExternUrl(menuItem.url);
      window.open(externUrl, '_blank');
    } else if (menuItem.action === 'loadInModal') {
      this.handleShowDialog();
    } else if (menuItem.path !== location.pathname) {
      push({
        pathname: menuItem.path,
        query: menuItem.query,
      });
    }
  }

  @autobind
  handleSwitchRsp(rsp) {
    this.props.onSwitchRsp(rsp);
  }

  @autobind
  handleShowDialog() {
    this.props.onIsolationWallModalShow();
  }

  @autobind
  renderSecondaryMenu(secondaryMenu) {
    const fixSecondaryMenu = this.preTreatment(secondaryMenu);
    return (
      _.map(fixSecondaryMenu, (menu, index) => {
        if (!_.isEmpty(menu.children) || menu.name === '移动版') {
          return (
            <Dropdown
              key={menu.id}
              overlay={this.getDropdownMenu(menu)}
            >
              <div>
                <span className={styles.navItem}>
                  <span>{menu.name}</span>
                </span>
                {
                  (index !== fixSecondaryMenu.length - 1) ?
                    <span className={styles.splitLine} /> : null
                }
              </div>
            </Dropdown>
          );
        }

        return (
          <div onClick={() => this.handleLinkClick(menu)}>
            <span className={styles.navItem}>
              <span>{menu.name}</span>
            </span>
            {
              (index !== fixSecondaryMenu.length - 1) ?
                <span className={styles.splitLine} /> : null
            }
          </div>
        );
      }));
  }

  render() {
    const {
      empRspList,
      empInfo,
      secondaryMenu,
      empCurrentPosition,
    } = this.props;

    return (
      <div className={styles.fspHeader}>
        <div onClick={this.fakeLogin}><Logo /></div>
        <div className={styles.headerContent}>
          {/* <div className={styles.search}>
              <Search
                placeholder="搜索"
                onSearch={this.handleOnSearch}
                style={{ width: 155 }}
              />
            </div> */}
          {
            !_.isEmpty(secondaryMenu) ?
              this.renderSecondaryMenu(secondaryMenu) : null
          }
          {
            (!_.isEmpty(empRspList)) ?
              (<EmpRsp
                empRspList={empRspList}
                empCurrentPosition={empCurrentPosition}
                empInfo={empInfo}
                onSwitchRsp={this.handleSwitchRsp}
              />) :
              null
          }
        </div>
      </div>
    );
  }
}
