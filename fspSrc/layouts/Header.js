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
import { Link } from 'dva/router';
import { autobind } from 'core-decorators';

import Logo from './widget/Logo';
import EmpRsp from './widget/EmpRp';
import NavItem from './widget/NavItem';
import styles from './header.less';
import QRCode from './img/qrcode.png';

export default class Header extends PureComponent {
  static propTypes = {
    navs: PropTypes.array.isRequired,
    empInfo: PropTypes.object.isRequired,
    // 用户岗位列表
    empRspList: PropTypes.array.isRequired,
    empCurrentPosition: PropTypes.string.isRequired,
    onSearch: PropTypes.func,
    onSwitchRsp: PropTypes.func,
    onIsolationWallModalShow: PropTypes.func,
  }
  static defaultProps = {
    navs: [],
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

  @autobind
  fakeLogin() {
    if (process.env.NODE_ENV === 'development') {
      window.open('fsp/login?iv-user=002332#/report', '_blank');
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

  render() {
    const { empRspList, empInfo, navs, empCurrentPosition } = this.props;
    const commonTools = (
      <Menu>
        <Menu.Item>
          <Link to="/fsp/serviceCenter/investContract">投顾签约</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/application/commission">服务订阅</Link>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.handleShowDialog}>隔离墙</a>
        </Menu.Item>
        <Menu.Item>
          产品适当性售前查询
        </Menu.Item>
      </Menu>
    );
    const mobileVersion = (
      <img src={QRCode} alt="移动端二维码" />
    );
    const knowledgeBase = (
      <Menu>
        <Menu.Item>
          基础业务知识
        </Menu.Item>
      </Menu>
    );
    const helpMenu = (
      <Menu>
        <Menu.Item>
          反馈管理
        </Menu.Item>
        <Menu.Item>
          专项业务知识
        </Menu.Item>
        <Menu.Item>
          更新日志
        </Menu.Item>
      </Menu>
    );
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
            !_.isEmpty(navs) ?
              (
                navs.map(nav => (<NavItem
                  id={nav.id}
                  name={nav.name}
                  action={nav.action}
                  url={nav.url}
                  path={nav.path}
                  subMenu={nav.children}
                />))
              ) :
              null
          }

          <Dropdown overlay={commonTools}>
            <div>
              <span className={styles.navItem}>
                <span>常用工具</span>
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>

          <Dropdown overlay={mobileVersion}>
            <div>
              <span className={styles.navItem}>
                <span>移动版</span>
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>

          <Dropdown overlay={knowledgeBase}>
            <div>
              <span className={styles.navItem}>
                <span>知识库</span>
              </span>
              <span className={styles.splitLine} />
            </div>
          </Dropdown>

          <Dropdown overlay={helpMenu}>
            <div>
              <span className={styles.navItem}>
                <span>帮助</span>
              </span>
            </div>
          </Dropdown>

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
