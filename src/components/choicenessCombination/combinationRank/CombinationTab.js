/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-tab切换
 * @Date: 2018-04-18 14:39:47
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 16:42:43
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
// import _ from 'lodash';
import { Tabs } from 'antd';
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

  // componentWillReceiveProps({ tabList }) {
  //   const { activeKey } = this.state;
  //   if (_.isEmpty(activeKey) && !_.isEmpty(tabList)) {
  //     this.setState({
  //       activeKey: tabList[0].key,
  //     });
  //   }
  // }

  @autobind
  getTabPaneList() {
    const { tabList = EMPTY_LIST } = this.props;
    return ((tabList[0] || EMPTY_OBJECT).children || EMPTY_LIST).map(item => (
      <TabPane tab={item.label} key={item.key} />
    ));
  }

  render() {
    const {
      tabChange,
      // tabList,
      rankTabActiveKey,
    } = this.props;
    // const { activeKey } = this.state;
    // const defaultActiveKey = (tabList[0] || EMPTY_OBJECT).key;
    return (
      <div className={styles.combinationTabBox}>
        <Tabs activeKey={rankTabActiveKey} onChange={tabChange}>
          {this.getTabPaneList()}
        </Tabs>
      </div>
    );
  }
}
