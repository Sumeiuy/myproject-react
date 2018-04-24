/*
 * @Author: XuWenKang
 * @Description: 精选组合-组合排名-筛选
 * @Date: 2018-04-18 14:26:13
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-04-24 15:55:27
*/

import React, { PureComponent } from 'react';
import { TreeSelect } from 'antd';
// import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import InfoForm from '../../common/infoForm';
import Select from '../../common/Select';
import styles from './combinationFilter.less';

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


export default class CombinationRank extends PureComponent {
  static propTypes = {

  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);
    this.state = {
      yieldValue: '',
      riskValue: '',
    };
  }

  @autobind
  handleRiskChange(value) {
    console.log('risk', value);
  }

  @autobind
  handleYieldSelect(value) {
    console.log('yield', value);
  }

  render() {
    const treeSelectProps = {
      treeData,
      value: this.state.riskValue,
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
              data={[]}
              value={''}
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
