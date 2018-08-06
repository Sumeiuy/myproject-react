/*
 * @Descripter: 产品销售
 * @Author: zhangjun
 * @Date: 2018-08-01 16:03:07
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-08-03 11:53:16
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import withRouter from '../../decorators/withRouter';
import Loading from '../../layouts/Loading';
import iframePaths from './config';
import styles from './home.less';

@withRouter
export default class ProductSaleHome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  @autobind
  handleLoad() {
    this.setState({ loading: false });
  }
  render() {
    const { location: { pathname } } = this.props;
    const { loading } = this.state;
    const { iframePath } = _.filter(iframePaths, item => (item.path === pathname))[0];
    return (
      <div className={styles.productSaleWrapper}>
        <Loading loading={loading} />
        <iframe src={iframePath} className={styles.productSale} onLoad={this.handleLoad} frameBorder="no" />
      </div>
    );
  }
}
