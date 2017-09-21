import React, { PropTypes } from 'react';

import styles from './textList.less';

function renderList(dataSource) {
  return dataSource.map(item => (
    <div className={styles.row}>
      <div className={styles.intro}>
        <div className={styles.title}>{item.cust}</div>
        <div className={styles.count}>{item.count}</div>
      </div>
    </div>
  ));
}
function TextList({ dataSource }) {
  return (
    <div className={styles.container}>
      {renderList(dataSource)}
    </div>
  );
}

TextList.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export default TextList;
