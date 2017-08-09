/**
 * @fileOverview pageCommon/BoardSelect.js
 * @author sunweibin
 * @description 看板切换Select
 */
import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Dropdown, Menu, Icon } from 'antd';
import _ from 'lodash';

// import Scroll from '../common/Scroll';
import { constants, BoardBasic, optionsMap } from '../../config';
import { canCustomBoard } from '../../permissions';
import './BoardSelect.less';

const defaultBoardId = constants.boardId;
const sliceLength = BoardBasic.regular.length;
const visibleBoardType = optionsMap.visibleBoardType;
const SubMenu = Menu.SubMenu;
// const defaultBoardType = constants.boardType;

export default class BoardSelect extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    visibleBoards: PropTypes.array.isRequired,
    newVisibleBoards: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const { visibleBoards, location: { query: { boardId }, pathname } } = this.props;
    const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || defaultBoardId;
    let boardName = visibleBoardType.manage.name;
    if (pathname !== '/boardManage') {
      boardName = this.findBoardBy(bId, visibleBoards).name;
    }
    this.state = {
      dropdownVisible: false,
      boardName,
      hasRegisterWheel: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visibleBoards, location: { query: { boardId } } } = nextProps;
    const { visibleBoards: preVB, location: { query: { boardId: preId } } } = this.props;
    if (!_.isEqual(visibleBoards, preVB) || !_.isEqual(boardId, preId)) {
      const bId = boardId
        || (visibleBoards.length && String(visibleBoards[0].id))
        || defaultBoardId;
      const boardName = this.findBoardBy(bId, visibleBoards).name;
      this.setState({
        boardName,
      });
    }
  }

  @autobind
  getPopupContainer() {
    return document.querySelector('.reportHeader .reportName');
  }

  @autobind
  getScrollRef() {
    const scrollBd = document.querySelector('.reportName .ant-dropdown-menu');
    return scrollBd;
  }

  @autobind
  stopSpread(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
    // e.nativeEvent.stopImmediatePropagation();
  }

  @autobind
  registerScrollEvent() {
    this.setState({
      hasRegisterWheel: true,
    });
    const scrollBd = this.getScrollRef();
    scrollBd.addEventListener('wheel', this.stopSpread, false);
    scrollBd.addEventListener('mousewheel', this.stopSpread, false);
    scrollBd.addEventListener('DOMMouseScroll', this.stopSpread, false);
  }


  @autobind
  findBoardBy(id, vr) {
    const newId = Number.parseInt(id, 10);
    let board = _.find(vr, { id: newId });
    const { location: { pathname } } = this.props;
    if (pathname === '/boardManage') {
      board = {
        name: visibleBoardType.manage.name,
      };
    }
    return board || vr[0];
  }

  @autobind
  handleVisibleChange(flag) {
    this.setState({ dropdownVisible: flag });
    const { hasRegisterWheel } = this.state;
    if (flag) {
      if (!hasRegisterWheel) {
        this.registerScrollEvent();
      }
    }
  }

  @autobind
  handleMenuClick(MenuItem) {
    this.handleVisibleChange(false);
    const { push, collectData } = this.props;
    const { key, item: { props: { type, boardType } } } = MenuItem;
    const { visibleBoards } = this.props;
    let boardname;
    switch (type) {
      case visibleBoardType.manage.key:
        collectData({
          text: '看板管理',
        });
        push('/boardManage');
        break;
      case visibleBoardType.ordinary.key:
        boardname = _.find(visibleBoards, { id: Number(key) }).name;
        collectData({
          text: boardname,
        });
        push(`/report?boardId=${key}`);
        break;
      case visibleBoardType.history.key:
        boardname = _.find(visibleBoards, { id: Number(key) }).name;
        collectData({
          text: boardname,
        });
        push(`/history?boardId=${key}&boardType=${boardType}`);
        break;
      default:
        break;
    }
  }

  render() {
    const { newVisibleBoards } = this.props;
    const { dropdownVisible, boardName } = this.state;

    const staticBorads = _.slice(newVisibleBoards, [0], [sliceLength]);
    const ordinaryStaticBoards = _.slice(staticBorads, 0, 2);
    const historyStaticBoards = _.slice(staticBorads, 2, 4);
    const lastVisibleBoards = newVisibleBoards[newVisibleBoards.length - 1];
    const menu = (
      <Menu
        onClick={this.handleMenuClick}
      >
        {
          ordinaryStaticBoards.map(item =>
            (<Menu.Item
              key={String(item.id)}
              type={visibleBoardType.ordinary.key}
              title={item.name}
            >
              {item.name}
            </Menu.Item>),
          )
        }
        {
          historyStaticBoards.map(item =>
            (<Menu.Item
              key={String(item.id)}
              type={visibleBoardType.history.key}
              boardType={item.boardType}
              title={item.name}
            >
              {item.name}
            </Menu.Item>),
          )
        }
        {
          lastVisibleBoards.ordinary.map(item =>
            (<Menu.Item
              key={String(item.id)}
              type={visibleBoardType.ordinary.key}
              title={item.name}
            >
              {item.name}
            </Menu.Item>),
          )
        }
        <Menu.Divider />
        <SubMenu
          title="自定义看板"
          style={{
            maxHeight: '400px',
            overflowY: 'scroll',
          }}
        >
          {
            lastVisibleBoards.history.map(item =>
              (<Menu.Item
                key={String(item.id)}
                type={visibleBoardType.history.key}
                boardType={item.boardType}
                title={item.name}
              >
                {item.name}
              </Menu.Item>),
            )
          }
        </SubMenu>
        <Menu.Divider />
        { canCustomBoard() ? (
          <Menu.Item
            key="0"
            type={visibleBoardType.manage.key}
          >
            {visibleBoardType.manage.name}
          </Menu.Item>
        ) : null }
      </Menu>
    );

    return (
      <Dropdown
        overlay={menu}
        placement="bottomLeft"
        getPopupContainer={this.getPopupContainer}
        visible={dropdownVisible}
        onVisibleChange={this.handleVisibleChange}
      >
        <div className="selfDropDownName">
          {boardName}<Icon type="down" />
        </div>
      </Dropdown>
    );
  }
}
