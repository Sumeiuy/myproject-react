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
export default class Tree extends Component {
  static propTypes = {
    treeData: PropTypes.array,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    treeData: [],
    onSelect: () => {},
    selectKey: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      defultKey: '',
      selectKey: '',
      openKeys: [],
      menuKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { treeData, onSelect } = nextProps;
    if (this.props.treeData === treeData) {
      return;
    }
    // 更新数据
    const { selectKey, defultKey } = this.state;
    if (!_.isEmpty(treeData)) {
      const { children, id } = _.head(treeData);
      const menuKeys = _.map(children, item => item.id);
      if (_.isEmpty(selectKey) && _.isEmpty(defultKey)) {
        this.setState(
          { menuKeys, selectKey: id, defultKey: id },
          () => { onSelect(this.getItem(id)); },
        );
      } else {
        this.setState({ menuKeys });
      }
    }
  }

  getHeadLine(obj) {
    const { name = '', id = '' } = _.head(obj) || {};
    if (!_.isEmpty(name)) {
      return { title: name, logo: name.substr(0, 1), id };
    }
    return { id };
  }

  @autobind
  getItem(key) {
    const { treeData } = this.props;
    const { id } = _.head(treeData);
    if (key === id) {
      return _.head(treeData);
    }
    const keys = _.split(key, '/');
    const select = this.getBranchItem(_.head(treeData), keys);
    return select;
  }

  @autobind
  getBranchItem(list, keys) {
    const branchItem = _.find(list.children, item => item.id === keys[0]);
    if (keys.length === 1) {
      return branchItem;
    }
    return this.getBranchItem(branchItem, keys.slice(1));
  }

  @autobind
  handleSubmenuClick(submenu) {
    const { key } = submenu;
    const { selectKey } = this.state;
    // 去重
    if (selectKey !== key) {
      this.setState(
        { selectKey: key },
        () => { this.props.onSelect(this.getItem(key)); },
      );
    }
  }

  @autobind
  handleOpenClick(openKeys) {
    const { menuKeys, selectKey } = this.state;
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (menuKeys.indexOf(latestOpenKey) === -1) {
      // 点击菜单
      if (_.isEmpty(openKeys)) {
        const keys = _.split(selectKey, '/');
        const curKey = _.head(keys);
        this.setState(
          { openKeys, selectKey: curKey },
          () => {
            // 去重
            if (keys.length > 1) {
              this.props.onSelect(this.getItem(curKey));
            }
          },
        );
      }
    } else {
      this.setState(
        { openKeys: latestOpenKey ? [latestOpenKey] : [], selectKey: latestOpenKey },
        () => {
          // 去重
          if (selectKey !== latestOpenKey) {
            this.props.onSelect(this.getItem(latestOpenKey));
          }
        },
      );
    }
  }

  @autobind
  handleLogoClick(logoKey) {
    const { selectKey } = this.state;
    // 去重
    if (logoKey !== selectKey) {
      this.setState(
        { openKeys: [], selectKey: logoKey },
        () => { this.props.onSelect(this.getItem(logoKey)); },
      );
    }
  }

  @autobind
  renderHeader(obj) {
    const { title = '--', logo = '--', id = '' } = this.getHeadLine(obj);
    return (
      <div className={styles.header}>
        <div className={styles.logoBg}>
          <div className={styles.logo} onClick={() => { this.handleLogoClick(id); }}>{logo}</div>
        </div>
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
    const { selectKey, openKeys } = this.state;
    const keys = _.split(selectKey, '/');
    const isSelectSubmenu = (!_.isEmpty(keys) && keys.length > 1);
    const menuKey = _.head(keys);
    const { children } = _.head(paramData);
    return (
      <Menu
        onClick={this.handleSubmenuClick}
        onOpenChange={this.handleOpenClick}
        openKeys={openKeys}
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
    const screenHeight = document.documentElement.clientHeight;
    const style = { height: `${(screenHeight - 109)}px` };
    return (
      <div className={styles.treeContainer} style={style}>
        {this.renderHeader(treeData)}
        {this.renderTree(treeData)}
      </div>
    );
  }
}
