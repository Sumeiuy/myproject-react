/*
 * @Author: zhangjun
 * @Date: 2018-11-21 09:21:54
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-21 17:02:38
 * @description 盈利能力等级
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { profitAbilityLevelList } from '../config';

import styles from './profitAbilityLevel.less';

export default function ProfitAbilityLevel(props) {
  const { profitAbilityLevel } = props;
  const levelData = _.map(profitAbilityLevelList, (level, index) => {
    const { levelName } = level;
    const stepCls = classnames({
      [styles.stepItem]: true,
      [styles.itemFinish]: index < profitAbilityLevel,
      [styles.itemProgress]: index === profitAbilityLevel,
    });
    return (
      <div className={styles.steps}>
        <div className={stepCls}>
          <div className={styles.itemTail}>
          </div>
          <div className={styles.itemIcon}></div>
          <div className={styles.itemContent}>{levelName}</div>
        </div>
      </div>
    );
  });
  return (
    <div className={styles.profitAbilityLevel}>
      {levelData}
    </div>
  );
}

ProfitAbilityLevel.propTypes = {
  profitAbilityLevel: PropTypes.number.isRequired,
};
