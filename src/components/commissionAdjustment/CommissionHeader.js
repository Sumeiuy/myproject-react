/**
 * @description 佣金调整页面的头部
 * @author sunweibin
 */

import React, { PureComponent, PropTypes } from 'react';

// import styles from './CommissionHeader.lessss';

export default class CommissionHeader extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div />
    );
  }
}
