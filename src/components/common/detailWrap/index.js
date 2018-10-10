/**
 * @Author: sunweibin
 * @Date: 2018-05-08 17:42:15
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-09-28 15:23:09
 * @description 列表展示页面右侧详情包装组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import EmptyData from '../emptyData';

import styles from './index.less';

export default function DetailWrapper(props) {
  const { isEmpty, children, currentId, extra, extraIsFllowTitle } = props;
  const bugTitle = `编号:${currentId}`;
  return (
    <div className={styles.detialBox}>
      <div className={styles.inner}>
        {
          isEmpty ? (<EmptyData />)
          : (
            <div className={styles.innerWrap}>
              <div className={styles.titleArea}>
                <div className={styles.title}>
                  {
                    extraIsFllowTitle
                      ? (<div className={styles.fllowExtra}>{extra}</div>)
                      : null
                  }
                  {bugTitle}
                </div>
                {
                  (!extraIsFllowTitle && !_.isEmpty(extra))
                  ? (<div className={styles.extra}>{extra}</div>)
                  : null
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
  extraIsFllowTitle: PropTypes.bool,
};

DetailWrapper.defaultProps = {
  isEmpty: true,
  children: null,
  currentId: '',
  extra: null,
  extraIsFllowTitle: false,
};
