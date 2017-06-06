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
    scope: PropTypes.number.isRequired,
    boardTitle: PropTypes.string.isRequired,
    postExcelInfo: PropTypes.func.isRequired,
    showScopeOrder: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    indexID: PropTypes.string,
    indexKey: PropTypes.string,
  }

  static defaultProps = {
    indexID: '',
    indexKey: '',
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
      scope,
      postExcelInfo,
      boardTitle,
      showScopeOrder,
      indexKey,
      indexID,
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
          changeBoard={this.changeBoard}
          showScopeOrder={showScopeOrder}
          indexID={indexID}
          indexKey={indexKey}
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
