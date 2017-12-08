/**
 * @file components/commissionAdjustment/BatchCommission.js
 * @description 批量佣金调整新建页面
 * @author sunweibin
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';


export default class BatchCommission extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
  }

  static defaultProps = {
    name: '',
  }

  render() {
    return (
      <div />
    );
  }
}
