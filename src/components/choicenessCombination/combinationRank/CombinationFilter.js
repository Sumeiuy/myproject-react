/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-筛选
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-11-26 10:29:58
*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { SingleFilter } from 'lego-react-filter/src';

import styles from './combinationFilter.less';
import logable from '../../../decorators/logable';
import { yieldRankList, riskDefaultItem } from '../config';

const EMPTY_LIST = [];

export default class CombinationRank extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    composeType: PropTypes.array,
    onTypeChange: PropTypes.func.isRequired,
    // 组合排名收益率排序
    yieldRankChange: PropTypes.func.isRequired,
    yieldRankValue: PropTypes.string,
    // 组合排名风险筛选
    riskLevelFilter: PropTypes.func.isRequired,
    riskLevel: PropTypes.string,
    creatorList: PropTypes.array.isRequired,
    clearData: PropTypes.func.isRequired,
    rankTabActiveKey: PropTypes.string,
    adviser: PropTypes.object.isRequired,
  }

  static defaultProps = {
    yieldRankValue: '',
    riskLevel: '',
    composeType: [],
    rankTabActiveKey: '',
  }

  static contextTypes = {
    dict: PropTypes.object.isRequired,
    replace: PropTypes.func.isRequired,
  }

  @autobind
  getTreeData() {
    const { dict: { prodRiskLevelList = EMPTY_LIST } } = this.context;
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
    const { replace } = this.context;
    const { location: { query = {} }, yieldRankChange } = this.props;
    replace({
      query: {
        ...query,
        yieldRank: item.value,
      }
    });
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
    const { replace } = this.context;
    const { location: { query = {} }, riskLevelFilter } = this.props;
    replace({
      query: {
        ...query,
        riskLevel: value,
      }
    });
    riskLevelFilter({
      value,
    });
  }

  // 投资顾问选项变化
  @autobind
  @logable({
    type: 'DropdownSelect',
    payload: {
      name: '投资顾问',
      value: '$args[0].value',
    },
  })
  handleCreatorSelectChange({value}) {
    const {
      onTypeChange,
      rankTabActiveKey,
      location: { query = {} },
    } = this.props;
    const { replace } = this.context;
    replace({
      query: {
        ...query,
        adviserId: value.empId || '',
      }
    });
    if(!_.isEmpty(value)) {
      onTypeChange({
        type: rankTabActiveKey,
        adviser: value,
      });
    }
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
    const { replace } = this.context;
    const { location: { query = {} }, adviser, onTypeChange } = this.props;
    replace({
      query: {
        ...query,
        type: value,
      }
    });
    onTypeChange({
      type: value,
      adviser,
    });
  }

  @autobind
  getOptionItemValue({value: { empId, empName }}) {
    const showEmpId = empId ? `(${empId})` : '';
    return (<span>{empName}  {showEmpId}</span>);
  }

  render() {
    const {
      yieldRankValue,
      rankTabActiveKey,
      riskLevel,
      composeType,
      creatorList,
      adviser,
    } = this.props;
    // 所有组合有个 value， 而在请求所有组合数据时，后端需要 value 为空
    // 所以手动将所有组合的 value 值设置为空
    let composeData = [
      {
        ...composeType[0],
        value: '',
      },
    ];
    if (composeType[0] && !_.isEmpty(composeType[0].children)) {
      composeData = composeData.concat([...composeType[0].children]);
    }
    const creatorData = [
      {
        empId: '',
        empName: '不限',
      },
      ...creatorList,
    ];
    return (
      <div className={styles.combinationFilterBox}>
        <div className={styles.formItem}>
          <SingleFilter
            className={styles.searchFilter}
            filterName="组合类型"
            data={composeData}
            dataMap={['value', 'label']}
            value={rankTabActiveKey}
            onChange={this.handleComposeTypeChange}
            dropdownStyle={{ width: 190 }}
          />
        </div>
        <div className={styles.formItem}>
          <SingleFilter
            className={styles.longSearchFilter}
            filterName="投资顾问"
            data={creatorData}
            dataMap={['empId', 'empName']}
            defaultSelectLabel={adviser}
            useLabelInValue
            needItemObj
            value={adviser}
            onChange={this.handleCreatorSelectChange}
            getOptionItemValue={this.getOptionItemValue}
            dropdownStyle={{ width: 190 }}
          />
        </div>
        <div className={styles.formItem}>
          <SingleFilter
            className={styles.moreTextFilter}
            filterName="收益率排序"
            filterId="rankValue"
            data={yieldRankList}
            dataMap={['value', 'label']}
            defaultSelectLabel={yieldRankValue}
            value={yieldRankValue}
            onChange={this.handleYieldSelect}
            dropdownStyle={{ width: 270 }}
          />
        </div>
        <div className={styles.formItem}>
          <SingleFilter
            className={styles.searchFilter}
            filterName="风险等级"
            filterId="riskLevel"
            data={this.getTreeData()}
            dataMap={['value', 'label']}
            defaultSelectLabel={riskLevel}
            value={riskLevel}
            onChange={this.handleRiskChange}
            dropdownStyle={{ width: 190 }}
          />
        </div>
      </div>
    );
  }
}
