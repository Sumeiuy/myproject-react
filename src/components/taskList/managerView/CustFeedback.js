/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-06 16:26:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2018-02-09 13:03:37
 * 客户反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import { constructPieOptions } from './ConstructPieOptions';
import { constructEmptyPie } from './ConstructEmptyPie';
import IECharts from '../../IECharts';
import styles from './custFeedback.less';

const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

// 一级反馈颜色表
const getLevelColor = (index, alpha = 1) => {
  switch (Math.ceil(Number(index))) {
    case 0:
      return `rgba(57,131,255,${alpha})`;
    case 1:
      return `rgba(74,218,213,${alpha})`;
    case 2:
      return `rgba(117,111,184,${alpha})`;
    case 3:
      return `rgba(255,78,123,${alpha})`;
    case 4:
      return `rgba(255,178,78,${alpha})`;
    case 5:
      return `rgba(112,195,129,${alpha})`;
    case 6:
      return `rgba(241,222,90,${alpha})`;
    case 7:
      return `rgba(120,146,98,${alpha})`;
    case 8:
      return `rgba(255,120,78,${alpha})`;
    default:
      return '#fff';
  }
};

export default class CustFeedback extends PureComponent {

  static propTypes = {
    // 客户反馈
    custFeedback: PropTypes.array,
    onPieHover: PropTypes.func,
    onPieLeave: PropTypes.func,
  }

  static defaultProps = {
    custFeedback: EMPTY_LIST,
    onPieHover: (params) => {
      console.log(params);
    },
    onPieLeave: () => { },
  }

  constructor(props) {
    super(props);
    const {
      level1Data = EMPTY_LIST,
      level2Data = EMPTY_LIST,
    } = this.renderCustFeedbackChart(props.custFeedback);
    this.state = {
      level1Data,
      level2Data,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { custFeedback: nextFeedback } = nextProps;
    const { custFeedback } = this.props;
    if (custFeedback !== nextFeedback) {
      // 需要重新绘制饼图时，清除echarts的当前实例
      if (this.chartInstance) {
        this.chartInstance.getChartsInstance().clear();
      }
      const { level1Data, level2Data } = this.renderCustFeedbackChart(nextFeedback);
      this.setState({
        level1Data,
        level2Data,
      });
    }
  }

  /**
   * 根据当前索引换算透明度，从1开始，0.2往下递减，减到0.2就不再递减
   * @param {*string} index 索引
   * @param {*string} childIndex child索引
   */
  @autobind
  getCurrentColor(index, childIndex) {
    let alpha = 1 - (Number(childIndex) * 0.2);
    if (alpha <= 0.2) {
      alpha = 0.2;
    }
    return getLevelColor(index, alpha);
  }

  @autobind
  renderCustFeedbackChart(custFeedback) {
    // 前后台定义返回的格式可以直接给一级饼图作数据源
    if (_.isEmpty(custFeedback)) {
      return {
        level1Data: [],
        level2Data: [],
      };
    }

    let level1Data = custFeedback || [];
    // 然后添加颜色
    level1Data = _.map(level1Data, (item, index) => {
      const currentLevel1ItemColor = getLevelColor(index, 1);
      return {
        ...item,
        color: currentLevel1ItemColor,
        itemStyle: {
          normal: {
            color: currentLevel1ItemColor,
          },
        },
        children: _.map(item.children, (itemData, childIndex) => {
          const currentColor = this.getCurrentColor(index, childIndex);
          return {
            ...itemData,
            color: currentColor,
            // 将子级数据的占比乘以父级占比
            value: item.value * itemData.value,
          };
        }),
      };
    });

    // 构造二级数据源
    let level2Data = [];

    _.each(level1Data, (item, index) => {
      if (!_.isEmpty(item.children)) {
        level2Data.push(_.map(item.children, (itemData, childIndex) => {
          const currentLevel2ItemColor = this.getCurrentColor(index, childIndex);
          return {
            value: itemData.value,
            name: itemData.name,
            color: currentLevel2ItemColor,
            itemStyle: {
              normal: {
                color: currentLevel2ItemColor,
              },
            },
            parent: {
              name: item.name,
              value: item.value,
              color: getLevelColor(index, 1),
            },
          };
        }));
      }
    });

    // 将二维数组抹平
    level2Data = _.flatten(level2Data);

    return {
      level1Data,
      level2Data,
    };
  }

  @autobind
  renderChildren(children) {
    let childrenElem = '';
    _.each(children, item =>
      childrenElem += `<div class="item">
          <i class="icon" style='background: ${item.color}'></i>
          <span class="type">${item.name}：</span>
          <span class="percent">${Number(item.value) * 100}%</span>
        </div>`,
    );
    return childrenElem;
  }

  @autobind
  renderParent(name, value) {
    let parentElem = '';
    parentElem = `<div class="title">
        ${name}：${value * 100}%
      </div>`;
    return parentElem;
  }

  /**
   * 构造tooltip string
   * @param {*object} params charts series数据源
   */
  @autobind
  renderTooltip(params) {
    // componentType: 'series',
    // // 系列类型
    // seriesType: string,
    // // 系列在传入的 option.series 中的 index
    // seriesIndex: number,
    // // 系列名称
    // seriesName: string,
    // // 数据名，类目名
    // name: string,
    // // 数据在传入的 data 数组中的 index
    // dataIndex: number,
    // // 传入的原始数据项
    // data: Object,
    // // 传入的数据值
    // value: number|Array,
    // // 数据图形的颜色
    // color: string,
    // // 饼图的百分比
    // percent: number,

    const {
      name,
      data,
      value,
      seriesIndex,
    } = params;

    const { children, parent } = data;
    const { level1Data } = this.state;
    let childrenElem = '';
    let parentElem = '';

    // 一级反馈，内部
    if (seriesIndex === 0) {
      // 一级反馈有children
      parentElem = this.renderParent(name, Number(value));
      childrenElem = this.renderChildren(children);
    } else if (seriesIndex === 1) {
      // 二级反馈，外部
      // 二级反馈有parent
      // 找出parent对应的children
      parentElem = this.renderParent(parent.name, Number(parent.value));
      const parentTree = _.find(level1Data, item => item.name === parent.name);
      if (!_.isEmpty(parentTree)) {
        if (!_.isEmpty(parentTree.children)) {
          childrenElem = this.renderChildren(parentTree.children);
        }
      }
    }

    return `<div class="tooltipContent">
      ${parentElem}
      <div class="content">
        <div class="divider"></div>
        ${childrenElem}
      </div>
    </div>`;
  }

  render() {
    const { level1Data, level2Data } = this.state;

    const options = _.isEmpty(level1Data) && _.isEmpty(level2Data) ? constructEmptyPie() :
      constructPieOptions({
        renderTooltip: this.renderTooltip,
        level1Data,
        level2Data,
      });

    return (
      <div className={styles.custFeedbackSection}>
        <div className={styles.title}>
          客户反馈
        </div>
        <div className={styles.content}>
          <IECharts
            option={options}
            resizable
            style={{
              height: '162px',
              width: '50%',
            }}
            ref={ref => this.chartInstance = ref}
          />
          <div className={styles.chartExp}>
            {_.isEmpty(level1Data) && _.isEmpty(level2Data) ?
              <div className={styles.emptyContent}>暂无客户反馈</div> :
              _.map(level1Data, item =>
                <div
                  className={styles.content}
                  key={item.key}
                >
                  <i className={styles.parentIcon} style={{ background: item.color }} />
                  <span>{item.name}</span>：<span>{Number(item.value) * 100}%</span>
                </div>,
              )}
          </div>
        </div>
      </div>
    );
  }
}
