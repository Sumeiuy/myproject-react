/**
 * @description 树形展开
 * @author zhangjunli
 * Usage:
 * <Tree
 *  treeData={object}
 *  onSelect={func}
 * />
 * treeData: 不必须，数据源
 * onSelect：不必须，选中事件
 */
import React, { PropTypes, Component } from 'react';
import { autobind } from 'core-decorators';
import { Menu } from 'antd';
import _ from 'lodash';
import classnames from 'classnames';
import styles from './tree.less';

const SubMenu = Menu.SubMenu;
const NJFGS = 'njfgs';
export default class Tree extends Component {
  static propTypes = {
    treeData: PropTypes.array,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    treeData: [],
    onSelect: () => {},
  }

  constructor(props) {
    super(props);
    const { treeData } = props;
    let menuKeys = [];
    let selectKey = '';
    if (!_.isEmpty(treeData)) {
      const { children, id } = _.head(treeData);
      selectKey = id;
      menuKeys = _.map(children, item => item.id);
    }
    this.state = {
      selectKey,
      openKeys: [],
      menuKeys,
    };
  }

  getHeadLine(obj) {
    let logo = '--';
    let title = '--';
    if (!_.isEmpty(obj)) {
      const { name } = _.head(obj);
      title = name;
      logo = name.substr(0, 1);
    }
    return { title, logo };
  }

  @autobind
  getItem(key) {
    const { treeData } = this.props;
    const { children = [] } = _.head(treeData);
    const keys = _.split(key, '/');
    const select = this.getBranchItem(_.head(treeData), children, keys);
    return select;
  }

  @autobind
  getBranchItem(obj, array, keys) {
    if (_.isEmpty(array) || _.isEmpty(keys)) {
      return obj;
    }
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j];
        if (item.id === key) {
          const { children = [] } = item;
          return this.getBranchItem(
            item,
            children,
            _.slice(keys, Math.min((j + 1), keys.length), keys.length),
          );
        }
      }
    }
    return {};
  }

  @autobind
  handleSubmenuClick(submenu) {
    const { key } = submenu;
    this.setState({ selectKey: key });
    this.props.onSelect(this.getItem(key));
  }

  @autobind
  handleOpenClick(openKeys) {
    const { menuKeys } = this.state;
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (menuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys, selectKey: NJFGS });
      this.props.onSelect(this.getItem(NJFGS));
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
        selectKey: latestOpenKey,
      });
      this.props.onSelect(this.getItem(latestOpenKey));
    }
  }

  @autobind
  renderHeader(obj) {
    const { title, logo } = this.getHeadLine(obj);
    return (
      <div className={styles.header}>
        <div className={styles.logoBg}><div className={styles.logo}>{logo}</div></div>
        <div className={styles.title}>{title}</div>
      </div>
    );
  }

  renderTreeTitle(titleClass, title, isSelectMenu, isSelectSubmenu) {
    return (
      <div
        className={classnames(
          styles.menu,
          { [styles.selectMenu]: isSelectMenu, [styles.selectChild]: isSelectSubmenu },
        )}
      >
        <div className={styles.cycle}>{'财'}</div>
        <div className={titleClass}>{title}</div>
      </div>
    );
  }

  @autobind
  renderTree(paramData) {
    if (_.isEmpty(paramData)) {
      return null;
    }
    const { selectKey } = this.state;
    const keys = _.split(selectKey, '/');
    const isSelectSubmenu = (!_.isEmpty(keys) && keys.length > 1);
    const menuKey = _.head(keys);
    const { children } = _.head(paramData);
    console.log('######renderTree###########', paramData, children);
    return (
      <Menu
        onClick={this.handleSubmenuClick}
        onOpenChange={this.handleOpenClick}
        openKeys={this.state.openKeys}
        style={{ width: '100%' }}
        mode="inline"
      >
        {_.map(
          children,
          center => (
            <SubMenu
              key={center.id}
              title={this.renderTreeTitle(
                styles.centerName,
                center.name,
                (center.id === selectKey),
                (isSelectSubmenu && center.id === menuKey),
              )}
            >
              {_.map(
                center.children,
                team => (
                  <Menu.Item
                    key={`${center.id}/${team.id}`}
                    className={classnames(
                      styles.submenu,
                      { [styles.selectSubmenu]: (`${center.id}/${team.id}` === selectKey) },
                    )}
                  >{team.name}</Menu.Item>
                ),
              )}
            </SubMenu>
          ),
        )}
      </Menu>
    );
  }

  render() {
    const { treeData } = this.props;
    return (
      <div className={styles.treeContainer}>
        {this.renderHeader(treeData)}
        {this.renderTree(treeData)}
      </div>
    );
  }
}
