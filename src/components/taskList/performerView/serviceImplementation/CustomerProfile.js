import React from 'react';
import PropTypes from 'prop-types';
import styles from './customerProfile.less';

import { riskLevelConfig } from './config';

import iconDiamond from '../img/iconDiamond.png';
import iconWhiteGold from '../img/iconWhiteGold.png';
import iconGold from '../img/iconGold.png';
import iconSliver from '../img/iconSliver.png';
import iconMoney from '../img/iconMoney.png';

// 客户等级的图片源
const rankImgSrcConfig = {
  // 钻石
  805010: iconDiamond,
  // 白金
  805015: iconWhiteGold,
  // 金卡
  805020: iconGold,
  // 银卡
  805025: iconSliver,
  // 理财
  805030: iconMoney,
};

export default function CustomerProfile(props) {
  const { targetCustDetail = {} } = props;
  const {
    custName, isAllocate, isHighWorth,
    riskLevelCode, isSign, levelCode,
  } = targetCustDetail;
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <p className={styles.item}>{custName}{isAllocate === '0' && '(未分配)'}</p>
          <p className={styles.item}>
            {isHighWorth && <span className={styles.highWorth}>高</span>}
            <span className={styles.riskLevel}>{riskLevelConfig[riskLevelCode]}</span>
            {isSign && <span className={styles.sign}>签</span>}
            {rankImgSrcConfig[levelCode] && <img className={styles.rank} src={rankImgSrcConfig[levelCode]} alt="" />}
          </p>
        </div>
      </div>
    </div>
  );
}

CustomerProfile.propTypes = {
  targetCustDetail: PropTypes.object.isRequired,
};
