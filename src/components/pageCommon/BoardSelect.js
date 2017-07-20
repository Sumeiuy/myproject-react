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
import './BoardSelect.less';

export default class BoardSelect extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
    collectData: PropTypes.func.isRequired,
    visibleBoards: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    const { visibleBoards, location: { query: { boardId }, pathname } } = this.props;
    const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || '1';
    let boardName = '看板管理';
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
      const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || '1';
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
  stopSpread(e = window.event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  @autobind
  registerScrollEvent() {
    this.setState({
      hasRegisterWheel: true,
    });
    const scrollBd = this.getScrollRef();
    // const scrollInstance = new Scroll(scrollBd);
    // return scrollInstance;
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
        name: '看板管理',
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
    const { key } = MenuItem;
    // 当点击的是看板管理选项的时候
    if (key === '0') {
      collectData({
        text: '看板管理',
      });
      push('/boardManage');
    } else {
      const { visibleBoards } = this.props;
      const boardname = _.find(visibleBoards, { id: Number(key) }).name;
      collectData({
        text: boardname,
      });
      push(`/report?boardId=${key}`);
    }
  }

  render() {
    const { visibleBoards } = this.props;
    const { dropdownVisible, boardName } = this.state;
    const menu = (
      <Menu
        onClick={this.handleMenuClick}
        style={{
          width: '200px',
          maxHeight: '400px',
          overflowY: 'scroll',
        }}
      >
        {
          visibleBoards.map(item =>
            (<Menu.Item key={String(item.id)} title={item.name}>{item.name}</Menu.Item>),
          )
        }
        <Menu.Divider />
        <Menu.Item key="0">看板管理</Menu.Item>
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
