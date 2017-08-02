/**
 * @description 历史对比排名区域
 * @author sunweibin
 * @fileOverview history/HistoryCompareRankChart.js
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
// import _ from 'lodash';

import { optionsMap } from '../../config';
import Icon from '../common/Icon';
import HistoryRankChart from '../chartRealTime/HistoryRankChart';
import styles from './HistoryCompareRankChart.less';

// Select的选项组件
const Option = Select.Option;
// 自高到低、自低到高排序选项
const sortByOrder = optionsMap.sortByOrder;
const sortByOrderSelect = sortByOrder.map((item, index) => {
  const optionKey = `hOrder-${index}`;
  return (React.createElement(Option, { key: optionKey, value: `${item.key}` }, `${item.name}`));
});
// 按类别排序
const sortByType = optionsMap.sortByType;


export default class HistoryCompareRankChart extends PureComponent {
  static propTypes = {
    level: PropTypes.string,
    scope: PropTypes.string,
    data: PropTypes.array.isRequired,
  };

  static defaultProps = {
    level: '1', // 当前组织结构级别
    scope: '2', // 查询数据的维度
  }

  constructor(props) {
    super(props);
    const { scope } = props; // scope为维度
    this.state = {
      scopeSelectValue: scope,
      scope,
      orderType: 'desc',
      rankPage: 1,
      totalPage: 10,
    };
  }

  @autobind
  getPopupContainer() {
    return document.querySelector('.react-app');
  }

  @autobind
  changeRankPage(rankPage) {
    this.setState({ rankPage });
  }

  // 切换维度
  @autobind
  handleScopeChange() {

  }

  // 切换排序
  @autobind
  handleOrderTypeChange() {

  }

  // 上一页
  @autobind
  handleLastClick() {
    let { rankPage } = this.state;
    if (rankPage > 1) {
      this.changeRankPage(--rankPage);
    }
  }

  // 下一页
  @autobind
  handleNextClick() {
    const { totalPage } = this.state;
    let { rankPage } = this.state;
    if (rankPage < totalPage) {
      this.changeRankPage(++rankPage);
    }
  }

  render() {
    const { level, data, scope } = this.props;
    const { orderType, scopeSelectValue, rankPage, totalPage } = this.state;
    // 隐藏选项
    const toggleScope2Option = classnames({
      hideOption: Number(level) !== 1,
    });
    const toggleScope3Option = classnames({
      hideOption: Number(level) === 3,
    });
    // 是否隐藏翻页按钮
    const togglePageFlip = classnames({
      [styles.pageFlip]: true,
      hideEle: totalPage < 2,
    });
    // 上一页按钮显示状态
    const toggleLastPage = classnames({
      [styles.pageBtn]: true,
      hideEle: rankPage === 1,
    });
    // 分割线显示状态
    const toggleDivider = classnames({
      hideEle: rankPage === 1 || rankPage === totalPage,
    });
    // 下一页按钮显示状态
    const toggleNextPage = classnames({
      [styles.pageBtn]: true,
      hideEle: rankPage === totalPage,
    });


    return (
      <div className={styles.historyRange}>
        <div className={styles.chartHd}>
          <div className={styles.headerLeft}>
            <span className={styles.chartHdCaption}>排名</span>
            <span className={styles.chartUnit}>(万元)</span>
          </div>
          <div className={styles.headerRight}>
            <Select
              value={scopeSelectValue}
              className={styles.newSelect}
              onChange={this.handleScopeChange}
              getPopupContainer={this.getPopupContainer}
            >
              {
                sortByType.map((item, index) => {
                  const sortByTypeIndex = index;
                  let optionClass = '';
                  // 按投顾所有级别均存在
                  if (index === 0) {
                    // 按分公司
                    optionClass = toggleScope2Option;
                  }
                  if (index === 1) {
                    // 按营业部
                    optionClass = toggleScope3Option;
                  }
                  return (
                    <Option
                      className={optionClass}
                      key={sortByTypeIndex}
                      value={item.scope}
                    >
                      按{item.name}
                    </Option>
                  );
                })
              }
            </Select>
            <Select
              value={orderType}
              className={styles.newSelect1}
              onChange={this.handleOrderTypeChange}
              getPopupContainer={this.getPopupContainer}
            >
              {sortByOrderSelect}
            </Select>
            <div className={togglePageFlip}>
              <span className={toggleLastPage} onClick={this.handleLastClick}><Icon title="上一页" type="xiangzuo" /></span>
              <span className={toggleDivider}>|</span>
              <span className={toggleNextPage} onClick={this.handleNextClick}><Icon title="下一页" type="xiangyou" /></span>
            </div>
          </div>
        </div>
        <div className={styles.chartBd}>
          <HistoryRankChart data={data} level={level} scope={scope} />
        </div>
      </div>
    );
  }
}
