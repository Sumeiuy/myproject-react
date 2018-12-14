/**
 * @Author: sunweibin
 * @Date: 2018-01-04 15:29:15
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-30 14:28:21
 * @description 新头部导航
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
  Menu,
  Dropdown,
  Input,
  Modal,
  Button
} from 'antd';
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
import EnvironmentalInfo from '../../src/components/environmentalInfo/EnvironmentalInfoModal';
import { logCommon, logPV } from '../../src/decorators/logable';

// 首页执行者视图首次引导提示第十步的dom的id名称(我要提问)
const NEW_HOME_INTRO_TENTH_SEEP_IDNAME = 'homePageIntroTenthStep';
// 首页执行者视图首次引导提示第十一步的dom的id名称(常用工具)
export const NEW_HOME_INTRO_ELEVENTH_SEEP_IDNAME = 'homePageIntroEleventhStep';

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
    empPostnList: PropTypes.array.isRequired,
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
      // 环境信息modal是否可见
      environmentalInfoVisible: false,
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

  getCurrentId(menu) {
    if (menu.name === '问题反馈') {
      return NEW_HOME_INTRO_TENTH_SEEP_IDNAME;
    }
    if (menu.name === '常用工具') {
      return NEW_HOME_INTRO_ELEVENTH_SEEP_IDNAME;
    }
    return '';
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
          className={styles.menuItem}
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
    const filterMenu = _.filter(secondaryMenu,
      menu => menu.name === '移动版'
        || (!_.isEmpty(menu.children))
        || (!!menu.path));

    let feedbackMenu = _.find(filterMenu, menu => menu.name === '问题反馈') || {};

    if (_.find(feedbackMenu.children, menu => menu.name === '反馈管理')) {
      feedbackMenu = _.filter(feedbackMenu.children, menu => menu.name !== '反馈记录');
      return _.map(filterMenu, (menu) => {
        const newMenu = menu;
        if (menu.name === '问题反馈') {
          newMenu.children = feedbackMenu;
        }
        return newMenu;
      });
    }
    return filterMenu;
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
      logCommon({
        type: 'NavClick',
        payload: {
          name: '次级导航',
          value: externUrl,
          url: externUrl,
        },
      });
      window.open(externUrl, '_blank');
    } else if (menuItem.action === 'loadInModal') {
      if (menuItem.name === '我要反馈') {
        this.handleFeedbackClick();
      }
      this.handleShowDialog(menuItem);
    } else if (menuItem.path !== location.pathname) {
      logCommon({
        type: 'NavClick',
        payload: {
          name: '次级导航',
          value: menuItem.path,
          url: menuItem.path,
        },
      });
      push({
        pathname: menuItem.path,
        query: menuItem.query,
        state: {
          url: menuItem && menuItem.url,
        },
      });
    }
  }

  @autobind
  handleInputChange(value) {
    this.setState({
      stockCode: _.trim(value),
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
    // 点击环境信息
    if (menuItem.name === '环境信息') {
      this.handleEnvironmentalInfoModalShow();
    }
  }

  // 环境信息弹窗
  @autobind
  @logPV({
    pathname: '',
    title: '环境信息弹窗',
  })
  handleEnvironmentalInfoModalShow() {
    this.setState({
      environmentalInfoVisible: true,
    });
  }

  @autobind
  @logPV({
    pathname: '',
    title: '隔离墙弹框',
  })
  handleIsolationWallModalShow() {
    this.setState({
      isolationWallModalVisible: true,
    });
  }

  @autobind
  @logPV({
    pathname: '',
    title: '关闭隔离墙弹框',
  })
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
        { isFullUrl: true })
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
  @logPV({
    pathname: '',
    title: '我要反馈弹框',
  })
  handleFeedbackClick() {
    if (!$('#feedback-module')[0]) {
      window.handleFeedbackBtnClick();
    }
  }

  // 环境信息弹窗点击关闭
  @autobind
  @logPV({
    pathname: '',
    title: '关闭环境信息弹框',
  })
  handleEnvironmentalInfoHide() {
    this.setState({
      environmentalInfoVisible: false,
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
                  { menu.name === '问题反馈' ? <i className={styles.feedbackIcon} /> : null}
                  <span id={this.getCurrentId(menu)}>{menu.name}</span>
                </span>
                {
                  (index !== fixSecondaryMenu.length - 1)
                    ? <span className={styles.splitLine} /> : null
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
              (index !== fixSecondaryMenu.length - 1)
                ? <span className={styles.splitLine} />
                : null
            }
          </div>
        );
      }));
  }

  render() {
    const {
      empPostnList,
      empInfo,
      secondaryMenu,
      empCurrentPosition,
      push,
      hotPossibleWdsList,
      searchHistoryVal,
      location,
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
      <div className={styles.fspHeaderContainer}>
        <div className={styles.fspHeader}>
          <EnvironmentalInfo
            handleEnvironmentalInfoHide={this.handleEnvironmentalInfoHide}
            environmentalInfoVisible={this.state.environmentalInfoVisible}
          />
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
              value={this.state.stockCode}
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
          <div><Logo /></div>
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
              !_.isEmpty(secondaryMenu) ? this.renderSecondaryMenu(secondaryMenu) : null
            }
            {
              (!_.isEmpty(empPostnList))
                ? (
                  <EmpRsp
                    empPostnList={empPostnList}
                    empCurrentPosition={empCurrentPosition}
                    empInfo={empInfo}
                    onSwitchRsp={this.handleSwitchRsp}
                  />
                ) : null
            }
          </div>
        </div>
      </div>
    );
  }
}
