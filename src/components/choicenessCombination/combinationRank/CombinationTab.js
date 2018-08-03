/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-tab切换
 * @Date: 2018-04-18 14:39:47
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-28 16:04:39
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Tabs } from 'antd';
import logable from '../../../decorators/logable';
import styles from './combinationTab.less';

const TabPane = Tabs.TabPane;
const EMPTY_OBJECT = {};
const EMPTY_LIST = [];
export default class CombinationTab extends PureComponent {
  static propTypes = {
    // tab切换
    tabChange: PropTypes.func.isRequired,
    rankTabActiveKey: PropTypes.string.isRequired,
    // 组合树列表数据
    tabList: PropTypes.array.isRequired,
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      activeKey: '',
    };
  }

  @autobind
  getTabPaneList() {
    const { tabList = EMPTY_LIST } = this.props;
    return ((tabList[0] || EMPTY_OBJECT).children || EMPTY_LIST).map(item => (
      <TabPane tab={item.label} key={item.key} />
    ));
  }

  @autobind
  @logable({
    type: 'Click',
    payload: {
      name: '组合排名TAB切换',
      value: '$args[0]',
    },
  })
  handleTabChange(key) {
    const { tabChange } = this.props;
    tabChange(key);
  }

  render() {
    const {
      // tabList,
      rankTabActiveKey,
    } = this.props;
    // const { activeKey } = this.state;
    // const defaultActiveKey = (tabList[0] || EMPTY_OBJECT).key;
    return (
      <div className={styles.combinationTabBox}>
        <Tabs activeKey={rankTabActiveKey} onChange={this.handleTabChange}>
          {this.getTabPaneList()}
        </Tabs>
      </div>
    );
  }
}
