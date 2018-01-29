/**
 * @Author: sunweibin
 * @Date: 2017-11-17 14:38:06
 * @Last Modified by: zhushengnan
 * @Last Modified time: 2018-01-04 14:06:18
 * @description 新的左侧列表组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Pagination from '../../common/Pagination';

import styles from './index.less';

export default class ApplicationList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    pagination: PropTypes.object,
  }

  static defaultProps = {
    pagination: null,
  };

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
        {
          _.isEmpty(pagination) ? null
          : (
            <div className={styles.pagination}>
              <Pagination {...pagination} />
            </div>
          )
        }
      </div>
    );
  }
}
