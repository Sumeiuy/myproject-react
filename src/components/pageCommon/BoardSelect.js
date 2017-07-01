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
      boardName = this.findBoardBy(bId).name;
    }
    this.state = {
      dropdownVisible: false,
      boardName,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: { boardId: preId } } } = this.props;
    const { visibleBoards, location: { query: { boardId } } } = nextProps;
    if (Number(boardId || '1') !== Number(preId || '1')) {
      const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || '1';
      const boardName = this.findBoardBy(bId).name;
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
  findBoardBy(id) {
    const { visibleBoards } = this.props;
    const newId = Number.parseInt(id, 10);
    const board = _.find(visibleBoards, { id: newId });
    return board || visibleBoards[0];
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
      <Menu onClick={this.handleMenuClick}>
        {
          visibleBoards.map(item => (<Menu.Item key={String(item.id)}>{item.name}</Menu.Item>))
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
