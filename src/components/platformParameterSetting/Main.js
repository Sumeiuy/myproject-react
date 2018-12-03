/**
 * @Descripter: 平台参数设置MainWrap
 * @Author: K0170179
 * @Date: 2018/4/12
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import env from '../../helper/env';
import styles from './main.less';

import Header from './Header';

export default class Main extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    menu: PropTypes.array.isRequired,
    matchPath: PropTypes.string.isRequired,
  };

  render() {
    const {
      children,
      menu,
      matchPath,
    } = this.props;
    const isReact = env.isInReact();
    return (
      <div
        className={classnames({
          [styles.reactPadding]: isReact,
        })}
      >
        <Header menu={menu} matchPath={matchPath} />
        {children}
      </div>
    );
  }
}
