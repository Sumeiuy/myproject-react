/**
 * @Author: sunweibin
 * @Date: 2017-11-17 14:38:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-20 14:46:20
 * @description 新的左侧列表组件
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import _ from 'lodash';

import styles from './index.less';

export default class ApplicationList extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired,
    renderRow: PropTypes.func.isRequired,
    pagination: PropTypes.object,
    queryCustUuid: PropTypes.func.isRequired,
  }

  static defaultProps = {
    pagination: null,
  };

  componentDidMount() {
    const { queryCustUuid } = this.props;
    if (queryCustUuid) {
      queryCustUuid();
    }
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
