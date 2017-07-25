/**
 * @fileOverview chartRealTime/ChartRadar.js
 * @author yangquanjian
 * @description 雷达图
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import IECharts from '../IECharts';
import styles from './chartRadar.less';

export default class ChartRadar extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    options: PropTypes.object,
  }

  static defaultProps = {
    location: {},
    options: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      wrapperH: 0,
    };
  }

  componentDidMount() {
    const element = this.getElement;
    this.getEmelHeight(element);
  }

  @autobind
  getEmelHeight(element) {
    this.setState({
      wrapperH: element.clientHeight,
    });
  }

  render() {
    const { options } = this.props;
    return (
      <div ref={ref => (this.getElement = ref)} className={styles.radarBox}>
        <IECharts
          option={options}
          resizable
          style={{
            height: this.state.wrapperH,
          }}
        />
      </div>
    );
  }
}
