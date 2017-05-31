/**
 * @fileOverview components/invest/PreformanceChartBoard.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';

import ChartBoard from './ChartBoard';
import ChartTable from './ChartTable';
import BoardHeader from './BoardHeader';

export default class PerformanceChartBoard extends PureComponent {

  static propTypes = {
    chartData: PropTypes.array,
    chartTableInfo: PropTypes.object,
    replace: PropTypes.func.isRequired,
    level: PropTypes.string,
    boardTitle: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    showScopeOrder: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    location: {},
    chartData: [],
    chartTableInfo: {},
    level: '',
    repalce: () => {},
  }

  constructor(props) {
    super(props);
    const { location: { query } } = this.props;
    this.state = {
      showChart: query.showChart || 'zhuzhuangtu',
    };
  }

  @autobind
  changeBoard(showChart) {
    this.setState({
      showChart,
    });
  }

  render() {
    const { showChart } = this.state;
    const {
      chartData,
      chartTableInfo,
      replace,
      location,
      level,
      postExcelInfo,
      boardTitle,
      showScopeOrder,
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
          changeBoard={this.changeBoard}
          showScopeOrder={showScopeOrder}
        />
        {/* 根据 url 里的 showChart 来显示不同的组件 */}
        {
          showChart === 'tables' ?
          (
            <ChartTable
              chartTableInfo={chartTableInfo}
              replace={replace}
              level={level}
              location={location}
            />
          )
          :
          (
            <ChartBoard
              chartData={chartData}
              location={location}
              level={level}
            />
          )
        }
      </div>
    );
  }
}
