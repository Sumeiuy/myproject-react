/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
 * @Last Modified by: ouchangzhi
 * @Last Modified time: 2018-01-16 16:05:26
 * @description 新头部导航
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Menu, Dropdown, Input, Modal, Button } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import className from 'classnames';

import Logo from './widget/Logo';
import EmpRsp from './widget/EmpRp';
import styles from './header.less';
import QRCode from './img/qrcode.png';
import { fixExternUrl } from '../components/utils/tab';
import withRouter from '../../src/decorators/withRouter';
import api from '../../src/api';
import { Search } from '../../src/components/customerPool/home';
import { emp, permission } from '../../src/helper';

const effects = {
  getHotPossibleWds: 'customerPool/getHotPossibleWds',
  saveSearchVal: 'customerPool/saveSearchVal',
};

const fetchDataFunction = (globalLoading, type) => query => ({
  type,
  payload: query || {},
  loading: globalLoading,
});

const mapStateToProps = state => ({
  hotPossibleWdsList: state.customerPool.hotPossibleWdsList, // 联想的推荐热词列表
  searchHistoryVal: state.customerPool.searchHistoryVal, // 保存搜索内容
});

const mapDispatchToProps = {
  getHotPossibleWds: fetchDataFunction(false, effects.getHotPossibleWds),
  saveSearchVal: fetchDataFunction(false, effects.saveSearchVal),
};

@connect(mapStateToProps, mapDispatchToProps)
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
    push: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    getHotPossibleWds: PropTypes.func.isRequired,
    saveSearchVal: PropTypes.func.isRequired,
    hotPossibleWdsList: PropTypes.array,
    searchHistoryVal: PropTypes.string,
  }
  static defaultProps = {
    secondaryMenu: [],
    empInfo: {},
    onSearch: _.noop,
    onSwitchRsp: _.noop,
    hotPossibleWdsList: [],
    searchHistoryVal: '',
  }

  constructor(props) {
    super(props);
    // 登录用户orgId
    this.orgId = emp.getOrgId();
    this.state = {
      // 隔离墙modal是否可见
      isolationWallModalVisible: false,
    };
    // HTSC 任务管理岗
    this.hasTkMampPermission = permission.hasTkMampPermission();
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
      window.open('fsp/login?iv-user=002332#/statisticalQuery/report', '_blank');
    }
  }

  // 获取联想数据
  @autobind
  queryHotPossibleWds(state) {
    const { getHotPossibleWds } = this.props;
    const setData = {
      orgId: this.hasTkMampPermission ? this.orgId : '', // 组织ID
      empNo: emp.getId(), // 用户ID
    };
    getHotPossibleWds({
      ...setData,
      ...state,
    });
  }

  @autobind
  handleSaveSearchVal(obj) {
    const { saveSearchVal } = this.props;
    saveSearchVal(obj);
  }

  @autobind
  handleLinkClick(menuItem) {
    const { push, location } = this.props;
    if (menuItem.action === 'loadExternSystemPage') {
      const externUrl = fixExternUrl(menuItem.url);
      window.open(externUrl, '_blank');
    } else if (menuItem.action === 'loadInModal') {
      this.handleShowDialog(menuItem);
    } else if (menuItem.path !== location.pathname) {
      push({
        pathname: menuItem.path,
        query: menuItem.query,
      });
    }
  }

  @autobind
  handleInputChange(value) {
    this.setState({
      stockCode: value,
    });
  }

  @autobind
  handleSwitchRsp(rsp) {
    this.props.onSwitchRsp(rsp);
  }

  @autobind
  handleShowDialog(menuItem) {
    if (menuItem.name === '隔离墙') {
      this.handleIsolationWallModalShow();
    }
  }

  @autobind
  handleIsolationWallModalShow() {
    this.setState({
      isolationWallModalVisible: true,
    });
  }

  @autobind
  handleIsolationWallModalHide() {
    this.setState({
      isolationWallModalVisible: false,
      dataValidResult: '',
      stockCode: '',
    });
  }

  @autobind
  handleSubmitExistCp() {
    if (!this.state.stockCode) {
      this.setState({
        dataValidResult: 'empty',
      });
      return;
    }
    api
      .postFspData(`/isExistCp?stockCode=${this.state.stockCode}`,
        {},
        { isFullUrl: true },
      )
      .then((data) => {
        if (data === 'true') {
          this.setState({
            dataValidResult: 'true',
          });
        } else {
          this.setState({
            dataValidResult: 'false',
          });
        }
      });
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
      push,
      hotPossibleWdsList,
      searchHistoryVal,
    } = this.props;

    const rightClasses = className({
      [styles.validMessage]: true,
      [styles.show]: this.state.dataValidResult === 'true',
    });

    const rightIconClasses = className(['iconfont', 'icon-duihao', styles.rightIcon]);

    const errorClasses = className({
      [styles.validMessage]: true,
      [styles.show]: this.state.dataValidResult === 'false',
    });

    const errorEmptyClasses = className({
      [styles.validMessage]: true,
      [styles.show]: this.state.dataValidResult === 'empty',
    });

    const errorIconClasses = className(['iconfont', 'icon-tixing', styles.errorIcon]);

    return (
      <div className={styles.fspHeader}>
        <Modal
          title="隔离墙"
          width={650}
          className={styles.modal}
          destroyOnClose
          visible={this.state.isolationWallModalVisible}
          onOk={this.handleSubmitExistCp}
          onCancel={this.handleIsolationWallModalHide}
          footer={[
            <Button key="back" onClick={this.handleIsolationWallModalHide}>取消</Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleSubmitExistCp}
            >
              验证
            </Button>,
          ]}
        >
          <div className={styles.selectedInfo}>股票代码：</div>
          <Input
            onChange={e => this.handleInputChange(e.target.value)}
            onPressEnter={this.handleSubmitExistCp}
          />
          <div className={rightClasses}>
            <i className={rightIconClasses} />
            <span>此产品验证通过</span>
          </div>
          <div className={errorClasses}>
            <i className={errorIconClasses} />
            <span>此产品验证不通过</span>
          </div>
          <div className={errorEmptyClasses}>
            <i className={errorIconClasses} />
            <span>产品代码不能为空</span>
          </div>
        </Modal>
        <div onClick={this.fakeLogin}><Logo /></div>
        <div className={styles.search}>
          <Search
            orgId={this.orgId}
            queryHotPossibleWds={this.queryHotPossibleWds}
            queryHotWdsData={hotPossibleWdsList}
            push={push}
            searchHistoryVal={searchHistoryVal}
            saveSearchVal={this.handleSaveSearchVal}
            location={location}
            isOnlySearchable
          />
        </div>
        <div className={styles.headerContent}>
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
