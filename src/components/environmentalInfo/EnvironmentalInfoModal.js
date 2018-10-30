/*
 * @Author: zuoguangzu
 * @Date: 2018-10-29 13:17:52
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-30 14:10:58
 */

import React from 'react';
import PropTypes from 'prop-types';

import CommonModal from '../common/biz/CommonModal';
import env from '../../helper/env';

import Icon from './img/environmentalInfoIcon.png';
import styles from  './environmentalInfoModal.less';

export default function EnvironmentalInfo(props) {
  const {
    handleEnvironmentalInfoHide,
    environmentalInfoVisible,
  } = props;
  const environmentalInfo = env.getEnv();
  const {
    $screen_width,
    $screen_height,
    $browser,
    $browser_version,
    $os_name,
    $os_version
  } = environmentalInfo;
  return (
    <CommonModal
      title="环境信息"
      visible={environmentalInfoVisible}
      closeModal={handleEnvironmentalInfoHide}
      wrapClassName={styles.environmentalInfo}
      needBtn={false}
    >
      <div className={styles.environmentalInfoContent}>
        <div className={styles.environmentalInfoImg}>
          <img src={Icon}/>
        </div>
        <div className={styles.environmentalInfoText}>
          <ul>
            <li>
              <span>操作系统：</span>
              <span>{$os_name}</span>
            </li>
            <li>
              <span>屏幕高度：</span>
              <span>{$screen_height}</span>
            </li>
            <li>
              <span>浏览器名：</span>
              <span>{$browser}</span>
            </li>
          </ul>
        </div>
        <div className={styles.environmentalInfoText}>
          <ul>
            <li>
              <span>操作系统版本：</span>
              <span>{$os_version}</span>
            </li>
            <li>
              <span>屏幕宽度：</span>
              <span>{$screen_width}</span>
            </li>
            <li>
              <span>浏览器版本：</span>
              <span>{$browser_version}</span>
            </li>
          </ul>
        </div>
      </div>
    </CommonModal>
  );
}

EnvironmentalInfo.propTypes = {
  handleEnvironmentalInfoHide: PropTypes.func.isRequired,
  environmentalInfoVisible: PropTypes.bool.isRequired,
};
