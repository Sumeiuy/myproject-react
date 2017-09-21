/**
 * @file components/customerPool/common/RectFrame.js
 *  矩形框
 * @author zhangjunli
 */
import React, { PropTypes } from 'react';
import _ from 'lodash';

import Icon from '../../common/Icon';
import styles from './rectFrame.less';

function RectFrame(props) {
  const { dataSource: { title, icon }, children } = props;
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {
          _.isEmpty(icon) ? (
            null
          ) : (
            <div className={styles.iconContainer}>
              <Icon type={icon} className={styles.icon} />
            </div>
          )
        }
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

RectFrame.propTypes = {
  dataSource: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default RectFrame;
