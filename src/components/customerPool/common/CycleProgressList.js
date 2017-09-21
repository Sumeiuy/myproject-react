import React, { PropTypes } from 'react';
import { Progress } from 'antd';
import styles from './cycleProgressList.less';

function renderList(dataSource) {
  return dataSource.map(item => (
    <div className={styles.row}>
      <Progress
        percent={item.percent}
        strokeWidth={6}
        showInfo={false}
        type="circle"
        format={percent => (
          <div>
            <div className={styles.percent}>{percent}</div>
            <div className={styles.symbol}>%</div>
          </div>
        )}
      />
    </div>
  ));
}
function CycleProgressList({ dataSource }) {
  return (
    <div className={styles.container}>
      {renderList(dataSource)}
    </div>
  );
}

CycleProgressList.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default CycleProgressList;
