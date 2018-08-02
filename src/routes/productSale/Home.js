/*
 * @Descripter: 产品销售
 * @Author: zhangjun
 * @Date: 2018-08-01 16:03:07
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-01 23:18:12
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import iframePaths from './config';
import styles from './home.less';

@withRouter
export default class ProductSaleHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  render() {
    const { location: { pathname } } = this.props;
    const { iframePath } = _.filter(iframePaths, item => (item.path === pathname))[0];
    return (
      <iframe src={iframePath} className={styles.productSale} frameBorder="no" />
    );
  }
}
