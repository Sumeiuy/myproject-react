/*
 * @Author: xuxiaoqin
 * @Date: 2017-12-06 16:26:34
 * @Last Modified by: xuxiaoqin
 * @Last Modified time: 2017-12-07 15:32:16
 * 客户反馈
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import constructPieOptions from './ConstructPieOptions';
import IECharts from '../../IECharts';
// import _ from 'lodash';
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
    const { onPieHover, onPieLeave } = this.props;
    return (
      <IECharts
        option={constructPieOptions({ renderTooltip: this.renderTooltip })}
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
    );
  }

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

    //
    // galleryViewPath: ,

    //
    // galleryEditorPath: ,

    //
    // imagePath: ,

    //
    // gl: ,
    const {
      name,
      // data,
      value,
      // color,
      // percent,
    } = params;

    return `<div class="tooltipContent">
      <div class="title">
        ${name}：${value}
      </div>
      <div class="content">
        <div class="divider"></div>
        <div class="item">
          <span class="icon"></span>
          <span class="type">一周内购买：</span>
          <span class="percent">17%</span>
        </div>
        <div class="item">
          <span class="icon"></span>
          <span class="type">一个月内购买：</span>
          <span class="percent">17%</span>
        </div>
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
          <div className={styles.chartExp}>
            <div>有意愿购买：<span>30%</span></div>
            <div>有意愿购买：<span>30%</span></div>
            <div>有意愿购买：<span>30%</span></div>
          </div>
        </div>
      </div>
    );
  }
}
