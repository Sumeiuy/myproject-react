/*
 * @Author: zhangjun
 * @Date: 2018-11-20 15:28:46
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-11-26 13:42:27
 * @description 客户投资特征
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classnames from 'classnames';
import { autobind } from 'core-decorators';

import { Popover } from 'antd';
import Icon from '../../common/Icon';
import InvestmentFeatureLabel from './InvestmentFeatureLabel';
import ProfitAbilityLevel from './ProfitAbilityLevel';
import { profitAbilityLevelList } from '../config';

import styles from './investmentFeature.less';

export default class InvestmentFeature extends PureComponent {
  static propTypes = {
    // 客户盈利能力
    profitAbility: PropTypes.object.isRequired,
    // 投资账户特征
    investmentFeatureLabels: PropTypes.array.isRequired,
  }

  // 获取盈利能力等级描述
  @autobind
  getLevelDesc() {
    // 展示的数据和levelList顺序相反，levelList需要倒叙排列
    const levelList = _.slice(profitAbilityLevelList);
    const levelListReverse = _.reverse(levelList);
    const levelDescData = _.map(levelListReverse, (level) => {
      const { levelName, levelDesc, levelClassName } = level;
      const levelLabelCls = classnames([styles.levelLabel, styles[levelClassName]]);
      return (
        <div className={styles.levelDesc}>
          <span className={levelLabelCls}>{levelName}</span>
          <span className={styles.levelValue}>{levelDesc}</span>
        </div>
      );
    });
    return (
      <div className={styles.levelDescWrapper}>
        {levelDescData}
      </div>
    );
  }

  render() {
    const {
      profitAbility: {
        beatCustPercent,
        custAssetStage,
        profitAbilityLevel,
      },
      investmentFeatureLabels,
    } = this.props;
    const levelDesc = this.getLevelDesc();
    return (
      <div className={styles.investmentFeature}>
        <div className={styles.profitAbility}>
          <p className={styles.title}>
            盈利能力超越了
          </p>
          <p className={styles.beatCustPercent}>
            {beatCustPercent}
          </p>
          <p className={styles.custAssetStage}>
            同资产段 (
            {custAssetStage}
）客户
          </p>
        </div>
        <div className={styles.profitAbilityLevel}>
          <div className={styles.profitAbilityLevelTitle}>
            盈利能力等级
            <Popover
              overlayClassName={styles.levelPopover}
              title={levelDesc}
              trigger="click"
            >
              <Icon type="tishi" className={styles.profitAbilityLevelIcon} />
            </Popover>
          </div>
          <div className={styles.levelWrapper}>
            <ProfitAbilityLevel
              profitAbilityLevel={profitAbilityLevel}
            />
          </div>
        </div>
        <div className={styles.investmentFeatureLabel}>
          <p className={styles.title}>
            投资账户特征
          </p>
          <div className={styles.labelContainer}>
            {
              _.map(investmentFeatureLabels, label => (<InvestmentFeatureLabel key={label.id} labelData={label} />))
            }
          </div>
        </div>
      </div>
    );
  }
}
