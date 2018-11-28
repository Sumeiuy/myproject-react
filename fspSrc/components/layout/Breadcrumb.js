import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { Button } from 'antd';
import { logCommon } from '../../../src/decorators/logable';
import {
  tabNotUseGlobalBreadcrumb,
  locationNeedBreadcrumb,
  findParentBreadcrumb,
  getAllBreadcrumbItem,
} from '../../../src/config/tabMenu';

import { sessionStore } from '../../../src/config';

import styles from './breadcrumb.less';

function getFinalBreadcrumbRoutes(location, breadcrumbRoutes, routerHistory) {
  // 对于某些页面不使用公共的面包屑
  const { pathname } = location;
  const notUseGlobalBreadcrumb = _.some(tabNotUseGlobalBreadcrumb, path => pathname.indexOf(path) > -1);
  const breadcrumbItem = _.find(locationNeedBreadcrumb, item => item.path === location.pathname);

  let newBreadcrumbRoutes = [
    ...breadcrumbRoutes,
  ];

  if(breadcrumbItem) {
    newBreadcrumbRoutes = getAllBreadcrumbItem(breadcrumbItem);
  }

  newBreadcrumbRoutes = _.map(newBreadcrumbRoutes, (item) => {
    const matchHistoryItem = _.find(routerHistory, record => record.pathname === item.path);
    if(matchHistoryItem) {
      return {
        ...item,
        query: matchHistoryItem.query,
      };
    }
    return item;
  });

  return notUseGlobalBreadcrumb ? []: newBreadcrumbRoutes;
}

export default class Breadcrumb extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 从菜单获取的初始面包屑
    breadcrumbRoutes: PropTypes.array.isRequired,
    // 用户浏览记录
    routerHistory: PropTypes.array.isRequired,
    push: PropTypes.func.isRequired
  }

  @autobind
  handleBreadcrumbItemClick(breadcrumbItem, canClick) {
    if(canClick) {
      logCommon({
        type: 'NavClick',
        payload: {
          name: '面包屑',
          value: breadcrumbItem.path,
          url: breadcrumbItem.path,
        },
      });
      // 客户管理菜单上有权限判断, 必须设置?source=leftMenu
      const currentQuery =
        _.isEmpty(breadcrumbItem.query) ? { source: 'leftMenu' } : breadcrumbItem.query;

      this.props.push({
        pathname: breadcrumbItem.path,
        query: breadcrumbItem.path === '/customerPool/list' ? currentQuery: breadcrumbItem.query,
      });
    }
  }

  @autobind
  handleBtnClick() {
    logCommon({
      type: 'NavClick',
      payload: {
        name: '客户360切换回新版',
        value: '/customerPool/list/detail',
      },
    });
    this.props.push({
      pathname: '/fsp/customerCenter/customer360',
      state: this.props.location.state || sessionStore.get('jspState'),
    });
  }

  renderBreadcrumbItem(breadcrumbItem, index, breadcrumbItemCount) {
    const { location: { pathname } } = this.props;
    const canClick = breadcrumbItem.type === 'link' && index < (breadcrumbItemCount - 1);
    const shouldrenderDivider = findParentBreadcrumb(locationNeedBreadcrumb, pathname);
    const breadcrumbItemCls = classnames({
      [styles.breadcrumbItem]: true,
      [styles.lastBreadcrumbItem]: index === (breadcrumbItemCount - 1),
      [styles.canClick]: canClick,
    });
    return (
      <div
        key={breadcrumbItem.name}
        className={breadcrumbItemCls}
      >
        <span
          className={styles.breadcrumbName}
          onClick={() => this.handleBreadcrumbItemClick(breadcrumbItem, canClick)}
        >{breadcrumbItem.name}</span>
        {
          (index < (breadcrumbItemCount - 1) || shouldrenderDivider) ?
          <span className={styles.breadcrumbDivide}>/</span> : null
        }
      </div>
    );
  }

  render() {
    const {
      location,
      breadcrumbRoutes,
      routerHistory,
    } = this.props;

    const finalBreadcrumbRoutes =
      getFinalBreadcrumbRoutes(location, breadcrumbRoutes, routerHistory);

    const breadcrumbItemCount = finalBreadcrumbRoutes.length;

    return (
      !_.isEmpty(finalBreadcrumbRoutes) ?
      <div className={styles.breadcrumbContainer}>
        <div className={styles.breadcrumb}>
          {
            _.map(
              finalBreadcrumbRoutes,
              (item, index) => this.renderBreadcrumbItem(item, index, breadcrumbItemCount))
          }
        </div>
        {
          location.pathname === '/fsp/customerPool/list/customerDetail' ?
            <div className={styles.actionBtn}>
              <Button ghost type="primary" onClick={this.handleBtnClick}>
                回到新版
              </Button>
            </div> : null
        }
      </div> : null
    );
  }
}
