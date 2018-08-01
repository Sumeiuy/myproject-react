/*
 * @Descripter: 产品销售
 * @Author: zhangjun
 * @Date: 2018-08-01 16:03:07
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-01 17:21:39
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import withRouter from '../../decorators/withRouter';
import { iframe } from './config';
import styles from './home.less';

@withRouter
export default class productSale extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  render() {
    const { location: { pathname } } = this.props;
    const { iframePath } = _.filter(iframe, item => (item.path === pathname));
    return (
      <iframe src={iframePath} className={styles.productSale} frameBorder="no" />
    );
  }
}
