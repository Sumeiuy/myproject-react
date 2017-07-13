/**
 * @fileOverview components/pageCommon/scrollBar.js
 * @author hongguangqing
 */

import React, { PropTypes, PureComponent } from 'react';

import styles from './scrollBar.less';

export default class ScrollBar extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
  }

  static defaultProps = {
    location: {},
  }


  render() {
    return (
      <div className={styles.reportScrollBar}>
        <div className={styles.reportScrollBarInner} />
      </div>
    );
  }
}
