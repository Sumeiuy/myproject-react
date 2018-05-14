/*
 * @Description: 投顾业务能力竞赛
 * @Author: WangJunjun
 * @Date: 2018-05-08 17:13:44
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-12 02:25:32
 */

import React from 'react';
import ReportFormIframe from '../../components/investmentConsultantRace/ReportFormIframe';
import styles from './home.less';

const InvestmentConsultantRace = () => (
  <div className={styles.investmentConsultantRacePage}>
    <ReportFormIframe
      name={'investmentConsultantRace'}
      src={'/fspa/external/finereport/ReportServer'}
    />
  </div>
);

export default InvestmentConsultantRace;
