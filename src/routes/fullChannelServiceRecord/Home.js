import React, { PureComponent } from 'react';

// import Search from '../../components/fullChannelServiceRecord/Search';
import styles from './home.less';

// const searchName = 'fullChannelServiceRecord';

export default class Home extends PureComponent {
  render() {
    return (
      <div className={styles.serviceRecord}>
        {
          /* <div className={styles.searchBox}>
            <Search {...searchProps} />
          </div> */
        }
        <div className={styles.filterBox} />
        <div className={styles.listBox} />
      </div>
    );
  }
}
