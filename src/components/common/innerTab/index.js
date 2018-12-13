import React from 'react';
import { Tabs } from 'antd';
import styles from './innerTab.less';

function InnerTabs(props) {
  const { children, ...restProps } = props;
  return (
    <Tabs
      {...restProps}
      className={styles.tab}
      animated={false}
    >
      {props.children}
    </Tabs>
  );
}

InnerTabs.TabPane = Tabs.TabPane;

export default InnerTabs;
