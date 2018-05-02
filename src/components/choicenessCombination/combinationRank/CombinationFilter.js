/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-筛选
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-05-02 17:09:23
*/

import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoForm from '../../common/infoForm';
import Select from '../../common/Select';
import styles from './combinationFilter.less';
import { yieldRankList, riskDefaultItem } from '../../../routes/choicenessCombination/config';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const labelStyle = {
  width: 'auto',
};

const EMPTY_LIST = [];

export default class CombinationRank extends PureComponent {
  static propTypes = {
    // 字典
    dict: PropTypes.object.isRequired,
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
  handleYieldSelect(key, value) {
    const { yieldRankChange } = this.props;
    yieldRankChange({
      value,
    });
  }

  @autobind
  handleRiskChange(value) {
    const { riskLevelFilter } = this.props;
    riskLevelFilter({
      value,
    });
  }

  render() {
    const {
      yieldRankValue,
      riskLevel,
    } = this.props;
    const treeSelectProps = {
      treeData: this.getTreeData(),
      value: riskLevel,
      onChange: this.handleRiskChange,
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
        <div className={`${styles.formItem} ${styles.treeSelectBox}`}>
          <InfoForm label="风险等级" style={labelStyle}>
            <TreeSelect {...treeSelectProps} />
          </InfoForm>
        </div>
      </div>
    );
  }
}
