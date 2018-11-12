import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { tabNotUseGlobalBreadcrumb } from '../../../src/config/tabMenu';
import styles from './breadcrumb.less';

function getFinalBreadcrumbRoutes(location, breadcrumbRoutes, routerHistory) {
  // 对于某些页面不使用公共的面包屑
  const { pathname } = location;
  const notUseGlobalBreadcrumb = _.some(tabNotUseGlobalBreadcrumb, path => pathname.indexOf(path) > -1);
  return notUseGlobalBreadcrumb ? []: breadcrumbRoutes;
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

  renderBreadcrumbItem(breadcrumbItem, index, breadcrumbItemCount) {

    const breadcrumbItemCls = classnames({
      [styles.breadcrumbItem]: true,
      [styles.canClick]: breadcrumbItem.type === 'link' && index < (breadcrumbItemCount - 1),
    });

    return (
      <div
        key={breadcrumbItem.index}
        className={breadcrumbItemCls}
      >
        <span className={styles.breadcrumbName}>{breadcrumbItem.name}</span>
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
