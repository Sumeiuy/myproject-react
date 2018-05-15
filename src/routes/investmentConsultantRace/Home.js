/*
 * @Description: 投顾业务能力竞赛
 * @Author: WangJunjun
 * @Date: 2018-05-08 17:13:44
 * @Last Modified by: WangJunjun
 * @Last Modified time: 2018-05-15 10:03:12
 */

import React from 'react';
import ReportFormIframe from '../../components/investmentConsultantRace/ReportFormIframe';
import styles from './home.less';

const InvestmentConsultantRace = () => (
  <div className={styles.investmentConsultantRacePage}>
    <ReportFormIframe
      name="investmentConsultantRace"
      src="/finereport/ReportServer"
      frameBorder="0"
    />
  </div>
);

export default InvestmentConsultantRace;
