/**
 * @fileOverview pageCommon/BoardSelect.js
 * @author sunweibin
 * @description 看板切换Select
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Dropdown, Menu, Icon, Button } from 'antd';
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
    const { visibleBoards, location: { query: { boardId } } } = this.props;
    const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || '1';
    const boardName = this.findBoardBy(bId).name;
    this.state = {
      dropdownVisible: false,
      boardId: bId,
      boardName,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { query: { boardId: preId } } } = this.props;
    const { visibleBoards, location: { query: { boardId } } } = nextProps;
    if (boardId !== preId) {
      const bId = boardId || (visibleBoards.length && String(visibleBoards[0].id)) || '1';
      const boardName = this.findBoardBy(bId).name;
      this.setState({
        dropdownVisible: false,
        boardId: bId,
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
  hideDropDown() {
    this.setState({
      dropdownVisible: false,
    });
  }
  @autobind
  handleVisibleChange(flag) {
    this.setState({ dropdownVisible: flag });
  }

  @autobind
  handleMenuClick(MenuItem) {
    this.hideDropDown();
    const { push, location: { pathname }, replace } = this.props;
    const { key } = MenuItem;
    if (key === 'boardManage') {
      push('/boardManage');
    } else {
      replace({
        pathname,
        query: {
          boardId: key,
        },
      });
    }
  }

  render() {
    const { visibleBoards } = this.props;
    const { boardId, dropdownVisible, boardName } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[`${boardId}`]}>
        {
          visibleBoards.map(item => (<Menu.Item key={String(item.id)}>{item.name}</Menu.Item>))
        }
        <Menu.Divider />
        <Menu.Item key="boardManage">看板管理</Menu.Item>
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
        <Button>
          {boardName}<Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
