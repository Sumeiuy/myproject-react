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

import './BoardSelect.less';

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
    selectDefault: PropTypes.string.isRequired,
    push: PropTypes.func.isRequired,
    boards: PropTypes.array,
  }

  static defaultProps = {
    boards: [],
  }

  constructor(props) {
    super(props);
    // const { location: { query: { boradId } } } = this.props;
    // TODO:此处在后期迭代时需要与后端确认接口以及数据结构
    const { selectDefault } = this.props;
    let initialBoardName = '';
    if (selectDefault === 'invest') {
      initialBoardName = '投顾业绩汇总';
    } else if (selectDefault === 'business') {
      initialBoardName = '经营业绩汇总';
    }
    this.state = {
      boardName: initialBoardName,
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
    console.log('handleMenuClick>>key>>', key);
    // TODO 此处后期迭代中需要做跳转页面逻辑处理
    const url = `/${key}`;
    push(url);
  }

  render() {
    const { boardName } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.ItemGroup>
          <Menu.Item key="invest">投顾业绩汇总</Menu.Item>
          <Menu.Item key="business">经营业绩汇总</Menu.Item>
        </Menu.ItemGroup>
        <Menu.Divider />
        <Menu.Item key="default3">看板管理</Menu.Item>
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
