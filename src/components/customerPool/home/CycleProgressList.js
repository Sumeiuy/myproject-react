/**
 * @file components/customerPool/common/CycleProgressList.js
 *  圆形进度条列表，目前只一行，两列，每列一个圆形进度条
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';
import { Progress } from 'antd';
import classnames from 'classnames';

import styles from './cycleProgressList.less';

function renderList(dataSource) {
  const motData = dataSource[0] || {};
  const serviceData = dataSource[1] || {};
  return (
    <div className={styles.row}>
      <div className={classnames(styles.column, styles.firstColumn)}>
        <Progress
          percent={motData.percent || '--'}
          width={90}
          type="circle"
          format={percent => (
            <div className={styles.content}>
              <div className={styles.percent}>{percent || '--'}</div>
              <div className={styles.symbol}>%</div>
            </div>
          )}
        />
        <div className={styles.text}>{motData.category || '--'}</div>
      </div>
      <div className={classnames(styles.column, styles.secondColumn)}>
        <Progress
          percent={serviceData.percent || '--'}
          width={90}
          type="circle"
          format={percent => (
            <div className={styles.content}>
              <div className={styles.percent}>{percent || '--'}</div>
              <div className={styles.symbol}>%</div>
            </div>
          )}
        />
        <div className={styles.text}>{serviceData.category || '--'}</div>
      </div>
    </div>
  );
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
