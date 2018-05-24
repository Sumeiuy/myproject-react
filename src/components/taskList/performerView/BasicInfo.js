/*
 * @Description: 执行者右侧详情的基本信息
 * @Author: WangJunjun
 * @Date: 2018-05-22 12:26:05
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-24 10:45:52
 */


import React from 'react';
import PropTypes from 'prop-types';
import styles from './basicInfo.less';

const BasicInfo = ({ missionName, missionStatusName, basicInfoData }) => (
  <div className={styles.basicInfo}>
    <p className={styles.title}>{missionName}:&nbsp;{missionStatusName}</p>
    <div className={styles.basicInfoContent}>
      {
        basicInfoData.map(item => (
          <div className={styles.coloumn} key={item.id}>
            <div className={styles.infoKey}>{item.key}</div>
            <div className={styles.infoValue}>{item.value}</div>
          </div>
        ))
      }
    </div>
  </div>
);

BasicInfo.propTypes = {
  missionName: PropTypes.string,
  missionStatusName: PropTypes.string,
  basicInfoData: PropTypes.array,
};

BasicInfo.defaultProps = {
  missionName: '',
  missionStatusName: '',
  basicInfoData: [],
};

export default BasicInfo;
