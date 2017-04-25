/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';

import Icon from '../common/Icon';
import ChartBoard from './ChartBoard';
import styles from './PerformanceChartBoard.less';

const Option = Select.Option;

export default class PerformanceChartBoard extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    chartData: PropTypes.array,
    replace: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    loading: false,
    location: {},
    chartData: [],
    repalce: () => {},
    sort: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      showChart: true,
    };
  }

  @autobind
  handleSortChange(column, value) {
    const { replace, location: { query } } = this.props;
    replace({
      pathname: '/invest',
      query: {
        ...query,
        [column]: value,
      },
    });
  }

  // 柱状图与表格切换
  @autobind
  handleIconClick() {
    const { showChart } = this.state;
    this.setState({
      showChart: !showChart,
    });
  }

  // 导出图标
  @autobind
  handleDataExportClick() {

  }

  render() {
    const { showChart } = this.state;
    const { chartData, loading } = this.props;
    if (chartData.length === 0) {
      return null;
    }
    return (
      <div className="investPerformanceBoard">
        <div className={styles.titleBar}>
          <div className={styles.titleText}>指标分布</div>
          <div className={styles.titleBarRight}>
            <div className={styles.iconBtn1}>
              <span>排序方式:</span>
              <Select
                defaultValue="1"
                className={styles.newSelect}
                onChange={(v) => { this.handleSortChange('sortColumn', v); }}
              >
                <Option value="1">按分公司</Option>
                <Option value="2">按营业部</Option>
              </Select>
              <Select
                defaultValue="1"
                className={styles.newSelect1}
                onChange={(v) => { this.handleSortChange('sortOrder', v); }}
              >
                <Option value="1">自高到低</Option>
                <Option value="2">自低到高</Option>
              </Select>
            </div>
            <div className={styles.iconBtn}>
              <Icon
                title="表格视图"
                type="tables"
                className={styles.fixMargin}
                onClick={this.handleIconClick}
                style={{
                  color: showChart ? '#fff' : '#ffd92a',
                }}
              />
              <Icon
                title="柱状图"
                type="zhuzhuangtu"
                className={styles.fixMargin}
                onClick={this.handleIconClick}
                style={{
                  color: showChart ? '#ffd92a' : '#fff',
                }}
              />
            </div>
            <div className={styles.iconBtn}>
              <Icon
                title="导出到文件"
                type="daochu"
                onClick={this.handleDataExportClick}
              />
            </div>
          </div>
        </div>
        <ChartBoard
          chartData={chartData}
          loading={loading}
        />
      </div>
    );
  }
}
