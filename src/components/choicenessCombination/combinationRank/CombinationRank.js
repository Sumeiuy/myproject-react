/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-18 16:54:47
*/

import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
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

  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  // tab切换
  @autobind
  handleTabChange(id) {
    console.log('tabId', id);
  }

  // 筛选
  @autobind
  handleFilter(data) {
    console.log('filter', data);
  }

  render() {
    return (
      <div className={styles.combinationRankBox}>
        <InfoTitle
          head="组合排名"
          titleStyle={titleStyle}
        />
        <CombinationTab tabChange={this.handleTabChange} />
        <CombinationFilter filter={this.handleFilter} />
        <div className={styles.combinationListBox}>
          <CombinationListItem />
        </div>
      </div>
    );
  }
}
