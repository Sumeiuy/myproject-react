/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-筛选
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-17 14:14:23
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { SingleFilter } from 'lego-react-filter/src';

import styles from './combinationFilter.less';
import logable from '../../../decorators/logable';
import { yieldRankList, riskDefaultItem } from '../config';

const DEFAULT_TYPE = '31001';
const EMPTY_LIST = [];

export default class CombinationRank extends PureComponent {
  static propTypes = {
    // 字典
    dict: PropTypes.object.isRequired,
    composeType: PropTypes.array,
    typeChange: PropTypes.func.isRequired,
    // 筛选
    // filterChange: PropTypes.func.isRequired,
    // 组合排名收益率排序
    yieldRankChange: PropTypes.func.isRequired,
    yieldRankValue: PropTypes.string,
    // 组合排名风险筛选
    riskLevelFilter: PropTypes.func.isRequired,
    riskLevel: PropTypes.string,
  }

  static defaultProps = {
    yieldRankValue: '',
    riskLevel: '',
    composeType: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      adviser: '',
      type: DEFAULT_TYPE,
    };
  }

  @autobind
  getTreeData() {
    const { dict: { prodRiskLevelList = EMPTY_LIST } } = this.props;
    const treeDataList = [riskDefaultItem];
    prodRiskLevelList.forEach((item) => {
      treeDataList.push({
        ...item,
        label: item.value,
        value: item.key,
      });
    });
    return treeDataList;
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '收益率排序',
      value: '$args[0]',
    },
  })
  handleYieldSelect(item) {
    const { yieldRankChange } = this.props;
    yieldRankChange({
      value: item.value,
    });
  }

  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '风险等级',
      value: '$args[0]',
    },
  })
  handleRiskChange(item) {
    const { value } = item;
    if (_.isEmpty(value)) {
      return;
    }
    const { riskLevelFilter } = this.props;
    riskLevelFilter({
      value,
    });
  }

  // 投资顾问变化
  @autobind
  @logable({ type: 'ButtonClick', payload: { name: '搜索投资顾问' } })
  handleAdviserChange(value) {
    this.setState({
      adviser: value,
    });
  }

  // 切换组合类型
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '组合类型',
      value: '$args[0]',
    },
  })
  handleComposeTypeChange(item) {
    const { value } = item;
    const { typeChange } = this.props;
    this.setState({
      type: value,
    }, typeChange({type: value}));
  }

  render() {
    const {
      yieldRankValue,
      riskLevel,
      composeType,
    } = this.props;
    const { adviser, type } = this.state;
    let composeData = [composeType[0]];
    if (composeType[0] && !_.isEmpty(composeType[0].children)) {
      composeData = composeData.concat([...composeType[0].children]);
    }
    return (
      <div className={styles.combinationFilterBox}>
        <div className={styles.formItem}>
          <SingleFilter
            className={styles.searchFilter}
            filterName="组合类型"
            data={composeData}
            dataMap={['value', 'label']}
            value={type}
            onChange={this.handleComposeTypeChange}
          />
        </div>
        <div className={styles.formItem}>
          <SingleFilter
            className={styles.searchFilter}
            filterName="投资顾问"
            showSearch
            placeholder="员工工号/员工姓名"
            data={[]}
            defaultSelectLabel={adviser}
            value={adviser}
            onInputChange={_.debounce(this.handleAdviserChange, 500)}
          />
        </div>
        <div className={styles.formItem}>
          <SingleFilter
            filterName="收益率排序"
            filterId="rankValue"
            data={yieldRankList}
            dataMap={['value', 'label']}
            defaultSelectLabel={yieldRankValue}
            value={yieldRankValue}
            onChange={this.handleYieldSelect}
          />
        </div>
        <div className={styles.formItem}>
          <SingleFilter
            filterName="风险等级"
            filterId="riskLevel"
            data={this.getTreeData()}
            dataMap={['value', 'label']}
            defaultSelectLabel={riskLevel}
            value={riskLevel}
            onChange={this.handleRiskChange}
          />
        </div>
      </div>
    );
  }
}
