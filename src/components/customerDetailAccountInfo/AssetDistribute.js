/*
 * @Author: sunweibin
 * @Date: 2018-10-11 16:30:07
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-11 20:16:40
 * @description 新版客户360详情下账户信息Tab下的资产分布组件
 */
import React, { PureComponent } from 'react';
import { Checkbox, Icon, Table } from 'antd';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { autobind } from 'core-decorators';

import {
  dataSource,
  TABLE_SCROLL_SETTING,
} from './config';
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
  setRowClassName(record) {
    // 给表格的内容区域设置一个类名，来覆盖表头column设置的样式
    const { children } = record;
    return _.isEmpty(children) ? '' : 'fixRowPadding';
  }

  // 处理表格表头的配置项
  @autobind
  getIndexTableColumns() {
    return [
      {
        width: 140,
        title: '资产',
        dataIndex: 'name',
        key: 'name',
        className: styles.zichanCls,
      },
      {
        width: 140,
        title: '持仓金额/占比',
        dataIndex: 'value',
        key: 'value',
        className: styles.holdValueCls,
        render: this.renderTableValueColumn,
      },
      {
        title: '收益/收益率',
        dataIndex: 'profit',
        key: 'profit',
        className: styles.profitCls,
        render: this.renderTableProfitColumn,
      },
    ];
  }


  @autobind
  handleCreditCheckboxChange(e) {
    const { checked } = e.target;
    this.setState({ checkedCredit: checked });
    // TODO 切换含信用的checkbox需要查询雷达图的数据
  }

  // 渲染持仓金额和占比的单元格
  @autobind
  renderTableValueColumn(value, record) {
    const { percent } = record;
    const percentText = `${percent * 100}%`;
    return (
      <div className={styles.indexHoldValueCell}>
        <span className={styles.value}>{value}</span>
        <span className={styles.percent}>{percentText}</span>
      </div>
    );
  }

  // 渲染收益/收益率的单元格
  @autobind
  renderTableProfitColumn(profit, record) {
    const { profitPercent } = record;
    // 需要判断数值，如果是>=0的数显示红色并带有加号
    // 如果是<0数显示成绿色，并带有减号
    const isAsc = profitPercent >=0;
    const percentText = isAsc ? `+${profitPercent * 100}%` : `${profitPercent * 100}%`;
    const profitRateCls = cx({
      [styles.profitRate]: true,
      [styles.isAsc]: isAsc,
    });
    return (
      <div className={styles.indexHoldValueCell}>
        <span className={styles.profit}>{profit}</span>
        <span className={profitRateCls}>{percentText}</span>
      </div>
    );
  }

  render() {
    const { checkedCredit } = this.state;
    // 获取表格的columns数据
    const columns = this.getIndexTableColumns();

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
          <div className={styles.indexDetailArea}>
            <Table
              indentSize={0}
              className={styles.indexDetailTable}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              rowClassName={this.setRowClassName}
              scroll={TABLE_SCROLL_SETTING}
            />
          </div>
        </div>
      </div>
    );
  }
}

