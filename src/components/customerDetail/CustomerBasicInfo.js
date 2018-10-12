import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Affix } from 'antd';
import styles from './customerBasicInfo.less';

import iconDiamond from '../taskList/performerView/img/iconDiamond.png';
import iconWhiteGold from '../taskList/performerView/img/iconWhiteGold.png';
import iconGold from '../taskList/performerView/img/iconGold.png';
import iconSliver from '../taskList/performerView/img/iconSliver.png';
import iconMoney from '../taskList/performerView/img/iconMoney.png';
import iconNull from '../taskList/performerView/img/iconNull.png';

export default class CustomerBasicInfo extends PureComponent {
  static propTypes = {
  }

  render() {
    const isHighWorth = true;
    const riskLevel = {
      title: '稳定型',
      name: '稳',
    };
    const isSign = true;
    const signMode = '佣金模式';
    const isPrivate = true;
    const rankImg = {
      title: '白金卡',
      src: iconWhiteGold,
    };
    return (
      <div className={styles.container}>
        <Affix offsetTop={0}>
          <div className={styles.content}>
            <div className={styles.frontInfo}>
              <span className={styles.name}>张小牛</span>
              <div className={styles.iconGroup}>
                {isHighWorth && <span className={styles.highWorth} title="客户类型：高净值">高</span>}
                {
                  riskLevel
                  && <span className={styles.riskLevel} title={`风险等级：${riskLevel.title}`}>
                    {riskLevel.name}
                  </span>
                }
                {isSign && <span className={styles.sign} title={signMode}>签</span>}
                {isPrivate && <span className={styles.private} title="私密客户">私</span>}
                {rankImg && <img className={styles.rank} title={`客户等级：${rankImg.title}`} src={rankImg.src} alt="" />}
              </div>
            </div>
            <div className={styles.endInfo}>
              <div className={styles.basicInfo}>020123588 | 男 | 53岁 | 开户3年</div>
              <div className={styles.actionGroup}>
                <span className={styles.connectCust}>联系客户</span>
                <span className={styles.addTag}>添加标签</span>
                <span className={styles.addServiceLog}>添加服务记录</span>
                <span className={styles.navToTask}>待处理任务</span>
              </div>
            </div>
          </div>
        </Affix>
      </div>
    );
  }
}
