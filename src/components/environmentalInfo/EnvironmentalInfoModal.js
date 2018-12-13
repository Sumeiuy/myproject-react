/*
 * @Author: zuoguangzu
 * @Date: 2018-10-29 13:17:52
 * @Last Modified by: maoquan@htsc.com
 * @Last Modified time: 2018-12-12 13:25:58
 */

import React from 'react';
import PropTypes from 'prop-types';

import CommonModal from '../common/biz/CommonModal';
import { env } from '../../helper';

import Icon from './img/environmentalInfoIcon.png';
import styles from './environmentalInfoModal.less';

export default function EnvironmentalInfo(props) {
  const {
    handleEnvironmentalInfoHide,
    environmentalInfoVisible,
  } = props;
  const {
    $screen_width,
    $screen_height,
    $browser,
    $browser_version,
    osname,
    $os_version,
  } = env.getEnv();
  return (
    <CommonModal
      title="环境信息"
      visible={environmentalInfoVisible}
      closeModal={handleEnvironmentalInfoHide}
      wrapClassName={styles.environmentalInfo}
      needBtn={false}
      modalKey="environmentalInfo"
      maskClosable={false}
    >
      <div className={styles.environmentalInfoContent}>
        <div className={styles.environmentalInfoImg}>
          <img src={Icon} alt="environmentalInfoImg" />
        </div>
        <div className={styles.environmentalInfoText}>
          <div className={styles.environmentalInfoTextPart}>
            <ul>
              <li>
                <span>操作系统：</span>
                <span>{osname}</span>
              </li>
              <li>
                <span>屏幕高度：</span>
                <span>{$screen_height}</span>
              </li>
            </ul>
            <ul>
              <li>
                <span>操作系统版本：</span>
                <span>{$os_version}</span>
              </li>
              <li>
                <span>屏幕宽度：</span>
                <span>{$screen_width}</span>
              </li>
            </ul>
          </div>
          <div>
            <span>浏览器名：</span>
            <span>{$browser}</span>
          </div>
          <div>
            <span>浏览器版本：</span>
            <span>{$browser_version}</span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}

EnvironmentalInfo.propTypes = {
  handleEnvironmentalInfoHide: PropTypes.func.isRequired,
  environmentalInfoVisible: PropTypes.bool.isRequired,
};
