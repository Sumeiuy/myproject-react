/**
 * @file components/layout/Tab.js
 *  切换切换用tab,具体展示的页面使用路由控制
 * @author zhufeiyang
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Tabs } from 'antd';
import localStorage from 'store';
import Loading from '../../layouts/Loading';
import menuConfig, { getDefaultMenus } from '../../../src/config/tabMenu';
import withRouter from '../../../src/decorators/withRouter';

const TabPane = Tabs.TabPane;

function preProcess(config, parentPath = '/', result = {}) {
  for (let i = 0, len = config.length; i < len; i++) {
    const item = config[i];
    const path = parentPath + item.path;
    result[path] = { ...item, path }; // eslint-disable-line
    if (item.child) {
      preProcess(item.child, `${path}/`, result);
    }
  }
  return result;
}

const TAB_CONFIG = preProcess(menuConfig);

// 包装当前路由内容到Loading组件内
// 对fsp页面进行去loading处理
function FspUnwrap(key = 'react', activeKey = 'react', { children, loading, loadingForceFull }) {
  if (key === activeKey) {
    if (key.indexOf('fsp') === -1) {
      return (
        <div>
          <Loading loading={loading} forceFull={loadingForceFull} />
          {children}
        </div>
      );
    }
    return (
      <div>{children}</div>
    );
  }

  return null;
}

FspUnwrap.propTypes = {
  key: PropTypes.string.isRequired,
  activeKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingForceFull: PropTypes.bool.isRequired,
};

const defaultMenus = getDefaultMenus();

const indexPaneKey = defaultMenus[0].key;

function getDefaultPanes() {
  return defaultMenus.map(menu => ({
    ...menu,
    closable: false,
    path: `/${menu.key}`,
  }));
}

function isPaneInArray(panes, paneArray) {
  return panes.length !== 0 ?
    _.some(paneArray, pane => pane.key === panes[0].key) : false;
}

function getFinalPanes(panes, addPanes = [], removePanes = []) {
  const filterPanes = panes.filter(pane => !_.find(removePanes, key => key === pane.key));
  const paneArray = addPanes.filter(pane => !_.find(panes, tabPane => tabPane.key === pane.key));
  return [
    ...filterPanes,
    ...paneArray,
  ];
}

@withRouter
export default class Tab extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    isBlockRemovePane: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    const { location: { pathname, query } } = props;
    // 根据当前路由找到的tab配置
    const config = this.getConfig(pathname);

    /**
     * 这里获取到的location对应的pane配置只可能是0或者1个
     * 这也是后面在判断本地是否有location对应的pane时，直接取panes[0]的原因
     */
    let panes = this.getPanesWithPathname(pathname, query);
    const localPanes = localStorage.get('panes');
    const isPaneInLocal = isPaneInArray(panes, localPanes);
    const isDefaultpane = isPaneInArray(panes, defaultMenus);
    // 默认tab必须得出现
    if (!isDefaultpane && isPaneInLocal) {
      panes = [
        ...localPanes,
      ];
    } else if (!isDefaultpane) {
      panes = [
        ...getDefaultPanes(),
        ...panes,
      ];
    } else if (isDefaultpane) {
      panes = getDefaultPanes();
    }

    this.state = {
      panes,
      activeKey: config.key || indexPaneKey,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { location: { pathname, query, state } } = nextProps;
    const { activeKey, addPanes, removePanes, shouldRemove, shouldStay } = state || {};
    if (!shouldStay) {
      if (pathname !== this.props.location.pathname) {
        const config = this.getConfig(pathname);
        let panes = this.getPanesWithPathname(pathname, query, shouldRemove);
        if (addPanes || removePanes) {
          panes = getFinalPanes(panes, addPanes, removePanes);
        }
        localStorage.set('panes', panes);
        this.setState({
          panes,
          activeKey: activeKey || config.key,
        });
      }
    }
  }

  @autobind
  onChange(activeKey) {
    const { push } = this.props;
    const { panes } = this.state;
    const pane = panes.find(item => item.key === activeKey);
    // 调用push时同时传递pathname，query
    push({
      pathname: pane.path,
      query: pane.query,
    });
  }


  @autobind
  onEdit(targetKey, action) {
    this[action](targetKey);
  }

   // 工具方法
  getConfig(pathname) {
    let path = pathname;
    while (path) {
      const config = TAB_CONFIG[path];
      if (config) {
        return config;
      }
      path = path.slice(0, path.lastIndexOf('/'));
    }
    return TAB_CONFIG[pathname] || {};
  }

  getPanesWithPathname(pathname, query, shouldRemove = false) {
    let { panes = [] } = this.state || {};
    const { activeKey = '' } = this.state || {};
    if (shouldRemove) {
      panes = panes.filter(pane => pane.key !== activeKey);
    }
    const paneConf = this.getConfig(pathname);
    if (!_.isEmpty(paneConf)) {
      const isExists = panes.find(item => item.key === paneConf.key);
      paneConf.query = query;
      if (!isExists) {
        panes.push(paneConf);
      } else {
        panes.map((pane) => {
          if (pane.key === paneConf.key) {
            return paneConf;
          }
          return pane;
        });
      }
    }
    return panes;
  }

  @autobind
  remove(targetKey) {
    const { push, isBlockRemovePane } = this.props;
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    const lastIndex = panes.length - 1;
    const pane = panes[lastIndex];

    if (isBlockRemovePane) {
      const shouldJumpPane = window.confirm(`请确定你要跳转到 ${pane.path}，未保存的数据会丢失!`); // eslint-disable-line
      if (shouldJumpPane) {
        this.setState(
          { panes },
          () => {
            push({
              pathname: pane.path,
              query: pane.query,
            });
          },
        );
      }
    } else {
      this.setState(
        { panes },
        () => {
          push({
            pathname: pane.path,
            query: pane.query,
          });
        },
      );
    }
  }

  @autobind
  renderTabPane(pane) {
    const { name, key, closable } = pane;
    const { activeKey } = this.state;
    return (
      <TabPane
        tab={name}
        key={key}
        closable={closable}
        id="container"
      >
        {
          FspUnwrap(key, activeKey, this.props)
        }
      </TabPane>
    );
  }

  render() {
    const { activeKey, panes } = this.state;
    return (
      <Tabs
        hideAdd
        onChange={this.onChange}
        activeKey={activeKey}
        onEdit={this.onEdit}
        type="editable-card"
      >
        {_.isEmpty(panes) ? FspUnwrap('react', 'react', this.props) : panes.map(this.renderTabPane)}
      </Tabs>
    );
  }
}
