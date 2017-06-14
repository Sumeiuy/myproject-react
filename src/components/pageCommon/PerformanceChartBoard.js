/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';

import ChartBoard from './ChartBoard';
import ChartTable from './ChartTable';
import BoardHeader from './BoardHeader';

export default class PerformanceChartBoard extends PureComponent {

  static propTypes = {
    chartData: PropTypes.array,
    chartTableInfo: PropTypes.object,
    replace: PropTypes.func.isRequired,
    showChart: PropTypes.string.isRequired,
    level: PropTypes.string,
    scope: PropTypes.number.isRequired,
    getTableInfo: PropTypes.func,
    boardTitle: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    updateShowCharts: PropTypes.func.isRequired,
    showScopeOrder: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    indexID: PropTypes.string,
    selfRequestData: PropTypes.func,
  }

  static defaultProps = {
    indexID: '',
    location: {},
    chartData: [],
    chartTableInfo: {},
    level: '',
    getTableInfo: () => {},
    repalce: () => {},
    selfRequestData: () => {},
  }

  render() {
    const {
      showChart,
      chartData,
      chartTableInfo,
      replace,
      location,
      level,
      scope,
      postExcelInfo,
      boardTitle,
      showScopeOrder,
      indexID,
      selfRequestData,
      getTableInfo,
      updateShowCharts,
    } = this.props;
    if (!(chartData && chartData.length) && showChart !== 'tables') {
      return null;
    }
    return (
      <div className="investPerformanceBoard">
        <BoardHeader
          location={location}
          title={boardTitle}
          postExcelInfo={postExcelInfo}
          replace={replace}
          level={level}
          scope={scope}
          showChart={showChart}
          showScopeOrder={showScopeOrder}
          indexID={indexID}
          selfRequestData={selfRequestData}
          getTableInfo={getTableInfo}
          updateShowCharts={updateShowCharts}
        />
        {/* 根据 url 里的 showChart 来显示不同的组件 */}
        {
          showChart === 'tables' ?
          (
            <ChartTable
              chartTableInfo={chartTableInfo}
              getTableInfo={getTableInfo}
              replace={replace}
              level={level}
              location={location}
              indexID={indexID}
            />
          )
          :
          (
            <ChartBoard
              chartData={chartData}
              location={location}
              level={level}
              scope={scope}
            />
          )
        }
      </div>
    );
  }
}
