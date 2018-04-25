/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-25 20:11:09
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import { autobind } from 'core-decorators';
import InfoTitle from '../../common/InfoTitle';
// import Icon from '../common/Icon';
import CombinationTab from './CombinationTab';
import CombinationFilter from './CombinationFilter';
import CombinationListItem from './CombinationListItem';
import styles from './combinationRank.less';

const titleStyle = {
  fontSize: '16px',
};

export default class CombinationRank extends PureComponent {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
    // 筛选
    filterChange: PropTypes.func.isRequired,
    // 图表tab切换
    chartTabChange: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const {
      tabChange,
      filterChange,
      chartTabChange,
    } = this.props;
    return (
      <div className={styles.combinationRankBox}>
        <InfoTitle
          head="组合排名"
          titleStyle={titleStyle}
        />
        <div className={styles.containerBox}>
          <CombinationTab tabChange={tabChange} />
          <CombinationFilter filterChange={filterChange} />
          <div className={styles.combinationListBox}>
            <CombinationListItem chartTabChange={chartTabChange} />
          </div>
        </div>
      </div>
    );
  }
}
