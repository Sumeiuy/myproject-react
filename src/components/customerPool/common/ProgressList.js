import React, { PropTypes } from 'react';
import { Progress } from 'antd';
import styles from './progressList.less';

function renderList(dataSource) {
  return dataSource.map(item => (
    <div className={styles.row}>
      <div className={styles.intro}>
        <div className={styles.title}>{item.cust}</div>
        <div className={styles.count}>{item.count}</div>
      </div>
      <Progress percent={item.percent} strokeWidth={6} showInfo={false} />
    </div>
  ));
}
function ProgressList({ dataSource }) {
  return (
    <div className={styles.container}>
      {renderList(dataSource)}
    </div>
  );
}

ProgressList.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default ProgressList;
