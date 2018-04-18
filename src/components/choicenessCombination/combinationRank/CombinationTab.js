/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-tab切换
 * @Date: 2018-04-18 14:39:47
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-18 14:49:42
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import styles from './combinationTab.less';

const TabPane = Tabs.TabPane;

export default class CombinationTab extends PureComponent {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  // constructor(props) {
  //   super(props);
  // }

  render() {
    const { tabChange } = this.props;
    return (
      <div className={styles.combinationTabBox}>
        <Tabs defaultActiveKey="1" onChange={tabChange}>
          <TabPane tab="组合1" key="1" />
          <TabPane tab="组合2" key="2" />
          <TabPane tab="组合3" key="3" />
          <TabPane tab="组合4" key="4" />
          <TabPane tab="组合5" key="5" />
          <TabPane tab="组合6" key="6" />
        </Tabs>
      </div>
    );
  }
}
