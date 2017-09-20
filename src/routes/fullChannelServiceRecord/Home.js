import React, { PureComponent } from 'react';

import Search from '../../components/customerPool/home/Search';
import styles from './home.less';

export default class Home extends PureComponent {
  render() {
    return (
      <div className={styles.serviceRecord}>
        <div className={styles.searchBox}>
          <Search />
        </div>
        <div className={styles.filterBox} />
        <div className={styles.listBox} />
      </div>
    );
  }
}
