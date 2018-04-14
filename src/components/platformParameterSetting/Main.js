/**
 * @Descripter: 平台参数设置MainWrap
 * @Author: K0170179
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Header from './Header';

export default class Main extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    const { children } = this.props;
    return (
      <div>
        <Header />
        {children}
      </div>
    );
  }
}
