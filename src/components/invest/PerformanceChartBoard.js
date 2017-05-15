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
    chartTableInfo: PropTypes.object,
    replace: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    level: PropTypes.string,
  }

  static defaultProps = {
    loading: false,
    location: {},
    chartData: [],
    chartTableInfo: {},
    level: '',
    repalce: () => {},
    sort: () => {},
  }

  constructor(props) {
    super(props);
    const { location: { query } } = this.props;
    this.state = {
      showChart: query.showChart || 'zhuzhuangtu',
      orderType: query.orderType,
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
    const { showChart, orderType } = this.state;
    const { chartData, chartTableInfo, replace, loading, location, level } = this.props;
    // console.log('sortByType', sortByType.slice(level - 1));
    const sliceSortByType = sortByType.slice(level - 1);
    const sliceScope = sliceSortByType[0].scope;
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
              {/**
                * todo -- 切换一级菜单的时候，清空二级菜单项目
              */}
              <Select
                defaultValue={sliceScope}
                className={styles.newSelect}
                onChange={(v) => { this.handleSortChange('scope', v); }}
              >
                {
                  sliceSortByType.map((item, index) => {
                    const sortByTypeIndex = index;
                    return <Option key={sortByTypeIndex} value={item.scope}>按{item.name}</Option>;
                  })
                }
              </Select>
              <Select
                defaultValue={orderType || 'desc'}
                className={styles.newSelect1}
                onChange={(v) => { this.handleSortChange('orderType', v); }}
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
            <ChartTable
              chartTableInfo={chartTableInfo}
              replace={replace}
              level={level}
              location={location}
            />
          :
            <ChartBoard
              chartData={chartData}
              location={location}
              loading={loading}
              level={level}
            />
        }
      </div>
    );
  }
}
