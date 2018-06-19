import React, { PureComponent } from 'react';
import Icon from '../../common/Icon';
import styles from './chiefViewpoint.less';

export default class ChiefViewpoint extends PureComponent {
  render() {
    return (
      <div className={styles.chiefViewpointBox}>
        <div className={`${styles.headerBox} clearfix`}>
          <Icon type="meizhoushouxiguandian" />
          <span>每日首席观点</span>
          <a href="">更多</a>
        </div>
        <h4 className={styles.title}>这是今天的首席观点</h4>
        <p className={styles.time}>2018-03-02</p>
        <p className={styles.content}>
          这是今天的首席观点这是今天的首席观点这是今天的首席观点这是今天的首席观点这是今天的首席观点这是今天的首席观点这是今天的首席观点
        </p>
        <div className={`${styles.footer} clearfix`}>
          <a href="">[详情]</a>
        </div>
      </div>
    );
  }
}
