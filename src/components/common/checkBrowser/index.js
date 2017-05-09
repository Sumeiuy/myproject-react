/**
 * @fileOverview components/common/checkBrowser/index.js
 * @author sunweibin
 * @description 检测浏览器版本并弹出提示页面,使用在组件的render方法上
 * @param {Object} [options] 确认用户浏览器最低支持的版本
 * @param {String} [options.MSIE] IE的最低浏览器版本
 * @param {String} [options.FF] 火狐的最低浏览器版本
 * @param {String} [options.Chrome] Chrome的最低浏览器版本
 * @param {String} [options.Opera] Opera的最低浏览器版本
 * @param {String} [options.Safari] Safari的最低浏览器版本
 * @param {String} [options.Edge] Edge的最低浏览器版本
 */

import React from 'react';
import { Tooltip } from 'antd';
import Icon from '../Icon';
import helper from '../../../utils/helper';
import styles from './checkBrowser.less';
import diqiu from './left-img.png';

function checkBrowser(options) {
  const copyToClipboard = () => {
    helper.copyToClipBoard('http://epi.htsc.com.cn');
  };
  return (target, name, descriptor) => {
    // const BROWSERS = ['MSIE', 'FF', 'Chrome', 'Opera', 'Safari', 'Edge'];
    if (options) {
      // 用户设置了最低版本浏览器
      // const { MSIE, FF, Chrome, Opera, Safari, Edge } = options;
      // const browserVersion = navigator.userAgent;
    }
    // const oldRender = descriptor.value;
    const downloadUrl = '/static/1.xlsx';

    const value = () => {
      const clientHeight = document.documentElement.clientHeight;
      return (
        <div
          className={styles.pageCheckBrowser}
          style={{
            height: clientHeight,
          }}
        >
          <div className={styles.content}>
            <div className={styles.left}>
              <img className={styles.imgResponsive} src={diqiu} alt="diqiu" />
            </div>
            <div className={styles.right}>
              <div className={styles.infoHeader}>
                <div className={styles.title}>请使用新版浏览器</div>
                <div className={styles.subtitle}>为了能更好体验理财工作平台的功能，请使用以下比较新的浏览器</div>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipcontent}>如果您尚未安装谷歌Chorme浏览器，请点击此处下载并安装</span>
                <Tooltip placement="right" title="下载安装">
                  <a href={downloadUrl}><Icon type="xianshi" className={styles.icon} /></a>
                </Tooltip>
              </div>
              <div className={styles.tip}>
                <span className={styles.tipcontent}>安装完成后，请使用Chorme浏览器访问 http://epi.htsc.com.cn</span>
                <Tooltip placement="right" title="点击复制">
                  <Icon type="xianshi" className={styles.icon} onClick={copyToClipboard} />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return {
      ...descriptor,
      value,
    };
  };
}

export default checkBrowser;
