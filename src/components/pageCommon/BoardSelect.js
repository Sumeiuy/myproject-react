/**
 * @fileOverview pageCommon/BoardSelect.js
 * @author sunweibin
 * @description 看板切换Select
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Dropdown, Menu, Icon } from 'antd';
import _ from 'lodash';

import './BoardSelect.less';

export default class BoardSelect extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
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
  findBoardBy(id, vr) {
    const newId = Number.parseInt(id, 10);
    const board = _.find(vr, { id: newId });
    return board || vr[0];
  }

  @autobind
  handleVisibleChange(flag) {
    this.setState({ dropdownVisible: flag });
  }

  @autobind
  handleMenuClick(MenuItem) {
    this.handleVisibleChange(false);
    const { push } = this.props;
    const { key } = MenuItem;
    if (key === '0') {
      push('/boardManage');
    } else {
      push(`/report?boardId=${key}`);
    }
  }

  render() {
    const { visibleBoards } = this.props;
    const { dropdownVisible, boardName } = this.state;
    const menu = (
      <Menu
        onClick={this.handleMenuClick}
        onMouseEnter={this.handleMenuScroll}
        style={{
          width: '200px',
          maxHeight: '400px',
          overflowY: 'scroll',
        }}
      >
        {/* 投顾绩效汇总 */}
        <Menu.Item key="1" title="投顾业绩汇总">投顾业绩汇总</Menu.Item>
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
