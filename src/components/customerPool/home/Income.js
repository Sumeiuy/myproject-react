/**
 * @file components/customerPool/Income.js
 *  客户池-收入
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import ReactDOM from 'react-dom';
import IECharts from '../../IECharts';
import styles from './customerService.less';

let pieCount = 0;
const EMPTY_LIST = [];
const INNER_DATA_MAP = [
  {
    key: 'tranPurRakeCopy',
    name: '净佣金',
  },
  {
    key: 'totCrdtIntCopy',
    name: '净利息',
  },
  {
    key: 'totTranInt',
    name: '净手续费',
  },
];
const OUTER_DATA_MAP = [
  {
    key: 'pIncomeAmt',
    name: '个人',
  },
  {
    key: 'prdtOIncomeAmt',
    name: '产品机构',
  },
  {
    key: 'oIncomeAmt',
    name: '一般机构',
  },
];
export default class Income extends PureComponent {

  static propTypes = {
    incomeData: PropTypes.array,
  }

  static defaultProps = {
    incomeData: EMPTY_LIST,
  }

  constructor(props) {
    super(props);
    this.state = {
      innerPie: ['45%', '60%'],
      wrapPie: ['70%', '85%'],
      ChartsKey: `pie${pieCount}`,
    };
  }

  componentDidMount() {
    // this.onResizeChange();
    window.addEventListener('resize', this.onResizeChange, false);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  componentWillUnmount() {
    // 取消事件监听
    window.removeEventListener('resize', this.onResizeChange, false);
  }

  @autobind
  onResizeChange() {
    /* eslint-disable */
    const serviceBox = ReactDOM.findDOMNode(document.getElementById('serviceBox'));
    if (serviceBox) {
      const s_width = serviceBox.getBoundingClientRect().width;
      if (s_width < 280) {
        this.setState({
          innerPie: ['35%', '50%'],
          wrapPie: ['60%', '75%'],
          ChartsKey: `pie${pieCount++}`,
        })
      }
    }
  }


  render() {
    const { incomeData = EMPTY_LIST } = this.props;
    if (!incomeData) {
      return null;
    }
    const outerData = [];
    const innerData = [];
    _.forEach(incomeData, (item) => {
      const tempInner = _.find(INNER_DATA_MAP, itemData => itemData.key === item.key);
      if (tempInner) {
        innerData.push({
          value: item.value || 0,
          name: tempInner.name,
        });
      }
      const tempOuter = _.find(OUTER_DATA_MAP, itemData => itemData.key === item.key);
      if (tempOuter) {
        outerData.push({
          value: item.value || 0,
          name: tempOuter.name,
        });
      }
    });
    const { ChartsKey, innerPie, wrapPie } = this.state;
    const options = {
      tooltip: {
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      color: ['#60c1ea', '#756fb8', '#7d9be0'],
      legend: {
        orient: 'left',
        x: 'right',
        top: '15px',
        data: [
          { name: '个人', icon: 'square' },
          { name: '一般机构', icon: 'square' },
          { name: '产品机构', icon: 'square' },
          { name: '净手续费', icon: 'square' },
          { name: '净佣金', icon: 'square' },
          { name: '净利息', icon: 'square' }
        ],
      },
      series: [
        {
          name: '净收入',
          type: 'pie',
          center: [90, 90],
          radius: innerPie,
          color: ['#ffa800', '#f0ce30', '#fa7911'],
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: innerData,
          selectedOffset: 0,
        },
        {
          name: '收入',
          type: 'pie',
          center: [90, 90],
          radius: wrapPie,
          label: {
            normal: {
              show: false,
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: outerData,
        },
      ],
    };
    return (
      <div className={styles.serviceBox} id="serviceBox">
        <div className={styles.chartBox}>
          <IECharts
            resizable
            option={options}
            style={{
              height: '180px',
              width: '100%',
            }}
            key={ChartsKey}
          />
        </div>
      </div>
    );
  }
}
