/*
 * @Author: sunweibin
 * @Date: 2018-10-11 16:30:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-11 17:47:10
 * @description 新版客户360详情下账户信息Tab下的资产分布组件
 */
import React, { PureComponent } from 'react';
import { Checkbox, Icon } from 'antd';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import styles from './assetDistribute.less';

export default class AssetDistribute extends PureComponent {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      // 选中含信用的checkbox
      checkedCredit: true,
    };
  }


  @autobind
  handleCreditCheckboxChange(e) {
    const { checked } = e.target;
    this.setState({ checkedCredit: checked });
    // TODO 切换含信用的checkbox需要查询雷达图的数据
  }

  render() {
    const { checkedCredit } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.title}>资产分布（元）</span>
          <span className={styles.checkbox}>
            <Checkbox
              checked={checkedCredit}
              onChange={this.handleCreditCheckboxChange}
            >
              含信用
            </Checkbox>
          </span>
        </div>
        <div className={styles.body}>
          <div className={styles.radarArea}>
            <div className={styles.radarChart}>2</div>
            <div className={styles.summary}>
              <span className={styles.summaryInfo}>
                <span className={styles.label}>总资产：</span>
                <span className={styles.value}>243.5</span>
                <span className={styles.unit}>万元</span>
              </span>
              <span className={styles.summaryInfo}>
                <span className={styles.label}>负债：</span>
                <span className={styles.value}>2436.5</span>
                <span className={styles.unit}>万元</span>
                <span className={styles.infoIco}><Icon type="info-circle" theme="outlined" /></span>
              </span>
            </div>
          </div>
          <div className={styles.indexDetailArea}>2</div>
        </div>
      </div>
    );
  }
}

