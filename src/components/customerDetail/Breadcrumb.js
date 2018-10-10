import React from 'react';
import { Breadcrumb } from 'antd';
import styles from './breadcrumb.less';

export default function CustDetailBreadcrumb(props) {
  function handleItemClick() {
    props.push(props.url || '/customerPool/list?source=leftMenu');
  }
  return (
    <div className={styles.breadcrumbContiner}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <span className={styles.link} onClick={handleItemClick}>客户列表</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item><span className={styles.text}>详情</span></Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}


