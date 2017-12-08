/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-06 16:26:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-07 20:45:53
 * 客户反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import constructPieOptions from './ConstructPieOptions';
import IECharts from '../../IECharts';
import styles from './custFeedback.less';

const EMPTY_LIST = [];
// const EMPTY_OBJECT = {};

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

  @autobind
  renderCustFeedbackChart() {
    const { onPieHover, onPieLeave, custFeedback = EMPTY_LIST } = this.props;

    // const level1Data = [
    //   {
    //     name: '前端',
    //     key: 'frontend',
    //     value: '0.5',
    //     children: [
    //       {
    //         name: '许晓钦',
    //         key: 'frontend',
    //         value: '0.3',
    //       },
    //       {
    //         name: '朱胜楠',
    //         key: 'frontend',
    //         value: '0.3',
    //       },
    //       {
    //         name: '朱飞阳',
    //         key: 'frontend',
    //         value: '0.3',
    //       },
    //       {
    //         name: '未知',
    //         key: 'frontend',
    //         value: '0.1',
    //       },
    //     ],
    //   },
    //   {
    //     name: '后端',
    //     key: 'backend',
    //     value: '0.5',
    //     children: [
    //       {
    //         name: '赵昌吾',
    //         key: 'backend',
    //         value: '0.3',
    //       },
    //       {
    //         name: '王必强',
    //         key: 'backend',
    //         value: '0.3',
    //       },
    //       {
    //         name: '冯涛',
    //         key: 'backend',
    //         value: '0.3',
    //       },
    //       {
    //         name: '未知',
    //         key: 'backend',
    //         value: '0.1',
    //       },
    //     ],
    //   },
    // ];

    // 前后台定义返回的格式可以直接给一级饼图作数据源
    const level1Data = custFeedback;
    // 构造二级数据源
    let level2Data = [];

    _.each(level1Data, (item) => {
      if (!_.isEmpty(item.children)) {
        level2Data.push(_.map(item.children, itemData => ({
          value: itemData.value,
          name: itemData.name,
          parent: {
            name: item.name,
            value: item.value,
          },
        })));
      }
    });

    // 将二维数组抹平
    level2Data = _.flatten(level2Data);

    return (
      <div>
        <IECharts
          option={constructPieOptions({
            renderTooltip: this.renderTooltip,
            level1Data,
            level2Data,
          })}
          resizable
          style={{
            height: '162px',
            width: '50%',
          }}
          onEvents={{
            mouseover: onPieHover,
            mouseout: onPieLeave,
          }}
        />
        <div className={styles.chartExp}>
          {_.map(level1Data, item => <div>{item.name}：
          <span>{Number(item.value) * 100}%</span></div>,
          )}
        </div>
      </div>
    );
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

    const { children } = data;

    let childrenElem = '<div></div>';
    // let parentElem = '<div></div>';

    // 一级反馈，内部
    if (seriesIndex === 0) {
      // 一级反馈有children
      _.each(children, item =>
        childrenElem += `<div class="item">
          <span class="icon"></span>
          <span class="type">${item.name}：</span>
          <span class="percent">${Number(item.value) * 100}%</span>
        </div>`,
      );
    } else if (seriesIndex === 1) {
      // 二级反馈，外部
    }

    return `<div class="tooltipContent">
      <div class="title">
        ${name}：${Number(value) * 100}%
      </div>
      <div class="content">
        ${seriesIndex === 0 ? '<div class="divider"></div>' : '<div></div>'}
        ${childrenElem}
      </div>
    </div>`;
  }

  render() {
    return (
      <div className={styles.custFeedbackSection}>
        <div className={styles.title}>
          客户反馈
        </div>
        <div className={styles.content}>
          {this.renderCustFeedbackChart()}
        </div>
      </div>
    );
  }
}
