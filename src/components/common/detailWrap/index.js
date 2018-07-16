/**
 * @Author: sunweibin
 * @Date: 2018-05-08 17:42:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-07-09 16:22:28
 * @description 列表展示页面右侧详情包装组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import EmptyData from '../emptyData';

import styles from './index.less';

export default function DetailWrapper(props) {
  const { isEmpty, children, currentId, extra } = props;
  const bugTitle = `编号:${currentId}`;
  return (
    <div className={styles.detialBox}>
      <div className={styles.inner}>
        {
          isEmpty ? (<EmptyData />)
          : (
            <div className={styles.innerWrap}>
              <div className={styles.titleArea}>
                <div className={styles.title}>{bugTitle}</div>
                {
                  _.isEmpty(extra) ? null
                  : (<div className={styles.extra}>{extra}</div>)
                }
              </div>
              {children}
            </div>
          )
        }
      </div>
    </div>
  );
}

DetailWrapper.propTypes = {
  isEmpty: PropTypes.bool,
  children: PropTypes.node,
  extra: PropTypes.element,
  currentId: PropTypes.string,
};

DetailWrapper.defaultProps = {
  isEmpty: true,
  children: null,
  currentId: '',
  extra: null,
};
