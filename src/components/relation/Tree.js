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
const data = {
  njfgs: {
    name: '南京分公司',
    id: 'njfgs',
    branchCenter: [{
      name: '财富中心1',
      id: '1',
      branchTeam: [{
        name: '张三团队',
        id: '1',
      }, {
        name: '李四团队',
        id: '2',
      }],
    }, {
      name: '财富中心2',
      id: '2',
      branchTeam: [{
        name: '马六团队',
        id: '3',
      }, {
        name: '玄武团队',
        id: '4',
      }],
    }, {
      name: '财富中心3',
      id: '3',
      branchTeam: [{
        name: '李逵团队',
        id: '5',
      }, {
        name: '镇江团队',
        id: '6',
      }],
    }],
  },
};

export default class Tree extends Component {
  static propTypes = {
    treeData: PropTypes.object,
    onSelect: PropTypes.func,
  }

  static defaultProps = {
    treeData: data,
    onSelect: () => {},
  }

  constructor(props) {
    super(props);
    const { treeData } = props;
    let menuKeys = [];
    if (!_.isEmpty(treeData) && !_.isEmpty(treeData[NJFGS])) {
      const { branchCenter } = treeData[NJFGS];
      menuKeys = _.map(branchCenter, item => item.id);
    }
    this.state = {
      selectKey: '1',
      openKeys: [_.head(menuKeys)],
      menuKeys,
    };
  }

  getHeadLine(obj) {
    let logo = '--';
    let title = '--';
    if (!_.isEmpty(obj)) {
      const { name } = obj[NJFGS];
      title = name;
      logo = name.substr(0, 1);
    }
    return { title, logo };
  }

  @autobind
  handleSubmenuClick(submenu) {
    const { key } = submenu;
    this.setState({ selectKey: key });
  }

  @autobind
  handleOpenClick(openKeys) {
    const { menuKeys, selectKey } = this.state;
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (menuKeys.indexOf(latestOpenKey) === -1) {
      const keys = _.split(selectKey, '/');
      this.setState({ openKeys, selectKey: _.head(keys) });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
        selectKey: latestOpenKey,
      });
    }
  }

  @autobind
  renderHeader(obj) {
    const { title, logo } = this.getHeadLine(obj);
    return (
      <div className={styles.header}>
        <div className={styles.logo}>{logo}</div>
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
  renderTree(obj) {
    if (_.isEmpty(obj)) {
      return null;
    }
    const { selectKey } = this.state;
    const keys = _.split(selectKey, '/');
    const isSelectSubmenu = (!_.isEmpty(keys) && keys.length > 1);
    const menuKey = _.head(keys);
    const { branchCenter } = obj[NJFGS];
    return (
      <Menu
        onClick={this.handleSubmenuClick}
        onOpenChange={this.handleOpenClick}
        openKeys={this.state.openKeys}
        style={{ width: '100%' }}
        mode="inline"
      >
        {_.map(
          branchCenter,
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
                center.branchTeam,
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
