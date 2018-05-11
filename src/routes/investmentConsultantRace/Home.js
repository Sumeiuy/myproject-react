/*
 * @Description: 投顾业务能力竞赛
 * @Author: WangJunjun
 * @Date: 2018-05-08 17:13:44
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-09 14:19:24
 */

import React from 'react';
import ReportFormIframe from '../../components/investmentConsultantRace/ReportFormIframe';
import styles from './home.less';

const InvestmentConsultantRace = () => (
  <div className={styles.investmentConsultantRacePage}>
    <ReportFormIframe
      name={'investmentConsultantRace'}
      src={'http://168.61.13.30:56780/finereport/ReportServer'}
    />
  </div>
);

export default InvestmentConsultantRace;
