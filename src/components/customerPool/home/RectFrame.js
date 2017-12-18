/**
 * @file components/customerPool/home/RectFrame.js
 *  存在不同指标的矩形框，带有title。样子类似：----和 | 都是solid线
 * ----------
 * |title   |
 * ----------
 * |        |
 * |        |
 * ----------
 * @author zhangjunli
 */
import React from 'react';
import PropTypes from 'prop-types';
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
            <Icon type={icon} />
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
