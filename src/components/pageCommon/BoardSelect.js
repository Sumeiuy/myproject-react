/**
 * @fileOverview pageCommon/BoardSelect.js
 * @author sunweibin
 * @description 看板切换Select
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Dropdown, Menu, Icon, Button } from 'antd';
import { withRouter, routerRedux } from 'dva/router';
import { connect } from 'react-redux';
import _ from 'lodash';

import './BoardSelect.less';

const boards = [
  {
    boardName: '投顾业绩汇总',
    boardId: '1',
    url: 'invest',
  },
  // {
  //   boardName: '经营业绩汇总',
  //   boardId: '2',
  //   url: 'business',
  // },
];

const mapStateToProps = state => ({
  boards: state.app.boards,
});

const mapDispatchToProps = {
  push: routerRedux.push,
};

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class BoardSelect extends PureComponent {

  static propTypes = {
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    boards: PropTypes.array,
  }

  static defaultProps = {
    boards: [],
  }

  constructor(props) {
    super(props);
    const { location: { query: { boardId } } } = this.props;
    // TODO:此处在后期迭代时需要与后端确认接口以及数据结构
    this.state = {
      boardId: boardId || '1',
    };
  }

  @autobind
  getPopupContainer() {
    return document.querySelector('.reportHeader .reportName');
  }

  @autobind
  handleMenuClick(MenuItem) {
    const { push } = this.props;
    const { key } = MenuItem;
    const path = _.filter(boards, { boardId: key })[0].url;
    // TODO 此处后期迭代中需要做跳转页面逻辑处理
    const url = `/${path}?boardId=${key}`;
    push(url);
  }

  render() {
    const { boardId } = this.state;
    const boardName = _.filter(boards, { boardId })[0].boardName;

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.ItemGroup>
          {
            boards.map(item => (<Menu.Item key={item.boardId}>{item.boardName}</Menu.Item>))
          }
        </Menu.ItemGroup>
        {/* <Menu.Divider /> */}
        {/* <Menu.Item key="default3">看板管理</Menu.Item> */}
      </Menu>
    );


    return (
      <Dropdown
        overlay={menu}
        placement="bottomLeft"
        getPopupContainer={this.getPopupContainer}
      >
        <Button>
          {boardName}<Icon type="down" />
        </Button>
      </Dropdown>
    );
  }
}
