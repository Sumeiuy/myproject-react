/**
 * @Author: sunweibin
 * @Date: 2017-11-17 14:38:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-01-30 15:25:40
 * @description 新的左侧列表组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { Icon } from 'antd';
import Pagination from '../../common/Pagination';

import styles from './index.less';

export default class ApplicationList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    pagination: PropTypes.object,
    onShrink: PropTypes.func,
  }

  static defaultProps = {
    pagination: null,
    onShrink: _.noop,
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
    } = this.props;

    if (!list) {
      return null;
    }
    return (
      <div className={styles.pageCommonList}>
        <div className={styles.listScroll}>
          {
            list.map((item, index) => renderRow(item, index))
          }
        </div>
        <div className={styles.listFoot}>
          {
            _.isEmpty(pagination) ? null
            : (
              <div className={styles.pagination}>
                <Pagination {...pagination} />
              </div>
            )
          }
          <div className={styles.shrinkIcon} onClick={this.handleShrinkClick}>
            <Icon type="double-left" />
          </div>
        </div>
      </div>
    );
  }
}
