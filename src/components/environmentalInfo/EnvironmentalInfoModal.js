/*
 * @Author: zuoguangzu
 * @Date: 2018-10-29 13:17:52
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-10-29 16:39:05
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { autobind } from 'core-decorators';

import {} from './config';

import Icon from './img/environmentalInfoIcon.png';
import styles from  './environmentalInfoModal.less';

export default function EnvironmentalInfo(props) {
  const {
    handleEnvironmentalInfoHide,
    environmentalInfoVisible,
  } = props;

  return (
    <Modal
      title="环境信息"
      width={650}
      height={300}
      className={styles.environmentalInfo}
      destroyOnClose
      visible={environmentalInfoVisible}
      footer={null}
      onCancel={handleEnvironmentalInfoHide}
    >
      <div className={styles.environmentalInfoContent}>
        <div className={styles.environmentalInfoImg}>
          <img src={Icon}/>
        </div>
        <div className={styles.environmentalInfoText}>
          <ul>
            <li>
              <span>操作系统：</span>
              <span>操作系统</span>
            </li>
            <li>
              <span>屏幕高度：</span>
              <span>屏幕高度</span>
            </li>
            <li>
              <span>浏览器名：</span>
              <span>浏览器名</span>
            </li>
          </ul>
        </div>
        <div className={styles.environmentalInfoText}>
          <ul>
            <li>
              <span>操作系统版本：</span>
              <span>操作系统版本</span>
            </li>
            <li>
              <span>屏幕宽度：</span>
              <span>屏幕宽度</span>
            </li>
            <li>
              <span>浏览器版本：</span>
              <span>浏览器版本</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

EnvironmentalInfo.propTypes = {
  handleEnvironmentalInfoHide: PropTypes.func.isRequired,
  environmentalInfoVisible: PropTypes.bool.isRequired,
};
