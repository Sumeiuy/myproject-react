/**
 * @Author: sunweibin
 * @Date: 2017-11-17 14:38:06
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-05-23 16:49:26
 * @description 新的左侧列表组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import classnames from 'classnames';
import Icon from '../Icon';
import Pagination from '../../common/Pagination';
import styles from './index.less';

export default class ApplicationList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    pagination: PropTypes.object,
    onShrink: PropTypes.func,
    // 是否需要一个fixed的title，不随着列表滚动
    fixedTitle: PropTypes.node,
    // footer是否需要border，默认需要，
    // 本组件复用的，目前任务管理三个视图UI改动，底部不需要border-top
    footerBordered: PropTypes.bool,
  }

  static defaultProps = {
    pagination: null,
    onShrink: _.noop,
    fixedTitle: null,
    footerBordered: true,
  };

  @autobind
  handleShrinkClick() {
    this.props.onShrink();
  }

  render() {
    const {
      renderRow,
      pagination,
      list,
      fixedTitle,
      footerBordered,
    } = this.props;

    if (!list) {
      return null;
    }
    return (
      <div className={styles.pageCommonList}>
        {
          fixedTitle &&
          <div className={styles.fixedTitle}>
            {fixedTitle}
          </div>
        }
        <div className={styles.listScroll}>
          {
            list.map((item, index) => renderRow(item, index))
          }
        </div>
        <div
          className={classnames({
            [styles.listFoot]: true,
            [styles.footerBorder]: footerBordered,
          })}
        >
          {
            _.isEmpty(pagination) ? null
              : (
                <div className={styles.pagination}>
                  <Pagination
                    {...pagination}
                    isShortPageList
                    isHideLastButton
                  />
                </div>
              )
          }
          <div className={styles.shrinkIcon} onClick={this.handleShrinkClick}>
            <Icon type="shouqi1" />
          </div>
        </div>
      </div>
    );
  }
}
