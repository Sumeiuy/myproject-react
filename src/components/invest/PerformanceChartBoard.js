/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { Select } from 'antd';
import { autobind } from 'core-decorators';

import { optionsMap } from '../../config';
import Icon from '../common/Icon';
import ChartBoard from './ChartBoard';
import ChartTable from './ChartTable';
import styles from './PerformanceChartBoard.less';

const Option = Select.Option;
// 按类别排序
const sortByType = optionsMap.sortByType;
// 按顺序排序
const sortByOrder = optionsMap.sortByOrder;
// 表格与图表视图
const showType = optionsMap.showType;

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

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     showChart: 'zhuzhuangtu',
  //   };
  // }

  componentWillMount() {
    const { location: { query } } = this.props;
    this.state = {
      sortColumn: query.sortColumn,
      sortOrder: query.sortOrder,
      showChart: 'zhuzhuangtu',
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
  handleIconClick(type) {
    // const val = event.target.getAttribute('type');
    const { replace, location: { query } } = this.props;
    replace({
      pathname: '/invest',
      query: {
        ...query,
        showChart: type,
      },
    });
    this.setState({
      showChart: type,
    });
  }

  // 导出图标
  @autobind
  handleDataExportClick() {

  }

  render() {
    const { showChart, sortColumn, sortOrder } = this.state;
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
                defaultValue={sortColumn || '1'}
                className={styles.newSelect}
                onChange={(v) => { this.handleSortChange('sortColumn', v); }}
              >
                {
                  sortByType.map((item, index) => {
                    const sortByTypeIndex = index;
                    return <Option key={sortByTypeIndex} value={item.key}>{item.name}</Option>;
                  })
                }
              </Select>
              <Select
                defaultValue={sortOrder || '1'}
                className={styles.newSelect1}
                onChange={(v) => { this.handleSortChange('sortOrder', v); }}
              >
                {
                  sortByOrder.map((item, index) => {
                    const sortByOrderIndex = index;
                    return <Option key={sortByOrderIndex} value={item.key}>{item.name}</Option>;
                  })
                }
              </Select>
            </div>
            <div className={styles.iconBtn}>
              {
                showType.map((item, index) => {
                  const iconIndex = `icon${index}`;
                  return (
                    <Icon
                      title={item.title}
                      type={item.type}
                      key={iconIndex}
                      className={styles.fixMargin}
                      onClick={() => { this.handleIconClick(item.type); }}
                      style={{ color: showChart === item.type ? '#ffd92a' : '#fff' }}
                    />
                  );
                })
              }
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
        {/* 根据 url 里的 showChart 来显示不同的组件 */}
        {
          showChart === showType[0].type ?
            <ChartTable />
          :
            <ChartBoard
              chartData={chartData}
              loading={loading}
            />
        }
      </div>
    );
  }
}
