/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-筛选
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-27 10:01:31
*/

import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoForm from '../../common/infoForm';
import Select from '../../common/Select';
import styles from './combinationFilter.less';
import { yieldRankList } from '../../../routes/choicenessCombination/config';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const labelStyle = {
  width: 'auto',
};

const treeData = [{
  label: 'Node1',
  value: '0-0',
  key: '0-0',
}, {
  label: 'Node2',
  value: '0-1',
  key: '0-1',
}];

const EMPTY_LIST = [];

export default class CombinationRank extends PureComponent {
  static propTypes = {
    // 筛选
    filterChange: PropTypes.func.isRequired,
    // 组合排名收益率排序
    yieldRankChange: PropTypes.func.isRequired,
    yieldRankValue: PropTypes.string,
    // 组合排名风险筛选
    riskLevelFilter: PropTypes.func.isRequired,
    riskLevel: PropTypes.array,
  }

  static defaultProps = {
    yieldRankValue: '',
    riskLevel: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      // yieldValue: '',
      // riskValue: '',
    };
  }

  @autobind
  handleRiskChange(value) {
    const { riskLevelFilter } = this.props;
    console.log('risk', value);
    riskLevelFilter({
      value,
    });
  }

  @autobind
  handleYieldSelect(key, value) {
    const { yieldRankChange } = this.props;
    console.log('yield', key, value);
    // filterChange({
    //   key: 'yield',
    //   value,
    // });
    yieldRankChange({
      value,
    });
  }

  render() {
    const {
      yieldRankValue,
      riskLevel,
    } = this.props;
    const treeSelectProps = {
      treeData,
      value: riskLevel,
      onChange: this.handleRiskChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      style: {
        width: 220,
      },
    };
    return (
      <div className={styles.combinationFilterBox}>
        <div className={styles.formItem}>
          <InfoForm label="收益率排序" style={labelStyle}>
            <Select
              name="yield"
              data={yieldRankList}
              value={yieldRankValue}
              onChange={this.handleYieldSelect}
              width={'178px'}
            />
          </InfoForm>
        </div>
        <div className={styles.formItem}>
          <InfoForm label="风险等级" style={labelStyle}>
            <TreeSelect {...treeSelectProps} />
          </InfoForm>
        </div>
      </div>
    );
  }
}
