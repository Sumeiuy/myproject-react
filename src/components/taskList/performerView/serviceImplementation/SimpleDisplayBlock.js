/*
 * @Description: 展示区块，用来显示服务策略和任务提示的
 * @Author: WangJunjun
 * @Date: 2018-05-27 15:43:12
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-06-01 14:11:35
 */

import React from 'react';
import PropTypes from 'prop-types';
import ForgeryRichText from '../../../common/ForgeryRichText';
import TextCollapse from './TextCollapse';
import styles from './simpleDisplayBlock.less';

export default function SimpleDisplayBlock({ title, data, missionFlowId, currentId }) {
  const key = `${title}-${currentId}-${missionFlowId}`;
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h5 className={styles.title}>{title}</h5>
        <TextCollapse key={key} minHeight="21px">
          <div className={styles.content}><ForgeryRichText text={data} /></div>
        </TextCollapse>
      </div>
    </div>
  );
}

SimpleDisplayBlock.propTypes = {
  title: PropTypes.string,
  data: PropTypes.string,
  currentId: PropTypes.string,
  missionFlowId: PropTypes.string,
};

SimpleDisplayBlock.defaultProps = {
  title: '',
  data: '',
  currentId: '',
  missionFlowId: '',
};
