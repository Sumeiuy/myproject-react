import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { tabNotUseGlobalBreadcrumb, locationNeedBreadcrumb } from '../../../src/config/tabMenu';
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
    newBreadcrumbRoutes = [
      breadcrumbItem.parent,
      breadcrumbItem,
    ];
  }

  newBreadcrumbRoutes = _.map(newBreadcrumbRoutes, (item) => {
    const matchHistoryItem = _.find(routerHistory, item => item.pathname === item.path);
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
      this.props.push({
        pathname: breadcrumbItem.path,
        query: breadcrumbItem.query,
      });
    }
  }

  renderBreadcrumbItem(breadcrumbItem, index, breadcrumbItemCount) {
    const canClick = breadcrumbItem.type === 'link' && index < (breadcrumbItemCount - 1);
    const breadcrumbItemCls = classnames({
      [styles.breadcrumbItem]: true,
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
          (index < (breadcrumbItemCount - 1)) ?
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
      <div className={styles.breadcrumb}>
        {
          _.map(
            finalBreadcrumbRoutes,
            (item, index) => this.renderBreadcrumbItem(item, index, breadcrumbItemCount))
        }
      </div> : null
    );
  }
}
