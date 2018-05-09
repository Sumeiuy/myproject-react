/*
 * @Description: 首页头部的投顾竞赛入口
 * @Author: WangJunjun
 * @Date: 2018-05-08 15:53:04
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-08 16:59:54
 */

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../common/Icon';
import { openRctTab } from '../../../utils/controlPane';
import styles from './homeTop.less';

const HomeTop = ({ push }) => {
  // 跳转到投顾业务能力竞赛页面
  const toInvestmentConsultantCompetenceRacePage = () => {
    const url = '/investmentConsultantRace';
    const param = {
      id: 'FSP_INVESTMENT_CONSULTANT_RACE',
      title: '投顾竞赛',
    };
    openRctTab({
      url,
      param,
      routerAction: push,
    });
  };

  return (
    <div className={styles.entryBox}>
      <div className={styles.item} onClick={toInvestmentConsultantCompetenceRacePage}>
        <Icon type="tougujingsai" className={styles.itemIcon} />
        <span className={styles.itemText}>投顾竞赛</span>
      </div>
    </div>
  );
};

HomeTop.propTypes = {
  push: PropTypes.func.isRequired,
};

export default HomeTop;
